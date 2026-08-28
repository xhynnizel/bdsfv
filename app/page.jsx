"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site, wall } from "@/lib/content";
import PasswordGate from "@/components/PasswordGate";

export default function Home() {
  const router = useRouter();
  // step: "idle" (notification card) -> "opening" (brief animation) -> "password" (gate)
  const [step, setStep] = useState("idle");

  const handleOpen = () => {
    if (step !== "idle") return;
    setStep("opening");
    setTimeout(() => {
      setStep("password");
    }, 950);
  };

  if (step === "password") {
    return (
      <PasswordGate
        password={wall.password}
        storageKey="home-unlocked"
        title={`For ${site.boyfriendName} 💌`}
        subtitle="Enter the password to continue"
        onUnlock={() => router.push("/surprise")}
      >
        {/* PasswordGate renders this once unlocked —  router.push already fired via onUnlock */}
        <main className="min-h-[100dvh] flex items-center justify-center px-5">
          <p className="text-center text-plum-light text-sm">Opening…</p>
        </main>
      </PasswordGate>
    );
  }

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-5 py-10 overflow-hidden">
      {/* ambient time / status bar, purely decorative — sells the "phone lock screen" bit */}
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
              className="group w-full text-left bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_40px_rgba(74,59,92,0.18)] border border-white/60 px-5 py-4 flex items-start gap-4 animate-float"
              aria-label="Open your new message"
            >
              <div className="shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-lavender to-peach flex items-center justify-center text-xl">
                💌
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
                className="w-16 h-16 rounded-full bg-gradient-to-br from-lavender to-peach flex items-center justify-center text-2xl shadow-lg"
              >
                💌
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
