"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import FramedStrip from "@/components/photobooth/FramedStrip";
import MessageModal from "@/components/MessageModal";
import { frames } from "@/lib/frames";
import { frameColors } from "@/lib/frameColors";
import { frameOverlays } from "@/lib/frameOverlays";
import { stickers } from "@/lib/stickers";
import {
  PLACED_STICKER_DEFAULT_SIZE,
  PLACED_STICKER_MIN_SIZE,
  PLACED_STICKER_MAX_SIZE,
} from "@/lib/photoboothConfig";

function makeId() {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const TABS = [
  { id: "color", label: "Color" },
  { id: "frames", label: "Frames" },
  { id: "overlay", label: "Overlay" },
  { id: "stickers", label: "Stickers" },
];

export default function DecorateStep({
  photos,
  layout,
  frameSelection,
  setFrameSelection,
  placedStickers,
  setPlacedStickers,
  frameOverlay,
  setFrameOverlay,
  name,
  message,
  onNameChange,
  onMessageChange,
  onDownload,
  onSend,
  sendStatus,
  configured,
  onBack,
}) {
  const compatibleFrames = frames.filter((f) => f.count === layout.count);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [activeTab, setActiveTab] = useState("color");

  const stripRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const rotateRef = useRef(null);
  const trayCandidateRef = useRef(null);
  const [ghost, setGhost] = useState(null);

  const chooseColor = (color) => {
    setFrameSelection({ type: "color", value: color.value, id: color.id });
  };

  const chooseDesign = (frame) => {
    setFrameSelection({ type: "design", ...frame, src: frame.bgImage });
  };

  const finishDrag = useCallback(
    (clientX, clientY) => {
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
        setPlacedStickers((prev) => [
          ...prev,
          { id: drag.id, src: drag.src, x, y, size: PLACED_STICKER_DEFAULT_SIZE, rotation: 0 },
        ]);
      } else {
        setPlacedStickers((prev) => prev.map((s) => (s.id === drag.id ? { ...s, x, y } : s)));
      }
    },
    [setPlacedStickers]
  );

useEffect(() => {
  const handleMove = (e) => {
    const point = e.touches ? e.touches[0] : e;
    const isTouch = Boolean(e.touches);

    if (resizeRef.current) {
      const rect = stripRef.current?.getBoundingClientRect();
      if (!rect) return;
      const { id, startSize, startX } = resizeRef.current;
      const deltaFraction = (point.clientX - startX) / rect.width;
      const nextSize = clamp(startSize + deltaFraction, PLACED_STICKER_MIN_SIZE, PLACED_STICKER_MAX_SIZE);
      setPlacedStickers((prev) => prev.map((s) => (s.id === id ? { ...s, size: nextSize } : s)));
      return;
    }

    if (rotateRef.current) {
      const { id, startRotation, centerX, centerY, startAngle } = rotateRef.current;
      const angle = Math.atan2(point.clientY - centerY, point.clientX - centerX) * (180 / Math.PI);
      const nextRotation = startRotation + (angle - startAngle);
      setPlacedStickers((prev) => prev.map((s) => (s.id === id ? { ...s, rotation: nextRotation } : s)));
      return;
    }

    if (trayCandidateRef.current && !dragRef.current) {
      const { src, startX, startY } = trayCandidateRef.current;
      const dx = point.clientX - startX;
      const dy = point.clientY - startY;
      const distance = Math.hypot(dx, dy);

      if (distance > 5) {
        // On mobile (touch), require upward drag so side-scrolling the tray isn't interrupted.
        // On desktop (mouse/pointer), allow dragging in ANY direction immediately.
        if (!isTouch || Math.abs(dy) > Math.abs(dx)) {
          dragRef.current = { id: makeId(), src, isNew: true };
          setGhost({ src, x: point.clientX, y: point.clientY });
        }
        trayCandidateRef.current = null;
      }
      if (!dragRef.current) return;
    }

    if (!dragRef.current) return;
    setGhost((g) => (g ? { ...g, x: point.clientX, y: point.clientY } : g));
  };

  const handleUp = (e) => {
    trayCandidateRef.current = null;
    if (resizeRef.current) {
      resizeRef.current = null;
      return;
    }
    if (rotateRef.current) {
      rotateRef.current = null;
      return;
    }
    if (!dragRef.current) return;
    const point = e.changedTouches ? e.changedTouches[0] : e;
    finishDrag(point.clientX, point.clientY);
  };

  const handleCancel = () => {
    trayCandidateRef.current = null;
    resizeRef.current = null;
    rotateRef.current = null;
    dragRef.current = null;
    setGhost(null);
  };

  window.addEventListener("pointermove", handleMove);
  window.addEventListener("pointerup", handleUp);
  window.addEventListener("pointercancel", handleCancel);
  return () => {
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", handleUp);
    window.removeEventListener("pointercancel", handleCancel);
  };
}, [finishDrag, setPlacedStickers]);

  const startTrayDrag = (e, src) => {
    trayCandidateRef.current = { src, startX: e.clientX, startY: e.clientY };
  };

  const startStickerDrag = (e, id, src) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { id, src, isNew: false };
    setGhost({ src, x: e.clientX, y: e.clientY });
  };

  const startResize = (e, id, currentSize) => {
    e.preventDefault();
    e.stopPropagation();
    const point = e.touches ? e.touches[0] : e;
    resizeRef.current = { id, startSize: currentSize, startX: point.clientX };
  };

  const startRotate = (e, id, currentRotation, xFrac, yFrac) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = stripRef.current?.getBoundingClientRect();
    if (!rect) return;
    const point = e.touches ? e.touches[0] : e;
    const centerX = rect.left + xFrac * rect.width;
    const centerY = rect.top + yFrac * rect.height;
    const startAngle = Math.atan2(point.clientY - centerY, point.clientX - centerX) * (180 / Math.PI);
    rotateRef.current = { id, startRotation: currentRotation, centerX, centerY, startAngle };
  };

  const removeSticker = (id) => {
    setPlacedStickers((prev) => prev.filter((s) => s.id !== id));
  };

  const canSend = name.trim().length > 0 && message.trim().length > 0;

  {/* Shared Sub-Components for Section Content */}
  const ColorSection = () => (
    <div>
      <p className="text-plum-light text-xs uppercase tracking-widest mb-2">Frame color</p>
      <div className="flex gap-3 overflow-x-auto pb-1 flex-wrap">
        {frameColors.map((color) => {
          const selected = frameSelection.type === "color" && frameSelection.id === color.id;
          return (
            <button
              key={color.id}
              onClick={() => chooseColor(color)}
              aria-label={color.label}
              className={`shrink-0 w-9 h-9 rounded-full border-2 ${
                selected ? "border-plum" : "border-white"
              } shadow-sm`}
              style={{ background: color.value }}
            />
          );
        })}
      </div>
    </div>
  );
