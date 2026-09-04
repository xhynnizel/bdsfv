"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { wall } from "@/lib/content";
import { isFirebaseConfigured } from "@/lib/firebase";
import { subscribeToWishes } from "@/lib/wishes";
import MusicToggle from "@/components/MusicToggle";
import PasswordGate from "@/components/PasswordGate";
import PixelEmailWall from "@/components/PixelEmailWall";

const ROTATIONS = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];
const SPRINGNOTE_IMAGES = [
  "/images/springnote-pink.png",
  "/images/springnote-purple.png",
  "/images/springnote-teal.png",
  "/images/springnote-yellow.png",
];
const STICKYNOTE_IMAGES = [
  "/images/stickynote-pink.png",
  "/images/stickynote-purple.png",
  "/images/stickynote-blue.png",
];
const LONGNOTE_IMAGES = [
  "/images/longnote-pink.png",
  "/images/longnote-blue.png",
  "/images/longnote-brown.png",
  "/images/longnote-white.png",
];

function WishModal({ wish, index, isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const SPRINGNOTE_MODAL = SPRINGNOTE_IMAGES[index % SPRINGNOTE_IMAGES.length];
  const STICKYNOTE_MODAL = STICKYNOTE_IMAGES[index % STICKYNOTE_IMAGES.length];
  const LONGNOTE_MODAL = LONGNOTE_IMAGES[index % LONGNOTE_IMAGES.length];
  const messageLength = wish.message.length + wish.name.length;
  const isLongNote = messageLength > 250;
  const noteImage = isLongNote ? LONGNOTE_MODAL : (wish.photo ? SPRINGNOTE_MODAL : STICKYNOTE_MODAL);
  const noteAspectRatio = isLongNote ? "4/5" : "3/4";
  // const noteWidth = isLongNote ? "500px" : "350px";
  const noteWidth = "500px";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: isClosing ? "fadeOut 0.3s ease-out" : "fadeIn 0.3s ease-out",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          animation: "zoomIn 0.4s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Note */}
        <div
          style={{
            backgroundImage: `url(${noteImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: noteWidth,
            aspectRatio: noteAspectRatio,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: "30px 20px",
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          <div className="text-center" style={{ maxWidth: "100%" }}>
            <p className="font-display text-plum text-sm font-bold mb-2">{wish.name}</p>
            <p className="font-body text-plum text-sm leading-relaxed break-words">
              {wish.message}
            </p>
          </div>
        </div>

        {/* Photo */}
        {wish.photo && (
          <div
            style={{
              width: "200px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wish.photo}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "32px",
            height: "32px",
            border: "none",
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.1)",
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "rgba(0,0,0,0.2)"}
          onMouseOut={(e) => e.target.style.backgroundColor = "rgba(0,0,0,0.1)"}
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes zoomIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

function WishCard({ wish, index }) {
  const rotate = ROTATIONS[index % ROTATIONS.length];
  const [isOpen, setIsOpen] = useState(false);
  const messageLength = wish.message.length + wish.name.length;

  const noteContainer = {
    className: `break-inside-avoid cursor-pointer transition-transform duration-300 ${rotate} hover:rotate-0 hover:scale-105 relative`,
    onMouseEnter: () => setIsOpen(false),
    onMouseLeave: () => setIsOpen(false),
  };

  const handleCardClick = () => {
    setIsOpen(true);
  };

  const handleBackdropClick = () => {
    setIsOpen(false);
  };

  // Longnotes for any message exceeding 250 characters
  if (messageLength > 250) {
    const longNote = LONGNOTE_IMAGES[index % LONGNOTE_IMAGES.length];
    return (
      <>
        <div
          className={noteContainer.className}
          style={{
            width: "400px",
            position: "relative",
            cursor: "pointer",
          }}
          onClick={handleCardClick}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        >
        <div
          style={{
            backgroundImage: `url(${longNote})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "100%",
            aspectRatio: "5/5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
            padding: "20px 15px",
            boxSizing: "border-box",
          }}
        >
          <div className="text-center pointer-events-none" style={{ maxWidth: "100%", paddingRight: "30px" }}>
            <p className="font-display text-plum text-xs font-bold mb-1">{wish.name}</p>
            <p className="font-body text-plum text-xs leading-tight break-words">
              {wish.message}
            </p>
          </div>
        </div>

        {/* Photo positioned on the right */}
        {wish.photo && (
          <div
            style={{
              position: "absolute", // Position relative to parent
              right: "-30px", // Distance from right edge (negative extends outside)
              top: "50%", // Center vertically
              width: "70px", // Photo width
              height: "auto", // Auto height maintains aspect ratio
              border: "3px solid white", // White border around photo
              borderRadius: "2px", // Slight corner roundness
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)", // Shadow for depth
              transform: "translateY(-50%) rotate(8deg)", // Center vertically and tilt right
              zIndex: 10, // Stacking order (on top of note)
              overflow: "hidden", // Keeps image within border
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wish.photo}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </div>

        <WishModal wish={wish} index={index} isOpen={isOpen} onClose={handleBackdropClick} />
      </>
    );
  }

  // Spring notes for messages with photos (<=250 chars)
  if (wish.photo) {
    const springNote = SPRINGNOTE_IMAGES[index % SPRINGNOTE_IMAGES.length];

    return (
      <>
        <div
          className={noteContainer.className}
          style={{
            perspective: "1000px",
            width: "350px",
            position: "relative",
            cursor: "pointer",
          }}
          onClick={handleCardClick}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        >
        <div
          style={{
            backgroundImage: `url(${springNote})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "100%",
            aspectRatio: "4/4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
            padding: "30px 20px",
            boxSizing: "border-box",
          }}
        >
          <div className="text-center pointer-events-none" style={{ maxWidth: "100%" }}>
            <p className="font-display text-plum text-xs font-bold mb-1">{wish.name}</p>
            <p className="font-body text-plum text-xs leading-tight break-words">
              {wish.message}
            </p>
          </div>
        </div>

        {/* Photo positioned on the right */}
        <div
          style={{
            position: "absolute", // Position relative to parent
            right: "0px", // Distance from right edge (negative extends outside)
            top: "20%", // Distance from top edge
            width: "70px", // Photo width
            height: "auto", // Auto height maintains aspect ratio
            border: "3px solid white", // White border around photo
            borderRadius: "2px", // Slight corner roundness
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)", // Shadow for depth
            transform: "rotate(10deg)", // Slight tilt angle
            zIndex: 10, // Stacking order (on top of note)
            overflow: "hidden", // Keeps image within border
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={wish.photo}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

        <WishModal wish={wish} index={index} isOpen={isOpen} onClose={handleBackdropClick} />
      </>
    );
  }

  // Sticky notes for messages without photos (<=250 chars)
  const stickyNote = STICKYNOTE_IMAGES[index % STICKYNOTE_IMAGES.length];
  return (
    <>
      <div
        className={noteContainer.className}
        style={{
          width: "350px",
          cursor: "pointer",
        }}
        onClick={handleCardClick}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
      >
      <div
        style={{
          backgroundImage: `url(${stickyNote})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100%",
          aspectRatio: "4/4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "30px 20px",
          boxSizing: "border-box",
        }}
      >
        <div className="text-center pointer-events-none" style={{ maxWidth: "100%" }}>
          <p className="font-display text-plum text-xs font-bold mb-1">{wish.name}</p>
          <p className="font-body text-plum text-xs leading-tight break-words">
            {wish.message}
          </p>
        </div>
        </div>
      </div>

      <WishModal wish={wish} index={index} isOpen={isOpen} onClose={handleBackdropClick} />
    </>
  );
}

function WallContent() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewMode, setViewMode] = useState("wall"); // "wall" or "email"

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
    <>
      {/* Inbox Mode */}
      {viewMode === "email" && (
        <main className="min-h-[100dvh] bg-gradient-to-b from-lavender-light/30 to-peach/20 flex flex-col">
          {/* Pixel top bar */}
          <div
            className="bg-gradient-to-r from-lavender to-lavender-light border-b-4 border-plum/40 px-4 py-3 flex items-center justify-between shadow-md flex-shrink-0"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex items-center gap-3">
              <h1 className="font-display font-bold text-plum text-lg">{wall.title} - Inbox</h1>
            </div>
            <button
              onClick={() => setViewMode("wall")}
              className="px-4 py-1 border-4 border-plum/50 bg-gradient-to-b from-lavender-light to-lavender text-plum font-bold text-xs hover:shadow-[inset_0_2px_0_rgba(0,0,0,0.1)]"
              style={{ cursor: "pointer" }}
            >
              ← CLASSIC VIEW
            </button>
          </div>

          {/* Main content area */}
          <div className="w-full flex-1 flex flex-col overflow-hidden">
            {!configured && (
              <p className="text-center text-plum-light text-sm max-w-sm mx-auto bg-white/70 rounded-xl px-5 py-4 border-2 border-plum/20">
                The wall isn't connected yet — finish the Firebase setup in the README to start collecting photos and messages here.
              </p>
            )}

            {configured && loading && (
              <p className="text-center text-plum-light text-sm font-mono">Loading inbox…</p>
            )}

            {configured && error && (
              <p className="text-center text-rose text-sm font-mono">
                Couldn't load the inbox right now — try refreshing.
              </p>
            )}

            {configured && !loading && !error && wishes.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-center text-plum-light text-sm font-mono max-w-sm">
                  {wall.emptyMessage}
                </p>
              </div>
            )}

            {configured && wishes.length > 0 && (
              <PixelEmailWall wishes={wishes} />
            )}
          </div>

          {/* Pixel bottom taskbar */}
          <div
            className="bg-gradient-to-r from-lavender-light/50 to-peach/50 border-t-4 border-plum/40 px-4 py-2 flex justify-between items-center text-xs text-plum-light font-mono flex-shrink-0"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 -2px 0 rgba(0,0,0,0.1)",
            }}
          >
            <span>📧 {wishes.length} message{wishes.length !== 1 ? "s" : ""}</span>
            <span>Ready</span>
          </div>
        </main>
      )}

      {/* Classic Wall Mode */}
      {viewMode === "wall" && (
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

          {/* Mode Toggle */}
          {configured && !loading && wishes.length > 0 && (
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setViewMode("email")}
                className={`px-6 py-2 rounded-full font-display text-sm transition-all ${
                  viewMode === "email"
                    ? "bg-lavender text-white shadow-md"
                    : "bg-white text-plum border border-lavender-light hover:bg-lavender-light/30"
                }`}
              >
                Inbox Mode
              </button>
            </div>
          )}

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
            <div className="mx-auto flex flex-wrap gap-0 justify-center px-5" style={{ maxWidth: "100%" }}>
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
        </main>
      )}

      {/* Music Toggle - Always rendered, never unmounted */}
      <MusicToggle src={wall.musicSrc} />
    </>
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
