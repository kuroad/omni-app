---
name: hsr-game-domain-knowledge
description: Honkai Star Rail (HSR) game mechanics knowledge for the omni-encyclopedia project — stat calculation (percentage vs flat), rarity tiers, Path and Element systems, and the community Crit Value (CV) formula for scoring relics. Use this skill whenever writing or reviewing any logic that computes, displays, filters, or scores game data in this app — not just UI text. Trigger it even without the word "skill" being mentioned — e.g. when the user asks to build a relic score feature, sum a character's stats, add a rarity badge, or filter characters by Path/Element.
---

# HSR Encyclopedia — Game Domain Knowledge

## Why this matters

Getting the visual polish right doesn't matter if the underlying numbers are wrong — players who know this game well will notice immediately if a stat total or a relic score is off, and that undermines trust in the whole encyclopedia. This skill exists to keep the *logic*, not just the layout, correct. Pair it with `hsr-frontend` (for how this data gets displayed) and `hsr-database-caching` (for how it's stored).

## Stats: percentage vs. flat

Most stats in HSR come in two forms that must be combined correctly:

- **Flat** — an absolute number added directly, e.g. `ATK +50`.
- **Percentage** — a multiplier applied to the character's base value, e.g. `ATK% +10%`.

A character's final stat is generally: `base stat × (1 + sum of all % bonuses) + sum of all flat bonuses`. When aggregating a stat from multiple sources (base kit + light cone + relics + traces/eidolons), **sum all the flat contributions together and all the percentage contributions together first**, then combine them — don't add a flat number and a percentage number together as if they were the same unit. This is the single most common source of an incorrect "total ATK" or "total HP" display.

## Rarity

Characters and light cones are rated 4★ or 5★; relics have their own rarity independent of set. This is typically shown via color/badge convention (commonly purple for 4★, gold for 5★). Whatever convention is chosen, use the `rarity` field consistently for both display *and* for filtering/sorting — don't derive rarity from something indirect like character name or release date.

## Path and Element

Pull the Path and Element lists from the Mihomo API response or from a database table that's synced periodically — **don't hardcode these as a fixed list in frontend code**. This game receives new content on a regular patch cycle, and the list genuinely does grow: as of the 4.0 update (February 2026), a ninth playable Path — **Elation** — was added alongside the existing eight (Destruction, The Hunt, Erudition, Harmony, Nihility, Preservation, Abundance, Remembrance). Elements have been more stable — as of mid-2026 there are still 7: Physical, Fire, Ice, Lightning, Wind, Quantum, Imaginary — but treat both lists as data that can change with a future patch, not as a constant baked into multiple files.

Practical implication: model Path and Element as their own reference tables (see `hsr-database-caching`) with a foreign key from `Character`/`LightCone`, so adding a new Path is a data insert, not a code deploy.

## Crit Value (CV): relic scoring

The community-standard formula for scoring a relic's crit-related substats:

```
CV = (CRIT Rate% × 2) + CRIT DMG%
```

This is what most relic-scoring features in the community are built around, and it's a reasonable default for a "relic score" feature in this app. A few things to get right when implementing it:

- Only sum substats that are actually CRIT Rate% and CRIT DMG% — don't accidentally include the main stat if it happens to be a crit stat, unless the feature is explicitly meant to include it (be consistent and document which convention was chosen).
- Labels like "Good" / "Great" / "Perfect" based on a CV threshold (commonly somewhere around 30–50+ depending on community convention) are **opinion, not a fixed game value** — define these thresholds as configuration in one place, not as magic numbers scattered across components, so they can be tuned without hunting through the codebase.

## Checklist before calling a domain-logic feature done

- [ ] Flat and percentage stat contributions are summed separately before being combined, never added together directly.
- [ ] `rarity` is read from the data field, not inferred from something indirect.
- [ ] Path and Element come from the API/database, not a hardcoded array in frontend code.
- [ ] CV (or any relic score) sums only the intended substat types, with a clearly documented convention.
- [ ] Any "Good/Great" quality thresholds live in one configurable place, not hardcoded in multiple components.
