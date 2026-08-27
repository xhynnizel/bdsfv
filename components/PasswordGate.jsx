"use client";

import { useEffect, useState } from "react";

/**
 * Wraps a page's content behind a simple password prompt. This is a static,
 * client-side check — good enough to keep casual visitors out, but not a
 * real auth system (anyone determined enough could dig through devtools).
 * Fine for a private birthday page; don't rely on it for anything sensitive.
 */
export default function PasswordGate({ password, storageKey, title, subtitle, children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === "unlocked") {
        setUnlocked(true);
      }
    } catch {
      // sessionStorage unavailable (e.g. private browsing edge cases) — no big deal
    }
    setCheckedStorage(true);
  }, [storageKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === password) {
      setUnlocked(true);
      setError(false);
      try {
        sessionStorage.setItem(storageKey, "unlocked");
      } catch {
        // ignore
      }
    } else {
      setError(true);
    }
  };

  // avoid a flash of the password prompt before we've checked sessionStorage
  if (!checkedStorage) return null;

  if (unlocked) return children;

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs bg-white/90 rounded-3xl px-6 py-8 shadow-[0_16px_50px_rgba(74,59,92,0.2)] text-center flex flex-col gap-4"
      >
        <p className="text-3xl">🔒</p>
        <div>
          <p className="font-display text-xl text-plum">{title}</p>
          {subtitle && <p className="text-plum-light text-sm mt-1">{subtitle}</p>}
        </div>
        <input
          type="password"
          inputMode="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          autoFocus
          className="rounded-xl border border-lavender-light px-4 py-3 text-center text-plum bg-cream/60 focus:outline-none focus:ring-2 focus:ring-lavender-dark"
        />
        {error && <p className="text-rose text-xs">That's not it — try again.</p>}
        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors"
        >
          Unlock
        </button>
      </form>
    </main>
  );
}
