// Conservative low-end device detection (SSR-safe).
// Used to gracefully degrade *motion only* on very weak hardware —
// layout, colors, content and behavior stay identical.

export function isLowEndDevice() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  try {
    const nav = navigator;
    // Explicit data-saver or very slow network.
    if (nav.connection?.saveData) return true;
    const effectiveType = nav.connection?.effectiveType;
    if (effectiveType === "slow-2g" || effectiveType === "2g") return true;
    // Very little RAM.
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) {
      return true;
    }
    // Very few CPU cores, or weak CPU + little RAM combined.
    if (typeof nav.hardwareConcurrency === "number") {
      if (nav.hardwareConcurrency <= 2) return true;
      if (
        nav.hardwareConcurrency <= 4 &&
        typeof nav.deviceMemory === "number" &&
        nav.deviceMemory <= 3
      ) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
