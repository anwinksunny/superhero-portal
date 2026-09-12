"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const COMIC_PANELS = [
  {
    id: 1,
    image: "/origin/1.png",
    isVertical: false,
    type: "caption-top-left",
    caption: "Three months. Same question. Still no answer.",
  },
  {
    id: 2,
    image: "/origin/2.png",
    isVertical: false,
    type: "thought-top-right",
    thought: "I can't think in here anymore.",
  },
  {
    id: 3,
    image: "/origin/3.png",
    isVertical: true, // Vertical 1024x1536
    type: "caption-bottom-left",
    caption: "So I went up. Because down had stopped making sense.",
  },
  {
    id: 4,
    image: "/origin/4.png",
    isVertical: false,
    type: "speech-top-center",
    speech: "I don't know which way is forward.",
  },
  {
    id: 5,
    image: "/origin/5.png",
    isVertical: false,
    type: "caption-top-center",
    caption: "The city didn't answer. Something else did.",
  },
  {
    id: 6,
    image: "/origin/6.png",
    isVertical: false,
    type: "sfx-and-caption",
    sfx: "hhhhhnnn...",
    caption: "Every street. Every rooftop. Every light. Suddenly, a pattern.",
  },
  {
    id: 7,
    image: "/origin/7.png",
    isVertical: false,
    type: "caption-bottom-right",
    caption: "The answer had been there the whole time. I just hadn't been still enough to see it.",
  },
  {
    id: 8,
    image: "/origin/8.png",
    isVertical: false,
    type: "speech-right-center",
    speech: "I can feel them.",
  },
  {
    id: 9,
    image: "/origin/9.png",
    isVertical: false,
    type: "caption-top-wide",
    caption: "Somewhere out there. Right now. Someone else was standing at their own edge, just like I had been.",
  },
  {
    id: 10,
    image: "/origin/10.png",
    isVertical: false,
    type: "caption-bottom-wide",
    caption: "I didn't choose this. It chose me, the moment I finally stood still.",
  },
  {
    id: 11,
    image: "/origin/11.png",
    isVertical: true, // Vertical 1024x1536
    type: "newspaper-bottom-right",
    caption: "I never picked the name. The city gave it to me. It stuck.",
  },
  {
    id: 12,
    image: "/origin/12.png",
    isVertical: false,
    type: "titlecard-splash",
    title: "CLARION",
    caption: "I am the clear call that cuts through confusion, so no one finds their way out alone.",
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

  const currentPage = COMIC_PAGES[currentPageIndex];
  const progressPercent = ((currentPageIndex + 1) / COMIC_PAGES.length) * 100;
  const currentPanel = COMIC_PANELS[currentPanelIndex];
  const mobileProgressPercent = ((currentPanelIndex + 1) / COMIC_PANELS.length) * 100;

  // Mobile panel: fit inside the fixed viewport-capped reader slot (see
  // below) so the whole section is visible without scrolling. Vertical
  // art fits by height, landscape by width — centered on a dark mat.
  // Overlays live inside the art box, so they always sit on the image.
  const renderMobilePanel = (p) => (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className={`relative ${
          p.isVertical
            ? "h-full max-w-full aspect-[2/3]"
            : "w-full max-h-full aspect-[3/2]"
        }`}
      >
        <Image
          src={p.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />

        {/* Inner comic panel border */}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/40 pointer-events-none" />

        {/* Clean Manhwa-style White Box with Black Text */}
        {renderManhwaOverlay(p)}
      </div>
    </div>
  );
  const renderPanelBox = (p) => (
    <div
      key={p.id}
      className={`relative rounded-xl border-4 border-black bg-[#061416] overflow-hidden shadow-2xl w-full ${
        p.isVertical ? "aspect-[2/3]" : "aspect-[3/2]"
      } lg:aspect-auto lg:h-[560px] lg:min-h-[560px]`}
    >
      <div className="relative w-full h-full">
        <Image
          src={p.image}
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover lg:object-contain"
        />

        {/* Inner comic panel border */}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/40 pointer-events-none" />

        {/* Clean Manhwa-style White Box with Black Text */}
        {renderManhwaOverlay(p)}
      </div>
    </div>
  );

  // Clean Manhwa-style White Box with Black Text (no "NARRATION", "THOUGHT", "SPEECH" labels)
  const renderManhwaOverlay = (p) => {
    switch (p.type) {
      case "caption-top-left":
        return (
          <div className="absolute top-3 left-3 sm:top-6 sm:left-6 max-w-[68%] sm:max-w-xs z-20">
            <div className="bg-white border-2 border-black p-2.5 sm:p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <p className="text-xs sm:text-sm font-black text-black leading-snug">
                &ldquo;{p.caption}&rdquo;
              </p>
            </div>
          </div>
        );

      case "thought-top-right":
        return (
          <div className="absolute top-3 right-3 sm:top-6 sm:right-6 max-w-[68%] sm:max-w-xs z-20 flex flex-col items-end">
            <div className="bg-white border-2 border-black px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <p className="text-xs sm:text-sm font-black italic text-black leading-snug">
                &ldquo;{p.thought}&rdquo;
              </p>
            </div>
            {/* Thought bubble trail dots */}
            <div className="flex flex-col items-center gap-1 mt-1 mr-6">
              <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-white border border-black mr-2 shadow-[1px_1px_0px_rgba(0,0,0,1)]" />
            </div>
          </div>
        );

      case "caption-bottom-left":
        return (
          <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 max-w-[68%] sm:max-w-xs z-20">
            <div className="bg-white border-2 border-black p-2.5 sm:p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <p className="text-xs sm:text-sm font-black text-black leading-snug">
                &ldquo;{p.caption}&rdquo;
              </p>
            </div>
          </div>
        );

      case "speech-top-center":
        return (
          <div className="absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 max-w-[68%] sm:max-w-xs z-20 flex flex-col items-center">
            <div className="bg-white border-2 border-black px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center">
              <p className="text-xs sm:text-sm font-black text-black leading-snug">
                &ldquo;{p.speech}&rdquo;
              </p>
            </div>
            {/* Pointer tail */}
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[10px] border-t-white -mt-[1px] filter drop-shadow-[0_2px_0_rgba(0,0,0,1)]" />
          </div>
        );

      case "caption-top-center":
        return (
          <div className="absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 max-w-[80%] sm:max-w-sm w-full z-20">
            <div className="bg-white border-2 border-black p-2.5 sm:p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center">
              <p className="text-xs sm:text-sm font-black text-black leading-snug">
                &ldquo;{p.caption}&rdquo;
              </p>
            </div>
          </div>
        );

      case "sfx-and-caption":
        return (
          <>
            {/* SFX near face */}
            <div className="absolute top-1/4 left-1/4 z-20">
              <div className="bg-white border-2 border-black px-3 py-1 -rotate-6 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                <span className="text-sm sm:text-lg font-black italic tracking-widest text-black font-mono">
                  {p.sfx}
                </span>
              </div>
            </div>
            {/* Caption bottom edge */}
            <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 max-w-[80%] sm:max-w-sm w-full z-20">
              <div className="bg-white border-2 border-black p-2.5 sm:p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center">
                <p className="text-xs sm:text-sm font-black text-black leading-snug">
                  &ldquo;{p.caption}&rdquo;
                </p>
              </div>
            </div>
          </>
        );

      case "caption-bottom-right":
        return (
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 max-w-[68%] sm:max-w-xs z-20">
            <div className="bg-white border-2 border-black p-2.5 sm:p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <p className="text-xs sm:text-sm font-black text-black leading-snug">
                &ldquo;{p.caption}&rdquo;
              </p>
            </div>
          </div>
        );

      case "speech-right-center":
        return (
          <div className="absolute top-1/3 right-3 sm:right-8 max-w-[68%] sm:max-w-xs z-20 flex flex-col items-start">
            <div className="bg-white border-2 border-black px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <p className="text-xs sm:text-sm font-black text-black leading-snug">
                &ldquo;{p.speech}&rdquo;
              </p>
            </div>
            {/* Tail pointing left */}
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[10px] border-r-white -ml-2 -mt-3 filter drop-shadow-[-2px_0_0_rgba(0,0,0,1)]" />
          </div>
        );

      case "caption-top-wide":
        return (
          <div className="absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 max-w-[85%] sm:max-w-md w-full z-20">
            <div className="bg-white border-2 border-black p-2.5 sm:p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center">
              <p className="text-xs sm:text-sm font-black text-black leading-snug">
                &ldquo;{p.caption}&rdquo;
              </p>
            </div>
          </div>
        );

      case "caption-bottom-wide":
        return (
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 max-w-[85%] sm:max-w-md w-full z-20">
            <div className="bg-white border-2 border-black p-2.5 sm:p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center">
              <p className="text-xs sm:text-sm font-black text-black leading-snug">
                &ldquo;{p.caption}&rdquo;
              </p>
            </div>
          </div>
        );

      case "newspaper-bottom-right":
        return (
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 max-w-[68%] sm:max-w-xs z-20">
            <div className="bg-white border-2 border-black p-2.5 sm:p-3.5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <p className="text-xs sm:text-sm font-black text-black leading-snug">
                &ldquo;{p.caption}&rdquo;
              </p>
            </div>
          </div>
        );

      case "titlecard-splash":
        return (
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 z-20">
            <div className="bg-white border-2 border-black p-4 sm:p-5 shadow-[5px_5px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl sm:text-4xl font-black text-black tracking-tight uppercase mb-1">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm font-black italic text-neutral-900 leading-snug">
                &ldquo;{p.caption}&rdquo;
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="origin" className="relative w-full bg-horizon-secondary py-12 lg:py-32 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-horizon-accent/5 blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-[400px] h-[400px] rounded-full bg-horizon-accent-secondary/5 blur-3xl" />
      </div>

      {/* Top divider accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-horizon-accent/40 to-transparent" />

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
            My Origin <span className="text-gradient-accent">Story</span>
          </motion.h2>
        </div>

        {/* 2-Panel Page Reader */}
        <div className="space-y-6">
          {/* Main Comic Frame — 2-panel spread on desktop */}
          <div className="hidden lg:block relative rounded-2xl border-4 border-black bg-horizon-primary shadow-[0_0_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Top Progress Bar */}
            <div className="w-full bg-neutral-900 h-1.5">
              <motion.div
                className="bg-gradient-to-r from-horizon-accent to-horizon-accent-secondary h-full"
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
            <div className="p-4 sm:p-6 bg-[#040e10]">
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-horizon-accent to-horizon-accent-secondary text-horizon-primary border-2 border-black px-6 py-2.5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform disabled:opacity-40 disabled:pointer-events-none"
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
                className="bg-gradient-to-r from-horizon-accent to-horizon-accent-secondary h-full"
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

            {/* Swipeable panel — viewport-capped slot so the whole
                section fits on screen; art shrinks to fit */}
            <div
              className="p-3 bg-[#040e10] touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div className="relative h-[48dvh] w-full overflow-hidden rounded-xl border-4 border-black bg-[#061416] shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPanel.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    {renderMobilePanel(currentPanel)}
                  </motion.div>
                </AnimatePresence>
              </div>
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
                className="inline-flex items-center justify-center bg-gradient-to-r from-horizon-accent to-horizon-accent-secondary text-horizon-primary border-2 border-black w-10 h-10 text-lg font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-transform disabled:opacity-40"
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