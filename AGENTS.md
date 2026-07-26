# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Current visual direction

- Rebuild the portfolio around one message per viewport, leaving deliberate negative space for motion.
- Aim for an experimental, highly capable engineer aesthetic: oversized Japanese typography, black and warm-paper surfaces, restrained violet-to-coral accents, monospaced microcopy, and no glass cards or dashboard density.
- Use motion as navigation and storytelling, drawing from the selected Kinetic Type Stage, Magnetic Build Constellation, and Living Thesis concepts.
- The intro's signature interaction is a scroll transition where imagery starts inside the headline letterforms and expands into the full background.
- The intro uses the real `pc.webp` image across the full headline, then grows that same image into a rectangular full-screen background; do not use an ellipse or capsule reveal.
- Works should feel magnetic and spatial, but with four large 16:10 landscape panels rather than small circular crops. Titles and descriptions must remain readable without zooming.
- A selected Works panel grows into a sticky, full-screen horizontal project sequence driven by normal vertical scrolling.
- Hobby strips use hover preview plus click-to-lock on pointer devices and tap/swipe on touch devices.
- Community cards, social rows, images, and supporting copy should be deliberately large; avoid microtype for meaningful content.
- Social link rows should not use leading sequence numbers or a colored vertical/inset accent bar; keep the subtle paper-dark tint and spacing response.
- Keep the intro Morph GPU-composited and avoid full-resolution multi-canvas redraws during scroll. Prefer a small direct WebGL effect over adding Three.js when a scene graph is unnecessary.
- All supplied portfolio images and logos must remain authentic.
- Keep motion playful but functional, with a reduced-motion fallback and responsive layouts that still communicate one idea at a time.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
