---
name: hsr-database-caching
description: Database schema design and caching strategy for the Honkai Star Rail (HSR) omni-encyclopedia web app — PostgreSQL relational modeling, Prisma/Drizzle ORM usage, and Redis TTL-based caching. Use this skill whenever designing or changing a database table, writing a migration, adding an ORM model, or deciding how/where to cache data for this project. Trigger it even without the word "skill" being mentioned — e.g. when the user asks to add a new field to a character, model relics and their sets, or speed up the UID profile endpoint.
---

# HSR Encyclopedia — Database & Caching

## Project context

Two very different storage needs live side by side here: a **PostgreSQL** database holding the static encyclopedia (characters, light cones, relics and their relationships), and a **Redis** cache sitting in front of the live Mihomo API calls for player profiles. Confusing which one a piece of data belongs in is the most common mistake — encyclopedia data belongs in Postgres and is queried directly; player profile data belongs in Redis as a short-lived cache in front of an external API, not in Postgres as a permanent record.

## PostgreSQL schema design

Encyclopedia data is naturally relational. Sketch the relationships before writing any migration — a five-minute ER sketch on paper saves several migration rewrites later. Core relationships for this domain:

```
Character 1---N CharacterTrace   (skills/talents)
Character N---1 Path
Character N---1 Element
Relic     N---1 RelicSet
LightCone N---1 Path
```

Normalize lookup values like Path and Element into their own tables rather than storing them as free-text strings on `Character`. This game adds new content on a regular patch cadence (new Paths, new Elements are rarer but do happen), so treating these as foreign keys into a small reference table — rather than a hardcoded enum — makes adding a new Path a data insert instead of a schema migration.

## ORM: Prisma or Drizzle

Write schemas in the ORM, not raw SQL, so TypeScript types stay generated and in sync with the frontend/backend that consume them.

```prisma
model Character {
  id        String   @id
  name      String
  rarity    Int      // 4 or 5
  pathId    String
  elementId String
  path      Path     @relation(fields: [pathId], references: [id])
  element   Element  @relation(fields: [elementId], references: [id])
}

model Path {
  id   String @id
  name String @unique
}
```

Run schema changes through the ORM's migration workflow (`prisma migrate dev`, `drizzle-kit generate`, etc.) rather than editing tables by hand in production — hand edits drift out of sync with the schema file and become invisible to the next person (or agent) working on the codebase.

## Redis: caching player profiles

Player profile data from Mihomo is cached, not stored permanently — it's a snapshot of something that changes on its own outside this app's control.

```ts
const CACHE_TTL_SECONDS = 300; // 5 minutes — fresh enough without hammering Mihomo
await redis.set(`profile:${uid}`, JSON.stringify(cleanedProfile), "EX", CACHE_TTL_SECONDS);
```

Guidelines for choosing keys and TTLs:

- **Key naming**: `profile:<uid>` for player data, `encyclopedia:<entity>:<id>` if you ever cache encyclopedia reads too. Consistent prefixes make it possible to inspect or flush a category of keys without guessing.
- **TTL for profile data**: minutes, not hours — it reflects something a player can change by playing. 5 minutes is a reasonable default; tune based on how "live" the UI needs to feel.
- **TTL for encyclopedia data (if cached at all)**: hours to days, since it only changes on game patches. In many cases it's simpler to skip caching encyclopedia reads entirely and just query Postgres directly — it's already fast for this data volume.
- Keep the TTL value in one place (a constant or config), not copy-pasted across every call site — the frontend's `staleTime` (see `hsr-frontend`) should be set to match it.

## Checklist before calling a data-layer change done

- [ ] New reference values (Path, Element, rarity tiers) are rows in a table, not hardcoded strings/enums.
- [ ] Schema changes went through an ORM migration, not a manual `ALTER TABLE` in production.
- [ ] Any new cached data has an explicit TTL chosen deliberately, not left at a default.
- [ ] Cache keys follow the existing `<category>:<id>` naming pattern.
- [ ] Player profile data is never written to Postgres as if it were permanent encyclopedia data.