const STICKER_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "viktor-cut-outs", label: "Viktor Cut-Outs" },
  { id: "cats", label: "Cats" },
  { id: "food", label: "Food" },
  // { id: "phrase", label: "Phrases" },
  { id: "others", label: "Others" },
];

const StickersSection = () => {
const [selectedCategory, setSelectedCategory] = useState("all");

  // Dynamically extract all unique categories present in the stickers array
  const categories = Array.from(
    new Set(stickers.map((s) => s.category || "others"))
  );

  const filteredStickers =
    selectedCategory === "all"
      ? stickers
      : stickers.filter((s) => (s.category || "others") === selectedCategory);
  return (
    <div className="w-full">
      {/* Dynamic Instruction Text based on screen size */}
      <p className="text-plum-light text-xs uppercase tracking-widest mb-2">
        <span className="hidden md:inline">
          Stickers - drag onto the photo, drag a corner handle to resize or rotate
        </span>
        <span className="inline md:hidden">
          Stickers - drag upwards onto the photo, drag a corner handle to resize or rotate
        </span>
      </p>

      {/* MOBILE VIEW */}
      <div className="flex md:hidden flex-col gap-3">
        {/* Category Pills - Wrapped (Non-scrollable) */}
        <div className="flex flex-wrap gap-1.5">
          {STICKER_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat.id
                  ? "bg-plum text-cream"
                  : "bg-white/80 text-plum-light border border-lavender-light"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stickers Row - Horizontally Scrollable Only */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 touch-pan-x">
          {filteredStickers.map((s) => (
            <button
              key={s.id}
              onPointerDown={(e) => startTrayDrag(e, s.src)}
              aria-label={`Drag ${s.label} sticker`}
              className="shrink-0 w-16 h-16 rounded-xl bg-white/90 border border-lavender-light flex items-center justify-center p-1.5 cursor-grab active:cursor-grabbing shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.label}
                className="w-full h-full object-contain pointer-events-none select-none"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:flex flex-wrap gap-2.5 max-h-[180px] overflow-y-auto pr-1">
        {stickers.map((s) => (
          <button
            key={s.id}
            onPointerDown={(e) => startTrayDrag(e, s.src)}
            aria-label={`Drag ${s.label} sticker`}
            className="w-11 h-11 rounded-xl bg-white/90 border border-lavender-light flex items-center justify-center p-1 cursor-grab active:cursor-grabbing shadow-sm shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.src}
              alt={s.label}
              className="w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

  const FramesSection = () => (
    compatibleFrames.length > 0 ? (
      <div>
        <p className="text-plum-light text-xs uppercase tracking-widest mb-2">Pre-designed frames</p>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {compatibleFrames.map((frame) => {
            const selected = frameSelection.type === "design" && frameSelection.id === frame.id;
            return (
              <button
                key={frame.id}
                onClick={() => chooseDesign(frame)}
                className="shrink-0 w-16 flex flex-col items-center gap-1"
              >
                <span className={`w-full rounded-lg overflow-hidden border-2 ${selected ? "border-plum" : "border-transparent"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={frame.bgImage} alt={frame.name} className="w-full h-auto block" />
                </span>
                <span className="text-[10px] text-plum-light text-center leading-tight">{frame.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    ) : null
  );

  const OverlaysSection = () => (
    <div>
      <p className="text-plum-light text-xs uppercase tracking-widest mb-2">Frame stickers overlay</p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {frameOverlays.map((overlay) => {
          const selected = frameOverlay?.id === overlay.id;
          return (
            <button
              key={overlay.id}
              onClick={() => setFrameOverlay(overlay)}
              className="shrink-0 w-16 flex flex-col items-center gap-1"
            >
              <span className={`w-full h-16 rounded-lg overflow-hidden border-2 flex items-center justify-center ${selected ? "border-plum" : "border-transparent"} bg-white/50`}>
                {overlay.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={overlay.src} alt={overlay.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lavender-light text-xs">None</span>
                )}
              </span>
              <span className="text-[10px] text-plum-light text-center leading-tight">{overlay.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-5 pb-24 md:pb-5">
      <button
        onClick={onBack}
        className="self-start text-plum-light text-xs underline underline-offset-4 hover:text-plum"
      >
        ← retake your photos
      </button>

      <div className="w-full flex flex-col md:flex-row gap-6 items-start md:items-center justify-center">
        {/* Live preview + download */}
        <div className="w-full max-w-[220px] mx-auto md:mx-0 flex flex-col items-center gap-3 shrink-0" style={{ width: "53%" }}>
          <FramedStrip
            ref={stripRef}
            photos={photos}
            background={frameSelection}
            placedStickers={placedStickers}
            fixedOverlay={frameOverlay}
            onStickerPointerDown={startStickerDrag}
            onRemoveSticker={removeSticker}
            onResizePointerDown={startResize}
            onRotatePointerDown={startRotate}
          />
          <button
            onClick={onDownload}
            className="w-full px-4 py-2.5 rounded-full border-2 border-lavender-dark text-plum font-body font-semibold text-sm hover:bg-lavender-light/50 transition-colors"
          >
            Download
          </button>
        </div>

        {/* Desktop View Layout ( hidden on mobile ) */}
        <div className="hidden md:flex flex-1 flex-col gap-5 w-full">
          <ColorSection />
          <StickersSection />
          <FramesSection />
          <OverlaysSection />

          {!configured && (
            <p className="text-rose text-xs bg-rose/10 rounded-lg px-3 py-2">
              The memory wall isn't set up yet, ask Shane to finish the Firebase setup in the README.
            </p>
          )}

          {sendStatus === "error" && (
            <p className="text-rose text-xs">Something went wrong sending that, mind trying again?</p>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={onSend}
              disabled={!canSend || sendStatus === "sending" || !configured}
              className="px-6 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors disabled:opacity-50"
            >
              {sendStatus === "sending" ? "Sending..." : "Send"}
            </button>
            <button
              disabled={!name.trim().length}
              onClick={() => setShowMessageModal(true)}
              className="px-6 py-3 rounded-full border-2 border-lavender-dark text-plum font-body font-semibold text-sm hover:bg-lavender-light/50 transition-colors disabled:opacity-50"
            >
              Preview message
            </button>
          </div>
        </div>

        {/* Mobile View Layout ( hidden on desktop ) */}
        <div className="flex md:hidden flex-1 flex-col gap-4 w-full">
          {/* Tab Navigation */}
          <div className="flex gap-1.5 bg-white/70 rounded-full p-1 w-full overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[72px] px-3 py-2 rounded-full text-xs font-body font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? "bg-plum text-cream" : "text-plum-light"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Panel */}
          <div className="min-h-[92px]">
            {activeTab === "color" && <ColorSection />}
            {activeTab === "frames" && (<FramesSection /> || <p className="text-plum-light text-xs">No pre-designed frames for this layout.</p>)}
            {activeTab === "overlay" && <OverlaysSection />}
            {activeTab === "stickers" && <StickersSection />}
          </div>

          {!configured && (
            <p className="text-rose text-xs bg-rose/10 rounded-lg px-3 py-2">
              The memory wall isn't set up yet, ask Shane to finish the Firebase setup in the README.
            </p>
          )}

          {sendStatus === "error" && (
            <p className="text-rose text-xs">Something went wrong sending that, mind trying again?</p>
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Bar ( Mobile Only ) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-cream/95 backdrop-blur border-t border-lavender-light px-4 py-3 flex gap-3">
        <button
          onClick={onSend}
          disabled={!canSend || sendStatus === "sending" || !configured}
          className="flex-1 px-6 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors disabled:opacity-50"
        >
          {sendStatus === "sending" ? "Sending..." : "Send"}
        </button>
        <button
          disabled={!name.trim().length}
          onClick={() => setShowMessageModal(true)}
          className="flex-1 px-6 py-3 rounded-full border-2 border-lavender-dark text-plum font-body font-semibold text-sm hover:bg-lavender-light/50 transition-colors disabled:opacity-50"
        >
          Preview
        </button>
      </div>

      {ghost && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ghost.src}
          alt=""
          className="fixed z-50 pointer-events-none select-none w-16 h-16 object-contain"
          style={{ left: ghost.x, top: ghost.y, transform: "translate(-50%, -50%)" }}
          aria-hidden="true"
        />
      )}

      {showMessageModal && (
        <MessageModal
          message={message}
          onMessageChange={onMessageChange}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </div>
  );
}