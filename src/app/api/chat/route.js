import { NextResponse } from "next/server";

export async function POST(request) {
  let fallback = "I’m here with you. Please try that again.";
  try {
    const body = await request.json();
    const { message, stage, isCorrection = false, isValid = true } = body;
    fallback = String(body.fallback ?? fallback).trim() || fallback;
    const text = String(message ?? "").trim().slice(0, 2_000);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!text || !apiKey) throw new Error("AI is not configured");

    // Flash-Lite is the stable, low-latency model for this short, high-volume
    // chat flow. An environment variable can still select a different model.
    const model = process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `You are Clarion: calm, practical and warm. This is a short intake chat at stage ${String(stage ?? "unknown")}. Reply with one concise, natural sentence. ${isCorrection ? "The visitor corrected an earlier detail. Acknowledge it and ask the current stage's question again." : "Respond naturally and keep the intake moving."} ${isValid ? "" : "Their input is not valid for this stage; gently explain what is needed."} Required next-step intent: ${String(fallback ?? "Continue the conversation.")}. Use that intent to choose the question, but never quote or repeat it verbatim and never add a second acknowledgement. Do not invent, request, repeat, or expose personal data beyond the visitor's message. Do not claim to be a professional or diagnose. If they indicate immediate danger or self-harm, encourage contacting local emergency services or a trusted person immediately.`,
            }],
          },
          contents: [{ role: "user", parts: [{ text }] }],
          generationConfig: {
            maxOutputTokens: 70,
            thinkingConfig: { thinkingLevel: "minimal" },
          },
        }),
        signal: AbortSignal.timeout(8_000),
      }
    );

    if (!response.ok) throw new Error(`Gemini returned ${response.status}`);
    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();
    if (!reply) throw new Error("Gemini returned no text");

    return NextResponse.json({ reply, source: "ai" });
  } catch (error) {
    console.error("Chat AI unavailable:", error);
    return NextResponse.json({ reply: fallback, source: "fallback" });
  }
}
