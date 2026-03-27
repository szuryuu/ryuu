---
title: "IncidentFox: Memory Spike Investigation"
description: "Testing IncidentFox's ability to investigate a memory spike, identify the offending process from logs, and provide remediation commands to the user — with no docker access on the agent."
date: "2026-03-16"
tags: ["DevOps", "IncidentFox", "VictoriaMetrics", "Loki", "SRE", "Memory"]
cover: "/images/incidentfox.webp"
featured: false
order: 9
---

## Objective

Proving that IncidentFox can investigate a memory spike, identify the root cause from logs and metrics, and provide accurate remediation commands to the user when the sre-agent has no docker or system access.

---

## Difference from Previous Cases

| Aspect                | PrometheusDown    | NodeExporterDown | HighMemoryUsage      |
| --------------------- | ----------------- | ---------------- | -------------------- |
| Alert evaluator       | External watchdog | Prometheus       | Prometheus           |
| Docker permission     | Yes               | Yes              | No                   |
| Remediation           | Agent executes    | Agent executes   | User executes        |
| Identification source | dockerd logs      | dockerd logs     | FATAL logs + metrics |

---

## Setup

### Alert Rule

`~/monitoring/alert.rules.yml`:

```yaml
- name: memory
  rules:
    - alert: HighMemoryUsage
      expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 40
      for: 30s
      labels:
        severity: critical
      annotations:
        summary: "Memory usage above 80% on {{ $labels.instance }}"
```

> Threshold set to `> 40` for testing. The Azure VM has 8Gi RAM and swap=0, so `MemAvailable` stays high even under stress test, making the default threshold unrealistic.

### Investigation Prompt

`~/monitoring/webhook-bridge/webhook.py`, add to `PROMPTS` dict:

```python
"HighMemoryUsage": (
    "We have a critical alert: HighMemoryUsage on {instance}. {summary}. "
    "Do NOT use CloudWatch or any external tools. Show ALL raw values. "
    "Step 1: Use VictoriaMetrics to query instant value of node_memory_MemAvailable_bytes "
    "and node_memory_MemTotal_bytes for label {instance=\"node-exporter:9100\"}. "
    "Show EXACT numeric values and calculate used percentage. "
    "Step 2: Use Loki to fetch 5 most recent log lines containing 'OOM' OR 'out of memory' "
    "OR 'FATAL' OR 'killed' using {host=\"mopogra-vm\"} in last 10 minutes. "
    "Show EXACT full text. "
    "Step 3: Identify which process or container was OOM killed. "
    "Step 4: Write brief RCA and provide exact commands for the user to run to remediate "
    "— since you do not have docker access, instruct the user on what to execute."
),
```

### Docker Permission — Removed from sre-agent

`~/incidentfox/docker-compose.yml` — confirm these lines are absent from sre-agent:

```yaml
# group_add:
#   - "999"
# volumes:
#   - /var/run/docker.sock:/var/run/docker.sock:rw
#   - /usr/bin/docker:/usr/bin/docker:ro
```

Verify:

```bash
docker exec incidentfox-sre-agent docker ps 2>&1
# Expected: executable file not found in $PATH
```

---

## Test 1 — Memory Spike Investigation with No Docker Access

**Setup:**

```bash
stress-ng --vm 2 --vm-bytes 85% --timeout 600s &
sleep 10 && logger -p user.err "FATAL: Memory spike detected. stress-ng consuming excessive memory. OOM killer may terminate processes on mopogra-vm."
```

**Monitor memory before triggering:**

```bash
watch -n 5 'curl -s "http://localhost:9090/api/v1/query?query=(1-(node_memory_MemAvailable_bytes/node_memory_MemTotal_bytes))*100" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(\"Memory used:\", round(float(d[\"data\"][\"result\"][0][\"value\"][1]),2), \"%\")"'
```

**Result:**

IncidentFox completed the investigation in 2 skill calls with no looping:

```
VictoriaMetrics:
  MemAvailable : 1,733,337,088 bytes
  MemTotal     : 8,330,469,376 bytes
  Memory used  : 79.2%

Loki (lookback 10 minutes):
  [2026-03-16 03:11:24] FATAL: Memory spike detected. stress-ng consuming excessive memory.
  [2026-03-16 03:03:39] FATAL: Memory spike detected. stress-ng consuming excessive memory.
```

RCA: `stress-ng` identified as the cause. Agent provided remediation instructions to user:

```bash
pkill -f stress-ng
# or:
ps aux | grep stress-ng
kill <pid>
```

User ran the command and memory returned to normal.

**Assessment:** Pass. Investigation was accurate, fallback to user-executed remediation worked correctly — the agent did not crash or loop when it lacked system access.

---

## How to Reproduce

```bash
# 1. Confirm all services are running
cd ~/monitoring && docker compose ps
cd ~/incidentfox && docker compose ps

# 2. Start stress test
stress-ng --vm 2 --vm-bytes 85% --timeout 600s &

# 3. Inject log at the same time — do not inject ahead of time, it will expire
sleep 10 && logger -p user.err "FATAL: Memory spike detected. stress-ng consuming excessive memory. OOM killer may terminate processes on mopogra-vm."

# 4. Wait for alert to fire (~30 seconds after threshold is hit)

# 5. Trigger @IncidentFox in a NEW Slack thread
# 6. Run the command provided by IncidentFox
# 7. After resolved, request runbook generation in the same thread
```

> Always start a new Slack thread for each investigation. Threads with 1000+ messages cause a 600-second timeout due to excessive history.

---

## Limitations

| Limitation                           | Detail                                                 | Workaround                                  |
| ------------------------------------ | ------------------------------------------------------ | ------------------------------------------- |
| Thread timeout                       | Long threads with many messages time out at 600s       | Use a new Slack thread per incident         |
| `ps` not available in container      | sre-agent does not include the `ps` binary             | Agent gracefully skips, does not crash      |
| MemAvailable always high on Azure VM | 8Gi RAM + swap=0, default threshold is not realistic   | Lower alert threshold to `> 40` for testing |
| Log window default too wide          | Without explicit instruction, Loki may look back hours | Specify `in last 10 minutes` in the prompt  |

---

## Lesson Learned

Inject FATAL logs at the same time as the stress test, not before — logs that are too old will have expired by the time the investigation runs. Always start a fresh Slack thread per incident to avoid timeout from history buildup. Without docker permission, the agent correctly falls back to providing exact commands for the user rather than failing. Specify the time window explicitly in the prompt — the agent will use a default that may be far too wide without it.

---

## Conclusion

IncidentFox successfully investigated the memory spike and provided accurate remediation despite having no docker or system access. The fallback to user-executed commands is the correct behavior for least-privilege environments. This case proves that IncidentFox's effectiveness is not dependent on permission level, but on prompt quality and log timing.
