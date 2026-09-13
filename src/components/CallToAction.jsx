"use client";

import { motion } from "framer-motion";
import heroConfig from "@/lib/heroConfig";

export default function CallToAction() {
  const openChat = () => {
    window.dispatchEvent(new CustomEvent("open-clarion-chat"));
  };

  return (
    <section className="relative w-full overflow-hidden bg-horizon-primary cv-auto">
      {/* Background glow effects */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-horizon-accent/5 blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-horizon-accent-secondary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-24 lg:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2.5 rounded-md border border-horizon-accent/40 bg-horizon-secondary/80 px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_15px_-3px_rgba(245,169,71,0.2)]">
            <span className="h-2 w-2 rotate-45 bg-horizon-accent shadow-[0_0_8px_#F5A947]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-horizon-accent">
              Need Someone in Your Corner?
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-horizon-text-light leading-tight">
            Don&apos;t face it alone.
            <br />
            <span className="text-horizon-accent">Clarion is here.</span>
          </h2>

          <p className="mx-auto max-w-lg text-lg text-horizon-text-muted">
            Tell {heroConfig.name} what you&apos;re going through. No forms, no waiting.
            Just a real conversation where someone truly listens.
          </p>

          <motion.button
            type="button"
            onClick={openChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 rounded-full bg-horizon-accent px-8 py-4 text-base font-bold text-horizon-primary shadow-glow-md transition-shadow duration-300 hover:shadow-glow-lg"
          >
            Talk to Clarion Now
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
