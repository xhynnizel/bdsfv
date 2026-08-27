"use client";

export default function MessageModal({ name, message, onNameChange, onMessageChange, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-plum/40 backdrop-blur-sm flex items-center justify-center px-5"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_60px_rgba(74,59,92,0.3)] p-6 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <p className="font-display text-lg text-plum">Your message</p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-full flex items-center justify-center text-plum-light hover:bg-lavender-light/40"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="modal-name" className="text-xs text-plum-light font-body">
            Your name
          </label>
          <input
            id="modal-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            maxLength={60}
            placeholder="e.g. Sam"
            className="rounded-xl border border-lavender-light px-4 py-2.5 text-sm text-plum bg-cream/60 focus:outline-none focus:ring-2 focus:ring-lavender-dark"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="modal-message" className="text-xs text-plum-light font-body">
            Your message
          </label>
          <textarea
            id="modal-message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Happy birthday! Hope your day is..."
            className="rounded-xl border border-lavender-light px-4 py-2.5 text-sm text-plum bg-cream/60 resize-none focus:outline-none focus:ring-2 focus:ring-lavender-dark"
          />
        </div>

        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors self-center"
        >
          Done
        </button>
      </div>
    </div>
  );
}