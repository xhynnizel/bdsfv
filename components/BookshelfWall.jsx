"use client";

import { useState } from "react";

const BOOK_COLORS = [
  { spine: "from-rose via-rose to-plum", label: "Rose" },
  { spine: "from-lavender via-lavender to-plum", label: "Lavender" },
  { spine: "from-peach via-peach to-rose", label: "Peach" },
  { spine: "from-gold via-gold to-peach", label: "Gold" },
  { spine: "from-plum via-plum to-lavender", label: "Plum" },
  { spine: "from-lavender-dark via-plum to-rose", label: "Berry" },
];

function BookSpine({ wish, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const color = BOOK_COLORS[index % BOOK_COLORS.length];
  const rotation = ((index % 3) - 1) * 0.5;

  return (
    <div className="h-64 flex items-end">
      <div
        className="relative cursor-pointer group"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        style={{ perspective: "1000px" }}
      >
        {/* Book spine */}
        <div
          className={`
            relative w-12 h-56 rounded-sm shadow-lg
            bg-gradient-to-b ${color.spine}
            transition-all duration-300
            hover:w-14 hover:shadow-xl hover:-translate-y-1
            flex flex-col items-center justify-between p-2
            overflow-hidden
          `}
          style={{
            transform: `rotateX(${rotation}deg)`,
          }}
        >
          {/* Decorative top */}
          <div className="w-full h-1 bg-white/30 rounded-full"></div>

          {/* Book title - vertical text */}
          <div className="flex-1 flex items-center justify-center min-w-0">
            <p
              className="font-display text-white text-xs font-bold text-center leading-tight break-words"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
                maxWidth: "2.5rem",
                wordBreak: "break-word",
              }}
            >
              {wish.name}
            </p>
          </div>

          {/* Decorative bottom */}
          <div className="w-full h-1 bg-white/30 rounded-full"></div>
        </div>

        {/* Message popup - appears on hover */}
        {isOpen && (
          <div
            className="
              fixed z-50
              bg-white rounded-lg shadow-2xl p-4
              border-2 border-lavender-light
              max-w-xs
              pointer-events-none
              animate-in fade-in zoom-in-95 duration-200
            "
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Cute corner decoration */}
            <div className="absolute -top-3 -right-3 text-2xl">✨</div>

            {/* Message text */}
            <p className="font-body text-plum text-sm leading-relaxed mb-3">
              {wish.message}
            </p>

            {/* Sender name */}
            <p className="font-display italic text-plum-light text-xs text-right">
              — {wish.name}
            </p>

            {/* Photo if exists */}
            {wish.photo && (
              <div className="mt-3 rounded-md overflow-hidden bg-lavender-light max-h-32">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={wish.photo} alt="" className="w-full h-auto object-cover" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookshelfWall({ wishes }) {
  // Group wishes into shelves (6 books per shelf for nice layout)
  const booksPerShelf = 6;
  const shelves = [];
  for (let i = 0; i < wishes.length; i += booksPerShelf) {
    shelves.push(wishes.slice(i, i + booksPerShelf));
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Bookshelf background */}
      <div className="relative">
        {/* Wood texture background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100 to-amber-50 rounded-lg pointer-events-none" />

        {/* Shelves */}
        <div className="relative space-y-12 p-8">
          {shelves.map((shelf, shelfIndex) => (
            <div key={shelfIndex} className="relative">
              {/* Shelf line */}
              <div className="absolute -bottom-6 left-0 right-0 h-1 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-full shadow-md" />

              {/* Books on this shelf */}
              <div className="flex gap-3 justify-center px-4">
                {shelf.map((wish, bookIndex) => (
                  <BookSpine
                    key={wish.id}
                    wish={wish}
                    index={shelfIndex * booksPerShelf + bookIndex}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookshelf ends/supports */}
      <div className="flex justify-center gap-8 mt-12 px-4">
        <div className="w-8 h-32 bg-gradient-to-b from-amber-800 to-amber-900 rounded-sm shadow-lg" />
        <div className="flex-1" />
        <div className="w-8 h-32 bg-gradient-to-b from-amber-800 to-amber-900 rounded-sm shadow-lg" />
      </div>
    </div>
  );
}
