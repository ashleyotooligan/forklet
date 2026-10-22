# Artwork and figure provenance

## Two kinds of image

| Asset | Source | Meaning |
|---|---|---|
| `brand/forklet-agent.png` | Original built-in image generation, 21 October 2026 | Project character on plain white; illustrative |
| `art/forklet-pair.png` | Built-in image generation using the first image as an identity reference | Two character copies; illustrative |
| `brand/forklet-cover.png` | Native Canvas code composition using the original portrait | Repository/social cover, 1600 × 800 |
| `screenshots/01` through `12` | `scripts/capture.mjs` and `src/view/render.mjs` | Twelve application-generated experiment plates, 1440 × 1080 |

The two character images were created for this project, not taken from another repository or stock library. No existing mascot was supplied as a target identity. The paired image uses only Forklet's original portrait as its character reference. The output uses opaque plain warm-white backgrounds by design.

The numerical figures are not image-model mockups. Their numbers, plotted traces, action dots and labels come from the implemented controller and generated reference study. They are rendered directly from application drawing functions, not captured from a browser. Character art is not a representation of measured hidden state.

## Character prompt

Built-in image-generation mode; new image, no image reference; opaque background:

> Use case: logo-brand. Create a completely original memorable mascot for Forklet, an independent decision-experiment project. A tiny folded-paper-inspired creature made from thick matte porcelain-like paper, one continuous compact body that divides into two upward folded lobes at the top. It is NOT a utensil or a fork tool. Its silhouette resembles an abstract living origami seed with a distinct central V-shaped crease. The left lobe has a soft cobalt-blue face and the right lobe has a warm apricot-coral face, with ivory folded edges joining into one small base. Two small expressive dark ink dot eyes placed low on the two sides of the crease, no mouth, no black visor. One tiny offset folded-paper foot at each bottom corner, no arms, no antennae, no costume, no equipment. Calm curious personality, geometric and tactile, restrained high-end low-poly illustration with crisp flat planes and a very subtle paper grain. Centered full-body character on a completely plain solid warm-white background, large generous margins, only a very soft small grounding shadow. Square composition. No room, no workshop, no screens, no graphs, no text, no numbers, no logos, no other characters. Distinct from round robots, peas, frogs, insects, Claude mascots and existing game characters. Elegant charming new identity with a clear split/fork theme.

## Paired-origin prompt

Built-in image-generation mode; local original Forklet portrait as the sole image reference; opaque background:

> Use case: illustration-story. Asset: Forklet paired-origin illustration for a decision experiment repository. Reference image role: preserve the exact original folded-paper creature identity, with one continuous ivory body, two tall split folded lobes, a central V crease, low dark dot eyes, and tiny folded feet. Create a new scene with two smaller copies of that same character, side by side with a wide empty gap between them. Both have identical shape and scale. The left copy has predominantly muted cobalt-blue inner folds, and the right copy has predominantly apricot-coral inner folds, while both keep ivory outer paper. They face slightly toward one another, curious and calm. High-end tactile matte origami/low-poly illustration, crisp flat planes, subtle fine paper grain. Completely plain solid warm-white background, generous negative space, soft unobtrusive contact shadows only. Landscape composition. No room, no desk, no computer, no graphs, no arrows, no labels, no text, no symbols, no money, no additional props. These are two states of one distinctive mascot, not new unrelated characters.

## Reuse

Project artwork is distributed with the repository under its MIT license to the extent applicable. AI-generated artwork may not receive identical legal protection in every jurisdiction. No trademark clearance is claimed for the project name or character.

DejaVu fonts are used by the local native figure renderer but are not included in the package. The optional renderer is not bundled. No third-party game art, chain logo, commercial model logo or scraped screenshot is used.
