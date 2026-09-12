"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import heroConfig from "@/lib/heroConfig";

export default function OriginStory() {
  return (
    <section id="origin" className="relative w-full overflow-hidden bg-horizon-secondary">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/origin-story-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-horizon-secondary via-horizon-secondary/60 to-horizon-secondary" />
      </div>

      {/* Accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[2px] bg-gradient-to-r from-transparent via-horizon-accent/60 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-horizon-accent/30 bg-horizon-accent/10 px-4 py-1.5 mb-6"
            >
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-horizon-accent">
                Origin Story
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-horizon-text-light leading-tight"
            >
              The Story Behind{" "}
              <span className="text-gradient-accent">Clarion</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="mt-8 relative pl-6 border-l-2 border-horizon-accent/30"
            >
              <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-horizon-accent" />
              <p className="text-lg sm:text-xl leading-relaxed text-horizon-text-light/90">
                {heroConfig.originStory}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="mt-8 text-base text-horizon-text-muted leading-relaxed"
            >
              Sounds hard to believe? Clarion's promise is simple: when the noise
              gets too loud, someone steps in. No cape, no show. Just a
              steady voice, and a clear path forward.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[3/4] max-w-sm mx-auto overflow-hidden rounded-2xl border border-horizon-accent/20 shadow-2xl shadow-black/30">
              <Image
                src="/clarion-hero.png"
                alt="Clarion, framed against the sky at dawn"
                fill
                sizes="(max-width: 1024px) 0vw, 30vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-horizon-primary/70 via-transparent to-transparent" />
              {/* Corner accent */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-horizon-accent/40 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-horizon-accent/40 rounded-bl-lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}