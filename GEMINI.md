---
description: Pedoman Utama Pengembangan Proyek Omni-App (Honkai Star Rail Encyclopedia)
trigger: always_on
---

# 🌌 Omni-App (Honkai Star Rail Encyclopedia) Guidelines

Aturan dan pedoman ini **wajib** diikuti oleh Agen AI ketika bekerja di dalam repositori `omni-app`.

## 1. Arsitektur & Teknologi (*Tech Stack*)
- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, TanStack Query (React Query).
- **Backend:** FastAPI (Python), Prisma ORM.
- **Database:** PostgreSQL (berjalan di dalam Docker lokal).
- **Data Source (Seed):** Seluruh data permainan diambil dari repositori pihak ketiga `Mar-7th/StarRailRes` menggunakan skrip `backend/seed.py`.

## 2. Struktur Database & Model Data (Prisma)
- Data spesifik dari entitas (seperti *Skills*, *Promotions*, *Skill Trees*, dll) disimpan di dalam kolom `staticData` sebagai **JSON String**.
- **Penting:** Saat menarik data dari API Backend atau di Frontend, `staticData` harus di-_parse_ terlebih dahulu menggunakan `JSON.parse()` sebelum bisa digunakan sebagai objek/kamus (dictionary).

## 3. Pedoman UI/UX (*Design Guidelines*)
- Tema wajib adalah **Dark Mode** dengan gaya **Glassmorphism**.
- **Warna Utama (Background):** Gunakan `#0B0F19` untuk latar belakang utama.
- **Kartu/Container:** Gunakan latar belakang tembus pandang seperti `bg-[#141A29]/80`, efek `backdrop-blur-xl`, dan *border* transparan `border-white/10`.
- **Tipografi:** Gunakan warna teks `text-white` atau `text-gray-100` untuk teks utama, dan `text-gray-300` atau `text-gray-400` untuk teks sekunder.
- **Aksen:** Gunakan gradasi cerah seperti `from-blue-500 to-purple-500` untuk aksen, ikon, atau garis pembatas.

## 4. Manipulasi Data Teks (Text Parsing)
- Teks deskripsi mentah dari Mihomo (StarRailRes) sering mengandung tag internal seperti `#1[i]%` atau `#2[f1]`.
- Frontend **harus selalu** menggunakan fungsi utilitas `parseDesc(desc: string, params: number[])` untuk membersihkan tag tersebut dan menggantinya dengan persentase aktual dari array `params`.
- Tag HTML seperti `<i>`, `<b>`, atau `<unbreak>` sering muncul di data mentah, sehingga render teks di React harus menggunakan `dangerouslySetInnerHTML={{ __html: parsedDesc }}` disertai dengan CSS *injection* untuk mengatur gaya HTML kustom tersebut.

## 5. Menjalankan Aplikasi (*Runbook*)
Jika Anda diminta untuk mengeksekusi, menjalankan, atau memeriksa aplikasi, ikuti perintah berikut:
1. Pastikan Docker menyala: `sudo docker compose up -d` (Gunakan sudo bila ada kendala izin).
2. Jalankan Backend (FastAPI): `cd backend && source venv/bin/activate && uvicorn routers.encyclopedia:router --reload --port 8000`.
3. Jalankan Frontend (Next.js): `cd frontend && npm run dev` (Port 3000).

*Gunakan panduan ini untuk setiap perubahan fitur atau perbaikan *bug* di proyek Omni-App.*
