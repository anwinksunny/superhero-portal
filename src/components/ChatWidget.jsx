"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import heroConfig from "@/lib/heroConfig";
import sendGrievanceEmail from "@/lib/sendEmail";
import {
  CONVERSATION_STATES,
  getNextState,
  getPromptForState,
} from "@/lib/conversationFlow";

function collectInfo(currentState, input, info) {
  const trimmed = input.trim();
  switch (currentState) {
    case CONVERSATION_STATES.ASK_NAME:
      return { ...info, name: trimmed };
    case CONVERSATION_STATES.ASK_AGE:
      return { ...info, age: trimmed.match(/\d+/)?.at(0) ?? trimmed };
    case CONVERSATION_STATES.ASK_LOCATION:
      return { ...info, location: trimmed };
    case CONVERSATION_STATES.ASK_EMAIL:
      return { ...info, email: trimmed };
    case CONVERSATION_STATES.ASK_PROBLEM:
      return { ...info, problem: trimmed };
    default:
      return info;
  }
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      id: 1,
      role: "clarion",
      text: getPromptForState(CONVERSATION_STATES.GREETING, heroConfig),
    },
  ]);
  const [conversationState, setConversationState] = useState(
    CONVERSATION_STATES.GREETING
  );
  const [collectedInfo, setCollectedInfo] = useState({});
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const emailSentRef = useRef(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const updatedInfo = collectInfo(conversationState, trimmed, collectedInfo);
    setCollectedInfo(updatedInfo);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: trimmed },
    ]);
    setInput("");
    setIsTyping(true);

    const history = [
      ...messages,
      { id: Date.now(), role: "user", text: trimmed },
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationState,
          history,
          userMessage: trimmed,
        }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "clarion", text: data.reply },
      ]);

      const nextState = getNextState(conversationState);
      setConversationState(nextState);

      if (nextState === CONVERSATION_STATES.DONE && !emailSentRef.current) {
        emailSentRef.current = true;
        try {
          await sendGrievanceEmail(updatedInfo);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              role: "clarion",
              text: "Message sent — Clarion has been notified.",
            },
          ]);
        } catch (error) {
          console.error("Grievance email failed:", error);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              role: "clarion",
              text: "I've got it all written down. If the delivery slips, reach out again — I'm always here.",
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Message failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "clarion",
          text: "Give me a moment — let me see this clearly before I answer.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* floating button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close chat with Clarion" : "Talk to Clarion"}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-horizon-accent text-horizon-primary shadow-lg shadow-horizon-accent/30 transition-colors hover:bg-horizon-accent-secondary"
        initial={false}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.svg
            key={isOpen ? "close" : "chat"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
            initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.6 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M9 10h6M9 14h4" />
              </>
            )}
          </motion.svg>
        </AnimatePresence>
      </motion.button>

      {/* chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-horizon-secondary sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:max-h-[calc(100vh-8rem)] sm:w-[400px] sm:rounded-3xl sm:shadow-2xl sm:shadow-black/40 sm:border sm:border-horizon-primary/40"
            id="chat-widget"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-horizon-primary/40 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-horizon-accent text-sm font-bold text-horizon-primary">
                  C
                </div>
                <div>
                  <p className="font-semibold text-horizon-text-light">
                    Clarion
                  </p>
                  <p className="text-xs text-horizon-text-muted">
                    Always listening
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-2 text-horizon-text-muted transition-colors hover:bg-horizon-primary/40 hover:text-horizon-text-light"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* messages */}
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {messages.map((m) => (
                <ChatBubble key={m.id} message={m} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* input */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-horizon-primary/40 px-5 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share what's on your mind..."
                className="flex-1 rounded-full border border-horizon-primary/40 bg-horizon-primary/40 px-4 py-2.5 text-sm text-horizon-text-light placeholder:text-horizon-text-muted outline-none transition-colors focus:border-horizon-accent"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-horizon-accent text-horizon-primary transition-colors hover:bg-horizon-accent-secondary"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="m22 2-7 20-4-9-9-4z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}