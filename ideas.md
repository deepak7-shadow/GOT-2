# Westeros House Atlas — Design Direction

## Three initial approaches

### Theme Name: The Winter Archive
**Very Brief Intro:** A restrained, scholarly collection of noble houses in ink, parchment, and frost. It feels like an heirloom codex opened beside a cold hearth.
**Probability:** 0.07

### Theme Name: Ash & Gold
**Very Brief Intro:** A dramatic political chronicle built from charcoal black, ember red, and antique gold. It emphasizes rivalry, succession, and the weight of a crown.
**Probability:** 0.03

### Theme Name: Crest & Chronicle
**Very Brief Intro:** A cinematic house atlas set against carved stone and storm-lit horizons. It balances archival authority with the sweep of an epic title sequence.
**Probability:** 0.09

## Chosen approach: Crest & Chronicle

### Design Movement
**Cinematic historicism** — editorial storytelling shaped by illuminated manuscripts, title-sequence scale, and tactile medieval materials rather than a generic fantasy-game interface.

### Core Principles
1. Let **asymmetry** create tension: large left-aligned type is counterbalanced by crests, imagery, and character details to the right.
2. Use **material contrast**: storm-black fields, parchment text panels, oxidized gold accents, and house-color slashes form the visual hierarchy.
3. Treat every house as a **chapter** with its own color temperature, animal mark, and narrative cadence.
4. Keep information **succinct and archival**, using small caps, rules, and date-like metadata instead of card-heavy UI.

### Color Philosophy
The interface begins in charcoal and blue-black to evoke slate, winter weather, and night. A restrained antique gold becomes the shared signal of lineage and importance, while house colors — frost grey, ember red, and lion crimson — appear as concentrated chapters rather than all-over decoration. The emotional goal is solemn and tactile, never neon or glossy.

### Layout Paradigm
The page follows a **vertical chronicle**. A full-bleed hero starts the story, then a narrow chapter index moves beside a sequence of asymmetric house spreads. Each spread uses a large numeral, a sigil, one portrait field, and an archive note rather than a uniform three-card grid.

### Signature Elements
1. A thin **gold census line** that extends through section labels and metadata.
2. **Heraldic medallions** — simplified, single-color animal marks set into textured circular seals.
3. Oversized **Roman chapter numbers** behind headings as faded, architectural type.

### Interaction Philosophy
Interaction should feel deliberate, like turning pages in a sealed historical ledger. Navigation gently scrolls to chapters; house spreads gain subtle elevation and color intensity on hover. No bouncy or game-like effects.

### Animation
Only opacity and transform animate. Hero content fades upward over 600ms using a strong ease-out. On scroll, house content enters as a restrained 16px rise with 60ms staggered detail lines. Crest hover states rotate by less than 2 degrees and lift 3px. All nonessential motion disables under `prefers-reduced-motion`.

### Typography System
Use **Cinzel** for titles, house names, and archival labels: high-contrast, engraved, and formal. Use **Source Serif 4** for copy: measured, legible, and literary. Headlines use uppercase with deliberate tracking; body copy stays sentence case and no wider than 62 characters.

### Brand Essence
**An atmospheric digital atlas for fantasy fans who want to trace the ambition, allegiance, and myth of the great houses.**

Personality adjectives: **solemn, cinematic, archival**.

### Brand Voice
Headlines are declarative and mythic, while labels read like catalog notes. CTAs use invitation rather than sales language.

Examples: “**Every oath leaves a mark.**” and “**Enter the annals of the North.**”

### Wordmark & Logo
The wordmark uses a widened, engraved Cinzel treatment paired with a bold circular **three-pronged crown-and-compass mark**. The mark suggests realm, succession, and the vantage point of an atlas; it is not a copy of an existing franchise sigil.

### Signature Brand Color
**Census Gold — #C8A96B.** A muted, mineral gold used only to indicate lineage, navigation, and points of importance.

## Style Decisions

- The supplied storm-castle visual serves as the hero background. Because it is low-key and dark, hero copy must stay parchment-white with a charcoal overlay behind it.
- The individual house profiles use original symbolic seal artwork and editorial portrait compositions; avoid actor likenesses, episode stills, and logos from a television production.
- The crown-and-compass is the primary ceremonial seal: recur it at section transitions, chapter moments, and the footer rather than treating it only as small navigation ornament.
- Controls and information surfaces should read as vellum ledgers, military maps, or court records through thin rules, Census Gold lineage marks, and archival metadata—not generic dashboard cards.
- Short controls and labels retain the mythic catalog voice; prefer terms such as annals, records, field, oath, claim, and allegiance over product-language defaults.
- Archive filters use thin census-rule selectors and gold filing marks rather than boxed dashboard chips, so the controls read as an instrument of the witness ledger.
