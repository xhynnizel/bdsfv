/**
 * Downscales + re-compresses a data URL so it's small enough to store
 * as a Firestore field (well under the 1MB document limit) and fast to
 * load on the wall page.
 */
export function compressImageDataUrl(dataUrl, maxWidth = 700, quality = 0.62) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
