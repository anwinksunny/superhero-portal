import heroConfig from "@/lib/heroConfig";

export default function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-horizon-accent text-horizon-primary rounded-br-md"
            : "bg-horizon-secondary text-horizon-text-light rounded-bl-md border border-horizon-primary/40"
        }`}
      >
        {!isUser && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-horizon-accent">
            {heroConfig.name}
          </p>
        )}
        <p>{message.text}</p>
      </div>
    </div>
  );
}