---
title: "IncidentFox: Runbook Generation Guide"
description: "How IncidentFox auto-generates incident runbooks after a resolved issue, including setup, trigger prompt, folder structure, and all cases documented so far."
date: "2026-03-16"
tags: ["DevOps", "IncidentFox", "Runbook", "SRE", "Documentation"]
cover: "/images/incidentfox.webp"
featured: false
order: 8
---

## Concept

Runbooks are only generated when an issue has been successfully resolved. If an investigation produced no remediation, only an RCA is saved.

```
Issue resolved?
    ├── YES  → Generate runbook (markdown + scripts if any)
    └── NO   → Save RCA only
```

---

## Setup

```bash
# Create the runbooks folder on the VM
mkdir -p ~/runbooks

# Verify access from inside the container
docker exec incidentfox-sre-agent touch /home/agent/runbooks/test && echo "OK"
ls ~/runbooks/
```

Add mount to `~/incidentfox/docker-compose.yml` under sre-agent volumes:

```yaml
sre-agent:
  volumes:
    - /home/adminuser/runbooks:/home/agent/runbooks:rw
```

```bash
cd ~/incidentfox && docker compose up -d --force-recreate sre-agent
```

---

## Folder Structure

```
~/runbooks/
  ├── PrometheusDown/
  │   ├── 2026-03-12_runbook.md
  │   ├── 2026-03-16_config_corrupt_runbook.md
  │   └── scripts/
  ├── NodeExporterDown/
  │   ├── 2026-03-12_runbook.md
  │   └── scripts/
  ├── HighMemoryUsage/
  │   ├── 2026-03-16_runbook.md
  │   └── scripts/
  └── <AlertName>/
      ├── <YYYY-MM-DD>_runbook.md
      └── scripts/
```

---

## How to Trigger

Reply in the **same Slack thread** as the investigation session, after the issue is resolved:

```
@IncidentFox(Demo) Issue resolved. Please generate a runbook for this incident
and save it as a markdown file to /home/agent/runbooks/<AlertName>/ with filename
<YYYY-MM-DD>_runbook.md.

Include these sections:
1. Incident Summary
2. Root Cause
3. Raw Evidence (exact log lines verbatim in code block)
4. Remediation Steps Performed
5. Scripts Used
6. Follow-up Recommendations

Create the directory if it doesn't exist.
```

> Replace `<AlertName>` and `<YYYY-MM-DD>` with the actual incident values.

---

## Monitor

```bash
# Watch folder in real time
watch -n 3 ls -la ~/runbooks/

# Read a runbook after it is created
cat ~/runbooks/<AlertName>/<YYYY-MM-DD>_runbook.md
```

---

## Runbooks Created So Far

### PrometheusDown — 2026-03-12

**File:** `~/runbooks/PrometheusDown/2026-03-12_runbook.md`
**Context:** Prometheus container failed due to Docker restart failures and DNS timeout.
**Remediation:** `docker start prometheus`, executed directly by the agent.
**Documentation:** `incidentfox-prometheus-down-case.md`

---

### NodeExporterDown — 2026-03-12

**File:** `~/runbooks/NodeExporterDown/2026-03-12_runbook.md`
**Context:** Node Exporter container went down, detected via Prometheus alert.
**Note:** First runbook to include a Raw Evidence section and Follow-up Recommendations.
**Documentation:** `incidentfox-node-exporter-down-case.md`

---

### HighMemoryUsage — 2026-03-16

**File:** `~/runbooks/HighMemoryUsage/2026-03-16_runbook.md`
**Context:** Memory spike caused by `stress-ng`, sre-agent had no docker permission.
**Remediation:** Agent provided `pkill -f stress-ng` as instruction to user.
**Documentation:** `incidentfox-high-memory-usage-case.md`

---

### PrometheusDown (Config Corrupt) — 2026-03-16

**File:** `~/runbooks/PrometheusDown/2026-03-16_config_corrupt_runbook.md`
**Context:** YAML syntax error in `prometheus.yml` caused a crash loop.
**Remediation:** Failed. Agent explained why and provided manual steps for SRE escalation.
**Note:** First investigation runbook where automated remediation was not possible.
**Documentation:** `incidentfox-config-corrupt-case.md`

---

## Notes

Runbook quality depends entirely on the quality of the investigation in the preceding thread. If the RCA was inaccurate due to a narrow log window, fix the RCA first before generating the runbook. For new cases, add an entry to the runbooks section above after the file is successfully created. Always trigger runbook generation in the same thread as the investigation — the agent has no context outside that thread.
