---
title: "IncidentFox: CPU Spike Investigation"
description: "Testing IncidentFox's ability to investigate a CPU spike incident by reading metrics from VictoriaMetrics, pulling FATAL logs from Loki, and generating a Root Cause Analysis."
date: "2026-03-12"
tags: ["DevOps", "IncidentFox", "VictoriaMetrics", "Loki", "RCA", "SRE"]
cover: "/images/incidentfox.webp"
featured: false
order: 5
---

## Objective

Proving that IncidentFox can actively investigate a CPU spike incident by reading metrics from VictoriaMetrics, pulling relevant logs from Loki, and producing an actionable Root Cause Analysis.

---

## Setup

CPU spike was created manually:

```bash
dd if=/dev/zero of=/dev/null & dd if=/dev/zero of=/dev/null &
```

FATAL logs were injected manually into syslog:

```bash
logger -p user.err "FATAL Exception: payment-service thread locked. OOM condition imminent due to CPU starvation."
logger -p user.err "FATAL Exception: database connection dropped. Timeout waiting for CPU cycles."
```

Grafana confirmed CPU at 100% before testing began.

---

## Test 1 — Natural Prompt, No Specific Instructions

**Prompt:**

```
@IncidentFox(Demo) Grafana is showing a massive CPU spike on 'mopogra-vm' right now.
Investigate this incident. Verify the current load average metric, then dig into the
syslog of that host from the last 10 minutes to find the root cause. Synthesize your
findings into a brief Root Cause Analysis (RCA).
```

**Result:**

```
The query for CPU load average metric on 'mopogra-vm' returned no data points.
The attempt to retrieve syslog logs from CloudWatch for 'mopogra-vm' also failed
due to missing AWS credentials.
```

> The bot hallucinated: it mentioned AWS CloudWatch and credentials that were irrelevant to this environment. This happened because there was no explicit instruction about which tools to use.

**Assessment:** Fail. Ambiguous prompts push the bot to guess the wrong tools.

---

## Test 2 — Structured Prompt, No Endpoint Provided

**Prompt:**

```
@IncidentFox(Demo) We have a critical CPU spike. You MUST use the exact tools and
labels below. Do NOT use CloudWatch.

Step 1: Use VictoriaMetrics to query instant value of 'node_load1' for
        {instance="node-exporter:9100"}.
Step 2: Use Loki to fetch the 3 most recent log lines containing "FATAL" using
        {job="syslog", host="mopogra-vm"} in the last 10 minutes.
Step 3: Synthesize findings from Step 1 and Step 2 into a brief RCA.
```

**Result:**

```
Queries failed due to DNS resolution errors. Could you provide the correct URLs
for VictoriaMetrics and Loki endpoints?
```

**Assessment:** Fail. Bot could not resolve default hostnames. Endpoint URLs need to be configured at the agent level or included in the prompt.

---

## Test 3 — CPU Load Reduced to 80%, Same Prompt

**Setup:**

```bash
stress-ng --cpu 2 --cpu-load 80 --timeout 120s &
logger -p user.err "FATAL Exception: payment-service thread locked. OOM condition imminent due to 80% CPU saturation."
```

**Result:**
Bot successfully read metrics from VictoriaMetrics, pulled FATAL logs from Loki, and produced an RCA citing CPU saturation as the root cause.

**Assessment:** Pass. Endpoints were correctly configured at this point, and lower CPU load kept the environment stable enough for investigation.

---

## Limitations

| Limitation                                 | Detail                                                | Workaround                                    |
| ------------------------------------------ | ----------------------------------------------------- | --------------------------------------------- |
| Bot guesses tools when prompt is ambiguous | Can land on wrong tools (CloudWatch, New Relic, etc.) | Always name the tool explicitly in the prompt |
| Endpoint URLs not auto-resolved            | Bot needs valid URLs to run queries                   | Configure at agent level or include in prompt |
| Long, detailed prompts required            | Every investigation needs step-by-step instructions   | Build prompt templates per incident type      |

---

## Conclusion

IncidentFox can produce accurate RCAs but only when given very specific instructions: which tool, which label, which step. Natural prompts without explicit instructions cause hallucinations or queries to the wrong tools. The practical fix is to build prompt templates per incident type with variables like instance name and time range.
