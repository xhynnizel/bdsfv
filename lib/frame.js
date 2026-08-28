// ────────────────────────────────────────────────────────────────
// PRE-DESIGNED FRAMES
// All 5 are the same template (banner + 3 photo windows + date/tag)
// recolored, so they share one set of measured window positions.
// Each is a genuinely transparent PNG — the white you see in a plain
// image viewer is actually alpha=0, not white fill — so photos are
// drawn first and the frame art layers on top, letting the photo
// show through the transparent windows.
//
// FRAME_ASPECT / FRAME_CELLS are also used by the plain color
// backgrounds in lib/frameColors.js, so every combination (any color
// or design, with or without a sticker overlay) lines up on the same
// 3-window layout — see components/photobooth/FramedStrip.jsx and
// lib/composePhoto.js.
//
// TO ADD ANOTHER COLOR VARIANT:
// 1. Export a transparent PNG, same pixel size as these (600×1800),
//    with the photo windows fully transparent (alpha 0).
// 2. Drop it in /public/frames/triple/.
// 3. Add an entry to `frameDesigns` below.
// ────────────────────────────────────────────────────────────────

export const FRAME_ASPECT = 1 / 3; // 2×6"

export const FRAME_CELLS = [
  { x: 0.0617, y: 0.1628, w: 0.875, h: 0.2078 },
  { x: 0.0617, y: 0.3956, w: 0.875, h: 0.2078 },
  { x: 0.0617, y: 0.6283, w: 0.875, h: 0.2078 },
];

export const frameDesigns = [
  { id: "rose", name: "Rose", src: "/frames/triple/1.png" },
  { id: "sky-blue", name: "Sky Blue", src: "/frames/triple/2.png" },
  { id: "mint", name: "Mint", src: "/frames/triple/3.png" },
  { id: "blush", name: "Blush", src: "/frames/triple/4.png" },
  { id: "midnight", name: "Midnight", src: "/frames/triple/5.png" },
];