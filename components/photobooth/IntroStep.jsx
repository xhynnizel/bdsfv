"use client";

import { useRef, useState } from "react";
import { photoboothIntro, site } from "@/lib/content";

export default function IntroStep({ onContinue }) {
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const videoRef = useRef(null);

  const startVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = false;
      await video.play();
      setVideoMuted(false);
      setVideoStarted(true);
    } catch {
      try {
        video.muted = true;
        await video.play();
        setVideoMuted(true);
        setVideoStarted(true);
      } catch {
        // Playback blocked entirely — leave the play button up so they can retry.
      }
    }
  };

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
          playsInline
          disablePictureInPicture
          controlsList="nodownload noremoteplayback"
          className="w-full h-full object-cover"
          onEnded={() => setVideoWatched(true)}
        />
        {!videoStarted ? (
          <button
            type="button"
            onClick={startVideo}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center bg-plum/30 hover:bg-plum/40 transition-colors text-cream text-4xl"
          >
            ▶️
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleVideoMute}
            aria-label={videoMuted ? "Unmute video" : "Mute video"}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-sm border border-lavender-light"
          >
            {videoMuted ? "🔇" : "🔊"}
          </button>
        )}
      </div>
      <p className="text-plum-light text-xs text-center">
        He sent me this video on Sept. 03 2026.<br/>
        <b>He has no idea about this website. So please keep this a secret.</b><br/>
        P.S. He did give me the permission to share this video. He just doesn't know where.
      </p>
      <div className="relative w-full bg-white/95 border border-lavender-light shadow-[0_16px_50px_rgba(74,59,92,0.14)] rounded-md px-6 py-10 md:px-12 md:py-14 transition-all duration-700">
        {!videoWatched ? (
          <div className="flex flex-col items-center gap-3 py-10">
            {/* <span className="text-3xl">✉️</span> */}
            <p className="font-display italic text-plum-light text-lg text-center">
              {videoStarted
                ? "Finish the video to open this letter"
                : "Play the video above to begin"}
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
          disabled={!videoWatched}
          className="px-8 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
        {/* {!videoWatched && (
          <p className="text-plum-light text-xs text-center">
            Watch the video to unlock your letter
          </p>
        )} */}
      </div>
    </div>
  );
}
