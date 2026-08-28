"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import FramedStrip from "@/components/photobooth/FramedStrip";
import MessageModal from "@/components/MessageModal";
import { frames } from "@/lib/frames";
import { frameColors } from "@/lib/frameColors";
import { frameOverlays } from "@/lib/frameOverlays";
import { stickers } from "@/lib/stickers";

function makeId() {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

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
  const isColorFrame = frameSelection.type === "color";
  const [showMessageModal, setShowMessageModal] = useState(false);

  const stripRef = useRef(null);
  const dragRef = useRef(null);
  const [ghost, setGhost] = useState(null);

  const chooseColor = (color) => {
    setFrameSelection({ type: "color", value: color.value, id: color.id });
  };

  const chooseDesign = (frame) => {
    setFrameSelection({ type: "design", ...frame, src: frame.bgImage });
    setPlacedStickers([]);
  };

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

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
        setPlacedStickers((prev) => [...prev, { id: drag.id, emoji: drag.emoji, x, y }]);
      } else {
        setPlacedStickers((prev) => prev.map((s) => (s.id === drag.id ? { ...s, x, y } : s)));
      }
    },
    [setPlacedStickers]
  );

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

  const canSend = name.trim().length > 0 && message.trim().length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-5">
      <button
        onClick={onBack}
        className="self-start text-plum-light text-xs underline underline-offset-4 hover:text-plum"
      >
        ← back to taking photos
      </button>

      <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center">
        {/* live preview + download */}
        <div className="w-full max-w-[220px] mx-auto md:mx-0 flex flex-col items-center gap-3 shrink-0">
          <FramedStrip
            ref={stripRef}
            photos={photos}
            background={frameSelection}
            placedStickers={placedStickers}
            fixedOverlay={frameOverlay}
            onStickerPointerDown={startStickerDrag}
            onRemoveSticker={removeSticker}
          />
          <button
            onClick={onDownload}
            className="w-full px-4 py-2.5 rounded-full border-2 border-lavender-dark text-plum font-body font-semibold text-sm hover:bg-lavender-light/50 transition-colors"
          >
            Download
          </button>
        </div>

        {/* options */}
        <div className="w-full flex-1 flex flex-col gap-5">
          <div>
            <p className="text-plum-light text-xs uppercase tracking-widest mb-2">
              Frame color
            </p>
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

          {compatibleFrames.length > 0 && (
            <div>
              <p className="text-plum-light text-xs uppercase tracking-widest mb-2">
                Pre-designed frames
              </p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {compatibleFrames.map((frame) => {
                  const selected = frameSelection.type === "design" && frameSelection.id === frame.id;
                  return (
                    <button
                      key={frame.id}
                      onClick={() => chooseDesign(frame)}
                      className="shrink-0 w-16 flex flex-col items-center gap-1"
                    >
                      <span
                        className={`w-full rounded-lg overflow-hidden border-2 ${
                          selected ? "border-plum" : "border-transparent"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={frame.bgImage} alt={frame.name} className="w-full h-auto block" />
                      </span>
                      <span className="text-[10px] text-plum-light text-center leading-tight">
                        {frame.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <p className="text-plum-light text-xs uppercase tracking-widest mb-2">
              Frame stickers overlay
            </p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {frameOverlays.map((overlay) => {
                const selected = frameOverlay?.id === overlay.id;
                return (
                  <button
                    key={overlay.id}
                    onClick={() => setFrameOverlay(overlay)}
                    className="shrink-0 w-16 flex flex-col items-center gap-1"
                  >
                    <span
                      className={`w-full h-16 rounded-lg overflow-hidden border-2 flex items-center justify-center ${
                        selected ? "border-plum" : "border-transparent"
                      } bg-white/50`}
                    >
                      {overlay.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={overlay.src} alt={overlay.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lavender-light text-xs">None</span>
                      )}
                    </span>
                    <span className="text-[10px] text-plum-light text-center leading-tight">
                      {overlay.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-plum-light text-xs uppercase tracking-widest mb-2">
              Stickers {!isColorFrame && "(pick a color above to use these)"}
            </p>
            <div className={`flex gap-2.5 overflow-x-auto pb-1 ${!isColorFrame ? "opacity-40 pointer-events-none" : ""}`}>
              {stickers.map((s) => (
                <button
                  key={s.id}
                  onPointerDown={(e) => isColorFrame && startTrayDrag(e, s.emoji)}
                  aria-label={`Drag ${s.label} sticker`}
                  className="shrink-0 w-11 h-11 rounded-xl bg-white/90 border border-lavender-light flex items-center justify-center text-xl touch-none cursor-grab active:cursor-grabbing shadow-sm"
                >
                  {s.emoji}
                </button>
              ))}
            </div>
          </div>

          {!configured && (
            <p className="text-rose text-xs bg-rose/10 rounded-lg px-3 py-2">
              The memory wall isn't set up yet — ask whoever made this site to
              finish the Firebase setup in the README.
            </p>
          )}

          {sendStatus === "error" && (
            <p className="text-rose text-xs">Something went wrong sending that — mind trying again?</p>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={onSend}
              disabled={!canSend || sendStatus === "sending" || !configured}
              className="px-6 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors disabled:opacity-50"
            >
              {sendStatus === "sending" ? "Sending…" : "Send"}
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
      </div>

      {/* floating drag ghost */}
      {ghost && (
        <span
          className="fixed z-50 pointer-events-none select-none text-4xl"
          style={{ left: ghost.x, top: ghost.y, transform: "translate(-50%, -50%)" }}
          aria-hidden="true"
        >
          {ghost.emoji}
        </span>
      )}

      {showMessageModal && (
        <MessageModal
          name={name}
          message={message}
          onNameChange={onNameChange}
          onMessageChange={onMessageChange}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </div>
  );
}