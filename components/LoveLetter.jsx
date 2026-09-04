"use client";

import { useState } from "react";
import { letter, site } from "@/lib/content";
import { useReveal } from "@/lib/useReveal";

export default function LoveLetter() {
  const ref = useReveal();
  const [unfolded, setUnfolded] = useState(false);
  const [hearts, setHearts] = useState([]);

  const handlePhotoClick = (e) => {
    e.stopPropagation();
    // Play voice message
    const audio = new Audio("/soundeffects/konnichiwa.m4a");
    audio.play().catch((err) => console.log("Audio playback failed:", err));
  };

  const handleLetterClick = (e) => {
    if (e.target.closest("img")) return;
    // Create heart particles constrained to letter area
    const newHearts = Array.from({ length: 8 }).map((_, i) => ({
      id: Math.random(),
      x: Math.random() * 200 - 100, // Constrain to ±100px from center
      y: window.innerHeight - 200,
      delay: i * 50,
    }));
    setHearts([...hearts, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => newHearts.every((nf) => nf.id !== h.id)));
    }, 3000);
  };

  return (
    <section className="w-full max-w-xl mx-auto px-5 py-20">
      <div ref={ref} className="section-fade">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.3em] text-xs text-lavender-dark mb-3">
            for you
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-plum">
            A letter
          </h2>
        </div>

        <div
          className={`relative bg-white/95 border border-lavender-light shadow-[0_16px_50px_rgba(74,59,92,0.14)] rounded-md px-6 py-10 md:px-12 md:py-14 transition-all duration-700 text-xs ${
            unfolded ? "" : "cursor-pointer hover:shadow-[0_20px_60px_rgba(74,59,92,0.2)]"
          }`}
          onClick={(e) => {
            if (!unfolded) {
              setUnfolded(true);
            } else {
              handleLetterClick(e);
            }
          }}
          role={!unfolded ? "button" : undefined}
          tabIndex={!unfolded ? 0 : undefined}
          onKeyDown={(e) => {
            if (!unfolded && (e.key === "Enter" || e.key === " ")) setUnfolded(true);
          }}
          aria-label={!unfolded ? "Open the letter" : undefined}
        >
          {!unfolded ? (
            <div className="flex flex-col items-center gap-3 py-10">
              {/* <span className="text-3xl">✉️</span> */}
              <p className="font-display italic text-plum-light text-lg">
                Tap to read
              </p>
            </div>
          ) : (
            <div className="animate-pop-in">
              <p className="font-display italic text-xl text-plum mb-6">
                {letter.greeting}
              </p>
              <div className="flex flex-col gap-5">
                {letter.paragraphs.map((p, i) => (
                  <p key={i} className="font-body text-plum-light leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex flex-col items-start gap-4">
                <p className="font-display italic text-lg text-plum">
                  {letter.signoff},<br />
                  {site.senderName}
                </p>

                {/* Photo */}
                <div className="relative mt-4">
                  <img
                    src="/stickers/gf.png"
                    alt="Sender"
                    className="w-24 h-24 rounded-lg shadow-md cursor-pointer hover:scale-110 transition-transform"
                    onClick={handlePhotoClick}
                  />
                </div>
              </div>

              {/* Heart particles */}
              {hearts.map((heart) => (
                <div
                  key={heart.id}
                  className="fixed pointer-events-none text-2xl"
                  style={{
                    left: `calc(50% + ${heart.x}px)`,
                    top: `${heart.y}px`,
                    transform: "translateX(-50%)",
                    animation: `floatHearts 3s ease-out ${heart.delay}ms forwards`,
                  }}
                >
                  ❤️
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes floatHearts {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-300px) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
