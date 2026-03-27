---
title: "IncidentFox: Loki Integration Testing"
description: "Testing IncidentFox's ability to query Loki logs, handle rate limits, and respond to structured vs general prompts."
date: "2026-03-10"
tags: ["DevOps", "IncidentFox", "Loki", "SRE", "Testing"]
cover: "/images/incidentfox.webp"
featured: false
order: 4
---

## Objective

Proving that IncidentFox can read logs from Loki and respond to basic queries, while identifying the limits of bot capability and token efficiency.

---

## Test 1 — Error Query from a Specific Container

**Prompt:**

```
@IncidentFox(Demo) query loki for recent errors from incidentfox-sre-agent container in the last 1 hour
```

**Result:**

```
I queried Loki logs for the incidentfox-sre-agent container for the last 1 hour
filtering for error logs, but no error logs were found in that timeframe. Let me
know if you want me to check a longer time range or search for warnings or other
types of messages.
```

**Assessment:** Pass. Response was accurate, fallback message was appropriate, no over-querying.

---

## Test 2 — Real-Time Server Resource Check

**Prompt:**

```
@IncidentFox(Demo) what is the memory usage and disk usage of this server right now?
```

**Result:**

```
Total memory: ~7.8 GB | Available: ~5.8 GB | Active: ~2.3 GB
Disk: 29 GB total, 13 GB used, 42% used on root /
```

> This is outside the intended use case for IncidentFox. The bot is better suited for incident detection, not resource monitoring.

**Assessment:** Pass technically, but out of scope.

---

## Test 3 — Check Errors and Warnings (15 Minutes)

**Prompt:**

```
@IncidentFox(Demo) check loki for any errors or warnings in incidentfox-slack-bot logs in the last 15 minutes
```

**Result:**

```
First query with 'or' operator failed (400 Bad Request). Bot self-corrected using
regex pattern 'error|warning'. Final result: no logs found.
```

> The bot ran two queries because the first LogQL syntax was wrong. This iteration consumed extra tokens that could have been avoided with a more specific prompt.

**Assessment:** Partial. Self-correction worked but was inefficient.

---

## Test 4 — Health Check via Loki (5 Minutes)

**Prompt:**

```
@IncidentFox(Demo) using loki, is incidentfox-slack-bot healthy? check last 5 minutes
```

**Result:**

```
Error: Could not connect to investigation service. Is it running?
```

> sre-agent logs revealed: `litellm.RateLimitError — TPM reached 1.34M, exceeding Azure AI Foundry tier S0 quota.`
> The Slack error message was misleading — it looked like the service was down, but it was actually a quota issue.

**Assessment:** Fail due to rate limit. General prompts accelerated quota exhaustion.

---

## Test 5 — Aggregation Query with Structured Prompt

**Prompt:**

```
@IncidentFox Execute an aggregation query to Loki to calculate the total number of
log lines containing "error" or "exception" from "incidentfox-slack-bot" in the
last 5 minutes. Do not pull raw log contents.

Condition 1: If count > 0, pull ONLY the first 2 log lines as sample.
Condition 2 (FALLBACK): If count is 0 or no results, reply "System Healthy: No
errors found" and STOP. Do NOT retry, do NOT expand time range, do NOT modify LogQL.
```

**Result:** Quota insufficient to run the query.

> The prompt structure was correct and efficient. Needs to be retried after quota reset.

**Assessment:** Fail due to previous quota exhaustion, not prompt quality.

---

## Limitations

| Limitation                      | Detail                                                      | Workaround                                         |
| ------------------------------- | ----------------------------------------------------------- | -------------------------------------------------- |
| Azure AI Foundry S0 quota       | 1.34M TPM depleted from a single testing session            | Upgrade quota or migrate to alternative provider   |
| General prompts cause iteration | Bot retries and modifies queries on its own, wasting tokens | Use structured prompts with explicit instructions  |
| Misleading error messages       | Rate limit error surfaces as "service not running"          | Add error handling that differentiates error types |

---

## Conclusion

The Loki integration works for basic queries. The main problem is not bot capability but prompt efficiency and quota constraints. General prompts push the bot to iterate unnecessarily. The structured prompt in Test 5 is the right pattern going forward, but needs to be validated after quota is reset or provider is changed.
