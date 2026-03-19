---
title: "Write Up: ID-Networkers CyberDefense"
description: "Dokumentasi skenario lab id-networks cyberdefense bootcamp, mencakup analisis SIEM Wazuh, forensik jaringan, dan forensik memori."
date: "2026-03-18"
tags: ["Cybersecurity", "DFIR", "Wazuh", "Forensics", "Writeup", "ID-Networkers"]
cover: "/images/wazuh.webp"
featured: true
order: 2
---

# Dokumentasi ID Networkers CyberDefense Challenge

Artikel ini mendokumentasikan proses investigasi insiden siber dari skenario lab ID Networkers CyberDefense BootCamp. Laporan ini tidak hanya menyajikan hasil akhir tetapi juga membedah motivasi taktis attacker di balik setiap anomali yang ditemukan.

Investigasi ini mengkorelasikan tiga pilar utama forensik digital yaitu SIEM Wazuh untuk visibilitas log server, Wireshark untuk ekstraksi payload pada traffic jaringan mentah, dan Volatility untuk memburu malware persisten di dalam memory.

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

Berikut adalah pembedahan lengkap dari sepuluh artefak krusial yang ditemukan selama investigasi berlangsung.

## 1\. Identifikasi Agent

Tindakan paling awal dalam merespons insiden adalah membatasi blast radius atau dampak serangan. Kita harus mengisolasi mesin mana yang sedang aktif diserang sebelum menelusuri data lebih dalam.

  * **Tujuan:** Menentukan target spesifik yang sedang dipantau oleh server SIEM lokal agar investigasi tidak melebar ke perangkat yang salah.
  * **Langkah:** 
    1. Buka dashboard utama Wazuh.
    2. Pilih menu **Agents** pada menu navigasi.
    3. Periksa daftar agent yang ada di tabel.
    4. Temukan agent yang terhubung ke SIEM.
  * **Jawaban:** 
    ```bash
    metasploitable
    ```

**Dokumentasi:**

![Agent Dashboard](/images/writing/agents.png)

## 2\. Identifikasi Infrastruktur Web Server

Setiap web server memiliki karakteristik kerentanan dan struktur sistem file yang berbeda. Mengetahui basis infrastrukturnya adalah syarat sebelum menganalisis payload serangan.

  * **Tujuan:** Attacker perlu mengetahui apakah target menggunakan Nginx IIS atau Apache agar mereka bisa menyesuaikan eksploitasi yang spesifik dengan arsitektur tersebut.
  * **Langkah:** 
    1. Masuk ke modul **Security events** di dashboard Wazuh.
    2. Pada search bar ketikkan filter `rule.groups: "web"` untuk menyaring log khusus serangan aplikasi.
    3. Buka salah satu log JSON yang muncul dengan mengeklik ikon panah di sebelah kiri log.
    4. Lihat bagian bawah dan cari atribut `location`. Nilai pada atribut tersebut adalah `/var/log/apache2/access.log`. Keberadaan direktori apache2 ini memastikan infrastruktur yang digunakan target.
  * **Jawaban:** 
    ```bash
    Apache

    ```

**Dokumentasi:**

![Wazuh Filter Web](/images/writing/filter-web.png)
![Location Apache](/images/writing/location-apache.png)

## 3\. Pemetaan Index Log Mentah

Sistem analitik sering kali dikonfigurasi dengan threshold atau ambang batas deteksi tertentu. Serangan tingkat lanjut (Advanced Persistent Threat) umumnya didesain sangat rapi agar berada di bawah ambang batas tersebut dan tidak memicu alarm keamanan.

  * **Tujuan:** Analis tidak boleh percaya sepenuhnya pada alert SIEM. Kita harus mengetahui di mana seluruh log murni tanpa filter disimpan untuk melakukan Threat Hunting secara manual.
  * **Langkah:** 
    1. Buka menu utama Wazuh.
    2. Arahkan ke bagian manajemen server lalu pilih **Stack Management**.
    3. Klik menu **Index Management** atau **Index Patterns**.
    4. Periksa daftar index yang tersedia. Terdapat satu pola index khusus yang terpisah dari alert biasa yang memang didesain untuk menyimpan seluruh log kejadian mentah (raw logs) secara utuh.
  * **Jawaban:** 
    ```bash
    wazuh-archives-*
    ```

**Dokumentasi:**

![Index Patterns](/images/writing/index-pattern.png)
![Wazuh Archives](/images/writing/wazuh-archive.png)

## 4\. Anomali Deteksi SQL Injection

