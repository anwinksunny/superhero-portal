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
              text: "Message sent. Clarion has been told about your request.",
            },
          ]);
        } catch (error) {
          console.error("Grievance email failed:", error);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              role: "clarion",
              text: "I've written it all down. If the message doesn't go through, reach out again. I'm always here.",
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
          text: "Give me a moment. Let me think about this before I answer.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close chat with Clarion" : "Talk to Clarion"}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-horizon-accent to-horizon-accent-secondary text-horizon-primary shadow-glow-md transition-shadow hover:shadow-glow-lg"
        initial={false}
        animate={{ scale: [1, 1.06, 1] }}
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

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-horizon-primary sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:max-h-[calc(100vh-8rem)] sm:w-[400px] sm:rounded-3xl sm:shadow-2xl sm:shadow-black/50 sm:border sm:border-horizon-secondary/60"
            id="chat-widget"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-horizon-secondary/60 bg-gradient-to-r from-horizon-secondary/80 to-horizon-primary px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-horizon-accent to-horizon-accent-secondary text-sm font-bold text-horizon-primary">
                  C
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-horizon-primary" />
                </div>
                <div>
                  <p className="font-semibold text-horizon-text-light">
                    Clarion
                  </p>
                  <p className="text-xs text-horizon-accent">
                    Online now
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-2 text-horizon-text-muted transition-colors hover:bg-horizon-secondary hover:text-horizon-text-light"
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

            {/* Messages area */}
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 bg-gradient-to-b from-horizon-primary to-horizon-primary/95">
              {messages.map((m) => (
                <ChatBubble key={m.id} message={m} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-horizon-secondary/60 bg-horizon-primary/80 backdrop-blur-sm px-5 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share what's on your mind..."
                className="flex-1 rounded-full border border-horizon-secondary bg-horizon-secondary/40 px-4 py-2.5 text-sm text-horizon-text-light placeholder:text-horizon-text-muted/60 outline-none transition-all focus:border-horizon-accent focus:ring-1 focus:ring-horizon-accent/30"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-horizon-accent to-horizon-accent-secondary text-horizon-primary transition-all hover:shadow-glow-sm hover:scale-105"
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