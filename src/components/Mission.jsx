"use client";

import { motion } from "framer-motion";
import heroConfig from "@/lib/heroConfig";

export default function Mission() {
  return (
    <section id="mission" className="relative w-full bg-horizon-secondary overflow-hidden cv-auto">
      {/* Top divider accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-horizon-accent/30" />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-horizon-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-24 lg:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2.5 rounded-md border border-horizon-accent/40 bg-horizon-primary/80 px-3.5 py-1.5 mb-8 backdrop-blur-md shadow-[0_0_15px_-3px_rgba(245,169,71,0.2)]">
            <span className="h-2 w-2 rotate-45 bg-horizon-accent shadow-[0_0_8px_#F5A947]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-horizon-accent">
              The Mission
            </span>
          </div>

          {/* Decorative quote mark */}
          <div className="text-7xl font-serif text-horizon-accent/20 leading-none mb-4" aria-hidden="true">
            &ldquo;
          </div>

          <blockquote className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-snug tracking-tight text-horizon-text-light">
            {heroConfig.mission}
          </blockquote>

          <div className="text-7xl font-serif text-horizon-accent/20 leading-none mt-4 rotate-180" aria-hidden="true">
            &ldquo;
          </div>

          <div className="mx-auto mt-8 w-24 h-1 rounded-full bg-horizon-accent" />
        </motion.div>
      </div>
    </section>
  );
}
