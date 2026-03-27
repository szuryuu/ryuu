---
title: "IncidentFox: Fully Automated Alert Investigation via Dual Webhook"
description: "Eliminating the manual trigger bottleneck by replacing Slack self-mention with a direct /investigate API call — making the entire flow from alert to runbook fully automated."
date: "2026-03-25"
tags: ["DevOps", "IncidentFox", "Alertmanager", "Slack", "Automation", "SRE"]
cover: "/images/incidentfox.webp"
featured: true
order: 11
---

## Objective

Eliminating the Slack self-mention limitation by replacing the manual `@IncidentFox` trigger with a direct API call to the `/investigate` endpoint, making the entire flow from alert to investigation result fully automated.

---

## Architecture

### Before (Manual Trigger)

```
Alert → Alertmanager → Webhook Bridge → Slack (notification)
                                              ↓
                                    User manually sends @IncidentFox
                                              ↓
                                    Results in Slack thread
```

### After (Auto Trigger)

```
Alert → Alertmanager → Webhook Bridge ──→ Slack (notification via Old Webhook)
                                      └──→ /investigate API (fire-and-forget)
                                                    ↓
                                           SSE stream result
                                                    ↓
                                    Slack (results via New Webhook)
```

### Why Two Webhooks?

| Webhook             | Function                                  |
| ------------------- | ----------------------------------------- |
| Old (`B0AKQUN8V0V`) | Send alert firing notification to channel |
| New (`B0AMVNG894G`) | Post investigation results to channel     |

Incoming Webhooks do not trigger the Slack Events API, so they cannot be used to mention @IncidentFox. The solution is to bypass Slack entirely and call the `/investigate` API directly.

---

## Setup

### Create a New Incoming Webhook

`https://api.slack.com/apps` → select app → Incoming Webhooks → Add New Webhook to Workspace → select the same channel.

### Connect webhook-bridge to incidentfox network

```bash
docker network connect incidentfox_app_network alertmanager-webhook-bridge

# Verify
docker exec alertmanager-webhook-bridge python3 -c \
  "import httpx; r = httpx.get('http://incidentfox-sre-agent:8000/health'); print(r.status_code, r.text)"
```

### Update docker-compose.yml webhook-bridge

```yaml
webhook-bridge:
  environment:
    - SLACK_INCOMING_WEBHOOK_URL=${SLACK_INCOMING_WEBHOOK_URL}
    - SLACK_ALERT_WEBHOOK_URL=https://hooks.slack.com/services/T0AHQCX0THV/B0AMVNG894G/...
    - INCIDENTFOX_URL=http://incidentfox-sre-agent:8000
```

### webhook.py Final

```python
from fastapi import FastAPI, Request
import os, httpx, uvicorn, asyncio, time, json

app = FastAPI()
SLACK_WEBHOOK_URL = os.environ["SLACK_INCOMING_WEBHOOK_URL"]
SLACK_ALERT_WEBHOOK_URL = os.environ.get("SLACK_ALERT_WEBHOOK_URL", SLACK_WEBHOOK_URL)
INCIDENTFOX_URL = os.environ.get("INCIDENTFOX_URL", "http://incidentfox-sre-agent:8000")

PROMPTS = {
    "PrometheusDown": (...),
    "NodeExporterDown": (...),
    "HighMemoryUsage": (...),
    "HighCPUUsage": (...),
}

async def _trigger_investigate(url: str, prompt: str, thread_id: str, alert_name: str):
    try:
        result_text = ""
        async with httpx.AsyncClient(timeout=600) as client:
            async with client.stream(
                "POST",
                f"{url}/investigate",
                json={"prompt": prompt, "thread_id": thread_id}
            ) as response:
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        try:
                            event = json.loads(line[6:])
                            if event.get("type") == "result":
                                result_text = event.get("data", {}).get("text", "")
                        except Exception:
                            pass

        if result_text:
            async with httpx.AsyncClient(timeout=10) as client:
                await client.post(SLACK_ALERT_WEBHOOK_URL, json={
                    "text": f":mag: *[AUTO INVESTIGATION RESULT] {alert_name}*\n\n{result_text[:4000]}"
                })

    except Exception as e:
        print(f"[webhook] IncidentFox trigger error: {e}")

@app.post("/webhook")
async def alertmanager_webhook(request: Request):
    body = await request.json()
    for alert in body.get("alerts", []):
        if alert["status"] != "firing":
            continue
        name = alert["labels"].get("alertname", "Unknown")
        instance = alert["labels"].get("instance", "unknown")
        summary = alert["annotations"].get("summary", "No summary")

        template = PROMPTS.get(name, DEFAULT_PROMPT)
        prompt = template.format(name=name, instance=instance, summary=summary)

        thread_id = f"alert-{name}-{int(time.time())}".replace(":", "").replace(".", "")

        slack_message = (
            f":rotating_light: *[FIRING] {name}*\n"
            f"Instance: `{instance}`\n"
            f"Summary: {summary}\n\n"
            f"<@U0AK04THCQ0> <@U0AK79BGX8D> — IncidentFox is investigating automatically..."
        )
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(SLACK_WEBHOOK_URL, json={"text": slack_message})

        asyncio.create_task(
            _trigger_investigate(INCIDENTFOX_URL, prompt, thread_id, name)
        )

    return {"ok": True}
```

