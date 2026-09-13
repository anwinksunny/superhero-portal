"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Do not even request the chat chunk until somebody opens it. This keeps
// Framer Motion, form validation and EmailJS out of the landing-page path.
const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

export default function LazyChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("open-clarion-chat", openChat);
    return () => window.removeEventListener("open-clarion-chat", openChat);
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
