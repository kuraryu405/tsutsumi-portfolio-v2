# Design QA

final result: passed

## Comparison Setup

- Source visual truth:
  - `/var/folders/s1/ws0tkss97j57y81jcbpy8ky80000gn/T/codex-clipboard-81ab78f9-2587-4368-ac99-e9e8b4216430.png` — opening text-mask state, 2543 × 1401 px.
  - `/var/folders/s1/ws0tkss97j57y81jcbpy8ky80000gn/T/codex-clipboard-a00273f4-aa31-4e54-9b9d-f358e19d9392.png` — Works orbit before the requested size/readability changes, 2517 × 1374 px.
  - `/var/folders/s1/ws0tkss97j57y81jcbpy8ky80000gn/T/codex-clipboard-c6007661-51fa-4cc5-bb9b-f6ad44df75c9.png` — Links layout reference, 1771 × 762 px.
  - The user-approved implementation plan in the task: one message per viewport, text-mask Morph, four large 16:10 Works panels, vertical-scroll/horizontal-project flow, larger About/Community/Links content.
- Browser-rendered implementation:
  - `qa-v2/26-hero-2543x1401.png`
  - `qa-v2/24-works-2517x1374.png`
  - `qa-v2/25-links-1771x762.png`
  - `qa-v2/06-project-happa.png`
  - `qa-v2/09-about-click-computers.png`
  - `qa-v2/10-community-1280.png`
  - `qa-v2/29-mobile-project-final.png`
  - `qa-v2/30-final-hero-1280.png`
- Combined comparison inputs opened and inspected:
  - `qa-v2/compare-hero-source-implementation.png`
  - `qa-v2/compare-works-source-implementation.png`
  - `qa-v2/compare-links-source-implementation.png`
- Tested CSS viewports: 1280 × 720, 1440 × 900, 2517 × 1374, 2560 × 1440, and 390 × 844.
- Device pixel ratio: 1.
- Density normalization:
  - Hero source and implementation were captured at 2543 × 1401.
  - Works source and implementation were captured at 2517 × 1374.
  - Links source and implementation were captured at 1771 × 762.
- State:
  - Hero start, mid-Morph, and full-background positions.
  - Works default selection and all four project launches.
  - Happa full-screen detail, previous/next controls, indicators, keyboard navigation, and final scroll exit to About.
  - About Photography and Computers locked states.
  - Community default state.
  - Links default state after icon and hover treatment correction.
  - Mobile hero, menu open, menu navigation, Works, project detail, About, Community, and Links.
- The Works comparison uses different active projects, so it was used only to judge the requested change in card scale, aspect ratio, typography, spacing, and orbit density. Project selection correctness was verified separately for all four works.

## Findings

No actionable P0, P1, or P2 issues remain.

### Fonts and Typography

- Noto Sans JP provides the heavy Japanese display type; IBM Plex Mono provides project names and compact interface metadata.
- The opening statement is materially brighter than the supplied screenshot, with a light outline that preserves the photograph while making the complete sentence immediately legible.
- Works titles are 18–22 px on desktop and remain legible on mobile. Active descriptions are 16 px on desktop.
- Project titles no longer clip at 390 px; the longest title remains contained by the slide.
- `Qiita` is spelled correctly in both visible copy and the accessible link label.

### Spacing and Layout Rhythm

- Each chapter has one dominant message and leaves motion space around it.
- Works cards are now 16:10 panels rather than circular crops. At 1440 × 900 and 2560 × 1440, every panel remains fully inside the viewport.
- About copy and the 60% active hobby image no longer overlap at 1280 px.
- Project navigation is at least 80 px high and has a distinct blurred surface on mobile.
- No horizontal document overflow was found at 390, 1280, 1440, or 2560 px.

### Colors and Visual Tokens

- Black, warm paper, violet, and coral remain consistent across all six sections.
- Image-backed slides use a stable scrim, and the mobile project rail has sufficient separation from both light and dark project imagery.
- X and GitHub use black SVG assets on paper. Qiita retains its green brand asset.
- Link hover/focus no longer replaces the whole row with a hard black block; it uses a subtle paper-dark tint and a coral inset marker without creating a new border seam.

### Image Quality and Asset Fidelity

- The hero uses `public/images/pc.webp` for both the text mask and the background.
- The same image coordinates remain fixed through the Morph: the text mask itself scales and the same image progressively fills the remaining gaps. No ellipse, capsule, or replacement image layer appears.
- Works, hobby, community, and social assets all use supplied source images or existing brand SVGs.
- Project panels preserve 16:10 crops with per-project focal positions; full-screen project slides retain sharp source images.

