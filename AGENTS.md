# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Current visual direction

- Rebuild the portfolio around one message per viewport, leaving deliberate negative space for motion.
- Aim for an experimental, highly capable engineer aesthetic: oversized Japanese typography, black and warm-paper surfaces, restrained violet-to-coral accents, monospaced microcopy, and no glass cards or dashboard density.
- Use motion as navigation and storytelling, drawing from the selected Kinetic Type Stage, Magnetic Build Constellation, and Living Thesis concepts.
- The intro's signature interaction is a scroll transition where imagery starts inside the headline letterforms and expands into the full background.
- The intro headline copy is “Beyond the period, a future yet unseen.” Visually connect the word “period” to the closing “.” as one continuous typographic gesture.
- The intro uses the real `pc.webp` image across the full headline, then grows that same image into a rectangular full-screen background; do not use an ellipse or capsule reveal.
- Works should feel magnetic and spatial, with large 16:10 landscape panels rather than small circular crops. Titles and descriptions must remain readable without zooming.
- Works planets are the entrance for all works (up to ~12); orbit slots are computed on an ellipse so new works never need hand-placed coordinates, and density shrinks the planet cards as the count grows.
- PROJECT is a single-screen exhibit, not a scroll-driven tour: one active 16:10 exhibit with wrap-around prev/next, keyboard arrows, a direct-jump ALL WORKS index, and a SKIP TO ABOUT exit. Section height stays constant no matter how many works exist.
- Planet selection and exhibit-active work are separate states. Clicking any Works planet jumps straight to that project (launch animation included) without forcing a cyclic tour through the other works. Entering PROJECT directly keeps the current exhibit.
- Hobby strips use hover preview plus click-to-lock on pointer devices and tap/swipe on touch devices.
- Community cards, social rows, images, and supporting copy should be deliberately large; avoid microtype for meaningful content.
- Keep the shared celestial language hierarchical: Works are large 16:10 exhibits navigated like a planetary tour, communities are the main orbiting planets, and mutual friend links are smaller readable satellites at the end of Community rather than plain footer text.
- Each mutual friend link declares the community it orbits; Yuki Matsuda is a satellite of the GeeKen community planet.
- Mutual friends without a community use an explicit system orbit and travel around the whole Community field; keep demo entries clearly labeled as demos.
- On mobile, show mutual links in a separate FRIENDS block after the Community cards instead of as orbiting satellites, and state the originating community as a relationship (for example, “GeeKenからつながった友人”) so it is not mistaken for affiliation.
- Social link rows should not use leading sequence numbers or a colored vertical/inset accent bar; keep the subtle paper-dark tint and spacing response.
- Keep the intro Morph GPU-composited and avoid full-resolution multi-canvas redraws during scroll. Prefer a small direct WebGL effect over adding Three.js when a scene graph is unnecessary.
- When the hero needs preparation time, use only the short `INITIALIZING / TSUTSUMIN` to `READY` typography loader; never add fake progress or a forced minimum duration.
- All supplied portfolio images and logos must remain authentic.
- Keep motion playful but functional, with a reduced-motion fallback and responsive layouts that still communicate one idea at a time.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
