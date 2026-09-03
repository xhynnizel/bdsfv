// ────────────────────────────────────────────────────────────────
// Shared sizing constants used by both the on-screen strip preview
// (FramedStrip.jsx) and the final downloadable image (composePhoto.js)
// so the two always match exactly.
// ────────────────────────────────────────────────────────────────

export const OUTER_PAD = 0.05; // fraction of width — top/left/right margin around the photo grid
export const PLACED_STICKER_DEFAULT_SIZE = 0.16; // fraction of strip width, new sticker starting size
export const PLACED_STICKER_MIN_SIZE = 0.06; // fraction of strip width — smallest a sticker can be resized to
export const PLACED_STICKER_MAX_SIZE = 0.45; // fraction of strip width — largest a sticker can be resized to
export const CANVAS_WIDTH = 800; // base pixel width used when rendering the final PNG
