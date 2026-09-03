"use client";

import { forwardRef } from "react";
import { FRAME_ASPECT, FRAME_CELLS } from "@/lib/frame";
import { PLACED_STICKER_DEFAULT_SIZE } from "@/lib/photoboothConfig";

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
 * fixedOverlay: { id, src } | null
 * placedStickers: array of { id, src, x, y, size, rotation } — draggable, resizable, rotatable, always on top
 */
const FramedStrip = forwardRef(function FramedStrip(
  {
    photos,
    background = { type: "color", value: "#ffffff" },
    fixedOverlay,
    placedStickers = [],
    onStickerPointerDown,
    onRemoveSticker,
    onResizePointerDown,
    onRotatePointerDown,
    interactive = true,
  },
  ref
) {
  return (
    <div
      ref={ref}
      className="relative w-full rounded-2xl overflow-hidden shadow-[0_16px_50px_rgba(74,59,92,0.25)]"
      style={{ aspectRatio: FRAME_ASPECT, containerType: "inline-size" }}
    >
      {background.type === "color" && (
        <div className="absolute inset-0" style={{ background: background.value }} />
      )}

      <PhotoCells photos={photos} />

      {background.type === "design" && <FullBleedLayer src={background.src} />}

      {fixedOverlay?.src && <FullBleedLayer src={fixedOverlay.src} />}

      {/* user-placed, draggable + resizable + rotatable stickers — always on top */}
      {placedStickers.map((s) => {
        const size = s.size ?? PLACED_STICKER_DEFAULT_SIZE;
        const rotation = s.rotation ?? 0;
        return (
          <div
            key={s.id}
            className={`absolute select-none ${interactive ? "touch-none cursor-grab active:cursor-grabbing" : ""}`}
            style={{
              left: `${s.x * 100}%`,
              top: `${s.y * 100}%`,
              width: `${size * 100}cqw`,
              height: `${size * 100}cqw`,
              transform: "translate(-50%, -50%)",
            }}
            onPointerDown={interactive ? (e) => onStickerPointerDown(e, s.id, s.src) : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.src}
              alt=""
              draggable={false}
              className="w-full h-full object-contain pointer-events-none select-none"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            {interactive && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSticker(s.id);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  aria-label="Remove sticker"
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-plum text-xs leading-none flex items-center justify-center shadow"
                >
                  ×
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => onRotatePointerDown(e, s.id, rotation, s.x, s.y)}
                  aria-label="Rotate sticker"
                  className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-white text-plum text-[10px] leading-none flex items-center justify-center shadow cursor-grab touch-none"
                >
                  ↻
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => onResizePointerDown(e, s.id, size)}
                  aria-label="Resize sticker"
                  className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-white text-plum text-[10px] leading-none flex items-center justify-center shadow cursor-nwse-resize touch-none"
                >
                  ⤡
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default FramedStrip;
