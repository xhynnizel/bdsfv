// ────────────────────────────────────────────────────────────────
// GRID LAYOUTS
// Modeled on real photobooth print sizes. Each layout defines:
//   count   — how many photos it needs
//   aspect  — width / height of the whole printed strip
//   footer  — fraction of the height reserved at the bottom for a
//             caption/logo band (like a real photobooth print)
//   cells   — where each photo sits, as fractions (0–1) of the
//             photo area (the space above the footer band)
// Add, remove, or resize entries here to offer different prints.
// ────────────────────────────────────────────────────────────────

export const gridLayouts = [
  {
    id: "strip-3",
    name: '2×6" — 3 Photos',
    count: 3,
    aspect: 2 / 6,
    footer: 0.16,
    cells: [
      { x: 0, y: 0, w: 1, h: 1 / 3 },
      { x: 0, y: 1 / 3, w: 1, h: 1 / 3 },
      { x: 0, y: 2 / 3, w: 1, h: 1 / 3 },
    ],
  },
  // {
  //   id: "strip-4",
  //   name: '2×6" — 4 Photos',
  //   count: 4,
  //   aspect: 2 / 6,
  //   footer: 0.16,
  //   cells: [
  //     { x: 0, y: 0, w: 1, h: 0.25 },
  //     { x: 0, y: 0.25, w: 1, h: 0.25 },
  //     { x: 0, y: 0.5, w: 1, h: 0.25 },
  //     { x: 0, y: 0.75, w: 1, h: 0.25 },
  //   ],
  // },
  // {
  //   id: "single-portrait",
  //   name: '4×6" Portrait',
  //   count: 1,
  //   aspect: 4 / 6,
  //   footer: 0.12,
  //   cells: [{ x: 0, y: 0, w: 1, h: 1 }],
  // },
  // {
  //   id: "single-landscape",
  //   name: '4×6" Landscape',
  //   count: 1,
  //   aspect: 6 / 4,
  //   footer: 0.12,
  //   cells: [{ x: 0, y: 0, w: 1, h: 1 }],
  // },
];
