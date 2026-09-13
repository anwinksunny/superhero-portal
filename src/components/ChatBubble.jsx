import { motion } from "framer-motion";
import heroConfig from "@/lib/heroConfig";

export default function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[80%] break-words rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-horizon-accent text-horizon-primary rounded-br-md shadow-md"
            : "bg-horizon-secondary/80 text-horizon-text-light rounded-bl-md border border-horizon-secondary"
        }`}
      >
        {!isUser && (
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-horizon-accent">
            {heroConfig.name}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
      </div>
    </motion.div>
  );
}