---
title: "CloudOps: Azure GitOps Platform"
type: "Solo Project"
year: "2026"
description: "A production-grade GitOps monorepo deploying a Go/Nginx microservices architecture on a Terraform-provisioned Azure Kubernetes Service (AKS) cluster, featuring decoupled CI/CD and zero-credential security."
image: "/images/projects/terraform.png"
tech:
  [
    "Azure",
    "AKS",
    "Terraform",
    "GitHub Actions",
    "Go (Gin)",
    "Nginx",
    "PostgreSQL",
    "Prometheus",
  ]
github: "https://github.com/szuryuu/cloudops"
featured: true
order: 1
status: "Completed"
duration: "4 weeks"
---

## The Problem

In traditional deployments, infrastructure code, backend logic, and frontend assets are heavily entangled. A minor frontend change might trigger a massive infrastructure validation pipeline, slowing down delivery. Furthermore, "Day-2 Operations"—such as scaling, monitoring, and managing registry credentials—are often handled manually. Storing static passwords for container registries inside Kubernetes clusters introduces critical security vulnerabilities and maintenance nightmares when credentials rotate.

## My Solution

I engineered a comprehensive GitOps monorepo that strictly decouples the application lifecycle from the infrastructure lifecycle, fully deployed on Microsoft Azure.

- **Path-Based CI/CD Pipelines:** Configured GitHub Actions to dynamically trigger independent workflows (Frontend, Backend, Infrastructure) based exclusively on which directories were modified in the commit.
- **Zero-Credential Infrastructure:** Provisioned Azure Kubernetes Service (AKS) and Azure Container Registry (ACR) via Terraform, utilizing SystemAssigned Managed Identities for seamless, passwordless image pulling.
- **Internal DNS Routing:** Designed the Kubernetes topology to eliminate unnecessary public endpoints. The Go (Gin) backend and PostgreSQL database run purely on internal ClusterIPs, protected behind an Nginx reverse proxy.
- **Proactive Observability:** Deployed the `kube-prometheus-stack` via Helm, configuring custom Prometheus alerting rules and Grafana dashboards to proactively monitor node resources and pod health.

## Technical Deep Dive

### Architecture Decisions

**Why Path-Based CI/CD in a Monorepo?**
A monorepo provides a single source of truth, but running `terraform plan` every time a developer updates a Go API endpoint wastes compute minutes and delays deployments. By utilizing GitHub Actions `paths` filtering, pushing code to `applications/backend/**` strictly triggers the Go build and AKS deployment process, completely isolating it from the frontend and infrastructure pipelines.

**Why SystemAssigned Managed Identities?**
Instead of manually creating Kubernetes Secrets to store ACR passwords (which can be leaked or expire), I configured Terraform to grant the AKS cluster's managed identity the `AcrPull` role. This allows the cluster to authenticate to the container registry natively via Azure's IAM layer, achieving a true zero-secret deployment state.

### Key Features I Built

#### 1. Secure Internal Routing (Nginx Reverse Proxy)

To minimize the attack surface and reduce cloud load balancer costs, only the frontend Nginx pod is exposed externally. I configured Nginx to act as an API gateway, dynamically routing `/api/*` traffic to the backend via Kubernetes' internal DNS (`backend-service`), ensuring the Go API remains completely hidden from the public internet.

```nginx
# applications/frontend/nginx.k8s.conf
server {
    listen 80;

    # Serve static frontend files
    location / {
        root /usr/share/nginx/html;
        index index.html;
    }

    # Proxy API traffic securely through Kubernetes internal DNS
    location /api/ {
        proxy_pass http://backend-service:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 2. Automated Day-2 Operational Scripts

To ensure rapid incident response, I wrote abstraction scripts for complex disaster recovery scenarios. Instead of operators memorizing complex `kubectl` rollout commands during high-stress outages, they can execute a single automated script to instantly revert deployments to their last known stable state.

```bash
# scripts/rollback.sh
echo "Initiating rollback for $COMPONENT..."
kubectl rollout undo deployment/$COMPONENT -n $NAMESPACE

echo "Waiting for rollback to complete..."
kubectl rollout status deployment/$COMPONENT -n $NAMESPACE
```
