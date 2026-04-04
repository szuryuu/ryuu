---
title: "Dynamic VMSS Auto-Discovery & Mesh"
type: "Solo Project"
year: "2026"
description: "An elastic Service Mesh architecture integrating Envoy Proxy with Azure Virtual Machine Scale Sets (VMSS), featuring metric-driven autoscaling and zero-downtime dynamic routing."
image: "/images/projects/terraform.png"
tech: ["Go", "Envoy Proxy", "Terraform", "Azure VMSS", "Cloud-init"]
github: "https://github.com/szuryuu/auto-discover-vmss"
featured: true
order: 2
status: "Completed"
duration: "2 weeks"
---

## The Problem

In a modern cloud environment, static infrastructure is a liability. Applications must scale out during traffic spikes and scale in during quiet periods to optimize costs. However, dynamic scaling introduces a massive routing challenge: as Virtual Machine Scale Sets (VMSS) autonomously create and destroy ephemeral instances, traditional load balancers fail to keep up. Updating reverse proxy configurations manually or via slow CI/CD pipelines during an autoscaling event leads to dropped requests, traffic blackholes, and unacceptable downtime.

## My Solution

I evolved my previous static discovery architecture into a fully elastic, self-healing Service Mesh designed specifically for Azure VMSS.

- **Metric-Driven Elasticity:** Orchestrated Azure Monitor Autoscale settings via Terraform to dynamically scale backend instances based on real-time CPU thresholds.
- **Autonomous Control Plane:** Enhanced the Go-based Control Plane to continuously track ephemeral VMSS instances using Azure Managed Identities, instantly detecting scaling events.
- **Zero-Downtime Routing (xDS):** Leveraged Envoy Proxy as the edge gateway. When the Control Plane detects a new instance spun up by the autoscaler, it streams the new routing topology to Envoy via gRPC, applying the configuration in-memory without dropping a single active connection.
- **Immutable Infrastructure:** Completely codified the network isolation, scale sets, autoscale rules, and security groups using modular Terraform.

## Technical Deep Dive

### Architecture Decisions

**Why Virtual Machine Scale Sets (VMSS)?**
Unlike standalone VMs, VMSS provides native high availability, fault domains, and automated elasticity. By decoupling the compute layer into a Scale Set, the architecture shifts from "pet" servers to "cattle", allowing the system to handle unpredictable traffic loads efficiently.

**Why Envoy's xDS over DNS-based Discovery?**
DNS caching and TTLs (Time to Live) create dangerous propagation delays during scaling events. Envoy's xDS protocol pushes endpoint updates directly to the proxy in real-time, ensuring traffic is only routed to instances that actually exist and are ready to serve requests.

### Key Features I Built

#### 1. Metric-Driven Autoscaling Logic

I wrote Terraform modules to implement strict autoscaling rules. The infrastructure automatically scales out (adds instances) when CPU utilization exceeds 75% for 5 minutes, and scales in (removes instances) when CPU drops below 25%, optimizing cloud computing costs.

```hcl
# modules/backend-vmss/autoscale.tf
rule {
  metric_trigger {
    metric_name        = "Percentage CPU"
    metric_resource_id = azurerm_linux_virtual_machine_scale_set.app_vmss.id
    time_grain         = "PT1M"
    statistic          = "Average"
    time_window        = "PT5M"
    time_aggregation   = "Average"
    operator           = "GreaterThan"
    threshold          = 75
  }
  scale_action {
    direction = "Increase"
    type      = "ChangeCount"
    value     = "1"
    cooldown  = "PT1M"
  }
}
```
