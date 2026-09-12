"use client";

import { motion } from "framer-motion";
import heroConfig from "@/lib/heroConfig";

export default function Mission() {
  return (
    <section id="mission" className="relative w-full bg-horizon-secondary overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-horizon-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto max-w-4xl px-6 py-24 lg:py-32 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-horizon-accent/30 bg-horizon-accent/10 px-4 py-1.5 mb-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-horizon-accent">
            The Mission
          </span>
        </div>

        {/* Decorative quote mark */}
        <div className="text-7xl font-serif text-horizon-accent/20 leading-none mb-4" aria-hidden="true">
          &ldquo;
        </div>

        <blockquote className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-snug tracking-tight text-horizon-text-light">
          {heroConfig.mission}
        </blockquote>

        <div className="text-7xl font-serif text-horizon-accent/20 leading-none mt-4 rotate-180" aria-hidden="true">
          &ldquo;
        </div>

        <div className="mx-auto mt-8 w-24 h-1 rounded-full bg-gradient-to-r from-horizon-accent to-horizon-accent-secondary" />
      </motion.div>
    </section>
  );
}