---

## Design Decisions

**Fire-and-Forget Pattern:** The `/investigate` API returns an SSE stream that can run for up to 10 minutes. If the webhook bridge waits for the response, it will time out and crash. `asyncio.create_task()` ensures the webhook bridge immediately returns 200 to Alertmanager while the investigation runs in the background.

**Unique Thread ID per Alert:** Without a timestamp, the same thread ID gets reused for every alert, causing the agent to skip steps it considers already done from previous history. A timestamp guarantees each alert gets a fresh context.

```python
thread_id = f"alert-{name}-{int(time.time())}"
```

**SSE Stream Parsing:** Only `result` type events are captured as the final answer. Other events (`thought`, `tool_start`, `tool_end`) are ignored.

```python
if event.get("type") == "result":
    result_text = event.get("data", {}).get("text", "")
```

**Slack Message Limit:** Investigation results are truncated at 4000 characters to avoid Slack API errors.

---

## Test Results

### NodeExporterDown (Without FATAL Log)

```
Firing notification appeared automatically in Slack           Pass
Investigation ran automatically                               Pass
docker logs node-exporter shown exactly                       Pass
docker start node-exporter executed automatically             Pass
Loki: "No logs found" reported explicitly (none injected)     Pass
Investigation results posted to Slack automatically           Pass
```

### HighCPUUsage

```
VictoriaMetrics query succeeded — node_load1 = 1.07           Pass
Results posted automatically to Slack                         Pass
```

---

## Root Cause: Loki Skill Does Not Return Data

The main issue found during debugging: the `observability-loki` Skill tool only returns metadata, not query results.

```
output: "{'success': True, 'commandName': 'observability-loki', 'allowedTools': ['Bash']}"
```

The agent did not proceed to call Bash and instead answered with placeholders.

**Fix:** Bypass the Skill tool entirely. Instruct the agent to call Bash directly in the prompt.

### NodeExporterDown Final Prompt (Working)

```python
"NodeExporterDown": (
    "We have a critical alert: Node Exporter is DOWN on {instance}. "
    "Host metrics collection has stopped. "
    "Step 1: Run 'docker logs node-exporter --tail=20'. Show EXACT output. "
    "Step 2: Run this exact bash command to fetch Loki logs: "
    "python .claude/skills/observability-loki/scripts/query_logs.py "
    "'{{job=\"syslog\", host=\"mopogra-vm\"}} |~ \"FATAL\"' --limit 5 --lookback 0.5 "
    "Show EXACT full output. If no logs found, state explicitly. "
    "Step 3: Run 'docker start node-exporter'. Show exact output. "
    "Step 4: Write RCA using ONLY exact values from Step 1 and 2. Do NOT use placeholders."
),
```

> Curly braces `{...}` must be escaped as `{{...}}` in Python format strings to avoid `KeyError`.

