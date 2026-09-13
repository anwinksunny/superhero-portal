"use client";

import { motion } from "framer-motion";
import SmoothImage from "./SmoothImage";
import heroConfig from "@/lib/heroConfig";

const powerIcons = [
  "/icons/icon-skyline-sight.png",
  "/icons/icon-horizonstep.png",
  "/icons/icon-clear-call.png",
];

const powerColors = [
  { glow: "hover:shadow-[0_0_40px_-8px_rgba(245,169,71,0.4)]" },
  { glow: "hover:shadow-[0_0_40px_-8px_rgba(242,112,92,0.4)]" },
  { glow: "hover:shadow-[0_0_40px_-8px_rgba(245,169,71,0.4)]" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Powers() {
  return (
    <section id="powers" className="relative w-full bg-horizon-primary overflow-hidden py-24 lg:py-32 cv-auto">
      {/* Background ambient accents */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-horizon-accent/5 blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-horizon-accent-secondary/5 blur-3xl" />
      </div>

      {/* Top divider accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-horizon-accent/30" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 rounded-md border border-horizon-accent/40 bg-horizon-secondary/80 px-3.5 py-1.5 mb-6 backdrop-blur-md shadow-[0_0_15px_-3px_rgba(245,169,71,0.2)]"
          >
            <span className="h-2 w-2 rotate-45 bg-horizon-accent shadow-[0_0_8px_#F5A947]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-horizon-accent">
              Powers & Abilities
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-horizon-text-light leading-tight"
          >
            What Clarion <span className="text-horizon-accent">Brings</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mt-4 text-base sm:text-lg text-horizon-text-muted leading-relaxed"
          >
            Three gifts born from the Horizon Network to cut through panic, distance, and noise.
          </motion.p>
        </div>

        {/* 2-Column Content: Hero Image Showcase + 3 Powers */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: clarion-hero.png Showcase Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-5 w-full flex justify-center"
          >
            <div className="relative aspect-[3/4] w-full max-w-md rounded-2xl border-2 border-horizon-accent/40 bg-horizon-secondary/80 overflow-hidden shadow-2xl group">
              <SmoothImage
                src="/clarion-hero.png"
                alt="Clarion standing on a rooftop at dawn"
                fill
                quality={75}
                sizes="(max-width: 1024px) 100vw, 40vw"
                wrapperClassName="h-full w-full"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />

              {/* Subtle tint overlay (kept light so the hero stays visible) */}
              <div className="absolute inset-0 bg-horizon-primary/10 pointer-events-none" />

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-horizon-accent/60" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-horizon-accent/60" />
            </div>
          </motion.div>

          {/* Right Column: 3 Powers Cards */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {heroConfig.powers.map((power, i) => (
              <motion.article
                key={power.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={cardVariants}
                className={`group relative rounded-2xl border border-horizon-secondary bg-horizon-secondary p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 ${powerColors[i].glow}`}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-horizon-accent/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-horizon-accent/15 ring-1 ring-horizon-text-muted/20 transition-all duration-300 group-hover:ring-horizon-accent/60 group-hover:shadow-glow-sm">
                    <SmoothImage
                      src={powerIcons[i]}
                      alt={`${power.name} icon`}
                      width={64}
                      height={64}
                      quality={70}
                      sizes="64px"
                      wrapperClassName="h-full w-full"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 pr-6">
                    <h3 className="text-xl font-bold text-horizon-text-light group-hover:text-horizon-accent transition-colors duration-300">
                      {power.name}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base leading-relaxed text-horizon-text-muted">
                      {power.description}
                    </p>
                  </div>

                  {/* Card Number */}
                  <div className="text-3xl sm:text-4xl font-black text-horizon-text-light/10 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}