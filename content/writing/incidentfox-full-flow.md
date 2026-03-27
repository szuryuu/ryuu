---
title: "IncidentFox: Full Incident Flow — Detection, Remediation, and Runbook Generation"
description: "End-to-end proof of concept: IncidentFox detecting Prometheus down, investigating via logs, remediating with user approval, and auto-generating a runbook."
date: "2026-03-12"
tags: ["DevOps", "IncidentFox", "Prometheus", "SRE", "Runbook", "Remediation"]
cover: "/images/incidentfox.webp"
featured: true
order: 7
---

## Objective

Proving that IncidentFox can handle a complete incident lifecycle end-to-end: detect a service down, investigate via logs, remediate with user approval, and auto-generate a runbook after the issue is resolved.

---

## Architecture

```
Prometheus DOWN
      ↓
Prometheus Watchdog (checks every 15 seconds)
      ↓
POST /api/v2/alerts → Alertmanager
      ↓
Alertmanager → Webhook Bridge → Slack (notification + prompt)
      ↓
User triggers @IncidentFox → Loki investigation → RCA
      ↓
User approves in thread → IncidentFox runs docker start prometheus
      ↓
Watchdog detects UP → Alertmanager → Slack (resolved)
      ↓
User requests runbook → IncidentFox generates → saves to ~/runbooks/
```

---

## Additional Components

### Prometheus Watchdog

Prometheus cannot evaluate its own alerting rules when it is down, so an external watchdog running independently is required.

`~/monitoring/webhook-bridge/watchdog.py`:

```python
import httpx, time, os

PROMETHEUS_URL = os.environ.get("PROMETHEUS_URL", "http://prometheus:9090")
ALERTMANAGER_URL = os.environ.get("ALERTMANAGER_URL", "http://alertmanager:9093")
CHECK_INTERVAL = int(os.environ.get("CHECK_INTERVAL", "15"))

def is_prometheus_up():
    try:
        r = httpx.get(f"{PROMETHEUS_URL}/-/healthy", timeout=5)
        return r.status_code == 200
    except Exception:
        return False

def send_alert(firing: bool):
    status = "firing" if firing else "resolved"
    payload = [{
        "status": status,
        "labels": {
            "alertname": "PrometheusDown",
            "instance": "prometheus:9090",
            "severity": "critical"
        },
        "annotations": {
            "summary": "Prometheus is down on prometheus:9090"
        },
        "generatorURL": "http://watchdog"
    }]
    try:
        httpx.post(f"{ALERTMANAGER_URL}/api/v2/alerts", json=payload, timeout=5)
        print(f"[watchdog] Sent {status} alert to Alertmanager")
    except Exception as e:
        print(f"[watchdog] Failed to send alert: {e}")

was_down = False
print(f"[watchdog] Starting. Checking Prometheus every {CHECK_INTERVAL}s")
while True:
    up = is_prometheus_up()
    if not up and not was_down:
        print("[watchdog] Prometheus is DOWN — sending firing alert")
        send_alert(firing=True)
        was_down = True
    elif up and was_down:
        print("[watchdog] Prometheus is UP — sending resolved alert")
        send_alert(firing=False)
        was_down = False
    time.sleep(CHECK_INTERVAL)
```

### Docker Socket Access for SRE Agent

For IncidentFox to run `docker start/stop`, the sre-agent needs access to the Docker socket. Add to `~/incidentfox/docker-compose.yml`:

```yaml
sre-agent:
  group_add:
    - "999" # docker group GID — verify with: getent group docker
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:rw
    - /usr/bin/docker:/usr/bin/docker:ro
    - /home/adminuser/runbooks:/home/agent/runbooks:rw
```

---

## Investigation Result — PrometheusDown

**Prompt sent by user in Slack:**

```
@IncidentFox We have a critical alert: Prometheus is DOWN. Metrics collection has
stopped. Do NOT use Prometheus or VictoriaMetrics as they may be unavailable.

Step 1: Use Loki to fetch the 5 most recent log lines containing 'prometheus' OR
        'FATAL' OR 'error' using {host="mopogra-vm"} in the last 5 minutes.
        Show exact full text of each log line.
Step 2: Write a brief RCA explaining why Prometheus went down and recommended
        remediation steps.
```

**Result:**
IncidentFox identified from logs:

- Docker container restart failures (`ShouldRestart failed, restart canceled`)
- DNS resolution errors to 8.8.8.8 (i/o timeout)
- `prometheus` container detected via dockerd log

RCA cited Docker container lifecycle issues combined with DNS/network failures as root cause.

> Manually injected FATAL logs were not captured because they fell outside the 5-minute window at the time of investigation. Extending lookback to 30 minutes in the prompt improves coverage.

---

## Remediation Result

**User approval in Slack thread:**

```
@IncidentFox(Demo) Approved. Please restart the prometheus container using docker start prometheus.
```

IncidentFox ran `docker start prometheus`. Prometheus was back UP within seconds, verified via `docker ps`.

Human-in-the-loop behavior confirmed — the agent requested confirmation before execution and explained its plan and expected impact.

---

## Runbook Generation

Runbook was successfully created at `~/runbooks/PrometheusDown/2026-03-12_runbook.md`.

---

## How to Reproduce

```bash
# 1. Confirm all services are running
cd ~/monitoring && docker compose ps
cd ~/incidentfox && docker compose ps

# 2. Stop Prometheus and inject log
docker stop prometheus
logger -p user.err "FATAL: Prometheus container stopped. Metrics collection halted on mopogra-vm:9090."

# 3. Wait for watchdog to detect (~15 seconds)
docker logs prometheus-watchdog -f

# 4. Alert arrives in Slack — forward prompt to @IncidentFox
# 5. Approve remediation in the Slack thread
# 6. After resolved, request runbook generation
```

---

## Limitations

| Limitation                         | Detail                                                            | Workaround                                     |
| ---------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------- |
| Self-mention                       | Alert from IncidentFox cannot trigger itself                      | User manually forwards prompt to @IncidentFox  |
| Narrow log window                  | Default 5 minutes — injected logs may expire before investigation | Extend lookback to 30 minutes in prompt        |
| Docker binary missing in container | sre-agent does not include docker CLI                             | Mount `/usr/bin/docker` from host              |
| GID mismatch                       | Agent user lacks docker socket access                             | Add `group_add: ["999"]`                       |
| Alertmanager repeat_interval       | Same alert not resent within 1 hour                               | Set to `1m` during testing, `1h` in production |
| PrometheusDown self-evaluation     | Prometheus cannot evaluate rules when it is down                  | Use external watchdog                          |

---

## Security Note

Giving the sre-agent access to the Docker socket is a serious security tradeoff. The agent can stop, start, or delete any container on the host, including itself. For production, consider mounting the socket as `:ro` with a limited proxy, or whitelisting only specific commands like `docker start <container>`.

---

## Conclusion

The full flow from detection to runbook generation worked. Human-in-the-loop behavior performed as expected — the agent did not execute remediation without explicit confirmation. The one unresolved structural limitation is the need for a manual Slack trigger, which requires a second dedicated Slack App as the sender to properly fire the `app_mention` event.
