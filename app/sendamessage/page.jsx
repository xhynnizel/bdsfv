"use client";

import { useState } from "react";
import MessageStep from "@/components/photobooth/MessageStep";
import CaptureScreen from "@/components/photobooth/CaptureScreen";
import DecorateStep from "@/components/photobooth/DecorateStep";
import IntroStep from "@/components/photobooth/IntroStep";
import { composeStrip } from "@/lib/composePhoto";
import { compressImageDataUrl } from "@/lib/compressImage";
import { submitWish } from "@/lib/wishes";
import { isFirebaseConfigured } from "@/lib/firebase";
import { frameColors } from "@/lib/frameColors";
import { site } from "@/lib/content";

export default function PhotoboothPage() {
  const [step, setStep] = useState("intro"); // "intro" | "message" | "capture" | "decorate"

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const [layout, setLayout] = useState(null); // chosen inside CaptureScreen's Grid panel
  const [photos, setPhotos] = useState([]); // empty until a photo is attached
  const [frameSelection, setFrameSelection] = useState({
    type: "color",
    value: frameColors[0].value,
    id: frameColors[0].id,
  });
  const [placedStickers, setPlacedStickers] = useState([]);
  const [frameOverlay, setFrameOverlay] = useState(null);

  const [finalUrl, setFinalUrl] = useState(null);
  const [sendStatus, setSendStatus] = useState("idle"); // idle | sending | sent | error

  const configured = isFirebaseConfigured();
  const hasPhoto = layout && photos.length > 0 && photos.every(Boolean);

  const renderFinal = async () => {
    if (!hasPhoto) return null;
    const url = await composeStrip(photos, frameSelection, frameOverlay, placedStickers);
    setFinalUrl(url);
    return url;
  };

  const handleAttachPhoto = () => setStep("capture");

  const handleCaptureComplete = (chosenLayout, shots) => {
    setLayout(chosenLayout);
    setPhotos(shots);
    setFinalUrl(null);
    setStep("decorate");
  };

  const handleDownload = async () => {
    const url = await renderFinal();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "viktord's-birthday-photostrip.png";
    a.click();
  };

  const handleSend = async () => {
    if (sendStatus === "sending") return;
    setSendStatus("sending");
    try {
      let compressedPhoto = null;
      if (hasPhoto) {
        const url = await renderFinal();
        compressedPhoto = await compressImageDataUrl(url);
      }
      await submitWish({ name, message, photo: compressedPhoto });
      setSendStatus("sent");
      setStep("message");
    } catch {
      setSendStatus("error");
    }
  };

  return (
    <main className="min-h-[100dvh] px-5 py-14 flex flex-col items-center">
      <header className="text-center mb-10">
        <p className="uppercase tracking-[0.3em] text-xs text-lavender-dark mb-3">
          {site.boyfriendName}'s birthday
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-plum">
          {step === "intro"
            ? "Before you dive in"
            : step === "message"
            ? "Send a message"
            : step === "capture"
            ? "Photobooth"
            : "Decorate"}
        </h1>
      </header>

      {step === "intro" && <IntroStep onContinue={() => setStep("message")} />}

      {step === "message" && (
        <MessageStep
          name={name}
          message={message}
          onNameChange={setName}
          onMessageChange={setMessage}
          attachedPreviewUrl={hasPhoto ? finalUrl : null}
          onAttachPhoto={handleAttachPhoto}
          onSend={handleSend}
          sendStatus={sendStatus}
          configured={configured}
        />
      )}

      {step === "capture" && (
        <CaptureScreen
          onComplete={handleCaptureComplete}
          onBack={() => setStep("message")}
        />
      )}

      {step === "decorate" && layout && (
        <DecorateStep
          photos={photos}
          layout={layout}
          frameSelection={frameSelection}
          setFrameSelection={setFrameSelection}
          placedStickers={placedStickers}
          setPlacedStickers={setPlacedStickers}
          frameOverlay={frameOverlay}
          setFrameOverlay={setFrameOverlay}
          name={name}
          message={message}
          onNameChange={setName}
          onMessageChange={setMessage}
          onDownload={handleDownload}
          onSend={handleSend}
          sendStatus={sendStatus}
          configured={configured}
          onBack={() => setStep("capture")}
        />
      )}
    </main>
  );
}