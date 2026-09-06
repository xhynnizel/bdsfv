"use client";

import { site } from "@/lib/content";

export default function MessageStep({
  name,
  message,
  onNameChange,
  onMessageChange,
  attachedPreviewUrl,
  onAttachPhoto,
  onSend,
  sendStatus, // "idle" | "sending" | "sent" | "error"
  configured,
}) {
  const canSend = name.trim().length > 0 && message.trim().length > 0;
  const canAttachPhoto = name.trim().length > 0;

  if (sendStatus === "sent") {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/thanks-yall.png" alt="Thanks y'all" className="w-full max-w-xs h-auto" />
        {/* <p className="text-3xl">💌</p> */}
        <p className="font-display italic text-xl text-plum">Sent!</p>
        <p className="text-plum-light text-sm">
          {site.boyfriendName} will see your message on his wall.
        </p>
        <p>Again, thank you from the bottom of my heart for being part of this surprise for Viktor. Whether you are sending a photo from across town or writing a message from half a world away, your presence on this virtual wall means more to him—and to me—than words can fully express.</p>
        <p>Thank you for taking the time to share a piece of your heart with him today. </p>
        {/* Social Support Section */}
        <div className="mt-6 flex flex-col items-center gap-3 w-full">
          <p className="text-xs uppercase tracking-widest text-plum-light font-body font-semibold">
            Connect with Viktor
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2.5">
            <a
              href="https://instagram.com/viktordeee"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/80 hover:bg-white text-plum text-xs font-body font-medium rounded-full border border-plum/10 shadow-sm transition-all hover:-translate-y-0.5"
            >
              Instagram ↗
            </a>
            <a
              href="https://youtube.com/@viktordimitrenkoaudio?si=wCmzO5SgNsEoXKAZ"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/80 hover:bg-white text-plum text-xs font-body font-medium rounded-full border border-plum/10 shadow-sm transition-all hover:-translate-y-0.5"
            >
              Personal YouTube ↗
            </a>
            <a
              href="https://vk.ru/viktordeee"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/80 hover:bg-white text-plum text-xs font-body font-medium rounded-full border border-plum/10 shadow-sm transition-all hover:-translate-y-0.5"
            >
              VK ↗
            </a>
            <a
              href="https://dzen.ru/galereyamirovaudiobooks?share_to=link"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/80 hover:bg-white text-plum text-xs font-body font-medium rounded-full border border-plum/10 shadow-sm transition-all hover:-translate-y-0.5"
            >
              Галерея Миров Dzen ↗
            </a>
            <a
              href="https://youtube.com/@galereyamirovaudiobooks?si=IN_LSnKbRdcZSqeS"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/80 hover:bg-white text-plum text-xs font-body font-medium rounded-full border border-plum/10 shadow-sm transition-all hover:-translate-y-0.5"
            >
              Галерея Миров YouTube:  ↗
            </a>
            <a
              href="https://t.me/GalereyaMirovAudiobooks"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/80 hover:bg-white text-plum text-xs font-body font-medium rounded-full border border-plum/10 shadow-sm transition-all hover:-translate-y-0.5"
            >
              Галерея Миров Telegram ↗
            </a>
          </div>
        </div>
      </div>
      
    );
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      <div className="w-full bg-white/90 rounded-3xl shadow-[0_16px_50px_rgba(74,59,92,0.18)] p-5 flex flex-col gap-4">
        {attachedPreviewUrl && (
          <div className="w-full rounded-2xl overflow-hidden shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={attachedPreviewUrl} alt="" className="w-full h-auto block" />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs text-plum-light font-body">
            Your name <span className="text-rose">*</span>
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            maxLength={60}
            placeholder="e.g. Viktor"
            className="rounded-xl border border-lavender-light px-4 py-2.5 text-sm text-plum bg-cream/60 focus:outline-none focus:ring-2 focus:ring-lavender-dark"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-xs text-plum-light font-body">
            Your message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            maxLength={500}
            rows={5}
            placeholder="Happy birthday! Hope your day is..."
            className="rounded-xl border border-lavender-light px-4 py-2.5 text-sm text-plum bg-cream/60 resize-none focus:outline-none focus:ring-2 focus:ring-lavender-dark"
          />
        </div>
      </div>

      {!canAttachPhoto && (
        <p className="text-plum-light text-xs text-center bg-lavender/10 rounded-lg px-3 py-2 w-full">
          Fill in your name to attach a photo
        </p>
      )}

      {!configured && (
        <p className="text-rose text-xs text-center bg-rose/10 rounded-lg px-3 py-2 w-full">
          The memory wall isn't set up yet — ask whoever made this site to
          finish the Firebase setup in the README.
        </p>
      )}

      {sendStatus === "error" && (
        <p className="text-rose text-xs text-center">
          Something went wrong sending that — mind trying again?
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onAttachPhoto}
          disabled={!canAttachPhoto}
          className="px-6 py-3 rounded-full border-2 border-lavender-dark text-plum font-body font-semibold text-sm hover:bg-lavender-light/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {attachedPreviewUrl ? "Change photo" : "Attach a photo"}
        </button>
        <button
          onClick={onSend}
          disabled={!canSend || sendStatus === "sending" || !configured}
          className="px-6 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors disabled:opacity-50"
        >
          {sendStatus === "sending" ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
