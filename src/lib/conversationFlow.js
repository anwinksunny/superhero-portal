export const CONVERSATION_STATES = {
  GREETING: "GREETING",
  ASK_NAME: "ASK_NAME",
  ASK_AGE: "ASK_AGE",
  ASK_LOCATION: "ASK_LOCATION",
  ASK_EMAIL: "ASK_EMAIL",
  ASK_PROBLEM: "ASK_PROBLEM",
  DONE: "DONE",
};

const STATE_ORDER = [
  CONVERSATION_STATES.GREETING,
  CONVERSATION_STATES.ASK_NAME,
  CONVERSATION_STATES.ASK_AGE,
  CONVERSATION_STATES.ASK_LOCATION,
  CONVERSATION_STATES.ASK_EMAIL,
  CONVERSATION_STATES.ASK_PROBLEM,
  CONVERSATION_STATES.DONE,
];

export function getNextState(currentState) {
  // The GREETING prompt already asks for the visitor's name, so answering
  // it completes the name step — skip the redundant ASK_NAME prompt.
  if (currentState === CONVERSATION_STATES.GREETING)
    return CONVERSATION_STATES.ASK_AGE;
  const index = STATE_ORDER.indexOf(currentState);
  if (index === -1 || index === STATE_ORDER.length - 1) return currentState;
  return STATE_ORDER[index + 1];
}

// Light validation per step. Returns { ok: true, value } or
// { ok: false, error } with a friendly message Clarion can send back.
export function validateInputForState(state, input) {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "Please write something so I can hear you." };
  switch (state) {
    case CONVERSATION_STATES.GREETING:
    case CONVERSATION_STATES.ASK_NAME:
      if (trimmed.length < 2)
        return { ok: false, error: "I didn't quite catch your name. What should I call you?" };
      return { ok: true, value: trimmed };
    case CONVERSATION_STATES.ASK_AGE: {
      const age = trimmed.match(/\d+/)?.[0];
      if (!age || Number(age) < 1 || Number(age) > 120)
        return { ok: false, error: "How old are you? Just give me a number, like 21." };
      return { ok: true, value: age };
    }
    case CONVERSATION_STATES.ASK_LOCATION:
      if (trimmed.length < 2)
        return { ok: false, error: "Which city or town are you in right now?" };
      return { ok: true, value: trimmed };
    case CONVERSATION_STATES.ASK_EMAIL: {
      const email = trimmed.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0];
      if (!email)
        return { ok: false, error: "That email doesn't look quite right. What's the best email to reach you at?" };
      return { ok: true, value: email };
    }
    case CONVERSATION_STATES.ASK_PROBLEM:
      if (trimmed.length < 3)
        return { ok: false, error: "Take your time. In your own words, what's going on?" };
      return { ok: true, value: trimmed };
    default:
      return { ok: true, value: trimmed };
  }
}

// 5 collection steps for the progress indicator.
const STEP_FOR_STATE = {
  GREETING: 1,
  ASK_NAME: 1,
  ASK_AGE: 2,
  ASK_LOCATION: 3,
  ASK_EMAIL: 4,
  ASK_PROBLEM: 5,
  DONE: 6,
};

export const TOTAL_STEPS = 5;

export function getStepForState(state) {
  return STEP_FOR_STATE[state] ?? 1;
}

// Hardcoded fallback when the AI is unavailable (quota, network, no key).
// Unlike getPromptForState (the question), this acknowledges what the user
// just told us and asks the NEXT question — so a fully offline chat still
// feels like a conversation and collects every field in order.
export function getHardcodedReply(state, userMessage = "", info = {}) {
  const name = info.name || userMessage.trim();
  switch (state) {
    case CONVERSATION_STATES.GREETING:
    case CONVERSATION_STATES.ASK_NAME:
      return name
        ? `Nice to meet you, ${name}. I'm really glad you're here. How old are you?`
        : getPromptForState(state, { name: "Clarion" });
    case CONVERSATION_STATES.ASK_AGE:
      return "Got it, thanks. Where are you right now — which city or town?";
    case CONVERSATION_STATES.ASK_LOCATION:
      return "Thanks. What's the best email to reach you at?";
    case CONVERSATION_STATES.ASK_EMAIL:
      return "Perfect. Now the important part — in your own words, what's going on? What has you feeling stuck?";
    case CONVERSATION_STATES.ASK_PROBLEM:
    case CONVERSATION_STATES.DONE:
      return "Thank you for trusting me with that. I've got the full picture now, and I'll make sure your message reaches someone who can help.";
    default:
      return getPromptForState(state, { name: "Clarion" });
  }
}

export function getPromptForState(state, heroConfig) {
  const name = heroConfig?.name ?? "Clarion";
  switch (state) {
    case CONVERSATION_STATES.GREETING:
      return `Hi, I'm ${name}. I'm here because you're going through something, and that's okay. When you're ready, tell me your name.`;
    case CONVERSATION_STATES.ASK_NAME:
      return "What's your name?";
    case CONVERSATION_STATES.ASK_AGE:
      return "Thanks. How old are you?";
    case CONVERSATION_STATES.ASK_LOCATION:
      return "Where are you right now? Which city or town?";
    case CONVERSATION_STATES.ASK_EMAIL:
      return "One more thing: what's the best email to reach you at?";
    case CONVERSATION_STATES.ASK_PROBLEM:
      return "Now the important part. In your own words, what's going on? What has you feeling stuck?";
    case CONVERSATION_STATES.DONE:
      return "Thanks for sharing that with me. I've got the full picture now. Give me a moment to think about it with you.";
    default:
      return "Tell me what's going on, and we'll find a way forward together.";
  }
}