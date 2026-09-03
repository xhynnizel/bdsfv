"use client";

import { useEffect } from "react";

function isEditable(el) {
  return el?.tagName === "INPUT" || el?.tagName === "TEXTAREA" || el?.isContentEditable;
}

export default function GlobalProtection() {
  useEffect(() => {
    const blockContextMenu = (e) => e.preventDefault();

    const blockKeys = (e) => {
      const key = e.key?.toLowerCase();
      const isDevtools =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
        (e.metaKey && e.altKey && ["i", "j", "c"].includes(key)) ||
        (e.ctrlKey && key === "u") ||
        (e.metaKey && key === "u") ||
        (e.ctrlKey && key === "s") ||
        (e.metaKey && key === "s");
      if (isDevtools) e.preventDefault();
    };

    const blockDrag = (e) => {
      if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO") e.preventDefault();
    };

    const blockCopy = (e) => {
      if (!isEditable(e.target)) e.preventDefault();
    };

    const blockSelectStart = (e) => {
      if (!isEditable(e.target)) e.preventDefault();
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeys);
    document.addEventListener("dragstart", blockDrag);
    document.addEventListener("copy", blockCopy);
    document.addEventListener("cut", blockCopy);
    document.addEventListener("selectstart", blockSelectStart);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("dragstart", blockDrag);
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("cut", blockCopy);
      document.removeEventListener("selectstart", blockSelectStart);
    };
  }, []);

  return null;
}
