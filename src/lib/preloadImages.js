// All raster assets used across the page, so they can be silently
// pre-downloaded in the background after first paint. Next.js already
// preloads `priority` images (hero, logo) — this covers the rest,
// mainly the 12 origin-story panels.

const IMAGE_URLS = [
  "/logo.png",
  "/clarion-hero-cutout.png",
  "/clarion-hero.png",
  "/hero-bg-texture.png",
  "/origin-story-bg.png",
  ...Array.from({ length: 12 }, (_, i) => `/origin/${i + 1}.png`),
];

let preloaded = false;

export function preloadAllImages() {
  if (preloaded || typeof window === "undefined") return;
  preloaded = true;

  // Respect data-saver mode — don't burn mobile data uninvited.
  const conn = navigator.connection;
  if (conn?.saveData) return;

  const start = () => {
    for (const src of IMAGE_URLS) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
    }
  };

  // Wait until the browser is idle so preloading never slows first paint.
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(start, { timeout: 3000 });
  } else {
    setTimeout(start, 1500);
  }
}
