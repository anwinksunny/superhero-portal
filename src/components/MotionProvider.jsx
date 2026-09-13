"use client";

import { MotionConfig } from "framer-motion";
import { useMemo, useEffect } from "react";
import { isLowEndDevice } from "@/lib/devicePerf";

// Respects the OS "reduce motion" setting only — zero change for
// everyone else, calmer animations for users who asked for them.
export default function MotionProvider({ children }) {
  // Device capabilities cannot change mid-session; compute once per
  // component instance instead of on every render.
  const lowEnd = useMemo(() => isLowEndDevice(), []);

  useEffect(() => {
    document.documentElement.dataset.lowEnd = String(lowEnd);
  }, [lowEnd]);

  return <MotionConfig reducedMotion={lowEnd ? "always" : "user"}>{children}</MotionConfig>;
}
