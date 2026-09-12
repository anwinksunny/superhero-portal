"use client";

import { useEffect } from "react";
import { preloadAllImages } from "@/lib/preloadImages";

// Mounted once on the home page: silently pre-downloads every image
// after first paint so panels, hero art and logo appear instantly.
export default function ImagePreloader() {
  useEffect(() => {
    preloadAllImages();
  }, []);
  return null;
}
