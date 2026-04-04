---
title: "Azure Auto Discover VMs"
type: "Solo Project"
year: "2026"
description: "A dynamic Service Mesh utilizing Envoy Proxy and a custom Go Control Plane to automatically discover and load balance Azure Virtual Machines with zero downtime."
image: "/images/projects/terraform.png"
tech: ["Go", "Envoy Proxy", "Terraform", "Azure", "Cloud-init"]
github: "https://github.com/szuryuu/auto-discover-vms"
featured: true
order: 1
status: "Completed"
duration: "3 weeks"
---

## The Problem

In standard cloud deployments, scaling backend servers or replacing unhealthy instances requires manually updating load balancer configurations or hardcoding static IPs. This manual intervention introduces configuration drift, increases the risk of human error, and causes latency or dropped connections during proxy configuration reloads. In a dynamic, auto-scaling environment, infrastructure must be self-aware and autonomous.

## My Solution

I engineered a custom Service Mesh architecture for Azure that eliminates manual IP tracking and static load balancer configuration.

- **Custom Control Plane**  
  Built a lightweight, highly concurrent Go service using the Azure SDK to automatically discover backend Virtual Machines based on metadata.

- **Dynamic Configuration (xDS)**  
  Integrated Envoy Proxy as the edge gateway. It receives real-time configuration via gRPC and updates routing instantly without requiring restarts.

- **Infrastructure as Code**  
  Orchestrated the environment using modular Terraform. Infrastructure is bootstrapped automatically using `cloud-init`.

- **Real-Time Observability**  
  Implemented a REST API in the Control Plane to expose discovery status, health metrics, and system state.

## Technical Deep Dive

### Architecture Decisions

**Why Envoy Proxy over Nginx/HAProxy?**  
Traditional reverse proxies require reloads to apply upstream changes, which can drop active connections. Envoy supports dynamic configuration via the xDS API, allowing in-memory updates with zero downtime.

**Why Terraform Modularity?**  
The infrastructure is separated into independent modules (`network`, `backend-vms`, `control-plane`, `envoy-lb`). This ensures backend changes do not impact core networking or load balancing layers.

### Key Features

#### 1. Automated IaC Provisioning and Injection

Terraform dynamically injects the Control Plane IP into Envoy’s bootstrap configuration using `cloud-init`, enabling immediate gRPC connectivity on startup.

```hcl
# Inject Control Plane IP into Envoy bootstrap config
custom_data = base64encode(templatefile("${path.module}/cloud-init.yml", {
  control_plane_host = var.control_plane_host
}))
```

#### 2. REST API for Mesh Observability

A REST API was built alongside the gRPC server to provide real-time visibility into the system state.

```json
// GET /api/vms
{
  "last_update": "2025-02-04T10:00:00Z",
  "total_vms": 2,
  "snapshot_version": 15,
  "vms": [
    {
      "name": "auto-discover-vms-app-0",
      "public_ip": "20.120.10.1",
      "private_ip": "10.1.1.4"
    }
  ]
}
```