Ini adalah temuan krusial yang membuktikan adanya titik buta (blind spot) pada sistem deteksi peringatan bawaan.

  * **Tujuan:** Mencuri struktur database menggunakan query manipulatif. Attacker menembakkan berbagai varian payload seperti injeksi berbasis Union dan logika Boolean untuk menguji respons server.
  * **Rasionalisasi:** Dari 4 payload eksploitasi database yang dikirim peretas, 3 payload gagal dikenali sebagai SQL Injection dan hanya diklasifikasikan sebagai serangan web biasa. Hanya 1 payload yang secara eksplisit memicu alarm spesifik SQL Injection. Karena pertanyaan meminta jumlah yang spesifik terdeteksi sebagai SQLI oleh sistem maka angkanya adalah 1. Ini menjadi temuan berharga untuk menambal aturan deteksi SIEM di masa depan.
  * **Langkah:** 
    1. Kembali ke modul **Security events**.
    2. Ketikkan filter `rule.id: 31164` (ID ini spesifik untuk deteksi percobaan SQL injection).
    3. Ubah rentang waktu di pojok kanan atas menjadi batas maksimal agar mencakup seluruh data historis.
    4. Perhatikan metrik angka berlabel Hits di bagian atas dashboard yang menampilkan jumlah tangkapan log.
  * **Jawaban:** 
    ```bash
    1
    ```

**Dokumentasi:**

![Filter SQLI](/images/writing/filter-rule-id-sqli.png)
![SQLI Attempt](/images/writing/sqli-attempt.png)

## 5\. Validasi Eksekusi Cross Site Scripting

Menemukan script berbahaya di dalam log tidak otomatis berarti server tersebut berhasil diretas. Analis harus selalu memvalidasi bagaimana server merespons payload tersebut.

  * **Tujuan:** Menyisipkan script `<script>alert(document.cookie);</script>` untuk menguji apakah aplikasi web melakukan sanitasi input pada parameter URL. Jika berhasil celah ini bisa digunakan untuk merampas session token pengguna sah.
  * **Langkah:** 
    1. Hapus filter sebelumnya dan ketikkan `data.uri` kemudian masukkan operator `is one of` lalu masukkan valus yang memiliki `xss` di dalamnya.
    2. Buka struktur JSON dari log yang tertangkap.
    3. Fokus pada atribut `full_log`.
    4. Pada teks log access mentah tersebut lihat angka tiga digit yang muncul tepat setelah protokol HTTP/1.1. Angka tersebut adalah HTTP status code server yang menunjukkan bahwa request berhasil diproses tanpa diblokir oleh WAF.
  * **Jawaban:** 
    ```bash
    200
    ```

**Dokumentasi:**

![Filter XSS](/images/writing/filter-rule-xss.png)
![XSS Code](/images/writing/xss-http-code.png)

## 6\. Identifikasi File Target File Inclusion

Kerentanan aplikasi dimanfaatkan penyerang untuk keluar dari kurungan root direktori web dan mengintip file inti sistem operasi.

  * **Tujuan:** Membaca data `/etc/passwd` adalah langkah pengintaian (reconnaissance) standar di ekosistem Linux. Attacker mencoba memetakan nama nama pengguna di dalam sistem untuk keperluan serangan brute force di tahap berikutnya.
  * **Langkah:** 
    1. Buka **Security events**.
    2. Ubah basis index pencarian dari alert biasa menjadi index arsip mentah (`wazuh-archives-*`) menggunakan menu pilihan di sebelah kanan.
    3. Ketikkan kata `passwd` pada search bar untuk mencari jejak eksploitasi direktori yang diam diam lolos dari alarm.
    4. Buka JSON log yang muncul dan perhatikan bagian paling ujung dari teks payload penyerang. Ditemukan file spesifik target pembacaan akun pengguna.
  * **Jawaban:** 
    ```bash
    passwd
    ```

**Dokumentasi:**

![Wazuh Archives](/images/writing/wazuh-archive-search.png)
![Log File Inclusion](/images/writing/etc-passwd.png)

## 7\. Backdoor Reverse Shell pada Jaringan

Setelah kerentanan aplikasi web dibongkar fokus beralih pada ekstraksi paket jaringan mentah di Wireshark. Attacker yang berhasil menemukan celah upload file pasti akan mencoba menanamkan akses jarak jauh (Remote Access).

  * **Tujuan:** Mengapa menggunakan Reverse Shell? Karena aturan firewall modern umumnya memblokir semua koneksi masuk (inbound) dari luar. Dengan metode ini server korban lah yang dipaksa untuk membuka koneksi ke arah luar (outbound) menuju IP attacker yang mana jalur keluar ini jarang dicegat oleh firewall.
  * **Langkah:** 
    1. Buka aplikasi Wireshark dan load file bukti `suspect.pcap`.
    2. Cari paket yang menggunakan protokol HTTP dengan metode eksekusi POST.
    3. Klik kanan pada paket tersebut lalu pilih opsi **Follow** kemudian **TCP Stream**.
    4. Jendela baru akan terbuka menampilkan isi script PHP berbahaya yang diunggah peretas. Baca sintaks kode tersebut dan temukan variabel koneksi yang merujuk pada port komunikasi balik menuju IP attacker.
  * **Jawaban:** 
    ```bash
    9001
    ```

