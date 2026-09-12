import { motion } from "framer-motion";

const dotVariants = {
  hidden: { opacity: 0.4, y: 0 },
  visible: (i) => ({
    opacity: 1,
    y: [0, -4, 0],
    transition: {
      delay: i * 0.18,
      duration: 0.9,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
};

export default function TypingIndicator({ label = "Clarion is thinking…" }) {
  return (
    <div className="flex w-full justify-start" aria-live="polite">
      <div className="max-w-[80%] rounded-2xl rounded-bl-md border border-horizon-secondary bg-horizon-secondary/80 px-4 py-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-horizon-accent">
          Clarion
        </p>
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              custom={i}
              variants={dotVariants}
              initial="hidden"
              animate="visible"
              className="h-2 w-2 shrink-0 rounded-full bg-horizon-accent"
            />
          ))}
          <span className="text-xs text-horizon-text-muted">{label}</span>
        </div>
      </div>
    </div>
  );
}