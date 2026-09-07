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
  const truncatedMessage = email.message.substring(0, 50) + (email.message.length > 50 ? "..." : "");
  const isUnread = false; // Could add read/unread state if needed

  return (
    <div
      onClick={() => onSelect(index)}
      className={`
        cursor-pointer border-b border-plum/10 transition-all
        ${isSelected ? "bg-lavender-light" : "hover:bg-lavender-light/30"}
      `}
      style={{
        padding: "8px",
        backgroundColor: isSelected ? "#E4D8F3" : "white",
        borderStyle: "solid",
        position: "relative",
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
          <span className="text-xs font-bold text-plum/60">✓</span>
        )}
      </div>

      {/* Email content */}
      <div className="ml-8 flex gap-3 items-start">
        {/* Avatar circle - pixelated */}
        <div
          className={`w-8 h-8 rounded border-2 border-plum/50 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${color}`}
          style={{
            fontFamily: "monospace",
            backgroundColor: `hsl(${(index * 60) % 360}, 70%, 60%)`,
          }}
        >
          {email.name.charAt(0).toUpperCase()}
        </div>

        {/* Email details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-sm text-plum font-bold">{email.name}</span>
            {/* <span className="text-xs text-plum-light/60 flex-shrink-0">now</span> */}
          </div>
          <p className="text-xs text-plum-light line-clamp-1 mt-0.5">{truncatedMessage}</p>
        </div>

        {/* Star/read indicator - pixel */}
        <div
          className="w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs"
          style={{
            fontSize: "10px",
            opacity: 0.5,
        }}
        >
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
      onClick={onBack}
    >
      <div
        className="bg-white border-4 border-plum/50 shadow-2xl w-full h-[90vh] max-w-none relative"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 0 0 2px #4A3B5C, 0 0 0 4px #E4D8F3",
        }}
      >
        {/* Pixel header bar */}
        <div className="bg-gradient-to-r from-lavender to-lavender-light border-b-4 border-plum/30 p-3 flex items-center justify-between">
          <h2 className="font-display text-plum font-bold text-sm">📧 Email</h2>
          <button
            onClick={onBack}
            className="w-6 h-6 flex items-center justify-center font-bold text-plum hover:bg-white/50 border border-plum/30"
            style={{
              fontFamily: "monospace",
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Email content - two column layout */}
        <div className={`flex ${hasPhoto ? "h-96" : "min-h-80"}`}>
          {/* Left column - Message */}
          <div className={`${hasPhoto ? "w-1/2" : "w-full"} border-r-4 border-plum/20 p-6 flex flex-col justify-between overflow-auto`}>
            {/* From */}
            <div>
              <div className="border-2 border-plum/20 p-2 bg-lavender-light/30 mb-4">
                <p className="text-xs text-plum-light/70 font-mono mb-1">FROM:</p>
                <p className="font-display text-plum font-bold text-sm">{email.name}</p>
              </div>

              {/* Subject */}
              <div className="border-2 border-plum/20 p-2 bg-peach/20 mb-4">
                <p className="text-xs text-plum-light/70 font-mono mb-1">SUBJECT:</p>
                <p className="font-display text-plum font-bold text-sm">Birthday Message</p>
              </div>

              {/* Message body */}
              <div
                className="border-2 border-plum/30 p-3 bg-white flex-1 overflow-auto"
                style={{
                  fontFamily: "monospace",
                  lineHeight: "1.5",
                  wordBreak: "break-word",
                }}
              >
                <p className="text-plum text-xs whitespace-pre-wrap">{email.message}</p>
              </div>
            </div>
          </div>

          {/* Right column - Photo (if exists) */}
          {hasPhoto && (
            <div className="w-1/2 border-l-4 border-plum/20 p-4 bg-lavender-light/10 flex flex-col items-center justify-center overflow-hidden">
              <div className="border-4 border-plum/30 h-full w-full overflow-auto flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={email.photo} alt="" className="max-w-full max-h-full w-auto h-auto object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Pixel bottom bar with buttons */}
        <div className="border-t-4 border-plum/30 bg-gradient-to-r from-lavender-light/50 to-peach/50 p-3 flex gap-2">
          <button
            onClick={onBack}
            className="flex-1 py-2 border-4 border-plum/50 bg-gradient-to-b from-lavender-light to-lavender text-plum font-bold text-xs hover:shadow-[inset_0_2px_0_rgba(0,0,0,0.1)]"
            style={{
              cursor: "pointer",
            }}
          >
            ← BACK
          </button>
          <button
            className="flex-1 py-2 border-4 border-plum/50 bg-gradient-to-b from-peach to-peach text-plum font-bold text-xs hover:shadow-[inset_0_2px_0_rgba(0,0,0,0.1)]"
            style={{
              cursor: "pointer",
            }}
          >
            ♥ REPLY
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PixelEmailWall({ wishes }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className="w-full h-full">
      {/* Pixel email client container */}
      <div
        className="bg-white h-full"
        style={{
          boxShadow: "none",
        }}
      >
        {/* Pixel sidebar + list container */}
        <div className="flex h-full">
          {/* Mini sidebar */}
          <div className="w-24 bg-lavender-light/20 p-2 space-y-1 flex flex-col border-r-2 border-plum/20">
            <div className="text-xs font-bold text-plum px-2 py-1 bg-lavender/30 border-2 border-lavender-dark text-center">
              📥 Inbox
            </div>
            <div className="text-xs text-plum-light/70 px-2 py-1 hover:bg-lavender/20">
              💫 Sent
            </div>
            <div className="text-xs text-plum-light/70 px-2 py-1 hover:bg-lavender/20">
              ⭐ Starred
            </div>
            <div className="text-xs text-plum-light/70 px-2 py-1 hover:bg-lavender/20">
              🗑️ Trash
            </div>
          </div>

          {/* Email list */}
          <div className="flex-1 overflow-y-auto">
            <div>
              {wishes.map((email, index) => (
                <PixelEmailRow
                  key={email.id}
                  email={email}
                  index={index}
                  onSelect={() => setSelectedIndex(index)}
                  isSelected={selectedIndex === index}
                />
              ))}
            </div>

            {wishes.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-plum-light text-sm font-display">No messages yet!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email detail modal */}
      {selectedIndex !== null && (
        <PixelEmailDetail
          email={wishes[selectedIndex]}
          onBack={() => setSelectedIndex(null)}
        />
      )}
    </div>
  );
}
