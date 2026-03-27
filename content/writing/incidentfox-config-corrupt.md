---
title: "IncidentFox: Config Corruption Investigation"
description: "IncidentFox detecting Prometheus down due to YAML config corruption, attempting automated remediation, and gracefully escalating with manual steps when restart alone cannot fix the issue."
date: "2026-03-16"
tags: ["DevOps", "IncidentFox", "Prometheus", "SRE", "RCA", "Runbook"]
cover: "/images/incidentfox.webp"
featured: false
order: 10
---

## Objective

Proving that IncidentFox can detect Prometheus down due to config corruption, identify the root cause from docker logs, attempt remediation, and accurately explain why remediation failed along with the manual steps needed to actually fix it.

---

## Difference from Previous Cases

| Aspect                | PrometheusDown (Stop) | PrometheusDown (Config Corrupt) |
| --------------------- | --------------------- | ------------------------------- |
| Cause                 | Manual `docker stop`  | YAML syntax error in config     |
| Restart solves it?    | Yes                   | No                              |
| Automated remediation | Succeeded             | Failed                          |
| Runbook type          | Remediation runbook   | Investigation runbook           |
| Manual steps required | No                    | Yes                             |

---

## Setup

### Corrupt prometheus.yml

```bash
# Backup config
cp ~/monitoring/prometheus.yml ~/monitoring/prometheus.yml.bak

# Inject syntax error
cat >> ~/monitoring/prometheus.yml << 'EOF'

invalid_yaml_corruption: [unclosed bracket
  - bad: "config
EOF

# Recreate Prometheus so it loads the new config
cd ~/monitoring && docker compose up -d --force-recreate prometheus
```

Prometheus immediately enters a crash loop:

```
Error loading config: parsing YAML file prometheus.yml: yaml: line 27: did not find expected ',' or ']'
```

### Inject Log and Monitor Watchdog

```bash
logger -p user.err "FATAL: Prometheus failed to start. Config parse error in prometheus.yml line 27."
docker logs prometheus-watchdog --tail=5 -f
```

### Restore Config After Testing

```bash
cp ~/monitoring/prometheus.yml.bak ~/monitoring/prometheus.yml
cd ~/monitoring && docker compose up -d --force-recreate prometheus
```

---

## Updated Investigation Prompt

`~/monitoring/webhook-bridge/webhook.py`, update `PrometheusDown` prompt:

```python
"PrometheusDown": (
    "We have a critical alert: Prometheus is DOWN on {instance}. Metrics collection has stopped. "
    "Do NOT use Prometheus or VictoriaMetrics as they may be unavailable. "
    "Step 1: Run 'docker logs prometheus --tail=20' to check why Prometheus is down. Show EXACT output. "
    "Step 2: Run 'docker inspect prometheus --format={{{{.State.Status}}}}' to check container state. "
    "Step 3: Use Loki to fetch 5 most recent log lines containing 'prometheus' OR 'FATAL' OR 'error' "
    "from {{host=\"mopogra-vm\"}} in last 10 minutes. Show EXACT full text. "
    "Step 4: Based on findings, attempt to restart prometheus with 'docker start prometheus'. "
    "Step 5: Write RCA explaining root cause. If restart failed, explain why and what manual intervention is needed."
),
```

---

## Test 1 — Config Corrupt Investigation with Restart Attempt

**Approach:**
Prometheus config was corrupted, watchdog detected the outage, alert was sent to Slack, then IncidentFox was triggered to investigate and attempt remediation.

**Result:**

IncidentFox identified the root cause from `docker logs`:

```
Error loading config (--config.file=/etc/prometheus/prometheus.yml)
err="parsing YAML file /etc/prometheus/prometheus.yml: yaml: line 27:
did not find expected ',' or ']'"
```

Agent attempted `docker start prometheus`. Container kept crashing because the config was still broken. Agent recognized this and provided manual steps:

1. Open `/etc/prometheus/prometheus.yml`
2. Inspect line 27 for YAML syntax errors
3. Validate with `promtool check config`
4. Restart after config is fixed

**Assessment:** Investigation succeeded, automated remediation failed as expected. The most valuable output was not the restart attempt but the explanation of why restart alone could not fix this — that is what an SRE actually needs for escalation.

---

## Runbook Generated

**File:** `~/runbooks/PrometheusDown/2026-03-16_config_corrupt_runbook.md`

```markdown
# Investigation Runbook: Prometheus Down Due to Config Corruption

## 1. Incident Summary

Prometheus container repeatedly fails to start with an error parsing the configuration
file (/etc/prometheus/prometheus.yml). Metrics collection has stopped.

## 2. Root Cause

A syntax error in the Prometheus YAML config file at line 27 caused Prometheus to fail
to load its configuration and prevented the container from running.

## 3. Raw Evidence

time=2026-03-16T08:32:19.378Z level=ERROR source=main.go:672 msg="Error loading config
(--config.file=/etc/prometheus/prometheus.yml)" file=/etc/prometheus/prometheus.yml
err="parsing YAML file /etc/prometheus/prometheus.yml: yaml: line 27: did not find
expected ',' or ']'"

## 4. Remediation Attempted

Automated restart via docker start prometheus was performed. Container continuously
failed to start due to the persistent YAML syntax error.

## 5. Why Automated Remediation Failed

Restarting the container does not fix an invalid config file. Prometheus cannot run
with a broken configuration — manual correction is required before restart will work.

## 6. Manual Steps Required

1. Open /etc/prometheus/prometheus.yml
2. Inspect line 27 for YAML syntax errors (missing comma, unclosed bracket, etc.)
3. Fix the syntax error
4. Validate: promtool check config /etc/prometheus/prometheus.yml
5. Restart: docker restart prometheus
6. Confirm Prometheus is UP and metrics collection resumes

## 7. Scripts Used

docker logs prometheus --tail=20
docker inspect prometheus --format={.State.Status}
docker start prometheus
```

---

## Runbook Quality Comparison

| Case                  | Remediation   | Key Section               | Quality |
| --------------------- | ------------- | ------------------------- | ------- |
| PrometheusDown (stop) | Succeeded     |                           | Basic   |
| NodeExporterDown      | Succeeded     | Raw Evidence              | Good    |
| HighMemoryUsage       | User executed | Raw Evidence + Follow-up  | Good    |
| Config Corrupt        | Failed        | Why Failed + Manual Steps | Best    |

---

## Limitations

| Limitation                                                       | Detail                                                             | Workaround                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| Agent cannot read config files                                   | No access to `/etc/prometheus/prometheus.yml` inside the container | Mount config to a path accessible by the agent     |
| `docker inspect --format` not escaped                            | `{.State.Status}` needs to be `{{.State.Status}}` in prompt        | Fix escape in webhook.py                           |
| Agent cannot distinguish stop vs crash loop before investigating | Does not know the difference upfront                               | Add `docker inspect .RestartCount` check to prompt |

---

## Conclusion

IncidentFox correctly identified config corruption as the root cause and accurately explained why automated remediation could not resolve this incident. Graceful failure with actionable manual steps is the expected behavior from an SRE agent. For the team's knowledge base, an investigation runbook from a failed remediation case is just as valuable as a remediation runbook from a successful one.
