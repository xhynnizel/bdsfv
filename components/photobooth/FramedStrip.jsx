"use client";

import { forwardRef } from "react";
import { FRAME_ASPECT, FRAME_CELLS } from "@/lib/frame";
import { PLACED_STICKER_SIZE } from "@/lib/photoboothConfig";

function PhotoCells({ photos }) {
  return (
    <>
      {FRAME_CELLS.map((cell, i) => (
        <div
          key={i}
          className="absolute overflow-hidden bg-lavender-light/50"
          style={{
            left: `${cell.x * 100}%`,
            top: `${cell.y * 100}%`,
            width: `${cell.w * 100}%`,
            height: `${cell.h * 100}%`,
          }}
        >
          {photos[i] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photos[i]} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      ))}
    </>
  );
}

function FullBleedLayer({ src }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
    />
  );
}

/**
 * background: { type: "color", value } | { type: "design", src, id, name }
 * fixedOverlay: { id, src } | null — from lib/frameStickers.js, "none" has src=null
 * placedStickers: array of { id, emoji, x, y } — draggable, always on top
 */
const FramedStrip = forwardRef(function FramedStrip(
  { photos, background = { type: "color", value: "#ffffff" }, fixedOverlay, placedStickers = [], onStickerPointerDown, onRemoveSticker, interactive = true },
  ref
) {
  return (
    <div
      ref={ref}
      className="relative w-full rounded-2xl overflow-hidden shadow-[0_16px_50px_rgba(74,59,92,0.25)]"
      style={{ aspectRatio: FRAME_ASPECT }}
    >
      {background.type === "color" && (
        <div className="absolute inset-0" style={{ background: background.value }} />
      )}

      <PhotoCells photos={photos} />

      {background.type === "design" && <FullBleedLayer src={background.src} />}

      {fixedOverlay?.src && <FullBleedLayer src={fixedOverlay.src} />}

      {/* user-placed, draggable stickers — always on top */}
      {placedStickers.map((s) => (
        <div
          key={s.id}
          className={`absolute select-none ${interactive ? "touch-none cursor-grab active:cursor-grabbing" : ""}`}
          style={{
            left: `${s.x * 100}%`,
            top: `${s.y * 100}%`,
            transform: "translate(-50%, -50%)",
            fontSize: `${PLACED_STICKER_SIZE * 100}cqw`,
            lineHeight: 1,
          }}
          onPointerDown={interactive ? (e) => onStickerPointerDown(e, s.id, s.emoji) : undefined}
        >
          {s.emoji}
          {interactive && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSticker(s.id);
              }}
              aria-label="Remove sticker"
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-plum text-[10px] leading-none flex items-center justify-center shadow"
              style={{ fontSize: "10px" }}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
});

export default FramedStrip;
