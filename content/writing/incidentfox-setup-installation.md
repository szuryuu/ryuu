---
title: "IncidentFox: Setup and Installation Guide"
description: "Complete setup guide for IncidentFox from scratch, including Azure AI Foundry configuration, Prometheus, Grafana, VictoriaMetrics, and Loki integration."
date: "2026-03-10"
tags: ["DevOps", "IncidentFox", "Setup", "Azure", "Loki", "Prometheus", "SRE"]
cover: "/images/incidentfox.webp"
featured: true
order: 3
---

## Objective

Documenting the installation steps for IncidentFox from zero to fully operational, including integration with Azure AI Foundry, Prometheus, Grafana, VictoriaMetrics, and Loki.

---

## Step 1 — Clone and Initialize

```bash
git clone https://github.com/incidentfox/incidentfox
cd incidentfox
cp .env.example .env
make dev
```

---

## Step 2 — Slack App Configuration

Follow the official guide at `docs/SLACK_SETUP.md` in the repo, then fill in `.env`:

```
SLACK_BOT_TOKEN=xoxb-...
SLACK_APP_TOKEN=xapp-...
```

---

## Step 3 — Configure `.env`

```
# Slack
SLACK_BOT_TOKEN=xoxb-...
SLACK_APP_TOKEN=xapp-...

# Azure AI Foundry
AZURE_AI_API_KEY=<api-key-from-azure-portal>
AZURE_AI_API_BASE=https://<resource-name>.cognitiveservices.azure.com/
AZURE_AI_API_VERSION=2025-01-01-preview

# Config Service Auth
ADMIN_TOKEN=local-admin-token
CONFIG_SERVICE_ADMIN_TOKEN=local-admin-token

# App mode
CONFIG_MODE=local
```

> `CONFIG_SERVICE_ADMIN_TOKEN` is read by `slack-bot/config_client.py` (line 35).
> Without it, slack-bot will continuously receive 401 when issuing a team token to config-service.
> `ADMIN_TOKEN` alone is not sufficient.

API key is available at: **Azure Portal → Resource → Keys and Endpoint**

---

## Step 4 — Configure `config_service/config/local.yaml`

```yaml
org_id: local
team_id: default

ai_model:
  base_url: https://<resource-name>.cognitiveservices.azure.com/openai
  model_id: gpt-4.1-mini
  provider: azure_ai

integrations:
  azure_ai:
    api_key: ${AZURE_AI_API_KEY}
    base_url: https://<resource-name>.cognitiveservices.azure.com/openai
    api_version: "2025-01-01-preview"
```

> `provider` must be `azure_ai`, not `openai`. If set incorrectly, the system stores config as `azure_ai` from the UI but the `local.yaml` differs, causing credential conflicts.

---

## Step 5 — Configure Azure AI Foundry Quota

**Azure Portal → AI Foundry resource → Deployments → select deployment**

| Parameter                 | Minimum | Recommended |
| ------------------------- | ------- | ----------- |
| Tokens per Minute (TPM)   | 24,000  | 100,000+    |
| Requests per Minute (RPM) | 24      | 100+        |

> The system uses a multi-agent setup with 8 subagents. Each investigation triggers 20 to 50 API calls. With Azure's default quota (4 RPM), the system will time out before it can respond.

---

## Step 6 — Build and Run

```bash
# Full build
docker compose up -d --build --force-recreate

# Partial rebuild after config edits
docker compose restart slack-bot sre-agent credential-resolver
```

---

## Step 7 — Verify

```bash
# Check all containers are running
docker ps
# Expected running containers:
# postgres, config-service, credential-resolver, envoy, sre-agent, slack-bot

# Test sre-agent health
curl -s http://localhost:8000/health
# Expected: {"status":"healthy","mode":"simple","active_sessions":0}

# Check credential-resolver received the Azure key
docker exec incidentfox-credential-resolver env | grep -i azure

# Monitor logs while sending a message to the bot
docker compose logs slack-bot sre-agent -f
```

Expected log flow after mentioning the bot:

```
1. slack-bot           — APP_MENTION EVENT RECEIVED
2. slack-bot           — Routing found
3. sre-agent           — Investigation: thread=...
4. credential-resolver — LLM proxy: model=azure_ai/gpt-4.1-mini
5. envoy               — POST /v1/messages -> credential_resolver_llm 200
```

---

## Step 8 — Test in Slack

```
@IncidentFox hello
```

---

## Step 9 — Integrate Prometheus, Grafana, VictoriaMetrics

### Add to `.env`:

```
PROMETHEUS_URL=http://172.17.0.1:9090
GRAFANA_URL=http://172.17.0.1:3000
GRAFANA_API_KEY=<token from Grafana UI>
VICTORIAMETRICS_URL=http://172.17.0.1:8428
```

> `172.17.0.1` is the Docker bridge host IP (`docker0`). Use this because the monitoring stack and incidentfox stack are on different Docker networks and cannot reach each other via container names.
> Verify IP: `ip addr show docker0 | grep "inet " | awk '{print $2}' | cut -d/ -f1`

### Add to `local.yaml`:

```yaml
integrations:
  azure_ai:
    api_key: ${AZURE_AI_API_KEY}
    base_url: https://<resource>.cognitiveservices.azure.com/openai
    api_version: "2025-01-01-preview"
  prometheus:
    url: ${PROMETHEUS_URL}
  grafana:
    url: ${GRAFANA_URL}
    api_key: ${GRAFANA_API_KEY}
  victoria_metrics:
    url: ${VICTORIAMETRICS_URL}
```

### Add `env_file` to sre-agent in `docker-compose.yml`:

