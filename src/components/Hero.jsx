"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import heroConfig from "@/lib/heroConfig";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-horizon-radial relative overflow-hidden">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:py-0 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* text */}
        <div className="flex flex-col gap-6 z-10">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-sm font-semibold tracking-[0.25em] uppercase text-horizon-accent"
          >
            The Moment of Clarity
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] text-horizon-text-light"
          >
            {heroConfig.name}
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-lg sm:text-xl text-horizon-accent max-w-md"
          >
            {heroConfig.tagline}
          </motion.p>

          <motion.p
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-base text-horizon-text-muted max-w-md leading-relaxed"
          >
            When you&apos;re stuck between a hard choice and the fear of getting it
            wrong, Clarion stands beside you — steady, clear, and unhurried —
            until the path ahead becomes obvious.
          </motion.p>

          <motion.a
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            href="#chat-widget"
            className="self-start inline-flex items-center gap-2 rounded-full bg-horizon-accent px-7 py-3 text-sm font-semibold text-horizon-primary shadow-lg shadow-horizon-accent/20 transition-colors duration-200 hover:bg-horizon-accent-secondary hover:shadow-horizon-accent-secondary/20"
          >
            Talk to Clarion
            <span aria-hidden="true" className="text-lg leading-none">
              &rarr;
            </span>
          </motion.a>
        </div>

        {/* image */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative mx-auto lg:mx-0 w-full max-w-md lg:max-w-lg aspect-square"
        >
          <Image
            src="/clarion-hero-cutout.png"
            alt="Clarion standing on a rooftop at dawn, skyline glowing behind them"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain drop-shadow-[0_0_40px_rgba(245,169,71,0.12)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-horizon-secondary/50 blur-3xl -z-10"
          />
        </motion.div>
      </div>

      <Image
        src="/hero-bg-texture.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-15"
      />
    </section>
  );
}