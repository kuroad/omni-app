---
name: hsr-deployment
description: Deployment and server infrastructure standards for the Honkai Star Rail (HSR) omni-encyclopedia web app — Linux CLI basics, PM2 process management, Nginx reverse proxy configuration, and optional Docker setup. Use this skill whenever setting up, deploying, or troubleshooting how this app runs on a server: keeping the Node process alive, exposing it to the internet, or containerizing it. Trigger it even without the word "skill" being mentioned — e.g. when the user asks why the site is down, how to restart the app, or how to point a domain at it.
---

# HSR Encyclopedia — Deployment & Infrastructure

## Project context

This app runs as a Node.js process (the backend from `hsr-backend`) that needs to (1) stay alive in the background, and (2) be reachable from the public internet on a normal domain/port. PM2 handles the first, Nginx handles the second. Docker is an optional extra layer on top of both, not a replacement for either.

## Linux CLI basics

Deployment work here mostly happens over SSH on Ubuntu/Debian. The commands that come up most:

```bash
cd /var/www/hsr-encyclopedia   # navigate to the app directory
ls -la                          # check what's actually deployed
tail -f /var/log/nginx/error.log   # watch for live errors while debugging
df -h                           # check disk space if something's failing mysteriously
```

## PM2: keeping the Node process alive

```bash
pm2 start npm --name "hsr-api" -- run start
pm2 save                 # persist the process list across reboots
pm2 logs hsr-api         # tail logs when something's misbehaving
pm2 restart hsr-api      # after deploying new code
pm2 status               # quick health check of everything PM2 manages
```

`pm2 save` is easy to forget and means the app won't come back automatically after a server reboot — always run it after `pm2 start` on a fresh setup, not just once.

For anything beyond a single process, an `ecosystem.config.js` is worth setting up so start/restart behavior is version-controlled instead of remembered as a one-off CLI command:

```js
module.exports = {
  apps: [{
    name: "hsr-api",
    script: "npm",
    args: "run start",
    env: { NODE_ENV: "production", PORT: 3000 },
  }],
};
```

## Nginx as a reverse proxy

```nginx
server {
    listen 80;
    server_name hsr-encyclopedia.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Once this server block is live and the domain resolves to the server, add TLS (e.g. via Certbot) so public traffic is encrypted — don't leave the site on plain HTTP once it's out of local testing. If the app has a separate API service on a different port than the frontend, add a second `location` block (e.g. `location /api`) rather than running two entirely separate server blocks for one domain.

## Docker (optional)

Reach for Docker when the team is more than one person, or when "works on my machine" has actually caused a production issue — it buys environment parity between dev and prod at the cost of an extra layer to debug. For a small/solo deployment, PM2 + Nginx directly on a VPS is usually simpler to reason about and troubleshoot, and is a perfectly reasonable default to stay with unless there's a concrete reason to add Docker.

If Docker is adopted, keep it to a standard shape so it's easy to hand off:

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY . .
RUN npm ci --production
CMD ["npm", "run", "start"]
```

```yaml
services:
  api:
    build: .
    ports: ["3000:3000"]
    env_file: .env
  redis:
    image: redis:7-alpine
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: hsr
    volumes: ["pgdata:/var/lib/postgresql/data"]
volumes:
  pgdata:
```

## Checklist before calling a deployment done

- [ ] `pm2 save` was run after the process was started, so it survives a reboot.
- [ ] Nginx server block points at the correct local port and the domain actually resolves to this server.
- [ ] TLS is enabled — the site isn't left serving plain HTTP.
- [ ] Logs (`pm2 logs`, Nginx error log) were checked after deploying, not just assumed to be fine.
- [ ] If Docker is in use, `.env`/secrets aren't baked into the image itself.