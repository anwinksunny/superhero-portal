"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import heroConfig from "@/lib/heroConfig";

const powerIcons = [
  "/icons/icon-skyline-sight.png",
  "/icons/icon-horizonstep.png",
  "/icons/icon-clear-call.png",
];

const powerColors = [
  { from: "from-horizon-accent/20", glow: "group-hover:shadow-[0_0_40px_-8px_rgba(245,169,71,0.5)]" },
  { from: "from-horizon-accent-secondary/20", glow: "group-hover:shadow-[0_0_40px_-8px_rgba(242,112,92,0.5)]" },
  { from: "from-horizon-accent/20", glow: "group-hover:shadow-[0_0_40px_-8px_rgba(245,169,71,0.5)]" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.7, ease: "easeOut" },
  }),
};

export default function Powers() {
  return (
    <section id="powers" className="relative w-full bg-horizon-primary overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-horizon-accent/5 blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-horizon-accent-secondary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
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
            What Clarion{" "}
            <span className="text-gradient-accent">Brings</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mt-4 text-lg text-horizon-text-muted"
          >
            Three simple gifts for when everything feels unclear.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {heroConfig.powers.map((power, i) => (
            <motion.article
              key={power.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={cardVariants}
              className={`group relative rounded-2xl border border-horizon-secondary bg-gradient-to-b from-horizon-secondary/60 to-horizon-primary/40 p-8 transition-all duration-500 hover:-translate-y-1 ${powerColors[i].glow}`}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-horizon-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-horizon-accent/15 to-horizon-accent-secondary/10 ring-1 ring-horizon-text-muted/20 transition-all duration-300 group-hover:ring-horizon-accent/60 group-hover:shadow-glow-sm">
                <Image
                  src={powerIcons[i]}
                  alt={`${power.name} icon`}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <h3 className="mt-6 text-xl font-bold text-horizon-text-light group-hover:text-horizon-accent transition-colors duration-300">
                {power.name}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-horizon-text-muted">
                {power.description}
              </p>

              {/* Card number */}
              <div className="absolute top-6 right-6 text-5xl font-black text-horizon-text-light/5 select-none">
                {String(i + 1).padStart(2, "0")}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}