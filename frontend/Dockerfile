# 1. Base image
FROM node:20-alpine AS base

# 2. Dependencies
FROM base AS deps
WORKDIR /app
# Gunakan package-lock.json jika ada, jika tidak, cukup package.json
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate

ARG COMMIT_HASH
ENV NEXT_PUBLIC_COMMIT_HASH=$COMMIT_HASH

# Hasilkan output standalone
RUN npm run build

# 4. Runner (Production)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install bash dan openssl untuk Prisma & start.sh
RUN apk add --no-cache bash openssl

COPY --from=builder /app/public ./public

# Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma schema and config
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/scripts ./scripts

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

# Install tsx globally for ETL script
RUN npm install -g tsx

EXPOSE 3000
CMD ["./start.sh"]