```yaml
sre-agent:
  env_file:
    - .env
  environment:
    - ANTHROPIC_BASE_URL=http://envoy:8001
```

> sre-agent uses an explicit `environment:` block and does not automatically read `.env`.
> Without `env_file`, monitoring variables will not be injected into the container.

### Apply and verify:

```bash
docker compose up -d --force-recreate sre-agent
docker exec incidentfox-sre-agent env | grep -i "prometheus\|victoria\|grafana"
```

### Test in Slack:

```
@IncidentFox what is the memory usage and disk usage of this server right now?
```

---

## Step 10 — Loki Integration

This setup uses an existing external Loki VM as a centralized log aggregator for multiple VMs via Promtail.

```
VM incidentfox → Promtail → Loki VM
VM other A     → Promtail → Loki VM
VM other B     → Promtail → Loki VM
```

### Add to `/etc/hosts`:

```bash
echo "35.219.119.178 <LOKI_URL>" | sudo tee -a /etc/hosts
```

### Create `~/monitoring/promtail-config.yml`:

```yaml
server:
  http_listen_port: 9080

positions:
  filename: /tmp/positions.yaml

clients:
  - url: ${LOKI_URL}/loki/api/v1/push
    basic_auth:
      username: ${LOKI_USERNAME}
      password: ${LOKI_PASSWORD}

scrape_configs:
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    relabel_configs:
      - source_labels: ["__meta_docker_container_name"]
        regex: "/(.*)"
        target_label: container
        replacement: "$1"
      - source_labels: ["__meta_docker_container_name"]
        regex: "/(.*)"
        target_label: app
        replacement: "$1"
      - source_labels: ["__meta_docker_container_log_stream"]
        target_label: stream

  - job_name: syslog
    static_configs:
      - targets: [localhost]
        labels:
          job: syslog
          host: mopogra-vm
          __path__: /var/log/syslog
```

> The `app` label is mandatory. IncidentFox queries Loki using `{app="..."}` by default. Without this relabel rule, the agent will not find container logs even if the data is in Loki.

> Docker socket discovery prepends `/` to container names (e.g., `/incidentfox-sre-agent`). The regex `/(.*) ` in the relabel config strips this slash.

### Add Promtail to `~/monitoring/docker-compose.yml`:

```yaml
promtail:
  image: grafana/promtail:latest
  container_name: promtail
  volumes:
    - ./promtail-config.yml:/etc/promtail/promtail-config.yml
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - /var/log:/var/log:ro
    - /var/lib/docker/containers:/var/lib/docker/containers:ro
  command: -config.file=/etc/promtail/promtail-config.yml
  networks:
    - monitoring
  restart: unless-stopped
```

### Apply:

```bash
cd ~/monitoring && docker compose up -d promtail
sleep 10 && docker logs promtail --tail=5
```

### Connect to IncidentFox — add to `~/incidentfox/.env`:

```
LOKI_URL=http://<YOUR_LOKI_URL>
LOKI_USER=<YOUR_LOKI_USER>
LOKI_USERNAME=<YOUR_LOKI_USERNAME>
LOKI_PASSWORD=<YOUR_LOKI_PASSWORD>
```

> The variable name must be `LOKI_USER`, not only `LOKI_USERNAME`. Add both for compatibility.

### Verify labels are in Loki:

```bash
# Check app label is available
curl -s -u loki:<password> \
  "http://<LOKI_URL>/loki/api/v1/label/app/values" \
  | python3 -m json.tool

# Manual query test
curl -s -u loki:<password> \
  "http://<LOKI_URL>/loki/api/v1/query_range" \
  --data-urlencode 'query={app="incidentfox-slack-bot"}' \
  --data-urlencode 'limit=5' \
  | python3 -m json.tool | head -20
```

### Test in Slack:

```
@IncidentFox check loki for errors or warnings in incidentfox-slack-bot logs in the last 15 minutes
```

---

## Troubleshooting

### 401 on config-service

```
Failed to issue team token: 401 Unauthorized
```

Add `CONFIG_SERVICE_ADMIN_TOKEN=local-admin-token` to `.env` and restart slack-bot.

---

### 401 Azure — No API key configured

```
No API key configured for azure_ai
```

Change `provider: openai` to `provider: azure_ai` in `local.yaml`. Confirm `AZURE_AI_API_KEY` is in `.env`.

---

### 401 Azure — Access denied

```
AzureException AuthenticationError - Access denied due to invalid subscription key
```

`AZURE_AI_API_BASE` is too specific (contains deployment path or query string). Set to base URL only:

```
AZURE_AI_API_BASE=https://<resource-name>.cognitiveservices.azure.com/
```

---

### Bot not responding / timeout

```
429 Too Many Requests
Retrying request in 60 seconds
```

Azure quota is too low. Increase to at minimum 24,000 TPM in Azure Portal.

---

### Could not connect to investigation service

slack-bot failed to issue team token, or sre-agent is not healthy. Check:

```bash
docker logs incidentfox-sre-agent
curl -s http://localhost:8000/health
```

---

### 401 in Promtail logs

Password in `promtail-config.yml` is wrong or env var is not expanding. Hardcode the password directly in the config file rather than using env vars.

---

### "No logs found" even though data exists in Loki

Agent queries using `{app="..."}` but data was ingested with `{container="/..."}`. Add the `app` relabel rule to Promtail config as shown in Step 10.

---

### Agent looping and TPM depleted

This happens when Loki queries fail repeatedly — the agent retries continuously and burns tokens. The most common cause is a label mismatch. Resolve the label issue first before retrying.
