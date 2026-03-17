---
title: "Deploying a Single-Node Wazuh Stack via Docker"
description: "A comprehensive guide on deploying a single-node Wazuh cybersecurity platform architecture using Docker and Docker Compose."
date: "2026-03-17"
tags: ["DevOps", "Docker", "Wazuh", "Security"]
cover: "/images/wazuh.webp"
featured: true
order: 1
---

# Deploying a Single-Node Wazuh Stack via Docker

Wazuh is a powerful, open-source security platform, but deploying it manually can be complex. The `wazuh-docker` repository simplifies this by orchestrating the Wazuh Manager, Indexer, and Dashboard into a single cohesive deployment.

This guide covers the deployment of a single-node architecture, which is ideal for testing, development, and small-scale environments.

## Prerequisites

Before starting, ensure the host machine meets the following requirements:
* Docker and Docker Compose installed.
* Git installed.
* **Crucial Host Configuration:** The Wazuh Indexer requires a higher memory map capacity to function correctly. You must increase `vm.max_map_count` on the Linux host:

```bash
sudo sysctl -w vm.max_map_count=262144
```
*To make this persistent across reboots, add `vm.max_map_count=262144` to your `/etc/sysctl.conf` file.*

## Step 1: Clone the Repository and Lock the Version

Do not deploy blindly from the `main` branch, as it contains active, unstable development configurations. You must explicitly check out the version tag you intend to deploy to ensure compatibility and stability.

```bash
git clone [https://github.com/wazuh/wazuh-docker.git](https://github.com/wazuh/wazuh-docker.git)
cd wazuh-docker
git checkout v4.14.3
```

## Step 2: Generate TLS/SSL Certificates

Wazuh components communicate securely via TLS. The repository includes a utility to generate the necessary self-signed certificates for the internal network.

Navigate to the `single-node` directory and execute the generator script:

```bash
cd single-node
docker-compose -f generate-indexer-certs.yml run --rm generator
```
This process will create a `wazuh-certificates` directory containing the keys and PEM files required by the containers.

## Step 3: Deploy the Stack

With the certificates generated, bring up the entire stack in detached mode:

```bash
docker-compose up -d
```

The system will initialize three core containers:
1.  `single-node-wazuh.indexer-1`
2.  `single-node-wazuh.manager-1`
3.  `single-node-wazuh.dashboard-1`

## Step 4: Verification and Access

Do not attempt to access the dashboard immediately. The Indexer and Manager require several minutes to bootstrap and configure their initial indexes. 

Monitor the health state of the containers:
```bash
docker-compose ps
```
Wait until the status for both the indexer and manager transitions to `(healthy)`.

Once healthy, navigate to the Wazuh Dashboard via your web browser:
* **URL:** `https://localhost` (or the Docker host's IP)
* **Default Username:** `admin`
* **Default Password:** `SecretPassword`

*Note: You will receive a TLS warning in your browser due to the self-signed certificates generated in Step 2. Proceed past the warning to access the interface.*

---
> **Technical Note:** This deployment method and configuration was tested and verified to work specifically for **Wazuh version v4.14.3** as of **March 17, 2026**. Future major releases (such as v5.x) introduce significant architectural changes, including replacing the `.yml` certificate generator with a dedicated shell script and altering default credentials. Always refer to the official documentation matching your specific version tag to avoid deployment failures.
