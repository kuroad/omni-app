---
name: hsr-frontend
description: Frontend architecture and coding standards for the Honkai Star Rail (HSR) omni-encyclopedia web app — React, Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, and TanStack Query. Use this skill whenever writing, reviewing, or debugging any client-side code for this project: pages, components, styling, animations, or data-fetching hooks. Trigger it even without the word "skill" being mentioned — e.g. when the user asks to build a character card, a relic grid, a UID profile page, fix a layout, add a transition, or wire up a query for this app.
---

# HSR Encyclopedia — Frontend

## Project context

This is the client for an HSR omni-encyclopedia: a browsable database of characters, light cones, and relics, plus a UID lookup feature that pulls a player's live build data from the Mihomo API. Two data shapes coexist here, and almost every frontend decision below traces back to this split:

- **Encyclopedia data** (characters, relics, light cones) — rarely changes, benefits from SEO, safe to server-render.
- **Player profile data** (by UID) — changes whenever the player plays, needs client-side fetching and revalidation.

Before writing a component, decide which bucket it belongs to.

## TypeScript is not optional

The Mihomo API returns deeply nested JSON with plenty of optional fields. Skipping types here is the single biggest source of runtime crashes in this kind of app. Define an `interface`/`type` for every API response shape (character, relic, light cone, player profile) before writing the component that consumes it — don't let `any` leak in through a quick prototype and then never get typed properly.

```ts
interface RelicSubStat {
  key: string;
  value: number;
  isPercent: boolean;
}

interface Relic {
  id: string;
  name: string;
  rarity: 3 | 4 | 5;
  mainStat: { key: string; value: number };
  subStats: RelicSubStat[];
}
```

## Next.js App Router: split by data type

- Encyclopedia routes (`/characters`, `/characters/[id]`, `/relics`, `/light-cones`) → server components, SSR/SSG. The data barely changes, so there's no reason to pay a client-fetch waterfall for it.
- Profile routes (`/profile/[uid]`) → fetch an initial snapshot on the server for fast first paint, then hand off to a client component using TanStack Query for refresh/interaction. Don't force the whole page into `"use client"` just because one part of it needs live data — isolate the dynamic piece.

## Styling with Tailwind CSS

Write utility classes directly in markup for one-off layout. For anything that repeats — glassmorphism panels, rarity badges, stat rows — extract a small reusable component instead of copy-pasting a long class string across files. If you notice the same `className` string appearing in three or more places, that's the signal to extract it.

## Animation with Framer Motion

Use it for page transitions and deliberate micro-interactions: a 3D tilt on hover for character/relic cards, a fade-in once data finishes loading. Be deliberate about where it goes — animating every item in a long list (e.g. a full relic inventory) can visibly hurt performance on weaker devices. Prefer animating the container's entrance over animating each child individually.

## Data fetching with TanStack Query

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["player-profile", uid],
  queryFn: () => fetch(`/api/user/${uid}`).then((res) => res.json()),
  staleTime: 5 * 60 * 1000, // keep this in sync with the backend's Redis TTL
  retry: 1,
});
```

Set `staleTime` to match whatever TTL the backend uses for its Redis cache (see the `hsr-database-caching` skill). If they drift apart, the frontend ends up re-fetching against a backend that's still serving the same cached payload — wasted requests with no fresher data to show for it.

Handle the three states explicitly in every profile-facing component: loading, error, and empty (a valid UID with no public data, which the Mihomo API returns as a distinct case from "not found").

## Checklist before calling a frontend feature done

- [ ] Every Mihomo API shape used by this component has a proper `interface`/`type` — no stray `any`.
- [ ] Encyclopedia pages are server-rendered; profile pages isolate client-fetched parts instead of going fully client-side.
- [ ] Repeated class strings have been extracted into a component.
- [ ] Animations are applied selectively, not blanket-applied to long lists.
- [ ] `staleTime` in any new query matches the backend cache TTL for that endpoint.
- [ ] Loading, error, and empty states are all handled, not just the happy path.