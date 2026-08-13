---
name: hsr-backend
description: Backend API architecture and coding standards for the Honkai Star Rail (HSR) omni-encyclopedia web app — Node.js with Fastify/Hono/Express, routing conventions, Mihomo API data transformation, and rate-limit protection. Use this skill whenever writing, reviewing, or debugging any server-side code for this project: API routes, controllers, data-cleaning logic, or anything that talks to the Mihomo API. Trigger it even without the word "skill" being mentioned — e.g. when the user asks to add an endpoint, clean up a JSON response, fix a 429 from Mihomo, or wire the backend to the database/cache.
---

# HSR Encyclopedia — Backend

## Project context

This backend serves two kinds of data to the frontend: a static encyclopedia (characters, light cones, relics) backed by PostgreSQL, and live player profiles fetched on demand from the **Mihomo API** by UID. The Mihomo API is a third-party service with rate limits — most of this skill's rules exist to keep this backend from getting blocked by it.

## Runtime and framework

Node.js is the runtime. Default to **Fastify or Hono** for new routes — both are fast and lightweight, which matters here because this is an API-heavy service (lots of small JSON responses, not much server-rendered HTML). Express is fine to keep using if that's what the existing codebase already runs on; don't force a migration mid-project just for this skill's sake.

## Routing: organize by resource, not by page

```
GET /api/user/:uid          → player profile + character builds
GET /api/characters         → encyclopedia character list
GET /api/characters/:id     → single character detail
GET /api/relics/:id         → single relic detail
```

Keep the encyclopedia routes and the profile routes visibly separate (different route prefixes or files) — they have very different caching and error-handling needs, and mixing them makes it easy to accidentally apply the wrong strategy to the wrong kind of data.

## Cleaning Mihomo's data before it reaches the frontend

Raw Mihomo responses carry internal fields the frontend doesn't need, inconsistent nesting, and numbers that need rounding. Do this transformation in the backend, not the frontend, so the client only ever deals with a clean, predictable shape:

```ts
const cleanedRelics = rawRelics
  .filter((r) => r.icon) // drop malformed/empty entries
  .map((r) => ({
    id: r.id,
    name: r.name,
    mainStat: r.main_affix,
    subStats: r.sub_affix.map(normalizeStat),
  }));
```

Write one normalization function per entity type (character, relic, light cone) and reuse it everywhere that entity appears in a response, rather than inlining ad-hoc `.map()` calls in each route handler.

## Rate-limit protection is not optional

Never call the Mihomo API directly inside a request handler on every incoming request. Always route through the Redis cache layer (see `hsr-database-caching`):

1. Check Redis for `profile:<uid>`.
2. If present and fresh, return it — no external call made.
3. If missing or expired, call Mihomo, clean the response, write it to Redis with a TTL, then return it.

This single rule is the difference between a backend that survives a traffic spike and one that gets the whole app rate-limited by a third party for everyone. If you're adding a new endpoint that touches Mihomo, this pattern applies to it too — don't assume it's only needed for the main profile endpoint.

## Response and error conventions

Keep response shapes consistent across endpoints so the frontend doesn't need per-endpoint parsing logic:

```ts
// success
{ data: {...} }
// error
{ error: { message: string, code: string } }
```

Distinguish, at minimum, between "UID not found," "Mihomo API unreachable/rate-limited," and "internal error" — the frontend needs to show different messages for each, and lumping them into a generic 500 makes that impossible.

## Checklist before calling a backend feature done

- [ ] No route calls the Mihomo API directly without checking Redis first.
- [ ] New entity types have a dedicated normalization function, not inline transforms scattered across handlers.
- [ ] Encyclopedia and profile routes are clearly separated.
- [ ] Error responses distinguish "not found" from "upstream rate-limited" from "internal error."
- [ ] Response shapes match the existing `{ data }` / `{ error }` convention.