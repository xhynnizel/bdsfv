// ────────────────────────────────────────────────────────────────
// Shared checker-pattern helper so the on-screen preview (CSS) and
// the downloaded image (canvas) render the same pattern.
// ────────────────────────────────────────────────────────────────

export function checkerCss(color1, color2, sizePx = 24) {
  return {
    backgroundColor: color1,
    backgroundImage: `linear-gradient(45deg, ${color2} 25%, transparent 25%, transparent 75%, ${color2} 75%, ${color2}), linear-gradient(45deg, ${color2} 25%, transparent 25%, transparent 75%, ${color2} 75%, ${color2})`,
    backgroundSize: `${sizePx}px ${sizePx}px`,
    backgroundPosition: `0 0, ${sizePx / 2}px ${sizePx / 2}px`,
  };
}

export function drawChecker(ctx, w, h, color1, color2, size) {
  ctx.fillStyle = color1;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = color2;
  for (let y = 0; y < h; y += size) {
    for (let x = 0; x < w; x += size) {
      const alt = (Math.round(x / size) + Math.round(y / size)) % 2 === 0;
      if (alt) ctx.fillRect(x, y, size, size);
    }
  }
}
