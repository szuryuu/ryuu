---
title: "MySQL Load Test"
type: "Intern Project"
year: "2025"
description: "A high-performance load testing suite that captures real production traffic via PCAP analysis and replays it with weighted concurrency to accurately simulate database load."
image: "/images/projects/mysql.png"
tech: ["Go", "Gopacket", "Prometheus", "MySQL"]
github: "https://github.com/szuryuu/mysql-load-test"
# live: ""
featured: false
order: 4
status: "Completed"
duration: "1 months"
# team_size: 4
# role: "Lead Full-Stack Developer"
---

## The Problem

Synthetic benchmarks like Sysbench are great for raw hardware testing but fail to represent **real-world traffic patterns**. Production databases often face skewed data access (Pareto principle), specific query complexity distributions, and "thundering herd" scenarios that synthetic random queries cannot simulate.

## My Solution

I engineered **MySQL Load Test**, a "Record & Replay" ecosystem designed to replicate production behavior with high fidelity.

-   **Traffic Capture:** Instead of inventing queries, it parses real SQL traffic directly from network packets (`.pcap`) or TShark logs.
-   **Weighted Replay:** It doesn't just run queries randomly; it calculates the "fingerprint" weight of every query type. If `SELECT * FROM products` happens 80% of the time in production, the load tester ensures it happens 80% of the time during the test.
-   **High Concurrency:** Built on Go's goroutines to spawn thousands of concurrent virtual users with minimal memory footprint.
-   **Observability:** Integrated Prometheus exporter to visualize Latency (p99, p95) and QPS in real-time.

## Technical Deep Dive

### Architecture Decisions

**Why Packet Capture (Gopacket) over General Logs?**
-   **Zero Overhead:** Enabling the "General Query Log" in MySQL kills performance. By capturing traffic at the network layer (TCP/IP) using `gopacket`, I could extract SQL queries from a production server without adding *any* load to the database itself.

**Why Go?**
-   **Channel-Based Pipeline:** The `query-collector` component uses a streaming pipeline pattern. It reads gigabytes of PCAP data, processes distinct query fingerprints, and writes them to the DB in parallel without loading the entire dataset into RAM.

### Key Features I Built

#### 1. Weighted Random Selection Strategy
To mimic real traffic, I implemented a logic that selects queries based on their historical frequency. The config allows fetching these weights dynamically from the database.

```yaml
# configuration snippet
fingerprint_weights_query: |
  SELECT
    qf2.Hash AS Hash,
    CAST(COUNT(*) AS DECIMAL(10,4)) / qft.c * 100 AS Weight
  FROM QueryFingerprint qf2
  ...
  
```

#### 2. Network Layer Extraction Pipeline
The tool treats network packets as a stream of raw bytes, reassembles the TCP stream, and extracts the MySQL protocol payload. This allows "sniffing" queries even from uninstrumented legacy applications.

```bash
# From internal/cmd/query-collector/input_pcap.go
func (i *InputPcap) StartExtractor(ctx context.Context, out chan<- *query.Query) error {
    handle, _ := pcap.OpenOffline(i.file)
    packetSource := gopacket.NewPacketSource(handle, handle.LinkType())
    
    for packet := range packetSource.Packets() {
        // ... TCP reassembly and MySQL protocol decoding logic
        out <- extractedQuery
    }
}
```
