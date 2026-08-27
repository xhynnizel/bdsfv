import { FRAME_ASPECT, FRAME_CELLS } from "@/lib/frame";
import { PLACED_STICKER_SIZE, CANVAS_WIDTH } from "@/lib/photoboothConfig";

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx, sy, sw, sh;

  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/**
 * photos: array of 3 dataURLs
 * background: { type: "color", value } | { type: "design", src }
 * fixedOverlay: { src } | null — from lib/frameStickers.js ("none" has src=null)
 * placedStickers: array of { emoji, x, y } — fractions (0–1) of the whole strip
 * returns: dataURL (image/png) of the final decorated strip
 */
export async function composeStrip(photos, background, fixedOverlay, placedStickers = []) {
  const w = CANVAS_WIDTH;
  const h = Math.round(w / FRAME_ASPECT);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  if (background.type === "color") {
    ctx.fillStyle = background.value;
    ctx.fillRect(0, 0, w, h);
  }

  const toLoad = [...photos];
  if (background.type === "design") toLoad.push(background.src);
  if (fixedOverlay?.src) toLoad.push(fixedOverlay.src);

  const loaded = await Promise.all(toLoad.map((src) => loadImage(src)));
  const photoImgs = loaded.slice(0, photos.length);
  let cursor = photos.length;
  const designImg = background.type === "design" ? loaded[cursor++] : null;
  const overlayImg = fixedOverlay?.src ? loaded[cursor++] : null;

  FRAME_CELLS.forEach((cell, i) => {
    const img = photoImgs[i];
    if (!img) return;
    drawCover(ctx, img, cell.x * w, cell.y * h, cell.w * w, cell.h * h);
  });

  if (designImg) drawCover(ctx, designImg, 0, 0, w, h);
  if (overlayImg) drawCover(ctx, overlayImg, 0, 0, w, h);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  placedStickers.forEach((s) => {
    ctx.font = `${PLACED_STICKER_SIZE * w}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    ctx.fillText(s.emoji, s.x * w, s.y * h);
  });

  return canvas.toDataURL("image/png");
}