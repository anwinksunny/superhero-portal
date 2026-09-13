"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isLowEndDevice } from "@/lib/devicePerf";

// Do not put the chat in the landing-page path: Framer Motion, form
// validation and EmailJS only load when they are actually needed.
const loadChat = () => import("./ChatWidget");
const ChatWidget = dynamic(loadChat, { ssr: false });

export default function LazyChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("open-clarion-chat", openChat);
    return () => window.removeEventListener("open-clarion-chat", openChat);
  }, []);

  // Warm the chat chunk while the browser is idle so the first tap opens
  // instantly — without adding a single byte to the initial page load.
  // Skipped on data-saver / very slow connections and very weak hardware.
  useEffect(() => {
    if (isLowEndDevice()) return;
    const ric =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback
        : (cb) => setTimeout(cb, 1500);
    const cancel =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback
        : (id) => clearTimeout(id);
    const handle = ric(() => {
      loadChat().catch(() => {});
    });
    return () => cancel(handle);
  }, []);

  if (open) return <ChatWidget initialOpen onClose={() => setOpen(false)} />;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Talk to Clarion"
      className="fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-horizon-accent text-horizon-primary shadow-glow-md transition-transform hover:scale-105 active:scale-95"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M9 10h6M9 14h4" />
      </svg>
    </button>
  );
}
