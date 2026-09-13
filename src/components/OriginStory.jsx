"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmoothImage from "./SmoothImage";

const COMIC_PANELS = [
  {
    id: 1,
    image: "/origin/1.png",
    isVertical: false,
    text: "I’d been stuck on the same hard decision for months, and nothing I tried helped me figure it out. The walls of my room felt like they were closing in on me.",
  },
  {
    id: 2,
    image: "/origin/2.png",
    isVertical: false,
    text: "I couldn’t think straight anymore, not in that small space. I needed air, and I needed to get away from it all, even just for a moment.",
  },
  {
    id: 3,
    image: "/origin/3.png",
    isVertical: true, // Vertical 1024x1536
    text: "So I climbed up to the roof of my building, hoping the height might help me see things differently. The city stretched out below me, lit up and endless.",
  },
  {
    id: 4,
    image: "/origin/4.png",
    isVertical: false,
    text: "Standing alone at the edge, I finally said what I’d been afraid to admit. “I don’t know which way is forward,” I whispered into the dark.",
  },
  {
    id: 5,
    image: "/origin/5.png",
    isVertical: false,
    text: "The city didn’t answer me back. But as the first light of dawn broke over the skyline, something strange began to happen.",
  },
  {
    id: 6,
    image: "/origin/6.png",
    isVertical: false,
    text: "As the sunlight touched the skyline, something inside me shifted, like a new sense had switched on that I never knew I had. Every street and rooftop below connected into a single pattern, and for the first time in months, my confusion completely disappeared.",
  },
  {
    id: 7,
    image: "/origin/7.png",
    isVertical: false,
    text: "The answer had been there the whole time, hidden in plain sight. I just hadn’t been calm enough, or still enough, to see it before now.",
  },
  {
    id: 8,
    image: "/origin/8.png",
    isVertical: false,
    text: "Something inside me had changed for good. I could feel it — somewhere out there, other people were caught in that exact same fog I’d just escaped.",
  },
  {
    id: 9,
    image: "/origin/9.png",
    isVertical: false,
    text: "Right at that moment, across the city, other people were standing at their own edge, stuck in their own version of my problem. I could sense their confusion like a signal calling out to me.",
  },
  {
    id: 10,
    image: "/origin/10.png",
    isVertical: false,
    text: "I never asked for this power, and I definitely didn’t expect it. But I understood, standing there in the sunrise, that this was who I was now.",
  },
  {
    id: 11,
    image: "/origin/11.png",
    isVertical: true, // Vertical 1024x1536
    text: "News of a mysterious figure who showed up whenever someone felt hopeless began to spread through the city. People started calling me “the clarion voice in the noise.”",
  },
  {
    id: 12,
    image: "/origin/12.png",
    isVertical: false,
    text: "I never chose the name myself, but it stuck anyway. That’s how Clarion was born — not to fight monsters or villains, but to help people find their way through the noise, so no one has to feel lost alone.",
  },
];

const COMIC_PAGES = [
  {
    pageId: 1,
    panels: [COMIC_PANELS[0], COMIC_PANELS[1]],
  },
  {
    pageId: 2,
    panels: [COMIC_PANELS[2], COMIC_PANELS[3]], // Panel 3 is Vertical
  },
  {
    pageId: 3,
    panels: [COMIC_PANELS[4], COMIC_PANELS[5]],
  },
  {
    pageId: 4,
    panels: [COMIC_PANELS[6], COMIC_PANELS[7]],
  },
  {
    pageId: 5,
    panels: [COMIC_PANELS[8], COMIC_PANELS[9]],
  },
  {
    pageId: 6,
    panels: [COMIC_PANELS[10], COMIC_PANELS[11]], // Panel 11 is Vertical
  },
];

