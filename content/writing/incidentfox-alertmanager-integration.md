---
title: "IncidentFox: Alertmanager Integration"
description: "Testing an automated alert-to-Slack notification flow using Alertmanager, a webhook bridge, and IncidentFox — including all failed approaches and the working final solution."
date: "2026-03-13"
tags: ["DevOps", "IncidentFox", "Alertmanager", "Slack", "Prometheus", "SRE"]
cover: "/images/incidentfox.webp"
featured: false
order: 6
---

## Objective

Proving that Prometheus alerts can be automatically delivered to Slack as notifications, complete with a ready-to-use investigation prompt for IncidentFox.

---

## Architecture

```
Prometheus → Alertmanager → Webhook Bridge → Slack (notification + prompt)
                                                        ↓
                                             User triggers @IncidentFox
                                                        ↓
                                             IncidentFox → RCA
```

---

## Test 1 — Bot Token for Self-Mention (Fail)

**Approach:**
Webhook bridge sends a message to Slack using IncidentFox's own bot token, containing a mention of IncidentFox itself.

```python
slack = WebClient(token=os.environ["SLACK_BOT_TOKEN"])
slack.chat_postMessage(
    channel=CHANNEL_ID,
    text=f"<@{BOT_USER_ID}> investigate this alert..."
)
```

**Result:** Message arrived in the channel but IncidentFox did not respond. Slack prevents a bot from responding to mentions of itself to avoid infinite loops.

**Assessment:** Fail. Bot token cannot be used for self-mention.

---

## Test 2 — User Token (Fail)

**Approach:**
Send the message as a regular user using an `xoxp-` token, so the `@IncidentFox` mention appears to come from a human.

```python
slack = WebClient(token=os.environ["SLACK_USER_TOKEN"])
slack.chat_postMessage(
    channel=CHANNEL_ID,
    text=f"<@{BOT_USER_ID}> investigate this alert..."
)
```

**Result:** User OAuth Token with `admin:write` scope requires Slack Enterprise. Not available on free or standard workspaces.

**Assessment:** Fail. Not feasible without enterprise billing.

---

## Test 3 — Direct API Call to SRE Agent (Fail)

**Approach:**
Bypass Slack entirely. Webhook bridge calls the `/investigate` endpoint on the sre-agent directly.

```python
await client.post(f"{SRE_AGENT_URL}/investigate", json={"prompt": prompt})
```

**Result:** Investigation ran on the sre-agent (visible from logs), but results never appeared in Slack. The `/investigate` endpoint does not accept `channel_id` or `thread_id`, so the agent had no idea where to send the result.

**Assessment:** Fail. IncidentFox Community Edition is designed to be triggered via Slack, not direct API calls.

---

## Test 4 — Incoming Webhook + Manual Trigger (Pass)

**Approach:**
Webhook bridge sends alert notifications to Slack via an Incoming Webhook URL. The message includes alert details and a ready-to-copy investigation prompt. User copies the prompt and sends it to IncidentFox manually.

**Result:** Notifications arrived in Slack with the correct format. Users can immediately copy the prompt and trigger IncidentFox. End-to-end flow worked.

**Assessment:** Pass, with one caveat — user still needs to manually trigger the bot.

---

## Technical Notes

### Webhook Bridge

`~/monitoring/webhook-bridge/webhook.py`:

