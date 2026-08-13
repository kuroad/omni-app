#!/bin/bash

echo "Memeriksa koneksi database..."
n=0
while [ $n -lt 15 ]; do
  if npx prisma db push; then
    echo "Database PostgreSQL siap dan sinkronisasi selesai."
    break
  fi
  n=$((n+1))
  echo "Koneksi ditolak (Database masih booting). Mencoba lagi dalam 3 detik... ($n/15)"
  sleep 3
done

if [ $n -eq 15 ]; then
  echo "Gagal menghubungi database setelah 15 percobaan. Menghentikan proses."
  exit 1
fi

echo "Menjalankan proses sinkronisasi Omni-ETL..."
npx tsx src/workers/etl.ts

echo "Menyalakan peladen (server)..."
exec npx tsx src/server.ts
