---
title: "Azure End-to-End DevOps Pipeline"
type: "Solo Project"
year: "2026"
description: "A production-ready CI/CD pipeline and immutable infrastructure setup on Azure, featuring automated security scanning, zero-secret authentication, and dynamic telemetry injection."
image: "/images/projects/azure.png"
tech: ["GitHub Actions", "Terraform", "Docker", "Azure", "Bash"]
github: "https://github.com/szuryuu/azure-e2e-devops"
featured: false
order: 3
status: "Completed"
duration: "2 weeks"
---

## The Problem

Manual infrastructure provisioning and application deployment create bottlenecks, configuration drift, and severe security vulnerabilities. Storing hardcoded credentials (like container registry passwords) inside production servers is a massive security risk. Furthermore, pushing code without automated vulnerability scanning often leads to deploying compromised container images to production, while lack of centralized telemetry makes post-deployment troubleshooting nearly impossible.

## My Solution

I engineered a fully automated, secure, and observable End-to-End (E2E) DevOps pipeline combining GitHub Actions, Terraform, and Docker on Microsoft Azure.

- **GitOps Workflows:** Automated the entire lifecycle from code push to deployment. Terraform plan outputs are automatically generated and commented directly onto Pull Requests for peer review before infrastructure changes are applied.
- **Shift-Left Security:** Integrated Trivy vulnerability scanning into the CI/CD pipeline, automatically failing the build if `CRITICAL` or `HIGH` vulnerabilities are detected in the Docker image.
- **Zero Hardcoded Secrets:** Utilized Azure Managed Identities (System-Assigned). The production Virtual Machine authenticates to the Azure Container Registry (ACR) securely without needing any stored passwords or tokens.
- **Centralized Observability:** Configured Application Insights and Log Analytics Workspace via Terraform, capturing both host-level metrics and application telemetry.

## Technical Deep Dive

### Architecture Decisions

**Why Azure Managed Identities?**
Traditionally, pulling a private Docker image requires running `docker login` with a username and password, storing those secrets in the server's environment. By attaching a System-Assigned Managed Identity to the VM with `AcrPull` RBAC roles, the infrastructure securely authenticates to Azure's API natively. If the server is ever compromised, there are no credential files for an attacker to steal.

**Why Terraform with GitHub Actions?**
I decoupled the infrastructure provisioning (`terraform apply`) from the application build process (`docker build`). This ensures that compute, network, and monitoring resources are guaranteed to be in the correct state before the latest application artifact is deployed.

### Key Features I Built

#### 1. Shift-Left Container Security Scanning

Before any image is pushed to the Azure Container Registry, the GitHub Actions pipeline builds a local test image and scans it using Trivy. If vulnerabilities are found, the deployment is hard-stopped, protecting the production environment.

```yaml
# .github/workflows/main.yml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: "local/my-webapp:test"
    format: "table"
    exit-code: "1" # Fails the pipeline on detection
    ignore-unfixed: true
    vuln-type: "os,library"
    severity: "CRITICAL,HIGH"
```

#### 2. Zero-Touch Bootstrapping & Dynamic Telemetry

I utilized `cloud-init` to automate the VM setup upon creation. The script installs Docker, configures Nginx as a reverse proxy, waits for the Managed Identity to initialize, pulls the image, and uses `sed` to dynamically inject the Application Insights connection string into the container at runtime—keeping configuration out of the source code.

```bash
# terraform/modules/compute/cloud-init.yml
echo "Logging in to Azure with Managed Identity..."
az login --identity
az acr login --name ${acr_name}

# Pull and run the application
docker run -d -p 8080:80 --name production-app $IMAGE_TAG

# Inject Telemetry connection string securely at runtime
docker exec production-app sed -i 's|CONNECTION_STRING|${app_insights_connection_string}|g' /usr/share/nginx/html/index.html
docker restart production-app
```
