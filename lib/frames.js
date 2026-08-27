// ────────────────────────────────────────────────────────────────
// PRE-DESIGNED FRAMES
// Real artwork (see /public/frames/) instead of CSS approximations.
// Each frame is a flat 600×1800px image (2×6" @ 300dpi, matching the
// strip aspect ratio) with plain white rectangles where photos show
// through. `cells` gives the exact position of each white window, as
// fractions (0–1) of the full image — measured directly from the
// artwork, so photos line up pixel-perfect with no manual tuning.
//
// Only offered for the 2×6" strip layouts — `count` must match the
// number of photos taken. Picking one disables sticker-dragging,
// since the design is already finished (see lib/frameColors.js for
// the plain-color alternative that unlocks stickers).
//
// TO ADD YOUR OWN:
// 1. Export a flat (no transparency needed) PNG, ideally 600×1800px,
//    with pure white (#FFFFFF) rectangles where photos should show.
// 2. Drop it in /public/frames/.
// 3. Add an entry below with the right `count` and `cells`. If you
//    don't know the exact window positions, ask to have them
//    measured from the file the way these were.
//
// OVERLAPPING DECORATIONS: these are flat images, so a photo is drawn
// as a plain rectangle exactly matching its window — any decoration
// that was meant to overlap slightly onto the photo (like the cat's
// paw on "Cat Pattern") will end up partly covered. For decorations
// that should sit *on top* of the photo, export instead as a
// transparent PNG (art opaque, windows transparent) and set
// `overlay: true` on that frame — photos are then drawn first and the
// artwork layers on top, letting transparent windows show the photo
// through and opaque art overlap it naturally.
// ────────────────────────────────────────────────────────────────

const ASPECT = 1 / 3; // 2×6"

export const frames = [
  {
    id: "1",
    name: "Cat Pattern",
    count: 3,
    bgImage: "/frames/1.png",
    aspect: ASPECT,
    overlay: false,
    cells: [
      { x: 0.057, y: 0.032, w: 0.895, h: 0.243 },
      { x: 0.055, y: 0.273, w: 0.917, h: 0.282 },
      { x: 0.057, y: 0.562, w: 0.895, h: 0.285 },
    ],
  },
  {
    id: "2",
    name: "2",
    count: 3,
    bgImage: "/frames/2.png",
    aspect: ASPECT,
    overlay: false,
    cells: [
      { x: 0.067, y: 0.037, w: 0.877, h: 0.238 },
      { x: 0.067, y: 0.301, w: 0.877, h: 0.238 },
      { x: 0.067, y: 0.565, w: 0.877, h: 0.238 },
    ],
  },
  {
    id: "3",
    name: "3",
    count: 3,
    bgImage: "/frames/3.png",
    aspect: ASPECT,
    overlay: false,
    cells: [
      { x: 0.1, y: 0.023, w: 0.798, h: 0.26 },
      { x: 0.1, y: 0.303, w: 0.8, h: 0.26 },
      { x: 0.117, y: 0.584, w: 0.8, h: 0.259 },
    ],
  },
  {
    id: "4",
    name: "4",
    count: 3,
    bgImage: "/frames/4.png",
    aspect: ASPECT,
    overlay: false,
    cells: [
      { x: 0.055, y: 0.048, w: 0.888, h: 0.225 },
      { x: 0.055, y: 0.298, w: 0.888, h: 0.225 },
      { x: 0.055, y: 0.548, w: 0.888, h: 0.225 },
    ],
  },
  {
    id: "5",
    name: "5",
    count: 3,
    bgImage: "/frames/5.png",
    aspect: ASPECT,
    overlay: false,
    cells: [
      { x: 0.062, y: 0.037, w: 0.875, h: 0.238 },
      { x: 0.062, y: 0.301, w: 0.875, h: 0.238 },
      { x: 0.062, y: 0.565, w: 0.875, h: 0.238 },
    ],
  }
];
