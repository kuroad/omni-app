# 🗺️ AIOS Navigation Map & System Index

Sistem navigasi **AIOS (AI Operating System)** dirancang khusus untuk memandu AI Agent dalam memahami, menavigasi, dan mengeksekusi tugas pengembangan pada proyek **Web Omni-Ensiklopedia Honkai: Star Rail (HSR)**.

---

## 📂 Peta Struktur Berkas AIOS

```text
AIOS/
├── INIT.md                  # [PERINTAH INISIALISASI AGENT]
├── Navigation/              # [MODUL NAVIGASI AGENT]
│   ├── map.md               # Peta navigasi utama dan indeks berkas AIOS
│   └── routing-rules.md     # Aturan routing dan matriks keputusan AI Agent
├── Arsitektur/              # [CETAK BIRU ARSITEKTUR SITEM]
│   ├── 0. Map.md            # Mind map arsitektur menyeluruh
│   ├── 1. Tech Stack.md     # Rincian teknologi Frontend, Backend, DB, & Infrastructure
│   ├── 2. Data Flow.md      # Aliran data dinamis (Mihomo API/UID) & statis (PostgreSQL)
│   ├── 3. UI dan UX.md      # Estetika visual HSR (Glassmorphism, animations, theme)
│   └── 4. Deployment.md     # Panduan deployment VPS, Docker, PM2, & Reverse Proxy Nginx
└── Skills/                  # [KEAHLIAN KHUSUS AGENT (SKILLSETS)]
    ├── hsr-frontend.md      # Next.js (App Router), Tailwind, Framer Motion, TanStack Query
    ├── hsr-backend.md       # Node.js/Fastify, Mihomo API integration, Rate Limiting
    ├── hsr-database-caching.md # Redis cache (TTL 10m), PostgreSQL schema & ETL
    ├── hsr-deployment.md    # Nginx reverse proxy, Docker Compose, PM2 setup
    └── hsr-game-domain-knowledge.md # Domain HSR: stat formula, relic sets, character stats
```

---

## 🔗 Indeks Berkas & Fungsi Modul

### 0. 🚀 Inisialisasi Agent (`AIOS/`)
* **[INIT.md](file:///home/cynder/omni-app/AIOS/INIT.md)**: Berkas instruksi awal untuk melatih dan menginisialisasi pengetahuan AI Agent pada awal percakapan.

### 1. 🧭 Navigasi Agent (`AIOS/Navigation/`)
* **[map.md](file:///home/cynder/omni-app/AIOS/Navigation/map.md)**: Peta jalan utama yang memetakan seluruh berkas dalam sistem AIOS beserta indeks fungsinya.
* **[routing-rules.md](file:///home/cynder/omni-app/AIOS/Navigation/routing-rules.md)**: Aturan routing logis untuk AI Agent berdasarkan *intent* permintaan pengguna.

### 2. 🏛️ Cetak Biru Arsitektur (`AIOS/Arsitektur/`)
* **[0. Map.md](file:///home/cynder/omni-app/AIOS/Arsitektur/0.%20Map.md)**: Ringkasan visual & poin utama dari seluruh lapisan sistem.
* **[1. Tech Stack.md](file:///home/cynder/omni-app/AIOS/Arsitektur/1.%20Tech%20Stack.md)**: Pemilihan teknologi (Next.js, Fastify, Redis, PostgreSQL, Nginx).
* **[2. Data Flow.md](file:///home/cynder/omni-app/AIOS/Arsitektur/2.%20Data%20Flow.md)**: Arsitektur alur data *Cache Hit/Miss* Redis dan pipa ETL data statis HSR.
* **[3. UI dan UX.md](file:///home/cynder/omni-app/AIOS/Arsitektur/3.%20UI%20dan%20UX.md)**: Standar desain visual, efek glassmorphism, warna elemen, dan mikro-animasi.
* **[4. Deployment.md](file:///home/cynder/omni-app/AIOS/Arsitektur/4.%20Deployment.md)**: Konfigurasi infrastruktur produksi di VPS (Docker & Nginx).

### 3. 🎯 Keahlian Domain AI Agent (`AIOS/Skills/`)
* **[hsr-frontend.md](file:///home/cynder/omni-app/AIOS/Skills/hsr-frontend.md)**: Standar koding client-side, TypeScript strict types, TanStack Query, & Framer Motion.
* **[hsr-backend.md](file:///home/cynder/omni-app/AIOS/Skills/hsr-backend.md)**: Proteksi Mihomo API, Fastify routes, sanitasi data, dan rate limiting internal.
* **[hsr-database-caching.md](file:///home/cynder/omni-app/AIOS/Skills/hsr-database-caching.md)**: Manajemen Redis TTL (10 menit), migrasi PostgreSQL, dan query optimasi.
* **[hsr-deployment.md](file:///home/cynder/omni-app/AIOS/Skills/hsr-deployment.md)**: Setup `nginx.conf`, `docker-compose.yml`, SSL, dan integrasi PM2.
* **[hsr-game-domain-knowledge.md](file:///home/cynder/omni-app/AIOS/Skills/hsr-game-domain-knowledge.md)**: Pemahaman mendalam stat HSR, Mihomo API response, formula damage, dan aturan relik.

---

## 🚦 Cara Menggunakan Navigasi Ini
Ketika AI Agent menerima instruksi tugas dari pengguna:
1. Agent membaca berkas **[routing-rules.md](file:///home/cynder/omni-app/AIOS/Navigation/routing-rules.md)** untuk mengidentifikasi domain tugas.
2. Agent merutekan instruksi ke kombinasi berkas **Arsitektur** dan **Skills** yang sesuai.
3. Agent memuat panduan teknis yang relevan sebelum menulis atau mengubah kode.
