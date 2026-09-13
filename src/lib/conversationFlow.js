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

// A greeting with no name in it ("hi", "hello", "good morning") must not
// be mistaken for the visitor's name.
const GREETING_ONLY = /^(hi+|hii+|hello+|hey+|hai+|yo|good\s?(morning|afternoon|evening|day)|greetings|namaste)[!.…\s]*$/i;

// "my name is Anwin" / "i'm Anwin" → store just "Anwin".
function extractName(trimmed) {
  const m = trimmed.match(
    /(?:my name is|i['’]m|i am|this is|call me)\s+([A-Za-z][A-Za-z'’.-]*(?:\s+[A-Za-z][A-Za-z'’.-]*)?)/i
  );
  return m ? m[1].trim() : trimmed;
}
export function validateInputForState(state, input) {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "Please write something so I can hear you." };
  switch (state) {
    case CONVERSATION_STATES.GREETING:
    case CONVERSATION_STATES.ASK_NAME:
      if (GREETING_ONLY.test(trimmed))
        return { ok: false, error: "Hi there! I'm really glad you're here. What's your name?" };
      if (trimmed.length < 2)
        return { ok: false, error: "I didn't quite catch your name. What should I call you?" };
      return { ok: true, value: extractName(trimmed) };
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
      // Catch near-certain provider typos (gmail.co, gamil.com, …) before
      // they get stored — asking once now beats a bounced email later.
      const fixed = suggestEmailFix(email);
      if (fixed)
        return { ok: false, error: `Did you mean ${fixed}? Send it again to confirm.` };
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

// Domains that are almost certainly typos of well-known providers
// (gmail.co, gamil.com, outlok.com, …).
const EMAIL_TYPO_DOMAINS = {
  "gmail.co": "gmail.com",
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.om": "gmail.com",
  "gmaill.com": "gmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "outlok.com": "outlook.com",
  "outllok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "hotmal.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "iclod.com": "icloud.com",
  "icloud.con": "icloud.com",
};

const EMAIL_CANONICAL = {
  gmail: "gmail.com",
  yahoo: "yahoo.com",
  outlook: "outlook.com",
  hotmail: "hotmail.com",
  icloud: "icloud.com",
};

// Returns the corrected address for near-certain provider typos, else null.
export function suggestEmailFix(email) {
  const raw = String(email ?? "");
  const at = raw.toLowerCase().lastIndexOf("@");
  if (at === -1) return null;
  const user = raw.slice(0, at);
  const domain = raw.toLowerCase().slice(at + 1).replace(/\.+$/, "");
  if (EMAIL_TYPO_DOMAINS[domain]) return `${user}@${EMAIL_TYPO_DOMAINS[domain]}`;
  const m = domain.match(/^(gmail|yahoo|outlook|hotmail|icloud)\.(co|cm|om|con|cmo|ne|nt|comn|vom)$/);
  if (m && domain !== EMAIL_CANONICAL[m[1]]) {
    return `${user}@${EMAIL_CANONICAL[m[1]]}`;
  }
  return null;
}

// Corrections like "no, it's x@gmail.com" or "actually I'm 25" arrive at a
// LATER step than the info they fix. Detect them so we update the stored
// field and re-ask the current step — instead of advancing with garbage
// (e.g. treating an email correction as the user's problem and finishing
// early with DONE + sending the email).
export function detectCorrection(state, input, collectedInfo = {}) {
  const trimmed = String(input ?? "").trim();
  if (!trimmed) return null;

  // An explicit naming phrase is unambiguous even without "actually" or
  // "correction" — e.g. while asked for email, "My name is Anwin" should
  // update the stored name instead of being rejected as a bad email.
  if (state !== CONVERSATION_STATES.GREETING && state !== CONVERSATION_STATES.ASK_NAME) {
    const explicitName = trimmed.match(
      /^(?:my name is|call me|name['’]s)\s+([A-Za-z][A-Za-z'’.-]*(?:\s+[A-Za-z][A-Za-z'’.-]*)?)[!.…\s]*$/i
    )?.[1];
    if (
      explicitName &&
      explicitName.toLowerCase() !== String(collectedInfo.name ?? "").toLowerCase()
    ) {
      return { field: "name", value: explicitName.trim() };
    }
  }

  // Same rule for an explicitly stated age after the age step. A bare number
  // remains the normal answer for the current step, avoiding false updates.
  if (state !== CONVERSATION_STATES.GREETING && state !== CONVERSATION_STATES.ASK_NAME && state !== CONVERSATION_STATES.ASK_AGE) {
    const explicitAge = trimmed.match(
      /^(?:my age is|i am|i['’]m)\s+(\d{1,3})\s*(?:years?\s*old|years?|y\.?o\.?|yrs?)?\s*[!.…]*$/i
    )?.[1];
    if (
      explicitAge &&
      Number(explicitAge) >= 1 &&
      Number(explicitAge) <= 120 &&
      explicitAge !== String(collectedInfo.age ?? "")
    ) {
      return { field: "age", value: explicitAge };
    }
  }

  // Email correction — an address is distinctive, and people don't normally
  // paste one into later answers.
  if (
    (state === CONVERSATION_STATES.ASK_PROBLEM ||
      state === CONVERSATION_STATES.DONE) &&
    collectedInfo.email
  ) {
    const email = trimmed.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0];
    if (
      email &&
      email.toLowerCase() !== String(collectedInfo.email).toLowerCase()
    ) {
      return { field: "email", value: email };
    }
  }

  const laterSteps = [
    CONVERSATION_STATES.ASK_AGE,
    CONVERSATION_STATES.ASK_LOCATION,
    CONVERSATION_STATES.ASK_EMAIL,
    CONVERSATION_STATES.ASK_PROBLEM,
    CONVERSATION_STATES.DONE,
  ];
  if (!laterSteps.includes(state)) return null;
  const marker = trimmed.match(
    /^(?:no[,.]?\s+|actually\s+|sorry[,.]?\s+|correction[,:]?\s*|i meant\s+|my bad[,.]?\s+)/i
  );
  if (!marker) return null;
  const rest = trimmed.slice(marker[0].length).trim();
  if (!rest) return null;

  // Age correction: "actually 25", "no, 21", "sorry — 30 years old".
  const ageOnly = rest.match(
    /^(\d{1,3})\s*(years?\s*old|years?|y\.?o\.?|yrs?)?$/i
  )?.[1];
  if (ageOnly && Number(ageOnly) >= 1 && Number(ageOnly) <= 120) {
    if (String(collectedInfo.age ?? "") !== ageOnly) {
      return { field: "age", value: ageOnly };
    }
    return null;
  }

  // Name correction with an explicit naming verb: "actually, my name is Anwin".
  const name = rest.match(
    /(?:my name is|call me|name['’]s)\s+([A-Za-z][A-Za-z'’.-]*(?:\s+[A-Za-z][A-Za-z'’.-]*)?)/i
  )?.[1];
  if (
    name &&
    name.toLowerCase() !== String(collectedInfo.name ?? "").toLowerCase()
  ) {
    return { field: "name", value: name.trim() };
  }

  return null;
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