### Copy and Content

- The opening message remains 「好きなものを、つくって試す。」.
- Four works, four hobbies, three communities, three social links, and the friend link are present.
- Each work includes a slug, year, type, summary, detail copy, image focus, and external destination.
- Labels and calls to action describe their result: `VIEW PROJECT`, `OPEN SITE`, previous/next project names, and section navigation.

### Accessibility and Interaction

- Canvas output has a semantic hidden `h1`; project panels and navigation are native buttons/links with accessible labels.
- All four Works selections launched the correct project:
  - Portfolio → `Portfolioへ移動`
  - Happa → `Happaへ移動`
  - long-long-url → `long-long-urlへ移動`
  - INIAD Quest → `INIAD Questへ移動`
- ArrowRight and ArrowLeft moved between project positions. The project track released naturally into About; no scroll trap remained.
- Mobile menu opened as an opaque overlay, exposed all six destinations, navigated to Works, and closed automatically.
- About direct selection locked the image and description. Pointer-preview handlers and tap/swipe handlers are present; the Browser pointer-move API did not expose a CSS hover state, so hover was not claimed from automation alone.
- Reduced-motion CSS removes the horizontal track, stacks project slides vertically, hides the shared-element launch overlay/rail, and disables animated/smooth transitions. The selected in-app browser did not expose motion-preference emulation, so this fallback was verified from the active media rule and production CSS rather than a browser screenshot.
- Browser console errors: none. Only Vite connection and React DevTools informational messages were present.

## Full-View and Focused Comparison

- Full-view evidence:
  - Hero comparison confirms the improved text readability without changing the initial composition.
  - Works comparison confirms the circular thumbnails were replaced by substantially larger 16:10 panels and readable labels.
  - Links comparison confirms the larger editorial rows, corrected `Qiita` label, and black X/GitHub SVGs.
- Focused evidence:
  - `qa-v2/06-project-happa.png` verifies the full-screen image, large title/copy, and desktop thumbnail rail.
  - `qa-v2/29-mobile-project-final.png` verifies the corrected title fit and readable mobile rail.
  - `qa-v2/09-about-click-computers.png` verifies the active image occupies most of the deck while the description remains readable.
  - `qa-v2/10-community-1280.png` verifies the 320–380 px community cards and 16 px center description.

## Comparison History

### Pass 1

- P2: Works images and labels were too small at desktop sizes.
  - Fix: replaced circular nodes with responsive 16:10 panels, added large/medium/small density classes, increased active readout typography.
  - Post-fix evidence: `qa-v2/04-works-1280.png`, `qa-v2/24-works-2517x1374.png`.
- P2: About heading and description collided with the active image.
  - Fix: narrowed the copy column, moved the deck boundary, and adjusted heading scale.
  - Post-fix evidence: `qa-v2/09-about-click-computers.png`.
- P1: Mobile project titles clipped horizontally and the rail disappeared into light artwork.
  - Fix: reduced mobile project title sizing by viewport width and added a high-contrast blurred rail surface.
  - Post-fix evidence: `qa-v2/29-mobile-project-final.png`.
- P2: X/GitHub icons were white, and the Qiita hover created a heavy black region with distracting border contrast.
  - Fix: changed both SVG fills to black, kept `Qiita` spelling, and replaced the hover fill with a subtle tint plus coral inset marker.
  - Post-fix evidence: `qa-v2/25-links-1771x762.png`.

### Pass 2

- P2: The hero was a text mask followed by a separately expanding rectangle, so it did not read as a PowerPoint-style Morph.
  - Fix: pinned one full-image coordinate system, scaled the text mask to 7.2–8.6×, and filled its gaps with the same background image.
- P2: The photograph's dark monitor areas made the initial headline hard to parse.
  - Fix: added an initial brightness/saturation lift, a temporary white source-atop tint, and a light glyph outline that fade during the Morph.
  - Post-fix evidence: `qa-v2/compare-hero-source-implementation.png`, `qa-v2/19-hero-morph-30.png`, `qa-v2/20-hero-morph-60.png`.

### Pass 3

- Rechecked the complete flow at 1280 × 720 and the primary responsive sections at 1440 × 900, 2560 × 1440, and 390 × 844.
- Re-ran all four Works launches, keyboard project navigation, project-to-About release, About locking, mobile menu navigation, layout overflow checks, and browser console checks.
- No actionable P0, P1, or P2 findings remained.

## Follow-up Polish

- P3 test gap: a future run in a browser that exposes `prefers-reduced-motion` emulation can add screenshot evidence for the already implemented fallback.
