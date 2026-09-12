import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import { getPromptForState } from "@/lib/conversationFlow";
import heroConfig from "@/lib/heroConfig";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function toContent(role, text) {
  return {
    role,
    parts: [{ text }],
  };
}

export async function POST(request) {
  let conversationState = "GREETING";

  try {
    const body = await request.json();
    const { conversationState: state, history = [], userMessage = "" } = body;
    conversationState = state ?? conversationState;

    const systemInstruction = buildSystemPrompt(heroConfig, conversationState);

    const chat = model.startChat({
      systemInstruction,
      history: history
        .filter((m) => m.role === "user" || m.role === "clarion")
        .map((m) =>
          toContent(m.role === "clarion" ? "model" : "user", m.text)
        ),
    });

    const result = await chat.sendMessage(userMessage);
    const reply = result.response.text();

    return Response.json({ reply });
  } catch (error) {
    console.error("Gemini chat call failed:", error);
    const reply = getPromptForState(conversationState, heroConfig);
    return Response.json({ reply });
  }
}