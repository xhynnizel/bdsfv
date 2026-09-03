"use client";

import Image from "next/image";
import { timeline } from "@/lib/content";
import { useReveal } from "@/lib/useReveal";

function TimelineCard({ item, index }) {
  const ref = useReveal();
  const rotations = ["-rotate-3", "rotate-2", "-rotate-2", "rotate-3"];
  const rotate = rotations[index % rotations.length];

  return (
    <div
      ref={ref}
      className="section-fade flex flex-col items-center gap-4 md:flex-row md:even:flex-row-reverse md:gap-10"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div
        className={`relative bg-white p-3 pb-6 rounded-sm shadow-[0_12px_30px_rgba(74,59,92,0.15)] ${rotate} hover:rotate-0 transition-transform duration-300 w-full max-w-[280px]`}
      >
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-lavender-light">
          <Image
            src={item.image}
            alt={item.caption}
            fill
            sizes="280px"
            className="object-cover"
          />
        </div>
        <p className="font-display italic text-plum-light text-sm text-center mt-3">
          {item.date}
        </p>
      </div>

      <p className="font-body text-plum-light text-base md:text-lg max-w-xs text-center md:text-left">
        {item.caption}
      </p>
    </div>
  );
}

export default function PhotoTimeline() {
  const headerRef = useReveal();

  return (
    <section className="w-full max-w-2xl mx-auto px-5 py-20">
      <div ref={headerRef} className="section-fade text-center mb-14">
        <p className="uppercase tracking-[0.3em] text-xs text-lavender-dark mb-3">
          a little scrapbook
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-plum">
          You, through every season...
        </h2>
      </div>

      <div className="flex flex-col gap-16">
        {timeline.map((item, i) => (
          <TimelineCard item={item} index={i} key={item.date} />
        ))}
      </div>
    </section>
  );
}
