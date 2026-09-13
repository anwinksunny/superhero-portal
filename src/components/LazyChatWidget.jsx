"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isLowEndDevice } from "@/lib/devicePerf";

// Do not put the chat in the landing-page path: Framer Motion, form
// validation and EmailJS only load when they are actually needed.
const loadChat = () => import("./ChatWidget");
const ChatWidget = dynamic(loadChat, { ssr: false, loading: () => null });

// Clarion opens the conversation the moment someone arrives — the hero
// paints first, then the widget appears with a short cinematic beat.
const AUTO_OPEN_DELAY_MS = 1800;
// On touch devices a stray swipe or tap is too easy for a timer to beat, so
// Clarion is given a second chance shortly after load.
const TOUCH_RETRY_DELAY_MS = 4000;

export default function LazyChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("open-clarion-chat", openChat);
    return () => window.removeEventListener("open-clarion-chat", openChat);
  }, []);

  // Auto-greet on every visit, including plain refreshes: after the hero has
  // painted, the chat opens on its own so the superhero speaks first.
  // Suppressed only by interactions that show real intent — a deliberate
  // click/tap (any button or link), typing, or an already-open chat.
  useEffect(() => {
    if (isLowEndDevice()) return; // keep weak devices perfectly quiet

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const events = isTouch ? ["pointerdown", "keydown"] : ["keydown"];

    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      if (window.__clarionChatOpened) return;
      // Someone already acted (nav "Get Help", hero CTA...) — do not steal
      // focus from what they chose to do.
      if (document.activeElement && document.activeElement !== document.body) return;
      window.__clarionChatOpened = true;
      setOpen(true);
    }, AUTO_OPEN_DELAY_MS);

    const cancelTimer = () => {
      cancelled = true;
      clearTimeout(timer);
    };

    // A click/tap or a keypress before the timer means the visitor already
    // chose an action; plain scrolling (wheel/touch-drag) never suppresses
    // the greeting.
    events.forEach((ev) =>
      window.addEventListener(ev, cancelTimer, { once: true, passive: true })
    );

    // Touch-only second chance: swipes were ignored above, so if the first
    // window passes quietly the greeting still arrives.
    let retryTimer = 0;
    if (isTouch) {
      retryTimer = setTimeout(() => {
        if (cancelled || window.__clarionChatOpened) return;
        if (document.activeElement && document.activeElement !== document.body) return;
        window.__clarionChatOpened = true;
        setOpen(true);
      }, TOUCH_RETRY_DELAY_MS);
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (retryTimer) clearTimeout(retryTimer);
      events.forEach((ev) => window.removeEventListener(ev, cancelTimer));
    };
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

  const requestOpen = () => {
    window.__clarionChatOpened = true;
    setOpen(true);
  };

  const requestClose = () => {
    // Deliberately no persistence here: closing the chat only closes it for
    // this visit. A refresh greets again.
    setOpen(false);
  };

  if (open) return <ChatWidget initialOpen onClose={requestClose} />;

  return (
    <button
      type="button"
      onClick={requestOpen}
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
