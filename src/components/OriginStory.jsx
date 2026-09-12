"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import heroConfig from "@/lib/heroConfig";

export default function OriginStory() {
  return (
    <section className="relative w-full overflow-hidden bg-horizon-secondary">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/origin-story-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-horizon-secondary/70 via-horizon-secondary/40 to-horizon-secondary" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-sm font-semibold uppercase tracking-[0.25em] text-horizon-accent"
            >
              The Story Behind Clarion
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="mt-8 text-xl sm:text-2xl lg:text-[1.75rem] leading-relaxed lg:leading-snug text-horizon-text-light"
            >
              {heroConfig.originStory}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="mt-8 text-base text-horizon-text-muted"
            >
              Seems far-fetched? Clarion&apos;s promise is simple: when the noise
              climbs too high, someone steps in. No cape, no fanfare — just a
              steady voice, and a clear path home.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[3/4] max-w-sm mx-auto overflow-hidden rounded-2xl border border-horizon-primary/50 shadow-2xl shadow-black/30">
              <Image
                src="/clarion-hero.png"
                alt="Clarion, framed against the sky at dawn"
                fill
                sizes="(max-width: 1024px) 0vw, 30vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-horizon-primary/60 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}