### Verified Output

```
FATAL log: Mar 25 08:32:47 mopogra-vm adminuser: FATAL: Node Exporter stopped...
           Mar 25 08:08:48 mopogra-vm adminuser: FATAL: Node Exporter stopped...

RCA: node-exporter process stopped unexpectedly. Confirmed via Loki syslog.
     Container restarted successfully via docker start node-exporter.
```

---

## Auto Runbook Generation

After the investigation completes, the webhook bridge sends a follow-up request to `/investigate` using the **same thread_id**, giving the agent full context of the previous investigation.

### Implementation

```python
from datetime import datetime, timezone
date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
runbook_path = f"/home/agent/runbooks/{alert_name}/{date_str}_runbook.md"

runbook_prompt = (
    f"Based on the investigation above, generate a runbook and save it to {runbook_path}. "
    f"Include: 1. Incident Summary 2. Root Cause 3. Raw Evidence (exact log lines verbatim) "
    f"4. Remediation Steps Performed 5. Scripts Used 6. Follow-up Recommendations. "
    f"Create the directory if it doesn't exist."
)

async with client.stream("POST", f"{url}/investigate",
    json={"prompt": runbook_prompt, "thread_id": thread_id}
) as response:
    ...
```

### Full Flow with Runbook

```
Alert → Alertmanager → Webhook Bridge
              ↓                    ↓
    Slack notification    /investigate (thread_id: alert-X-timestamp)
                                   ↓
                          Investigation complete
                                   ↓
                    Slack [AUTO INVESTIGATION RESULT]
                                   ↓
                    /investigate (same thread_id)
                    "Generate runbook based on above..."
                                   ↓
                    ~/runbooks/AlertName/YYYY-MM-DD_runbook.md
                                   ↓
                    Slack [RUNBOOK SAVED]
```

File `~/runbooks/NodeExporterDown/2026-03-25_runbook.md` was created automatically with Raw Evidence, Remediation steps, Scripts Used, and Follow-up Recommendations.

---

## How to Test End-to-End

```bash
# 1. Inject log first, wait for Promtail to scrape
logger -p user.err "FATAL: Node Exporter stopped. Host metrics collection halted on mopogra-vm:9100."
sleep 20

# 2. Trigger alert
docker stop node-exporter

# 3. Monitor webhook bridge
docker logs alertmanager-webhook-bridge -f --tail=5

# 4. Monitor sre-agent
docker logs incidentfox-sre-agent -f --tail=5

# 5. Two messages will appear automatically in Slack:
#    [FIRING] NodeExporterDown ... investigating automatically
#    [AUTO INVESTIGATION RESULT] NodeExporterDown ...
```

---

## Limitations

| Limitation                             | Detail                                                           | Status                          |
| -------------------------------------- | ---------------------------------------------------------------- | ------------------------------- |
| FATAL logs not captured by Loki Skill  | Skill returns only metadata                                      | Fixed via direct Bash call      |
| Slack message truncated                | 4000 character limit, long RCAs get cut off                      | Acceptable                      |
| Results not threaded with notification | Posted as a separate message, not a reply                        | Future improvement              |
| Subagent OOM killed                    | Many simultaneous alerts can OOM kill Claude Code CLI subprocess | Avoid alert spam during testing |

---

## Comparison with Manual Flow

| Aspect                          | Manual Trigger               | Auto Trigger               |
| ------------------------------- | ---------------------------- | -------------------------- |
| User action required            | Yes                          | No                         |
| Response time                   | Depends on user availability | ~30 seconds after alert    |
| Slack thread context            | Present                      | Absent (separate messages) |
| MTTI (Mean Time to Investigate) | Minutes to hours             | Seconds                    |

---

## Conclusion

The fully automated flow from alert to runbook generation works end-to-end. The most unexpected bottleneck was not in the architecture but in the Loki Skill tool returning only metadata — the fix was simpler than anticipated: bypass the Skill, call Bash directly. The fire-and-forget pattern with unique thread IDs per alert is the right design to ensure every investigation runs with fresh context and no interference from previous history.
