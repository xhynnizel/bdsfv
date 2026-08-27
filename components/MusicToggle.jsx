"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicToggle({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setUnavailable(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="none"
        onError={() => setUnavailable(true)}
      />
      <button
        onClick={toggle}
        disabled={unavailable}
        aria-label={playing ? "Pause music" : "Play music"}
        className="fixed bottom-5 right-5 z-30 w-14 h-14 rounded-full bg-white/90 backdrop-blur shadow-[0_10px_30px_rgba(74,59,92,0.25)] flex items-center justify-center text-xl border border-lavender-light hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        title={unavailable ? "Add a song file to enable music" : undefined}
      >
        {playing ? "⏸" : "🎵"}
      </button>
    </>
  );
}
