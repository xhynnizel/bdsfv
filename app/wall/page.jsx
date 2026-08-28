"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { wall } from "@/lib/content";
import { isFirebaseConfigured } from "@/lib/firebase";
import { subscribeToWishes } from "@/lib/wishes";
import MusicToggle from "@/components/MusicToggle";
import PasswordGate from "@/components/PasswordGate";

// Fixed (not random-per-render) rotation + accent sequences so the
// scattered look is consistent and doesn't cause hydration mismatches.
const ROTATIONS = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];
const TAPE_COLORS = ["bg-rose/70", "bg-lavender/70", "bg-peach/70", "bg-gold/70"];

function WishCard({ wish, index }) {
  const rotate = ROTATIONS[index % ROTATIONS.length];
  const tape = TAPE_COLORS[index % TAPE_COLORS.length];
  const [isOpen, setIsOpen] = useState(false);

  if (!wish.photo) {
    return (
      <div
        className={`break-inside-avoid mb-3 bg-white rounded-sm shadow-[0_10px_28px_rgba(74,59,92,0.18)] ${rotate} hover:rotate-0 hover:scale-[1.02] transition-transform duration-300 relative cursor-pointer h-20 flex items-center justify-center overflow-hidden max-w-xs`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <span
          className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-sm ${tape} rotate-[-3deg] shadow-sm`}
          aria-hidden="true"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-b from-lavender-light to-lavender transition-all duration-300 flex flex-col items-center justify-center p-3 ${
            isOpen ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <p className="font-display text-plum text-center text-sm font-semibold">
            {wish.name}
          </p>
          <p className="text-plum-light text-xs mt-0.5">✉️</p>
        </div>

        <div
          className={`absolute inset-0 bg-white p-3 flex items-center justify-center transition-all duration-300 ${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <p className="font-body text-plum text-xs leading-relaxed break-words text-center">
            {wish.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`break-inside-avoid mb-5 rounded-sm shadow-[0_10px_28px_rgba(74,59,92,0.18)] ${rotate} hover:rotate-0 hover:scale-[1.02] transition-transform duration-300 relative max-w-xs`}
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span
        className={`absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-sm ${tape} rotate-[-3deg] shadow-sm z-10`}
        aria-hidden="true"
      />

      <div
        style={{
          transformStyle: "preserve-3d",
          transform: isOpen ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 300ms ease-in-out",
        }}
      >
        {/* Front: Photo */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="bg-white 
          
           rounded-sm"
        >
          {/* p-2 pb-3 */}
          <div className="w-full rounded-sm overflow-hidden bg-lavender-light mb-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={wish.photo} alt="" className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* Back: Message */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="bg-white p-2 pb-2 rounded-sm absolute inset-0 flex flex-col items-center justify-center"
        >
          <p className="font-body text-plum text-xs leading-relaxed break-words text-center mb-3">
            {wish.message}
          </p>
          <p className="font-display italic text-plum-light text-xs text-center">
            — {wish.name}
          </p>
        </div>
      </div>
    </div>
  );
}

function WallContent() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeToWishes(
      (data) => {
        setWishes(data);
        setLoading(false);
      },
      () => {
        setError(true);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [configured]);

  return (
    <main className="min-h-[100dvh] px-5 py-16 pb-28">
      <header className="text-center mb-12 max-w-md mx-auto">
        <p className="uppercase tracking-[0.3em] text-xs text-lavender-dark mb-3">
          a wall of love
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-plum mb-1.5">
          {wall.title}
        </h1>
        <p className="text-plum-light text-sm">{wall.subtitle}</p>
      </header>

      {!configured && (
        <p className="text-center text-plum-light text-sm max-w-sm mx-auto bg-white/70 rounded-xl px-5 py-4">
          The wall isn't connected yet — finish the Firebase setup in the
          README to start collecting photos and messages here.
        </p>
      )}

      {configured && loading && (
        <p className="text-center text-plum-light text-sm">Loading wishes…</p>
      )}

      {configured && error && (
        <p className="text-center text-rose text-sm">
          Couldn't load the wall right now — try refreshing.
        </p>
      )}

      {configured && !loading && !error && wishes.length === 0 && (
        <p className="text-center text-plum-light text-sm max-w-sm mx-auto">
          {wall.emptyMessage}
        </p>
      )}

      {configured && wishes.length > 0 && (
        <div className="max-w-6xl mx-auto columns-4 sm:columns-5 lg:columns-6 gap-2">
          {wishes.map((wish, i) => (
            <WishCard wish={wish} index={i} key={wish.id} />
          ))}
        </div>
      )}

      <div className="text-center mt-16">
        <Link
          href="/surprise"
          className="text-plum-light text-sm underline underline-offset-4 hover:text-plum"
        >
          ← back to your surprise
        </Link>
      </div>

      <MusicToggle src={wall.musicSrc} />
    </main>
  );
}

export default function WallPage() {
  return (
    <PasswordGate
      password={wall.password}
      storageKey="wall-unlocked"
      title={wall.title}
      subtitle="Enter the password to open your wall."
    >
      <WallContent />
    </PasswordGate>
  );
}
