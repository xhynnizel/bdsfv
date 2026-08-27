"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import FramedStrip from "@/components/photobooth/FramedStrip";
import { frames } from "@/lib/frames";
import { frameColors } from "@/lib/frameColors";
import { stickers } from "@/lib/stickers";

function makeId() {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function FrameStep({ photos, layout, onComplete, onBack }) {
  const compatibleFrames = frames.filter((f) => f.count === layout.count);
  const [mode, setMode] = useState(compatibleFrames.length > 0 ? "gallery" : "custom");

  return mode === "gallery" ? (
    <FrameGallery
      frames={compatibleFrames}
      onSelect={(frame) => onComplete({ type: "design", ...frame }, [])}
      onCustom={() => setMode("custom")}
      onBack={onBack}
    />
  ) : (
    <CustomizeFrame
      photos={photos}
      ref={stripRef}
      onComplete={onComplete}
      onBack={compatibleFrames.length > 0 ? () => setMode("gallery") : onBack}
      backLabel={compatibleFrames.length > 0 ? "← choose a design instead" : undefined}
    />
  );
}

function FrameGallery({ frames: options, onSelect, onCustom, onBack }) {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-5">
      <div className="w-full flex items-center justify-between px-1">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full border-2 border-lavender-dark text-plum font-body font-semibold text-sm hover:bg-lavender-light/50 transition-colors"
        >
          ← Back
        </button>
        <p className="font-display italic text-plum text-lg">
          ☆・˚ Select a frame ˚・☆
        </p>
        <span className="w-[74px]" aria-hidden="true" />
      </div>

      <div className="w-full flex gap-4 overflow-x-auto pb-3 px-1 snap-x snap-mandatory">
        {options.map((frame) => (
          <button
            key={frame.id}
            onClick={() => onSelect(frame)}
            className="snap-center shrink-0 w-36 sm:w-44 flex flex-col items-center gap-2 group"
          >
            <span className="w-full rounded-xl overflow-hidden shadow-[0_10px_28px_rgba(74,59,92,0.2)] border-2 border-transparent group-hover:border-plum transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={frame.bgImage} alt={frame.name} className="w-full h-auto block" />
            </span>
            <span className="text-xs text-plum-light">{frame.name}</span>
          </button>
        ))}

        <button
          onClick={onCustom}
          className="snap-center shrink-0 w-36 sm:w-44 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-lavender-dark bg-white/50 hover:bg-white/80 transition-colors"
          style={{ aspectRatio: 1 / 3 }}
        >
          <span className="text-3xl">🎨</span>
          <span className="text-xs text-plum-light text-center px-3">
            Custom colors &amp; stickers
          </span>
        </button>
      </div>

      <p className="text-plum-light text-xs text-center">
        Tap a frame to use it, or make your own on the right.
      </p>
    </div>
  );
}

function CustomizeFrame({ photos, layout, onComplete, onBack, backLabel }) {
  const [frameSelection, setFrameSelection] = useState({
    type: "color",
    value: frameColors[0].value,
    id: frameColors[0].id,
  });
  const [placedStickers, setPlacedStickers] = useState([]);

  const stripRef = useRef(null);
  const dragRef = useRef(null);
  const [ghost, setGhost] = useState(null);

  const chooseColor = (color) => {
    setFrameSelection({ type: "color", value: color.value, id: color.id });
  };

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const finishDrag = useCallback((clientX, clientY) => {
    const drag = dragRef.current;
    dragRef.current = null;
    setGhost(null);
    if (!drag) return;

    const rect = stripRef.current?.getBoundingClientRect();
    if (!rect) return;

    const inside =
      clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;

    if (!inside) {
      if (!drag.isNew) {
        setPlacedStickers((prev) => prev.filter((s) => s.id !== drag.id));
      }
      return;
    }

    const x = clamp((clientX - rect.left) / rect.width, 0.04, 0.96);
    const y = clamp((clientY - rect.top) / rect.height, 0.04, 0.96);

    if (drag.isNew) {
      setPlacedStickers((prev) => [...prev, { id: drag.id, emoji: drag.emoji, x, y }]);
    } else {
      setPlacedStickers((prev) => prev.map((s) => (s.id === drag.id ? { ...s, x, y } : s)));
    }
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragRef.current) return;
      const point = e.touches ? e.touches[0] : e;
      setGhost((g) => (g ? { ...g, x: point.clientX, y: point.clientY } : g));
    };
    const handleUp = (e) => {
      if (!dragRef.current) return;
      const point = e.changedTouches ? e.changedTouches[0] : e;
      finishDrag(point.clientX, point.clientY);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [finishDrag]);

  const startTrayDrag = (e, emoji) => {
    e.preventDefault();
    dragRef.current = { id: makeId(), emoji, isNew: true };
    setGhost({ emoji, x: e.clientX, y: e.clientY });
  };

  const startStickerDrag = (e, id, emoji) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { id, emoji, isNew: false };
    setGhost({ emoji, x: e.clientX, y: e.clientY });
  };

  const removeSticker = (id) => {
    setPlacedStickers((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      {backLabel && (
        <button onClick={onBack} className="self-start text-plum-light text-xs underline underline-offset-4 hover:text-plum">
          {backLabel}
        </button>
      )}

      <FramedStrip
        ref={stripRef}
        photos={photos}
        background={frameSelection}
        placedStickers={placedStickers}
        onStickerPointerDown={startStickerDrag}
        interactive={true}
        onRemoveSticker={removeSticker}
      />

      <div className="w-full">
        <p className="text-plum-light text-xs text-center mb-2">Frame color</p>
        <div className="flex gap-3 overflow-x-auto pb-2 px-1 justify-center flex-wrap">
          {frameColors.map((color) => {
            const selected = frameSelection.type === "color" && frameSelection.id === color.id;
            return (
              <button
                key={color.id}
                onClick={() => chooseColor(color)}
                aria-label={color.label}
                className={`shrink-0 w-10 h-10 rounded-full border-2 ${
                  selected ? "border-plum" : "border-white"
                } shadow-sm`}
                style={{ background: color.value }}
              />
            );
          })}
        </div>
      </div>

      <div className="w-full">
        <p className="text-plum-light text-xs text-center mb-2">
          drag a sticker onto your photo strip
        </p>
        <div className="flex gap-2.5 overflow-x-auto pb-2 px-1">
          {stickers.map((s) => (
            <button
              key={s.id}
              onPointerDown={(e) => startTrayDrag(e, s.emoji)}
              aria-label={`Drag ${s.label} sticker`}
              className="shrink-0 w-12 h-12 rounded-xl bg-white/90 border border-lavender-light flex items-center justify-center text-2xl touch-none cursor-grab active:cursor-grabbing shadow-sm"
            >
              {s.emoji}
            </button>
          ))}
        </div>
      </div>

      {ghost && (
        <span
          className="fixed z-50 pointer-events-none select-none text-4xl"
          style={{ left: ghost.x, top: ghost.y, transform: "translate(-50%, -50%)" }}
          aria-hidden="true"
        >
          {ghost.emoji}
        </span>
      )}

      <div className="flex gap-3">
        {!backLabel && (
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-full border-2 border-lavender-dark text-plum font-body font-semibold text-sm hover:bg-lavender-light/50 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={() => onComplete(frameSelection, placedStickers)}
          className="px-6 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
