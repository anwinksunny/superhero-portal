"use client";

import { motion } from "framer-motion";
import heroConfig from "@/lib/heroConfig";

export default function CallToAction() {
  return (
    <section className="relative w-full overflow-hidden bg-horizon-primary">
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
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-horizon-accent">
            Need Someone in Your Corner?
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-horizon-text-light leading-tight">
            Don't face it alone.
            <br />
            <span className="text-gradient-accent">Clarion is here.</span>
          </h2>

          <p className="mx-auto max-w-lg text-lg text-horizon-text-muted">
            Tell {heroConfig.name} what you're going through. No forms, no waiting.
            Just a real conversation where someone truly listens.
          </p>

          <motion.a
            href="#chat-widget"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-horizon-accent to-horizon-accent-secondary px-8 py-4 text-base font-bold text-horizon-primary shadow-glow-md transition-shadow duration-300 hover:shadow-glow-lg"
          >
            Talk to Clarion Now
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
