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
  const index = STATE_ORDER.indexOf(currentState);
  if (index === -1 || index === STATE_ORDER.length - 1) return currentState;
  return STATE_ORDER[index + 1];
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