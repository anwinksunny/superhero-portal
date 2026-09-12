"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import heroConfig from "@/lib/heroConfig";
import NetworkBackground from "./NetworkBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.15, duration: 0.7, ease: "easeOut" },
  }),
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
};

export default function Hero() {
  const openChat = () => {
    window.dispatchEvent(new CustomEvent("open-clarion-chat"));
  };

  return (
    <section className="relative min-h-screen flex items-center bg-horizon-radial overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Interactive connection network — links up around your cursor */}
        <NetworkBackground className="absolute inset-0 opacity-70" />        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-horizon-accent/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-horizon-accent-secondary/8 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-horizon-accent/5 blur-3xl"
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(rgba(245,169,71,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,169,71,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28 lg:py-0 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Text content */}
        <div className="flex flex-col gap-6 z-10">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 self-start rounded-md border border-horizon-accent/40 bg-horizon-secondary/80 px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_15px_-3px_rgba(245,169,71,0.2)]"
          >
            <span className="h-2 w-2 rotate-45 bg-horizon-accent shadow-[0_0_8px_#F5A947]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-horizon-accent">
              The Moment of Clarity
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95]"
          >
            <span className="text-horizon-text-light">{heroConfig.name}</span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-lg sm:text-xl text-gradient-accent font-semibold max-w-md"
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
            When emergency calls and hard choices get buried under the noise of the city,
            Clarion stands beside you, steady, calm, and patient,
            until the way forward becomes clear.
          </motion.p>

          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-wrap gap-4 mt-2"
          >
            <motion.button
              type="button"
              onClick={openChat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-horizon-accent to-horizon-accent-secondary px-7 py-3.5 text-sm font-bold text-horizon-primary shadow-glow-md transition-shadow duration-300 hover:shadow-glow-lg"
            >
              Talk to Clarion
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
            <a
              href="#origin"
              className="inline-flex items-center gap-2 rounded-full border border-horizon-text-muted/30 px-7 py-3.5 text-sm font-semibold text-horizon-text-light transition-all duration-200 hover:border-horizon-accent/50 hover:text-horizon-accent"
            >
              Learn More
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* Hero image */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative mx-auto lg:mx-0 w-full max-w-md lg:max-w-lg aspect-square"
        >
          <motion.div animate={floatAnimation} className="relative w-full h-full">
            <Image
              src="/clarion-hero-cutout.png"
              alt="Clarion standing on a rooftop at dawn, skyline glowing behind them"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain drop-shadow-[0_0_60px_rgba(245,169,71,0.15)]"
            />
          </motion.div>
          {/* Glow ring behind hero */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-gradient-to-br from-horizon-accent/10 to-horizon-accent-secondary/5 blur-3xl -z-10 scale-110"
          />
          {/* Accent ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
            className="absolute inset-[-10%] rounded-full border border-dashed border-horizon-accent/15 -z-10"
          />
        </motion.div>
      </div>

      {/* Background texture */}
      <Image
        src="/hero-bg-texture.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-10"
      />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-horizon-secondary to-transparent" />
    </section>
  );
}