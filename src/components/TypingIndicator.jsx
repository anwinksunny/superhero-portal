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

export default function TypingIndicator({ label = "Clarion is typing" }) {
  return (
    <div className="flex w-full justify-start">
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-horizon-primary/40 bg-horizon-secondary px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            custom={i}
            variants={dotVariants}
            initial="hidden"
            animate="visible"
            className="h-2 w-2 rounded-full bg-horizon-accent"
          />
        ))}
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}