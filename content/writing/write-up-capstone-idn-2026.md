---
title: "Write Up: ID-Networkers Digital Forensics Challenge"
description: "Dokumentasi investigasi insiden siber pada ID-Networkers Digital Forensics Challenge, mencakup analisis SIEM Wazuh, forensik jaringan PCAP, dan forensik memori."
date: "2026-03-18"
tags: ["Cybersecurity", "DFIR", "Wazuh", "Forensics", "Writeup", "ID-Networkers"]
cover: "/images/dummy_cover.webp"
featured: true
order: 2
---

# Write Up: ID-Networkers Cyber Defense Challenge

Artikel ini mendokumentasikan proses investigasi insiden siber dari skenario lab ID-Networkers Digital Forensics Challenge. Fokus utama penyelesaian berpusat pada identifikasi anomali dan jejak serangan melalui tiga pilar utama forensik digital:

- Analisis log sistem menggunakan SIEM Wazuh  
- Analisis lalu lintas jaringan mentah menggunakan Wireshark  
- Analisis memori sistem menggunakan Volatility  

---

## Challenge Questions

Berikut adalah daftar pertanyaan yang menjadi dasar investigasi:

1. Periksa dan identifikasi nama agent yang terhubung dengan SIEM yang dideploy secara lokal.  
2. Identifikasi nama web server yang digunakan atau terhubung dengan SIEM lokal.  
3. Sebutkan nama index di Wazuh yang digunakan untuk menyimpan semua log mentah (RAW logs).  
4. Periksa jumlah total aktivitas SQL Injection (SQLI) yang terdeteksi.  
5. Identifikasi HTTP status code terkait aktivitas Cross-Site Scripting (XSS).  
6. Identifikasi nama file yang terkait dengan aktivitas File Inclusion.  
7. Tentukan port komunikasi mencurigakan pada Remote File Inclusion.  
8. Identifikasi source port yang terhubung ke destination port 4444.  
9. Tentukan PID dari `shell.exe` pada memory dump.  
10. Tentukan URL terkait aktivitas Local File Inclusion (LFI).

---

## Phase 1: SIEM Analysis (Wazuh)

### 1. Identifikasi Agent

**Langkah:**
1. Masuk ke dashboard Wazuh  
2. Buka menu **Agents**  
3. Identifikasi agent aktif  

![Agent Dashboard](https://placehold.co/800x400?text=Agent+Dashboard)

**Jawaban:** `metasploitable`

---

### 2. Identifikasi Web Server

**Langkah:**
1. Buka log JSON  
2. Periksa field `location`  

```text
/var/log/apache2/access.log
````

![Log Apache](https://placehold.co/800x400?text=Apache+Log)

**Jawaban:** `Apache`

---

### 3. Identifikasi Index Log Mentah

**Langkah:**

1. Buka Stack Management
2. Masuk ke Index Management

![Index Management](https://placehold.co/800x400?text=Index+Management)

**Jawaban:** `wazuh-archives-*`

---

### 4. Deteksi SQL Injection

**Langkah:**

```text
rule.id: 31164
```

![SQLI Detection](https://placehold.co/800x400?text=SQL+Injection)

**Jawaban:** `1`

---

### 5. HTTP Status Code (XSS)

**Langkah:**

1. Filter: `rule.groups: "xss"`
2. Analisis payload

```html
<script>alert(document.cookie);</script>
```

![XSS Log](https://placehold.co/800x400?text=XSS+Log)

**Jawaban:** `200`

---

### 6. File pada Serangan File Inclusion

**Langkah:**

1. Gunakan index `wazuh-archives-*`
2. Cari keyword `passwd`

```text
/etc/passwd
```

![LFI Log](https://placehold.co/800x400?text=LFI+Log)

**Jawaban:** `passwd`

---

## Phase 2: Network Forensics (PCAP Analysis)

### 7. Port Komunikasi Mencurigakan

**Langkah:**

1. Buka `suspect.pcap`
2. Follow TCP Stream

![TCP Stream](https://placehold.co/800x400?text=TCP+Stream)

**Jawaban:** `9001`

---

### 8. Source Port ke Destination 4444

**Langkah:**

```text
tcp.dstport == 4444
```

![Wireshark Filter](https://placehold.co/800x400?text=Wireshark+Filter)

**Jawaban:** `49816`

---

## Phase 3: Memory Forensics (Volatility)

### 9. Identifikasi PID shell.exe

**Langkah:**

```bash
vol -f suspected.raw windows.pslist
```

![Volatility Output](https://placehold.co/800x400?text=Volatility+Output)

**Jawaban:** `7396`

---

### 10. URL Serangan LFI

**Langkah:**

1. Ambil dari log `wazuh-archives-*`
2. Copy field `data.url`

**Jawaban:**
`/prod/vulnerabilities/fi/?page=file/../../../../../../etc/passwd`

**Insight:**
Payload ini menunjukkan teknik directory traversal untuk mengakses file sensitif `/etc/passwd`.

---

## Conclusion

Investigasi ini mengungkap rantai serangan sebagai berikut:

* SQL Injection dan XSS sebagai tahap awal
* Eksploitasi LFI untuk akses file sensitif
* Upload backdoor dan reverse shell
* Persistensi melalui proses `shell.exe`

Pendekatan multi-layer (SIEM, network, memory) memungkinkan rekonstruksi insiden secara akurat.

---
