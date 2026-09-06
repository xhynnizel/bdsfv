"use client";

import { useEffect, useRef, useState } from "react";
import { gridLayouts } from "@/lib/gridLayouts";
import { filters } from "@/lib/filters";
import LayoutThumbnail from "@/components/photobooth/LayoutThumbnail";

const COUNTDOWN_OPTIONS = [3, 5, 10];
const DEFAULT_LAYOUT = gridLayouts.find((l) => l.id === "strip-4") || gridLayouts[0];

export default function CaptureScreen({ onComplete, onBack }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const [photos, setPhotos] = useState(Array(DEFAULT_LAYOUT.count).fill(null));

  const [status, setStatus] = useState("idle"); // idle | starting | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [count, setCount] = useState(null);
  const [capturingIndex, setCapturingIndex] = useState(null);

  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [filter, setFilter] = useState(filters[0]);
  const [glow, setGlow] = useState(1);
  const [activePanel, setActivePanel] = useState(null); // null | "grid" | "filters" | "glow"

  const isBusy = count !== null || capturingIndex !== null;
  const liveFilterCss = `${filter.css === "none" ? "" : filter.css} brightness(${glow})`;

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    setPhotos(Array(newLayout.count).fill(null));
    setActivePanel(null);
  };

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const startCamera = async () => {
    setStatus("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("ready");
    } catch {
      setErrorMsg("Couldn't access your camera. Please allow camera access and reload.");
      setStatus("error");
    }
  };

  const nextEmptySlot = (list) => {
    const idx = list.findIndex((p) => !p);
    return idx === -1 ? list.length - 1 : idx;
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    const size = Math.min(video.videoWidth, video.videoHeight);
    if (!size) return null;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.filter = liveFilterCss;

    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    ctx.save();
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    ctx.restore();

    return canvas.toDataURL("image/jpeg", 0.92);
  };

  const runCapture = async (indices) => {
    for (const idx of indices) {
      setCapturingIndex(idx);
      let n = countdownSeconds;
      setCount(n);
      while (n > 0) {
        // eslint-disable-next-line no-await-in-loop
        await wait(1000);
        n -= 1;
        setCount(n > 0 ? n : null);
      }
      const frame = captureFrame();
      if (frame) {
        setPhotos((prev) => {
          const next = [...prev];
          next[idx] = frame;
          return next;
        });
      }
      // eslint-disable-next-line no-await-in-loop
      await wait(300);
    }
    setCapturingIndex(null);
  };

  const handleStartCapture = () => {
    if (status !== "ready" || isBusy) return;
    const emptyIndices = photos.map((p, i) => (p ? null : i)).filter((i) => i !== null);
    runCapture(emptyIndices.length > 0 ? emptyIndices : photos.map((_, i) => i));
  };

  const handleRetake = (index) => {
    if (isBusy || status !== "ready") return;
    runCapture([index]);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPhotos((prev) => {
        const idx = nextEmptySlot(prev);
        const next = [...prev];
        next[idx] = dataUrl;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const allDone = photos.every(Boolean);
  const togglePanel = (panel) => setActivePanel((prev) => (prev === panel ? null : panel));

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-5">
      <button
        onClick={onBack}
        className="self-start text-plum-light text-xs underline underline-offset-4 hover:text-plum"
      >
        ← back to message
      </button>

      {/* top row: countdown timer + upload */}
      <div className="w-full flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white/80 rounded-full px-3 py-2 shadow-sm">
          {COUNTDOWN_OPTIONS.map((secs) => (
            <button
              key={secs}
              onClick={() => setCountdownSeconds(secs)}
              disabled={isBusy}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-colors ${
                countdownSeconds === secs
                  ? "bg-plum text-cream"
                  : "text-plum-light hover:bg-lavender-light/40"
              }`}
            >
              ⏱ {secs}s
            </button>
          ))}
        </div>

        <button
          onClick={handleUploadClick}
          disabled={isBusy || allDone}
          className="px-4 py-2 rounded-full border-2 border-rose text-rose font-body font-semibold text-sm hover:bg-rose/10 transition-colors disabled:opacity-40 flex items-center gap-1.5"
        >
          ⬆ Upload Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="w-full flex flex-col md:flex-row gap-4 items-start">
        {/* sidebar */}
        <div className="relative flex md:flex-col gap-2 order-2 md:order-1 shrink-0">
          {[
            // { id: "grid", label: "Grid", icon: "▦" },
            { id: "filters", label: "Filters", icon: "◐" },
            { id: "glow", label: "Glow", icon: "✨" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => togglePanel(item.id)}
              className={`flex md:flex-col items-center gap-1 px-3 py-2.5 rounded-2xl text-xs font-body font-medium transition-colors ${
                activePanel === item.id ? "bg-rose/20 text-rose" : "bg-white/80 text-plum-light hover:bg-white"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </button>
          ))}

          {/* flyout panel */}
          {activePanel && (
            <div className="md:absolute md:left-full md:top-0 md:ml-2 mt-1 md:mt-0 w-full md:w-64 bg-white rounded-2xl shadow-[0_16px_50px_rgba(74,59,92,0.25)] p-4 z-20">
              {activePanel === "grid" && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-display text-plum text-sm">Grid</p>
                    <button onClick={() => setActivePanel(null)} className="text-plum-light text-sm">✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {gridLayouts.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => handleLayoutChange(l)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-colors ${
                          layout.id === l.id ? "border-rose bg-rose/5" : "border-transparent hover:bg-lavender-light/30"
                        }`}
                      >
                        <div className="w-full max-w-[54px]">
                          <LayoutThumbnail layout={l} />
                        </div>
                        <span className={`text-[11px] leading-tight text-center ${layout.id === l.id ? "text-rose" : "text-plum-light"}`}>
                          {l.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activePanel === "filters" && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-display text-plum text-sm">Filters</p>
                    <button onClick={() => setActivePanel(null)} className="text-plum-light text-sm">✕</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {filters.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFilter(f)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl ${
                          filter.id === f.id ? "bg-rose/15" : "hover:bg-lavender-light/30"
                        }`}
                      >
                        <span
                          className="w-9 h-9 rounded-full bg-gradient-to-br from-lavender to-peach"
                          style={{ filter: f.css }}
                        />
                        <span className={`text-[10px] ${filter.id === f.id ? "text-rose" : "text-plum-light"}`}>
                          {f.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activePanel === "glow" && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-display text-plum text-sm">Glow</p>
                    <button onClick={() => setActivePanel(null)} className="text-plum-light text-sm">✕</button>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.5"
                    step="0.05"
                    value={glow}
                    onChange={(e) => setGlow(parseFloat(e.target.value))}
                    className="w-full accent-rose"
                  />
                  <div className="flex justify-between text-[10px] text-plum-light mt-1">
                    <span>Subtle</span>
                    <span>Bright</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* video */}
        <div className="flex-1 order-1 md:order-2 w-full flex flex-col items-center gap-4">
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-plum shadow-[0_16px_50px_rgba(74,59,92,0.25)]">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover [transform:scaleX(-1)]"
              style={{ filter: liveFilterCss }}
            />
            {status === "starting" && (
              <div className="absolute inset-0 flex items-center justify-center text-cream/80 text-sm">
                starting camera…
              </div>
            )}
            {status === "error" && (
              <div className="absolute inset-0 flex items-center justify-center text-center px-6 text-cream/90 text-sm">
                {errorMsg}
              </div>
            )}
            {count !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-plum/30">
                <span className="text-cream font-display text-7xl drop-shadow-lg">{count}</span>
              </div>
            )}
            {capturingIndex !== null && count === null && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center text-3xl">📸</span>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {status === "error" ? (
            <button
              onClick={startCamera}
              className="px-7 py-3.5 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors"
            >
              Try again
            </button>
          ) : allDone ? (
            <button
              onClick={() => onComplete(layout, photos)}
              disabled={isBusy}
              className="px-7 py-3.5 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleStartCapture}
              disabled={status !== "ready" || isBusy}
              className="px-7 py-3.5 rounded-full bg-rose text-white font-body font-semibold text-sm shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {/* 📷  */}
              Start Capture
            </button>
          )}

          <p className="text-plum-light text-xs text-center max-w-xs">
            {allDone
              ? "Tap any photo on the side to retake it."
              : capturingIndex !== null
              ? `Capturing photo ${capturingIndex + 1} of ${layout.count}…`
              : `${layout.name} selected — tap Grid to change it.`}
          </p>
        </div>

        {/* thumbnails */}
        <div className="flex md:flex-col gap-2.5 order-3 shrink-0 justify-center flex-wrap md:flex-nowrap">
          {Array.from({ length: layout.count }).map((_, i) => {
            const filled = !!photos[i];
            const isCurrent = capturingIndex === i;
            return (
              <button
                key={i}
                onClick={() => handleRetake(i)}
                disabled={!filled || isBusy}
                aria-label={filled ? `Retake photo ${i + 1}` : `Photo ${i + 1} not taken yet`}
                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-colors disabled:cursor-default ${
                  isCurrent ? "border-rose" : filled ? "border-lavender-dark cursor-pointer" : "border-transparent"
                }`}
              >
                {filled ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photos[i]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center bg-plum text-cream text-lg">
                    📷
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}