"use client";

import { useState } from "react";
import { deleteWish } from "@/lib/wishes";

function formatDate(createdAt) {
  if (createdAt && typeof createdAt.toDate === "function") {
    return createdAt.toDate().toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return "just now";
}

export default function AdminWishCard({ wish }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    setError(false);
    try {
      await deleteWish(wish.id);
    } catch {
      setError(true);
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white/90 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(74,59,92,0.12)] flex flex-col">
      {wish.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={wish.photo} alt="" className="w-full h-auto object-cover" />
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="font-body text-plum text-sm break-words">{wish.message}</p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="font-display italic text-plum-light text-sm">
            — {wish.name}
          </p>
          <p className="text-plum-light/60 text-xs">{formatDate(wish.createdAt)}</p>
        </div>

        {error && (
          <p className="text-rose text-xs">Couldn't delete that — try again.</p>
        )}

        {confirming ? (
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 px-3 py-2 rounded-full bg-rose text-white text-xs font-body font-semibold disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Yes, delete"}
            </button>
            <button
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="flex-1 px-3 py-2 rounded-full border border-lavender-light text-plum-light text-xs font-body font-semibold"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="mt-1 px-3 py-2 rounded-full border border-rose/60 text-rose text-xs font-body font-semibold hover:bg-rose/10 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
