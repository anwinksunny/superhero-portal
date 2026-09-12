"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import heroConfig from "@/lib/heroConfig";

const powerIcons = [
  "/icons/icon-skyline-sight.png",
  "/icons/icon-horizonstep.png",
  "/icons/icon-clear-call.png",
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Powers() {
  return (
    <section className="w-full bg-horizon-primary">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm font-semibold uppercase tracking-[0.25em] text-horizon-accent"
          >
            What Clarion Brings
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mt-4 text-xl sm:text-2xl text-horizon-text-light"
          >
            Three simple gifts for the moment the fog rolls in.
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
              className="group rounded-2xl border border-horizon-secondary bg-horizon-secondary/40 p-8 transition-shadow duration-300 hover:shadow-[0_0_40px_-8px_rgba(245,169,71,0.45)]"
            >
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-horizon-text-light/15 to-horizon-text-light/5 ring-1 ring-horizon-text-muted/30 transition-colors duration-300 group-hover:ring-horizon-accent/60">
                <Image
                  src={powerIcons[i]}
                  alt={`${power.name} icon`}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="mt-6 text-xl font-bold text-horizon-text-light">
                {power.name}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-horizon-text-muted">
                {power.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}