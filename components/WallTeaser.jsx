"use client";

import Link from "next/link";
import { useReveal } from "@/lib/useReveal";

export default function WallTeaser() {
  const ref = useReveal();

  return (
    <section className="w-full max-w-xl mx-auto px-5 pt-4 pb-4">
      <div
        ref={ref}
        className="section-fade bg-white/90 rounded-3xl px-6 py-10 text-center shadow-[0_16px_50px_rgba(74,59,92,0.14)] border border-lavender-light"
      >
        <h3 className="font-display text-2xl text-plum mb-2">
          One more surprise
        </h3>
        <p className="text-plum-light text-sm max-w-xs mx-auto mb-6">
          People who love you left you photos and messages. Turn on some
          music and go read them.
        </p>
        <Link
          href="/wall"
          className="inline-block px-6 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors"
        >
          Open your wall of wishes
        </Link>
      </div>
    </section>
  );
}
