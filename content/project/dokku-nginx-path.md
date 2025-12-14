---
title: "Dokku Nginx Path"
slug: "dokku-nginx-path"
type: "Intern Project"
year: "2025"
description: "A Dokku plugin enabling path-based routing for multiple applications under a single domain, featuring automated Nginx configuration merging and unified SSL management."
image: "/images/projects/dokku.png"
tech: ["Bash", "Go", "Nginx", "Dokku"]
github: "https://github.com/szuryuu/nginx-path-vhost"
# live: ""
featured: true
order: 1
status: "Completed"
duration: "1 months"
# team_size: 4
# role: "Lead Full-Stack Developer"
---

## The Problem

Standard Dokku deployments force a subdomain-based architecture (e.g., `app.domain.com`), which creates significant friction for specific architectural patterns. Developers faced challenges with:
- **SEO Fragmentation:** Splitting traffic across subdomains dilutes domain authority compared to subdirectories.
- **SSL Complexity:** Requiring wildcard certificates or managing separate certs for every microservice.
- **Unified Gateway Needs:** Difficulty in presenting multiple microservices (e.g., frontend, api, admin) as a single monolithic endpoint to the client without an external reverse proxy layer.

## My Solution

I engineered a custom Dokku plugin that intercepts the Nginx configuration lifecycle to enable **Path-Based Routing** (e.g., `domain.com/app1`, `domain.com/api`).

- **Unified Domain Root:** Serves multiple isolated Dokku apps under one domain name.
- **"Default App" Authority:** Implemented a master-slave logic where one "Default App" controls the root configuration (`/`), while secondary apps inject their specific `location` blocks.
- **Automated Config Merging:** Hooks into Dokku's deploy cycle to automatically rebuild the Nginx map whenever a linked application is deployed or updated.
- **Hybrid Architecture:** Utilizes Bash for Dokku lifecycle hooks and Go for high-performance property parsing.

## Technical Deep Dive

### Architecture Decisions

**Why Hybrid Bash & Go?**
- **Bash:** Essential for deep integration with Dokku's plugin trigger system (`pre-deploy`, `proxy-build-config`) which relies on shell scripts.
- **Go:** Replaced complex shell string manipulation with Go for the property management system (`nginx-property`). This ensures type safety and faster execution when parsing complex configuration maps for hundreds of potential vhosts.

**Why Sigil over standard Nginx includes?**
- Standard Nginx `include` directives were insufficient for dynamic upstream port mapping.
- I leveraged **Glider Labs' Sigil** templating engine to dynamically loop through `PROXY_PORT_MAP` and `DOKKU_APP_LISTENERS` at runtime, generating a valid, cohesive `nginx.conf` that routes traffic based on internal Docker IP changes.

**Handling the "Default App" Concept**
- To prevent routing collisions, I architected a priority system. The plugin identifies a `default-app` via a custom property. This app generates the main server block, while all other apps identified by `app-path` are rendered as upstream definitions and included via `include` directives, preventing "duplicate location" errors.

### Key Features I Built

#### 1. Dynamic Location Block Generation (Sigil Template)
This snippet demonstrates how the plugin iterates through listeners to construct Nginx location blocks dynamically, handling SSL redirects and header forwarding automatically.

```bash 
# nginx
{{ range $port_map := .PROXY_PORT_MAP | split " " }}
  # ... (upstream logic)

  # Current app routing
  {{ $current_app_path := $.APP_PATH | default $.APP }}
  location /{{ $current_app_path }}/ {
    {{ if eq $.STRIP_PATH "true" }}
      rewrite "^/{{ $current_app_path }}/(.*)" "/$1" break;
    {{ end }}
    proxy_pass http://{{ $.APP }}-{{ $upstream_port }}/;
    
    # Automated Header Injection for Context
    proxy_set_header X-Forwarded-Prefix /{{ $current_app_path }}/;
    proxy_set_header X-Script-Name /{{ $current_app_path }};
  }
{{ end }}
```

#### 2. Lifecycle Hook Interception

The plugin doesn't just sit idle; it actively listens to deployment events. If a secondary app is deployed, the plugin forces a rebuild of the primary proxy configuration to ensure the new path is live immediately.

```bash
# From: noes/proxy-build-config
trigger-nginx-path-vhosts-proxy-build-config() {
  declare APP="$1"
  # ... checks ...
  
  # Trigger network config build ensuring IP tables are updated
  plugn trigger network-build-config "$APP"
  
  # Rebuild the complex Nginx config map
  nginx_build_config "$APP"
}
```
