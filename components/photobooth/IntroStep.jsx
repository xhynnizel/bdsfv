"use client";

import { useEffect, useRef, useState } from "react";
import { photoboothIntro, site } from "@/lib/content";

export default function IntroStep({ onContinue }) {
  const [unfolded, setUnfolded] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const videoRef = useRef(null);

  const canContinue = videoWatched || unfolded;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;

    const tryPlay = async (muted) => {
      try {
        video.muted = muted;
        await video.play();
        if (!cancelled) setVideoMuted(muted);
        return true;
      } catch {
        return false;
      }
    };

    (async () => {
      const startedWithSound = await tryPlay(false);
      if (startedWithSound || cancelled) return;
      await tryPlay(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleVideoMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setVideoMuted(video.muted);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-8">
      <div className="relative w-48 h-48 md:w-60 md:h-60 mx-auto rounded-full overflow-hidden shadow-[0_16px_50px_rgba(74,59,92,0.25)] bg-plum/5">
        <video
          ref={videoRef}
          src={photoboothIntro.videoSrc}
          autoPlay
          playsInline
          disablePictureInPicture
          controlsList="nodownload noremoteplayback"
          className="w-full h-full object-cover"
          onEnded={() => setVideoWatched(true)}
        />
        <button
          type="button"
          onClick={toggleVideoMute}
          aria-label={videoMuted ? "Unmute video" : "Mute video"}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-sm border border-lavender-light"
        >
          {videoMuted ? "🔇" : "🔊"}
        </button>
      </div>

      <div
        className={`relative w-full bg-white/95 border border-lavender-light shadow-[0_16px_50px_rgba(74,59,92,0.14)] rounded-md px-6 py-10 md:px-12 md:py-14 transition-all duration-700 ${
          unfolded ? "" : "cursor-pointer hover:shadow-[0_20px_60px_rgba(74,59,92,0.2)]"
        }`}
        onClick={() => !unfolded && setUnfolded(true)}
        role={!unfolded ? "button" : undefined}
        tabIndex={!unfolded ? 0 : undefined}
        onKeyDown={(e) => {
          if (!unfolded && (e.key === "Enter" || e.key === " ")) setUnfolded(true);
        }}
        aria-label={!unfolded ? "Open the letter" : undefined}
      >
        {!unfolded ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <span className="text-3xl">✉️</span>
            <p className="font-display italic text-plum-light text-lg">
              Tap to read
            </p>
          </div>
        ) : (
          <div className="animate-pop-in">
            <p className="font-display italic text-xl text-plum mb-6">
              {photoboothIntro.greeting}
            </p>
            <div className="flex flex-col gap-5">
              {photoboothIntro.paragraphs.map((p, i) => (
                <p key={i} className="font-body text-plum-light leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoboothIntro.senderPhoto}
                alt={site.senderName}
                className="w-12 h-12 "
                // className="w-12 h-12 rounded-full object-cover border-2 border-lavender-light shadow-sm shrink-0"
              />
              <p className="font-display italic text-lg text-plum">
                {photoboothIntro.signoff}
                {/* ,<br />
                {site.senderName} */}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="px-8 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
        {!canContinue && (
          <p className="text-plum-light text-xs text-center">
            Watch the video or tap the letter to continue
          </p>
        )}
      </div>
    </div>
  );
}
