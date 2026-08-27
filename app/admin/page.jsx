"use client";

import { useEffect, useState } from "react";
import PasswordGate from "@/components/PasswordGate";
import AdminWishCard from "@/components/AdminWishCard";
import { adminConfig } from "@/lib/content";
import { isFirebaseConfigured } from "@/lib/firebase";
import { subscribeToWishes } from "@/lib/wishes";

function AdminContent() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
    <main className="min-h-[100dvh] px-5 py-14">
      <header className="text-center mb-10">
        <p className="uppercase tracking-[0.3em] text-xs text-lavender-dark mb-3">
          private
        </p>
        <h1 className="font-display text-3xl text-plum mb-2">
          Wall moderation
        </h1>
        <p className="text-plum-light text-sm">
          {wishes.length} {wishes.length === 1 ? "message" : "messages"} on the wall
        </p>
      </header>

      {!configured && (
        <p className="text-center text-plum-light text-sm max-w-sm mx-auto bg-white/70 rounded-xl px-5 py-4">
          Firebase isn't set up yet — finish the README's Firebase steps to
          start collecting (and moderating) wishes.
        </p>
      )}

      {configured && loading && (
        <p className="text-center text-plum-light text-sm">Loading…</p>
      )}

      {configured && error && (
        <p className="text-center text-rose text-sm">
          Couldn't load the wall right now — try refreshing.
        </p>
      )}

      {configured && !loading && !error && wishes.length === 0 && (
        <p className="text-center text-plum-light text-sm">
          Nothing here yet.
        </p>
      )}

      {configured && wishes.length > 0 && (
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishes.map((wish) => (
            <AdminWishCard wish={wish} key={wish.id} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function AdminPage() {
  return (
    <PasswordGate
      password={adminConfig.password}
      storageKey="admin-unlocked"
      title="Wall moderation"
      subtitle="This page is just for you."
    >
      <AdminContent />
    </PasswordGate>
  );
}
