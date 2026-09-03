import { FRAME_ASPECT, FRAME_CELLS } from "@/lib/frame";
import { PLACED_STICKER_DEFAULT_SIZE, CANVAS_WIDTH } from "@/lib/photoboothConfig";

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

function drawContain(ctx, img, cx, cy, boxSize, rotationDeg = 0) {
  const ratio = img.width / img.height;
  let w = boxSize;
  let h = boxSize;
  if (ratio > 1) {
    h = boxSize / ratio;
  } else {
    w = boxSize * ratio;
  }

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}

/**
 * photos: array of 3 dataURLs
 * background: { type: "color", value } | { type: "design", src }
 * fixedOverlay: { src } | null
 * placedStickers: array of { src, x, y, size, rotation } — x/y/size are fractions (0-1) of the whole strip
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
  const stickerLoadOffset = toLoad.length;
  toLoad.push(...placedStickers.map((s) => s.src));

  const loaded = await Promise.all(toLoad.map((src) => loadImage(src)));
  const photoImgs = loaded.slice(0, photos.length);
  let cursor = photos.length;
  const designImg = background.type === "design" ? loaded[cursor++] : null;
  const overlayImg = fixedOverlay?.src ? loaded[cursor++] : null;
  const stickerImgs = loaded.slice(stickerLoadOffset);

  FRAME_CELLS.forEach((cell, i) => {
    const img = photoImgs[i];
    if (!img) return;
    drawCover(ctx, img, cell.x * w, cell.y * h, cell.w * w, cell.h * h);
  });

  if (designImg) drawCover(ctx, designImg, 0, 0, w, h);
  if (overlayImg) drawCover(ctx, overlayImg, 0, 0, w, h);

  placedStickers.forEach((s, i) => {
    const img = stickerImgs[i];
    if (!img) return;
    const size = (s.size ?? PLACED_STICKER_DEFAULT_SIZE) * w;
    drawContain(ctx, img, s.x * w, s.y * h, size, s.rotation ?? 0);
  });

  return canvas.toDataURL("image/png");
}
