import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import { getPromptForState } from "@/lib/conversationFlow";
import heroConfig from "@/lib/heroConfig";

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  // Lightweight default: Flash-Lite has no thinking-token overhead
  // (~17 tokens vs ~542 on full Flash), so replies are faster/cheaper
  // and don't get cut off. Override with GEMINI_MODEL in .env.local.
  const modelName = process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite";
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in .env.local");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });
}

function toContent(role, text) {
  return {
    role,
    parts: [{ text: String(text ?? "") }],
  };
}

// Gemini requires history to start with a "user" turn and alternate
// user/model. The widget sends the initial Clarion greeting plus the
// current message inside `history`, so sanitize before startChat.
function sanitizeHistory(history, userMessage) {
  const mapped = (history ?? [])
    .filter((m) => m && (m.role === "user" || m.role === "clarion") && m.text)
    .map((m) => toContent(m.role === "clarion" ? "model" : "user", m.text));

  // Drop everything before the first user turn (e.g. opening greeting).
  const firstUser = mapped.findIndex((m) => m.role === "user");
  const trimmed = firstUser === -1 ? [] : mapped.slice(firstUser);

  // Collapse consecutive same-role turns (keep the last one).
  const deduped = [];
  for (const m of trimmed) {
    const last = deduped[deduped.length - 1];
    if (last && last.role === m.role) {
      last.parts = m.parts;
    } else {
      deduped.push({ ...m, parts: [...m.parts] });
    }
  }

  // The current userMessage is sent via sendMessage(), so don't duplicate
  // it as the last history entry.
  if (
    userMessage &&
    deduped.length > 0 &&
    deduped[deduped.length - 1].role === "user" &&
    deduped[deduped.length - 1].parts[0]?.text === userMessage
  ) {
    deduped.pop();
  }

  return deduped;
}

export async function POST(request) {
  let conversationState = "GREETING";

  try {
    const body = await request.json();
    const { conversationState: state, history = [], userMessage = "" } = body;
    conversationState = state ?? conversationState;

    // Don't spend quota on empty input — return the step prompt directly.
    if (!String(userMessage ?? "").trim()) {
      return Response.json({
        reply: getPromptForState(conversationState, heroConfig),
        source: "fallback",
      });
    }

    const systemInstruction = {
      role: "system",
      parts: [{ text: buildSystemPrompt(heroConfig, conversationState) }],
    };

    const model = getModel();
    const chat = model.startChat({
      systemInstruction,
      history: sanitizeHistory(history, userMessage),
    });

    const result = await chat.sendMessage(userMessage);
    // Join ALL text parts — response.text() can drop content when the
    // model returns multiple parts.
    const parts = result.response?.candidates?.[0]?.content?.parts ?? [];
    const joined = parts
      .filter((p) => typeof p.text === "string" && !p.thought)
      .map((p) => p.text)
      .join("");
    const reply = (joined || result.response.text() || "").trim();
    if (!reply) throw new Error("Empty reply from Gemini");

    return Response.json({ reply, source: "ai" });
  } catch (error) {
    console.error("Gemini chat call failed:", error);
    const reply = getPromptForState(conversationState, heroConfig);
    return Response.json({ reply, source: "fallback" });
  }
}