```python
from fastapi import FastAPI, Request
import os, httpx, uvicorn

app = FastAPI()
SLACK_WEBHOOK_URL = os.environ["SLACK_INCOMING_WEBHOOK_URL"]
BOT_USER_ID = os.environ["SLACK_BOT_USER_ID"]

@app.post("/webhook")
async def alertmanager_webhook(request: Request):
    body = await request.json()
    for alert in body.get("alerts", []):
        if alert["status"] != "firing":
            continue
        name = alert["labels"].get("alertname", "Unknown")
        instance = alert["labels"].get("instance", "unknown")
        summary = alert["annotations"].get("summary", "No summary")

        message = (
            f":rotating_light: *[FIRING] {name}*\n"
            f"Instance: `{instance}`\n"
            f"Summary: {summary}\n\n"
            f"<@U0AK04THCQ0> <@U0AK79BGX8D> please investigate:\n\n"
            f"<@{BOT_USER_ID}> We have a critical alert: *{name}* on `{instance}`. "
            f"{summary}. You MUST use the exact tools and labels provided below. "
            f"Do NOT use CloudWatch, New Relic, or any external tools. "
            f"Step 1: Use VictoriaMetrics to query instant value of `node_load1` "
            f"for {{instance=\"{instance}\"}}. "
            f"Step 2: Use Loki to fetch the 3 most recent log lines containing \"FATAL\" "
            f"using {{job=\"syslog\", host=\"mopogra-vm\"}} in the last 10 minutes. "
            f"Step 3: Write a brief RCA based on Step 1 and Step 2."
        )
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(SLACK_WEBHOOK_URL, json={"text": message})
    return {"ok": True}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9095)
```

### Docker Compose — Webhook Bridge

```yaml
webhook-bridge:
  image: python:3.11-slim
  container_name: alertmanager-webhook-bridge
  working_dir: /app
  volumes:
    - ./webhook-bridge:/app
  command: >
    bash -c "pip install fastapi uvicorn slack-sdk httpx -q && python webhook.py"
  environment:
    - SLACK_INCOMING_WEBHOOK_URL=${SLACK_INCOMING_WEBHOOK_URL}
    - SLACK_BOT_USER_ID=${SLACK_BOT_USER_ID}
    - ALERT_MENTION_USERS=${ALERT_MENTION_USERS}
  env_file:
    - .env
  ports:
    - "9095:9095"
  networks:
    - monitoring
    - shared
  restart: unless-stopped
```

### Alertmanager Config

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ["alertname"]
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: "incidentfox"

receivers:
  - name: "incidentfox"
    webhook_configs:
      - url: "http://alertmanager-webhook-bridge:9095/webhook"
        send_resolved: true
```

> Use container name, not IP. IPs change on every VM restart.

### Environment Variables

```
SLACK_INCOMING_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../xxx
SLACK_BOT_USER_ID=U0AJ2DLDQJH
ALERT_MENTION_USERS=U0AK04THCQ0,U0AK79BGX8D
```

### Testing

```bash
# Test webhook bridge manually
curl -X POST http://localhost:9095/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "alerts": [{
      "status": "firing",
      "labels": {
        "alertname": "HighCPUUsage",
        "instance": "node-exporter:9100",
        "severity": "warning"
      },
      "annotations": {
        "summary": "CPU usage above 80% on node-exporter:9100"
      }
    }]
  }'

# Test Alertmanager connectivity to webhook bridge
docker exec -it alertmanager wget -O- http://alertmanager-webhook-bridge:9095/webhook
# Expected: HTTP 405 — connection succeeded, wrong method (expected)
```

---

## Limitations

| Limitation                              | Detail                                            | Workaround                                    |
| --------------------------------------- | ------------------------------------------------- | --------------------------------------------- |
| Bot cannot self-mention                 | Alert cannot auto-trigger IncidentFox             | User manually copies prompt from notification |
| User token requires Slack Enterprise    | Not available on free workspaces                  | Incoming Webhook + manual trigger             |
| `/investigate` API has no Slack context | Results do not appear in Slack if called directly | Always trigger via Slack mention              |
| Dynamic container IPs                   | URL changes on every restart                      | Use container name in alertmanager.yml        |

---

## Conclusion

The alert-to-Slack flow works with Incoming Webhooks. The remaining bottleneck is that IncidentFox cannot be triggered automatically because Slack prevents a bot from responding to mentions of itself. The long-term solution is a second dedicated Slack App for alerting that sends `@IncidentFox` mentions — since the sender would be a different bot, Slack would fire the `app_mention` event normally.