**Dokumentasi:**

![Filter HTTP Method](/images/writing/http-method-filter.png)
![TCP Follow](/images/writing/tcp-follow-port-suspect.png)

## 8\. Koneksi Framework Metasploit

Seorang hacker jarang bekerja murni dari nol. Mereka sering menggunakan alat bantu canggih seperti Metasploit untuk menstabilkan dan mengendalikan sesi backdoor yang telah tertanam di mesin korban.

  * **Tujuan:** Mengidentifikasi mesin asal penyerang dan mengisolasi port dinamis (ephemeral port) yang mereka gunakan untuk melakukan proses handshake dengan server komando (C2).
  * **Langkah:** 
    1. Load file bukti kedua yaitu `external.pcapng` di Wireshark.
    2. Ketikkan sintaks filter `tcp.dstport == 4444` pada kolom pencarian di bagian atas lalu tekan Enter (Port 4444 adalah port default listener Metasploit).
    3. Klik pada paket pertama yang muncul. Paket ini umumnya memiliki penanda SYN yang berarti inisiasi handshake awal.
    4. Perluas menu **Transmission Control Protocol** di panel rincian bawah lalu periksa atribut **Source Port** untuk melihat angka port asal attacker.
  * **Jawaban:** 
    ```bash
    49816
    ```

**Dokumentasi:**

![Filter Port](/images/writing/filter-port-4444.png)
![Source Port](/images/writing/source-port.png)

## 9\. Isolasi Malware di dalam Memory

Langkah pamungkas dalam skenario serangan adalah menetapkan persistensi. Attacker memastikan kendali mereka tertanam dengan kuat di dalam sistem operasi target agar akses tidak hilang meskipun koneksi jaringan sempat terputus.

  * **Tujuan:** Menjalankan file eksekusi (executable) murni di latar belakang memori agar mereka bisa memberikan perintah tingkat OS secara leluasa tanpa harus berinteraksi lagi dengan aplikasi web yang rentan di permukaan.
  * **Langkah:** 
    1. Buka aplikasi terminal di sistem operasi analis.
    2. Arahkan direktori (cd) menuju lokasi file memory dump mentah yang bernama `suspected.raw`.
    3. Eksekusi framework Volatility dengan perintah pemetaan proses yaitu `vol -f suspected.raw windows.pslist`
    4. Analisis tabel hasil pemindaian yang dicetak di terminal. Cari file asing bernama `shell.exe`.
    5. Catat identitas proses tersebut yang berada tepat di kolom pertama yang bernama PID.
  * **Jawaban:** 
    ```bash
    7396
    ```

**Dokumentasi:**

![Suspected Raw](/images/writing/suspect-raw.png)
![Suspected Raw Info](/images/writing/suspect-raw-info.png)
![Suspected Raw Pslist](/images/writing/suspect-raw-pslist.png)

search shell.exe and check PID
![Suspected Raw PID](/images/writing/suspect-pid.png)

## 10\. Dokumentasi URL Local File Inclusion

Sebagai konklusi pencatatan dalam investigasi analis harus mendokumentasikan secara presisi dan utuh struktur URL yang dieksploitasi oleh penyerang di awal insiden. Tujuannya adalah memberikan data yang valid kepada tim developer untuk segera menambal celah perimeter aplikasi.

  * **Tujuan:** Menyatukan kembali kepingan artefak serangan web yang membuka pintu bagi seluruh insiden peretasan ini sejak awal.
  * **Langkah:** 
    1. Kembali ke menu **Security events** di dashboard SIEM yang mengarah pada index raw logs (langkah keenam).
    2. Buka JSON dari log manipulasi direktori tersebut.
    3. Cari atribut `data.url` atau lihat pada baris request HTTP GET di dalam atribut `full_log`.
    4. Salin seluruh teks URL eksploitasi tersebut secara penuh tanpa ada karakter yang tertinggal.
  * **Jawaban:** 
    ```bash
    /prod/vulnerabilities/fi/?page=file/../../../../../../etc/passwd
    ```

**Dokumentasi:**

![Step 6](/images/writing/wazuh-archive-search.png)
![Full Log](/images/writing/full-log.png)
