# 1. Base image
FROM node:20-alpine AS base

# 2. Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client (Wajib sebelum type-check/build)
RUN npx prisma generate

# Karena kita tidak menggunakan build tool (hanya tsx untuk dev),
# Untuk production kita perlu meng-compile TypeScript ke JavaScript
# Instal typescript secara global atau gunakan npx tsc
RUN npx tsc

# 4. Runner (Production)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install bash & openssl (opsional, berguna untuk debugging/prisma)
RUN apk add --no-cache bash openssl

COPY package.json ./
# Hanya copy production dependencies untuk meminimalisir ukuran
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Copy hasil build JS (dari src ke dist/src jika outDir diset, jika tidak kita akan jalankan tsx saja)
# Karena tsconfig kita tidak menggunakan outDir, kita copy src dan gunakan tsx
# Lebih baik untuk production menggunakan hasil transpilasi, namun demi kesederhanaan monorepo ini,
# kita copy src dan file konfigurasi.
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/prisma.config.ts ./

COPY start.sh ./
RUN chmod +x start.sh

# Expose port backend
EXPOSE 3001
ENV PORT=3001

# Jalankan sinkronisasi database, jalankan ETL otomatis, lalu mulai server
CMD ["./start.sh"]
