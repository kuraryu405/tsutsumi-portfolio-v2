# Design QA

final result: passed

## Pass 5 — Accelerated Intro and Simplified Social Rows

- Source visual truth:
  - `qa-v2/30-final-hero-1280.png` — the previously approved 1280 px opening state whose visual composition needed to survive the renderer change.
  - `/var/folders/s1/ws0tkss97j57y81jcbpy8ky80000gn/T/codex-clipboard-81be22c4-d0e8-4f9a-b3eb-6871e0d1a73b.png` — the social-row crop, interpreted together with the user’s explicit direction to remove both the coral vertical bar and the leading row numbers.
- Browser-rendered implementation:
  - `qa-v4/hero-webgl-start.png`
  - `qa-v4/hero-webgl-mid.png`
  - `qa-v4/hero-webgl-end.png`
  - `qa-v4/hero-webgl-mobile.png`
  - `qa-v4/links-no-numbers.png`
  - `qa-v4/links-focus-no-bar.png`
  - `qa-v4/links-no-numbers-mobile.png`
- Combined comparison inputs opened and inspected:
  - `qa-v4/compare-hero-approved-webgl.png`
  - `qa-v4/compare-link-cleanup-final.png`
- Viewports and density:
  - Desktop browser viewport: 1280 × 720; rendered screenshot: 1265 × 712; hero canvas CSS size: 1265 × 720; device pixel ratio: 1.
  - Mobile browser viewport: 390 × 844; rendered screenshot: 375 × 812; hero canvas CSS size: 375 × 844; device pixel ratio: 1.
  - The approved hero source and current desktop capture are both 1265 × 712, so no density normalization was required.
- States tested:
  - Intro start, scroll-driven text-mask expansion, and rectangular full-background completion.
  - Desktop social-row default and keyboard focus states.
  - Mobile intro and social-row layouts.
- Full-view comparison:
  - The WebGL opening preserves the real `pc.webp` image inside the full two-line headline, its black field, oversized Japanese typography, and the same rectangular full-background destination.
  - The GPU path remains visually consistent at the start, middle, and end of the Morph; the 2048 px source texture introduces no visible softness at the tested viewports.
- Focused comparison:
  - The social-row crop confirms that the coral inset bar and leading sequence number are absent while the paper surface, horizontal rules, icon, title, handle, and arrow remain.
- Required fidelity surfaces:
  - Fonts and typography: Noto Sans JP and IBM Plex Mono remain unchanged; headline scale, line height, and wrapping match the approved opening.
  - Spacing and layout rhythm: removing the number column shifts the icon/title group left without changing row height or the horizontal rules. Desktop and mobile have no horizontal overflow.
  - Colors and tokens: black, paper, violet, and coral tokens remain unchanged; link focus keeps the subtle paper-dark tint without an accent bar.
  - Image quality: `pc.webp` is uploaded once to a 2048 px GPU texture and remains sharp at 1280 px desktop and 390 px mobile.
  - Copy and content: social links retain their authentic names and handles; only the decorative 01 / 02 / 03 labels were removed.
- Accessibility and interaction:
  - The semantic hidden hero `h1` remains intact.
  - Keyboard focus on the X row produced `box-shadow: none`, `border-left-width: 0px`, and preserved the visible focus outline.
  - Browser console warnings/errors: none.
- Comparison history:
  - P1 performance risk: the opening previously rebuilt four full-viewport 2D canvases, rerasterized the Japanese text, filtered the source image, and recomposited every scroll update.
    - Fix: replaced the per-scroll 2D pipeline with one WebGL2 draw call. The image and glyph mask upload only on load/resize; scroll updates change uniforms only. No Three.js dependency was added because no scene graph is needed.
    - Post-fix evidence: `qa-v4/hero-webgl-start.png`, `qa-v4/hero-webgl-mid.png`, and `qa-v4/hero-webgl-end.png`.
  - P2 visual mismatch: the social-row focus state had a coral inset bar, and the rows still had decorative sequence numbers.
    - Fix: removed the inset shadow and number elements, then changed desktop/tablet/mobile grid tracks from five/four columns to four/three columns.
    - Post-fix evidence: `qa-v4/links-focus-no-bar.png`, `qa-v4/links-no-numbers.png`, and `qa-v4/links-no-numbers-mobile.png`.
- No actionable P0, P1, or P2 issues remain in this pass.

## Comparison Setup

- Source visual truth:
  - `/var/folders/s1/ws0tkss97j57y81jcbpy8ky80000gn/T/codex-clipboard-81ab78f9-2587-4368-ac99-e9e8b4216430.png` — opening text-mask state, 2543 × 1401 px.
  - `/var/folders/s1/ws0tkss97j57y81jcbpy8ky80000gn/T/codex-clipboard-a00273f4-aa31-4e54-9b9d-f358e19d9392.png` — Works orbit before the requested size/readability changes, 2517 × 1374 px.
  - `/var/folders/s1/ws0tkss97j57y81jcbpy8ky80000gn/T/codex-clipboard-c6007661-51fa-4cc5-bb9b-f6ad44df75c9.png` — Links layout reference, 1771 × 762 px.
  - The user-approved implementation plan in the task: one message per viewport, text-mask Morph, four large 16:10 Works panels, vertical-scroll/horizontal-project flow, larger About/Community/Links content.
- Browser-rendered implementation:
  - `qa-v3/06-profile-fixed.png`
  - `qa-v3/05-community-motion-b.png`
  - `qa-v3/07-profile-mobile.png`
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
  - Profile desktop/mobile states and two timed Community motion states.
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

- Black, warm paper, violet, and coral remain consistent across all seven sections.
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
- Mobile menu opened as an opaque overlay, exposed all seven destinations, navigated to Works, and closed automatically.
- The new Profile chapter identifies the owner as 「つつみん / TSUTSUMIN」 and uses the supplied profile image and biography from the original portfolio.
- Community cards now animate independently around the shared orbit while the field also responds to pointer position.
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

### Pass 4

- P1: The opening and existing hobby content did not explain whose portfolio this is.
  - Fix: added a dedicated Profile chapter immediately after the intro using the original portfolio’s real name, photograph, student status, biography, location, and technical interests.
  - Post-fix evidence: `qa-v3/06-profile-fixed.png`, `qa-v3/07-profile-mobile.png`.
- P2: Works communicated a moving planetary system, while Community cards remained visually static.
  - Fix: moved each Community card onto an independently timed floating wrapper, accelerated the orbit line, and added pointer-relative parallax variables.
  - Post-fix evidence: `qa-v3/04-community-motion-a.png`, `qa-v3/05-community-motion-b.png`; all three computed transforms changed between captures.

## Follow-up Polish

- P3 test gap: a future run in a browser that exposes `prefers-reduced-motion` emulation can add screenshot evidence for the already implemented fallback.
