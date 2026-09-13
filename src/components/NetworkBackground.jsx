"use client";

import { useEffect, useRef } from "react";
import { isLowEndDevice } from "@/lib/devicePerf";

// Interactive "horizon network" canvas: drifting nodes that link up with
// lines, and connect to your cursor on hover — Clarion seeing the city's
// invisible networks. Pointer-transparent so it never blocks clicks.
//
// Perf notes: pauses when off-screen / tab hidden, caps DPR at 1.5,
// fewer nodes on small screens, squared-distance checks (no hypot),
// single batched stroke pass, no per-frame gradients.
// Very low-end devices get one static frame (identical at rest) with
// no animation loop and no mouse tracking — zero per-frame cost.
export default function NetworkBackground({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A static canvas preserves the artwork without a permanent animation
    // loop on low-end hardware or for people who request reduced motion.
    const staticMode = reduced || isLowEndDevice();

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const DPR = staticMode ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let nodes = [];
    const mouse = { x: -9999, y: -9999 };

    const LINK_DIST = 130;
    const LINK_DIST2 = LINK_DIST * LINK_DIST;
    const CURSOR_DIST = 180;
    const CURSOR_DIST2 = CURSOR_DIST * CURSOR_DIST;

    const seed = () => {
      // ~40% fewer nodes than before; mobile gets even fewer; low-end
      // static frame gets the fewest (cheaper paint, same look).
      const base = Math.floor((w * h) / 26000);
      const cap = staticMode ? 30 : w < 768 ? 45 : 70;
      const count = Math.max(20, Math.min(cap, base));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.6,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
    };

    let ticking = false;
    const onMove = (e) => {
      if (ticking || !visible) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
          mouse.x = -9999;
          mouse.y = -9999;
        } else {
          mouse.x = x;
          mouse.y = y;
        }
        ticking = false;
      });
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Batched node links: one strokeStyle, one path pass.
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(245,169,71,0.22)";
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx * dx + dy * dy < LINK_DIST2) {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
        }
      }
      ctx.stroke();

      // Cursor links (desktop only — no hover on touch) + nodes.
      const hasCursor = mouse.x > -9998 && !isCoarsePointer;
      if (hasCursor) {
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "rgba(245,169,71,0.5)";
        ctx.beginPath();
        for (const n of nodes) {
          const mdx = n.x - mouse.x;
          const mdy = n.y - mouse.y;
          if (mdx * mdx + mdy * mdy < CURSOR_DIST2) {
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
          }
        }
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(245,169,71,0.45)";
      ctx.beginPath();
      for (const n of nodes) {
        ctx.moveTo(n.x + n.r, n.y);
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      }
      ctx.fill();

      if (hasCursor) {
        ctx.fillStyle = "rgba(245,169,71,0.9)";
        ctx.beginPath();
        for (const n of nodes) {
          const mdx = n.x - mouse.x;
          const mdy = n.y - mouse.y;
          if (mdx * mdx + mdy * mdy < CURSOR_DIST2) {
            ctx.moveTo(n.x + n.r + 0.8, n.y);
            ctx.arc(n.x, n.y, n.r + 0.8, 0, Math.PI * 2);
          }
        }
        ctx.fill();
      }
    };

    const step = () => {
      if (!visible) {
        raf = 0;
        return;
      }
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (!raf && visible) raf = requestAnimationFrame(step);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };

    // Pause when scrolled out of view — the hero canvas is the biggest
    // per-frame cost on the page.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    resize();
    draw();
    if (staticMode) {
      // One static frame — redraw (debounced) on resize only.
      // No animation loop, no mouse tracking.
      let staticTimer = 0;
      const staticRo = new ResizeObserver(() => {
        clearTimeout(staticTimer);
        staticTimer = setTimeout(() => {
          resize();
          draw();
        }, 250);
      });
      const staticParent = canvas.parentElement;
      if (staticParent) staticRo.observe(staticParent);
      return () => {
        io.disconnect();
        staticRo.disconnect();
        clearTimeout(staticTimer);
      };
    }
    start();

    let roTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(roTimer);
      roTimer = setTimeout(resize, 200);
    });
    const parent = canvas.parentElement;
    if (parent) ro.observe(parent);
    if (!isCoarsePointer) window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      clearTimeout(roTimer);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none h-full w-full ${className}`}
    />
  );
}
