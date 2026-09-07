"use client";

import { useState } from "react";

const EMAIL_COLORS = [
  "from-rose to-rose/80",
  "from-lavender to-lavender/80",
  "from-peach to-peach/80",
  "from-gold to-gold/80",
  "from-plum to-plum/80",
  "from-lavender-light to-lavender/80",
];

function PixelEmailRow({ email, index, onSelect, isSelected }) {
  const color = EMAIL_COLORS[index % EMAIL_COLORS.length];
  const truncatedMessage =
    email.message.substring(0, 50) + (email.message.length > 50 ? "..." : "");

  return (
    <div
      onClick={() => onSelect(index)}
      className={`
        cursor-pointer border-b border-plum/10 transition-all p-2 sm:p-3 relative select-none
        ${isSelected ? "bg-lavender-light" : "hover:bg-lavender-light/30"}
      `}
      style={{
        backgroundColor: isSelected ? "#E4D8F3" : "white",
      }}
    >
      {/* Pixel checkbox */}
      <div
        className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-plum/40 flex items-center justify-center"
        style={{
          backgroundColor: isSelected ? "#C8B6E2" : "transparent",
        }}
      >
        {isSelected && (
          <span className="text-[10px] font-bold text-plum/60">✓</span>
        )}
      </div>

      {/* Email content */}
      <div className="ml-6 sm:ml-8 flex gap-2.5 sm:gap-3 items-center">
        {/* Avatar circle - pixelated */}
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded border-2 border-plum/50 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${color}`}
          style={{
            fontFamily: "monospace",
          }}
        >
          {email.name.charAt(0).toUpperCase()}
        </div>

        {/* Email details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-1">
            <span className="font-display text-xs sm:text-sm text-plum font-bold truncate">
              {email.name}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-plum-light line-clamp-1 mt-0.5">
            {truncatedMessage}
          </p>
        </div>

        {/* Star/read indicator */}
        <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs opacity-50">
          ⭐
        </div>
      </div>
    </div>
  );
}

function PixelEmailDetail({ email, onBack }) {
  const hasPhoto = !!email.photo;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm"
      onClick={onBack}
    >
      <div
        className="bg-white border-4 border-plum/50 shadow-2xl w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 0 0 2px #4A3B5C, 0 0 0 4px #E4D8F3",
        }}
      >
        {/* Pixel header bar */}
        <div className="bg-gradient-to-r from-lavender to-lavender-light border-b-4 border-plum/30 p-2.5 sm:p-3 flex items-center justify-between shrink-0">
          <h2 className="font-display text-plum font-bold text-xs sm:text-sm">
            📧 Message from {email.name}
          </h2>
          <button
            onClick={onBack}
            className="w-6 h-6 flex items-center justify-center font-bold text-plum hover:bg-white/50 border border-plum/30 text-xs"
            style={{
              fontFamily: "monospace",
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Email content - responsive layout (stacks on mobile, side-by-side on desktop) */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
          {/* Message Column */}
          <div
            className={`w-full ${
              hasPhoto ? "md:w-1/2 md:border-r-4" : "w-full"
            } border-plum/20 p-3 sm:p-5 flex flex-col gap-3`}
          >
            {/* Headers */}
            <div className="border-2 border-plum/20 p-2 bg-lavender-light/30">
              <p className="text-[10px] text-plum-light/70 font-mono">FROM:</p>
              <p className="font-display text-plum font-bold text-xs sm:text-sm">
                {email.name}
              </p>
            </div>

            <div className="border-2 border-plum/20 p-2 bg-peach/20">
              <p className="text-[10px] text-plum-light/70 font-mono">SUBJECT:</p>
              <p className="font-display text-plum font-bold text-xs sm:text-sm">
                Birthday Wish! 🎉
              </p>
            </div>

            {/* Message body */}
            <div
              className="border-2 border-plum/30 p-3 bg-white flex-1 min-h-[100px] overflow-y-auto"
              style={{
                fontFamily: "monospace",
                lineHeight: "1.5",
                wordBreak: "break-word",
              }}
            >
              <p className="text-plum text-xs whitespace-pre-wrap">{email.message}</p>
            </div>
          </div>

          {/* Photo Column (Appears under text on mobile, beside text on md+ screens) */}
          {hasPhoto && (
            <div className="w-full md:w-1/2 border-t-4 md:border-t-0 md:border-l-0 border-plum/20 p-3 sm:p-4 bg-lavender-light/10 flex flex-col items-center justify-center shrink-0 min-h-[220px] md:min-h-0">
              <div className="border-4 border-plum/30 h-full max-h-[300px] md:max-h-full w-full overflow-hidden flex items-center justify-center bg-white p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={email.photo}
                  alt="Attached wish photo"
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pixel bottom bar */}
        <div className="border-t-4 border-plum/30 bg-gradient-to-r from-lavender-light/50 to-peach/50 p-2.5 sm:p-3 flex gap-2 shrink-0">
          <button
            onClick={onBack}
            className="flex-1 py-2 border-2 sm:border-4 border-plum/50 bg-gradient-to-b from-lavender-light to-lavender text-plum font-bold text-xs hover:shadow-[inset_0_2px_0_rgba(0,0,0,0.1)] active:scale-[0.98] transition-transform"
          >
            ← BACK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PixelEmailWall({ wishes }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className="w-full h-full min-h-[350px] border-4 border-plum/40 bg-white rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Top Client Bar */}
      <div className="bg-lavender-dark/20 border-b-2 border-plum/20 px-3 py-1.5 flex items-center justify-between text-xs font-mono text-plum">
        <span>PixelMail v1.0</span>
        <span>{wishes.length} Messages</span>
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Collapses to small icons/hidden on mobile screens */}
        <div className="w-12 sm:w-36 md:w-40 bg-lavender-light/20 p-1.5 sm:p-2 space-y-1 flex flex-col border-r-2 border-plum/20 shrink-0">
          <div className="text-xs font-bold text-plum px-2 py-1.5 bg-lavender/30 border-2 border-lavender-dark flex items-center gap-1.5 justify-center sm:justify-start">
            <span>📥</span>
            <span className="hidden sm:inline">Inbox</span>
          </div>
          <div className="text-xs text-plum-light/70 px-2 py-1.5 hover:bg-lavender/20 flex items-center gap-1.5 justify-center sm:justify-start">
            <span>💫</span>
            <span className="hidden sm:inline">Sent</span>
          </div>
          <div className="text-xs text-plum-light/70 px-2 py-1.5 hover:bg-lavender/20 flex items-center gap-1.5 justify-center sm:justify-start">
            <span>⭐</span>
            <span className="hidden sm:inline">Starred</span>
          </div>
          <div className="text-xs text-plum-light/70 px-2 py-1.5 hover:bg-lavender/20 flex items-center gap-1.5 justify-center sm:justify-start">
            <span>🗑️</span>
            <span className="hidden sm:inline">Trash</span>
          </div>
        </div>

        {/* Email list */}
        <div className="flex-1 overflow-y-auto">
          {wishes.map((email, index) => (
            <PixelEmailRow
              key={email.id || index}
              email={email}
              index={index}
              onSelect={() => setSelectedIndex(index)}
              isSelected={selectedIndex === index}
            />
          ))}

          {wishes.length === 0 && (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full">
              <p className="text-plum-light text-xs sm:text-sm font-display">
                No messages found in your inbox!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Email detail modal */}
      {selectedIndex !== null && wishes[selectedIndex] && (
        <PixelEmailDetail
          email={wishes[selectedIndex]}
          onBack={() => setSelectedIndex(null)}
        />
      )}
    </div>
  );
}