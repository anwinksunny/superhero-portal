"use client";

import { useState } from "react";
import Image from "next/image";

// Global cache so revisiting an already-downloaded image never flashes
// the skeleton again (e.g. paging back in the comic reader).
const loadedSrcs = new Set();

/**
 * SmoothImage — image is revealed ONLY after it is completely downloaded
 * and decoded. Until then a plain placeholder holds the layout (no CLS,
 * no half-painted / progressive-JPEG pop-in).
 *
 * - Keeps `opacity-0 blur-md scale-[1.02]` until `onLoad` fires.
 * - Fades to `opacity-100` over 700ms once complete.
 * - If the src was already loaded once this session, shows instantly.
 */
export default function SmoothImage({
  src,
  alt = "",
  className = "",
  wrapperClassName = "",
  skeletonClassName = "",
  eager = false, // true = fetch ASAP (above fold / current comic page)
  priority = false,
  quality,
  sizes,
  fill,
  width,
  height,
  fetchPriority,
  onLoad,
  ...rest
}) {
  const key = typeof src === "string" ? src : src?.src ?? "";
  const [prevKey, setPrevKey] = useState(key);
  const [loaded, setLoaded] = useState(() => loadedSrcs.has(key));

  // Reset when src changes (render-adjust pattern — no cascading effect).
  // Cached srcs reveal instantly; fresh srcs hold the skeleton until onLoad.
  if (prevKey !== key) {
    setPrevKey(key);
    setLoaded(loadedSrcs.has(key));
  }

  const handleLoad = (e) => {
    if (key) loadedSrcs.add(key);
    setLoaded(true);
    onLoad?.(e);
  };

  const isPriority = priority || eager;
  // Below-fold images must never compete with LCP.
  const resolvedFetchPriority =
    fetchPriority ?? (isPriority ? "high" : "low");

  return (
    <span
      className={`relative block overflow-hidden ${wrapperClassName}`}
      aria-hidden={alt === "" ? true : undefined}
    >
      {/* Placeholder holds layout while downloading */}
      {!loaded && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 animate-pulse bg-horizon-secondary ${skeletonClassName}`}
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        quality={quality}
        priority={isPriority}
        loading={isPriority ? undefined : "lazy"}
        decoding="async"
        fetchPriority={resolvedFetchPriority}
        onLoad={handleLoad}
        className={`${className} transition-opacity transition-[filter,transform] duration-700 ease-out ${
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-md scale-[1.02]"
        }`}
        {...rest}
      />
    </span>
  );
}
