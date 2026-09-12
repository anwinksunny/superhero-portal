"use client";

import { motion } from "framer-motion";
import heroConfig from "@/lib/heroConfig";

export default function Mission() {
  return (
    <section className="w-full bg-horizon-primary">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto max-w-4xl px-6 py-24 lg:py-32 text-center"
      >
        <div className="mx-auto h-px w-24 bg-horizon-accent" />
        <blockquote className="mt-10 text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-snug tracking-tight text-horizon-text-light">
          &ldquo;{heroConfig.mission}&rdquo;
        </blockquote>
        <div className="mx-auto mt-10 h-px w-24 bg-horizon-accent" />
      </motion.div>
    </section>
  );
}