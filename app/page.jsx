"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { site, wall } from "@/lib/content";
import PasswordGate from "@/components/PasswordGate";

// Target date: September 7th, 2026 at 8:00 PM (20:00) local time
const TARGET_UNLOCK_TIME = new Date("2026-09-07T20:00:00").getTime();
export default function Home() {
  const router = useRouter();
  // step: "password" (gate first) -> "idle" (notification card) -> "opening"
  const [step, setStep] = useState("password");
  const [isLocked, setIsLocked] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const checkUnlock = () => {
  const now = Date.now();
  const diff = TARGET_UNLOCK_TIME - now;

  if (diff <= 0) {
    setIsLocked(false);
  } else {
    setIsLocked(true);
    // Convert total difference into total hours
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setTimeLeft({ hours, minutes, seconds });
  }
};

    checkUnlock();
    const timer = setInterval(checkUnlock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpen = () => {
    if (step !== "idle") return;
    setStep("opening");
    setTimeout(() => {
      router.push("/surprise");
    }, 950);
  };

  // Locked Screen: Shown before Sept 7, 8:00 PM
  if (isLocked) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center px-5 py-10 overflow-hidden bg-gradient-to-b from-lavender-light/30 to-peach/20">
        <div className="fixed top-6 left-0 right-0 text-center pointer-events-none">
          <p className="font-body text-plum-light/70 text-sm tracking-widest uppercase">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="w-full max-w-sm text-center">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 relative">
              <Image
                src="/stickers/hearts/heart-pixel.png"
                alt="Heart"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="font-display font-bold text-plum text-xl">Not Quite Yet!</h2>
            <p className="text-plum-light text-sm">
              This surprise unlocks tomorrow night (Sept 7 at 8:00 PM).
            </p>

            <div className="flex gap-3 mt-2 font-mono text-plum font-bold">
              <div className="bg-lavender-light/40 px-3 py-2 rounded-xl">
                <span className="text-lg">{timeLeft.hours}</span>
                <span className="block text-[10px] uppercase text-plum-light font-body font-normal">hrs</span>
              </div>
              <div className="bg-lavender-light/40 px-3 py-2 rounded-xl">
                <span className="text-lg">{timeLeft.minutes}</span>
                <span className="block text-[10px] uppercase text-plum-light font-body font-normal">mins</span>
              </div>
              <div className="bg-lavender-light/40 px-3 py-2 rounded-xl">
                <span className="text-lg">{timeLeft.seconds}</span>
                <span className="block text-[10px] uppercase text-plum-light font-body font-normal">secs</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Password Gate appears first upon unlocking
  if (step === "password") {
    return (
      <PasswordGate
        password={wall.password}
        storageKey="home-unlocked"
        title={`For ${site.boyfriendName}`}
        subtitle="Enter the password to continue"
        onUnlock={() => setStep("idle")}
      >
        <main className="min-h-[100dvh] flex items-center justify-center px-5">
          <p className="text-center text-plum-light text-sm">Opening…</p>
        </main>
      </PasswordGate>
    );
  }

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-5 py-10 overflow-hidden">
      <div className="fixed top-6 left-0 right-0 text-center pointer-events-none">
        <p className="font-body text-plum-light/70 text-sm tracking-widest uppercase">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {step === "idle" ? (
            <motion.button
              key="notification"
              onClick={handleOpen}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="group w-full text-left bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_40px_rgba(74,59,92,0.18)] border border-white/60 px-5 py-4 flex items-center gap-4 animate-float"
              aria-label="Open your new message"
            >
              <div className="shrink-0 w-11 h-11 rounded-2xl overflow-hidden relative shadow-inner">
                <Image
                  src="/photos/shane.jpg"
                  alt="Contact photo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-body font-semibold text-plum text-[15px]">
                    Messages
                  </p>
                  <span className="text-xs text-plum-light/60 shrink-0">now</span>
                </div>
                <p className="text-plum-light text-sm mt-0.5 truncate group-hover:whitespace-normal group-hover:line-clamp-none">
                  {site.notificationPreview}
                </p>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="opening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center gap-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 relative"
              >
                <Image
                  src="/stickers/hearts/heart-pixel.png"
                  alt="Heart sticker"
                  fill
                  className="object-contain"
                />
              </motion.div>
              <p className="font-display italic text-plum-light text-lg">
                opening…
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {step === "idle" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-plum-light/60 text-xs mt-6 tracking-wide"
          >
            tap to open
          </motion.p>
        )}
      </div>
    </main>
  );
}