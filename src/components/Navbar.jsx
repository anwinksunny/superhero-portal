"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import SmoothImage from "./SmoothImage";
import heroConfig from "@/lib/heroConfig";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const openChat = () => {
    window.dispatchEvent(new CustomEvent("open-clarion-chat"));
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-horizon-primary/90 backdrop-blur-lg shadow-lg shadow-black/20 border-b border-horizon-secondary/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-glow-sm group-hover:scale-105 transition-transform duration-200">
            <SmoothImage
              src="/logo.png"
              alt="Clarion Logo"
              width={40}
              height={40}
              eager
              quality={75}
              sizes="40px"
              wrapperClassName="h-full w-full"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-xl font-bold text-horizon-text-light tracking-tight">
            {heroConfig.name}
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#origin" className="text-sm text-horizon-text-muted hover:text-horizon-accent transition-colors duration-200">
            Origin
          </a>
          <a href="#powers" className="text-sm text-horizon-text-muted hover:text-horizon-accent transition-colors duration-200">
            Powers
          </a>
          <a href="#mission" className="text-sm text-horizon-text-muted hover:text-horizon-accent transition-colors duration-200">
            Mission
          </a>
          <button
            type="button"
            onClick={openChat}
            className="inline-flex items-center gap-2 rounded-full bg-horizon-accent px-5 py-2 text-sm font-semibold text-horizon-primary shadow-glow-sm transition-all duration-200 hover:shadow-glow-md hover:scale-105"
          >
            Get Help
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={openChat}
          className="md:hidden inline-flex items-center gap-2 rounded-full bg-horizon-accent px-4 py-2 text-sm font-semibold text-horizon-primary"
        >
          Get Help
        </button>
      </div>
    </motion.nav>
  );
}
