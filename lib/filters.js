// lib/filters.js
export const filters = [
  { id: "none", name: "Original", css: "none" },
  { id: "bw", name: "B&W", css: "grayscale(1) contrast(1.05)" },
  { id: "sepia", name: "Sepia", css: "sepia(0.65) contrast(1.05)" },
  { id: "warm", name: "Warm", css: "saturate(1.3) sepia(0.15) brightness(1.05)" },
  { id: "cool", name: "Cool", css: "saturate(1.1) hue-rotate(-8deg) brightness(1.03)" },
  { id: "vivid", name: "Vivid", css: "saturate(1.5) contrast(1.1)" },
];