export default function OriginStory() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  // Mobile shows one panel at a time (12 panels); desktop shows 2-panel pages.
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const touchStartX = useRef(null);
  const sectionRef = useRef(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === COMIC_PAGES.length - 1;
  const isFirstPanel = currentPanelIndex === 0;
  const isLastPanel = currentPanelIndex === COMIC_PANELS.length - 1;

  const nextPage = useCallback(() => {
    setCurrentPageIndex((prev) => Math.min(prev + 1, COMIC_PAGES.length - 1));
  }, []);

  const prevPage = useCallback(() => {
    setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const nextPanel = useCallback(() => {
    setCurrentPanelIndex((prev) => Math.min(prev + 1, COMIC_PANELS.length - 1));
  }, []);

  const prevPanel = useCallback(() => {
    setCurrentPanelIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation (desktop) — never hijack typing in inputs.
  useEffect(() => {
    const handleKeyDown = (e) => {
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowRight") {
        nextPage();
      } else if (e.key === "ArrowLeft") {
        prevPage();
      } else if (e.key === " ") {
        e.preventDefault();
        nextPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPage, prevPage]);

  // Do not prefetch comic art while this below-the-fold reader is unseen.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: "400px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Swipe navigation for the mobile single-panel reader.
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx < -40) nextPanel();
    else if (dx > 40) prevPanel();
  };

  // Warm the browser cache for adjacent pages/panels (low priority) so
  // turning a page feels instant — without blocking the current image.
  // Current page stays `eager` (revealed only when fully decoded via
  // SmoothImage); neighbours prefetch silently in the background.
  useEffect(() => {
    if (!isNearViewport || typeof window === "undefined") return;
    const conn = navigator.connection;
    if (conn?.saveData) return;
    const queue = [];
    const nextPage = COMIC_PAGES[currentPageIndex + 1];
    const prevPage = COMIC_PAGES[currentPageIndex - 1];
    if (nextPage) queue.push(...nextPage.panels.map((p) => p.image));
    if (prevPage) queue.push(...prevPage.panels.map((p) => p.image));
    const nextPanelImg = COMIC_PANELS[currentPanelIndex + 1]?.image;
    const prevPanelImg = COMIC_PANELS[currentPanelIndex - 1]?.image;
    if (nextPanelImg) queue.push(nextPanelImg);
    if (prevPanelImg) queue.push(prevPanelImg);
    if (queue.length === 0) return;
    const t = setTimeout(() => {
      for (const src of [...new Set(queue)]) {
        const img = new window.Image();
        img.decoding = "async";
        img.loading = "lazy";
        img.fetchPriority = "low";
        img.src = src;
      }
    }, 800);
    return () => clearTimeout(t);
  }, [currentPageIndex, currentPanelIndex, isNearViewport]);

  const currentPage = COMIC_PAGES[currentPageIndex];
  const progressPercent = ((currentPageIndex + 1) / COMIC_PAGES.length) * 100;
  const currentPanel = COMIC_PANELS[currentPanelIndex];
  const mobileProgressPercent = ((currentPanelIndex + 1) / COMIC_PANELS.length) * 100;

  // Mobile panel: art fits inside a fixed-height slot, story caption sits
  // under the image in a comic-style box.
  const renderMobilePanel = (p) => (
    <div>
      <div className="flex h-[38dvh] w-full items-center justify-center overflow-hidden rounded-xl border-4 border-black comic-panel-mat shadow-2xl">
        <div
          className={`relative ${
            p.isVertical
              ? "h-full max-w-full aspect-[2/3]"
              : "w-full max-h-full aspect-[3/2]"
          }`}
        >
          <SmoothImage
            src={p.image}
            alt={`Origin story panel ${p.id}`}
            fill
            quality={75}
            sizes="100vw"
            wrapperClassName="h-full w-full"
            className="object-contain"
          />

          {/* Inner comic panel border */}
          <div className="absolute inset-0 ring-1 ring-inset ring-black/40 pointer-events-none" />
        </div>
      </div>
      {renderCaption(p, true)}
    </div>
  );
  const renderPanelBox = (p) => (
    <div key={p.id} className="w-full">
      <div
        className={`relative rounded-xl border-4 border-black comic-panel-mat overflow-hidden shadow-2xl w-full ${
          p.isVertical ? "aspect-[2/3]" : "aspect-[3/2]"
        } lg:aspect-auto lg:h-[560px] lg:min-h-[560px]`}
      >
        <div className="relative w-full h-full">
          <SmoothImage
            src={p.image}
            alt={`Origin story panel ${p.id}`}
            fill
            quality={75}
            sizes="(max-width: 1024px) 100vw, 50vw"
            wrapperClassName="h-full w-full"
            className="object-cover lg:object-contain"
          />

          {/* Inner comic panel border */}
          <div className="absolute inset-0 ring-1 ring-inset ring-black/40 pointer-events-none" />
        </div>
      </div>
      {renderCaption(p, false)}
    </div>
  );

  // Story caption under each panel — comic-style white box, black text.
  const renderCaption = (p, isMobile) => (
    <div
      className={`rounded-xl border-2 border-black bg-white p-3.5 sm:p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] ${
        isMobile ? "mt-3 min-h-[8rem]" : "mt-3"
      }`}
    >
      <p className="text-xs sm:text-sm font-bold leading-relaxed text-black">
        {p.text}
      </p>
    </div>
  );

  return (
    <section ref={sectionRef} id="origin" className="relative w-full bg-horizon-secondary py-12 lg:py-32 overflow-hidden cv-auto">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-horizon-accent/5 blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-[400px] h-[400px] rounded-full bg-horizon-accent-secondary/5 blur-3xl" />
      </div>

      {/* Top divider accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-horizon-accent/40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="pb-5 lg:pb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-horizon-text-light tracking-tight"
          >
            My Origin <span className="text-horizon-accent">Story</span>
          </motion.h2>
        </div>

        {/* 2-Panel Page Reader */}
        <div className="space-y-6">
          {/* Main Comic Frame — 2-panel spread on desktop */}
          <div className="hidden lg:block relative rounded-2xl border-4 border-black bg-horizon-primary shadow-[0_0_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Top Progress Bar */}
            <div className="w-full bg-neutral-900 h-1.5">
              <motion.div
                className="bg-horizon-accent h-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Page Header Bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#0a1f22] border-b-2 border-black text-xs font-bold">
              <span className="bg-white text-black px-2.5 py-1 text-xs font-black uppercase tracking-wider shadow-sm">
                PAGE {currentPage.pageId}
              </span>

              <span className="text-horizon-accent font-mono text-xs font-bold">
                PAGE {currentPage.pageId} OF {COMIC_PAGES.length}
              </span>
            </div>

            {/* 2 Panels Viewport */}
            <div className="p-4 sm:p-6 comic-texture-bg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage.pageId}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.3 }}
                  className="grid lg:grid-cols-2 gap-4 sm:gap-6 items-stretch"
                >
                  {currentPage.panels.map((p) => renderPanelBox(p))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Page Reader Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 bg-[#0a1f22] border-t-2 border-black">
              <button
                type="button"
                onClick={prevPage}
                disabled={isFirstPage}
                aria-label="Previous page"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black border-2 border-black px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform disabled:opacity-40 disabled:pointer-events-none"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Previous Page
              </button>

              {/* 6 Page Selector Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {COMIC_PAGES.map((pg, idx) => (
                  <button
                    key={pg.pageId}
                    type="button"
                    onClick={() => setCurrentPageIndex(idx)}
                    className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                      currentPageIndex === idx
                        ? "bg-horizon-accent text-horizon-primary shadow-[2px_2px_0px_rgba(0,0,0,1)] scale-105"
                        : "bg-white text-black hover:bg-neutral-100"
                    }`}
                  >
                    Page {pg.pageId}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={nextPage}
                disabled={isLastPage}
                aria-label="Next page"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-horizon-accent text-horizon-primary border-2 border-black px-6 py-2.5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform disabled:opacity-40 disabled:pointer-events-none"
              >
                Next Page
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile reader — one full panel at a time, swipeable */}
          <div className="lg:hidden relative rounded-2xl border-4 border-black bg-horizon-primary shadow-[0_0_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Top Progress Bar */}
            <div className="w-full bg-neutral-900 h-1.5">
              <motion.div
                className="bg-horizon-accent h-full"
                initial={false}
                animate={{ width: `${mobileProgressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Panel counter bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a1f22] border-b-2 border-black text-xs font-bold">
              <span className="bg-white text-black px-2.5 py-1 text-xs font-black uppercase tracking-wider shadow-sm">
                Panel {currentPanel.id}
              </span>
              <span className="text-horizon-accent font-mono text-xs font-bold">
                {currentPanelIndex + 1} OF {COMIC_PANELS.length}
              </span>
            </div>

            {/* Swipeable panel — art on top, story caption under it */}
            <div
              className="p-3 comic-texture-bg touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPanel.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25 }}
                >
                  {renderMobilePanel(currentPanel)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile controls: arrows + dots */}
            <div className="flex items-center justify-between gap-3 px-4 py-2 bg-[#0a1f22] border-t-2 border-black">
              <button
                type="button"
                onClick={prevPanel}
                disabled={isFirstPanel}
                aria-label="Previous panel"
                className="inline-flex items-center justify-center bg-white text-black border-2 border-black w-10 h-10 text-lg font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-transform disabled:opacity-40"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div className="flex items-center justify-center gap-1.5 flex-wrap" role="tablist" aria-label="Panels">
                {COMIC_PANELS.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    aria-selected={currentPanelIndex === idx}
                    aria-label={`Go to panel ${p.id}`}
                    onClick={() => setCurrentPanelIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentPanelIndex === idx
                        ? "w-6 bg-horizon-accent"
                        : "w-2 bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextPanel}
                disabled={isLastPanel}
                aria-label="Next panel"
                className="inline-flex items-center justify-center bg-horizon-accent text-horizon-primary border-2 border-black w-10 h-10 text-lg font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-transform disabled:opacity-40"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          <p className="hidden lg:block text-center text-xs text-horizon-text-muted">
            Tip: Use <kbd className="px-1.5 py-0.5 rounded bg-black text-white border border-white/20 font-mono">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-black text-white border border-white/20 font-mono">→</kbd> arrow keys to turn the pages.
          </p>
          <p className="lg:hidden text-center text-xs text-horizon-text-muted">
            Swipe left or right, or tap the arrows to read the story.
          </p>
        </div>
      </div>
    </section>
  );
}
