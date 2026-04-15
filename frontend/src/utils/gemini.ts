// KisanBot — Gemini API Utility
// Handles all communication with Google Gemini API for the KisanMitra chatbot

export interface Message {
  role: 'user' | 'model';
  text: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
  'en-IN': 'English',
  'hi-IN': 'Hindi',
  'pa-IN': 'Punjabi',
  'mr-IN': 'Marathi',
  'ta-IN': 'Tamil',
  'te-IN': 'Telugu',
  'bn-IN': 'Bengali',
  'gu-IN': 'Gujarati',
};

// Compact system prompt — keeps token usage low on free tier
const SYSTEM_PROMPT = (language: string) =>
  `You are KisanBot, an expert Indian agriculture assistant on the KisanMitra platform. ` +
  `Always respond ONLY in ${LANGUAGE_NAMES[language] || 'Hindi'} language. ` +
  `Use simple words a rural farmer understands. Address the farmer as "Kisan Bhai" or "Ji". ` +
  `Help with: crop diseases, pests, fertilizers, soil, irrigation, weather, mandi prices, government schemes (PM Kisan, KCC, crop insurance), and the KisanMitra app. ` +
  `Keep answers short (2-4 sentences), conversational, no bullet points or markdown.`;

// Max recent messages to include (keeps token count low)
const MAX_HISTORY = 6;



export async function askKisanBot(
  history: Message[],
  userMessage: string,
  language: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  // Only keep the last MAX_HISTORY messages to limit token usage
  const recentHistory = history.slice(-MAX_HISTORY);

  // Build Gemini-format contents array
  const contents = recentHistory.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));

  // Add current user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  // gemini-2.0-flash-lite: lowest token cost, best for free tier
  const MODEL = 'gemini-2.0-flash-lite';

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT(language) }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message = err?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    // Retry with fallback model if primary model not found or unsupported
    if (response.status === 404 || response.status === 400) {
      return askKisanBotFallback(history, userMessage, language, apiKey);
    }
    throw new Error(message);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  return text.trim();
}

// Fallback to gemini-1.5-flash if gemini-2.0-flash is not available on the key
async function askKisanBotFallback(
  history: Message[],
  userMessage: string,
  language: string,
  apiKey: string
): Promise<string> {
  const contents = history.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT(language) }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Koi jawab nahi mila.';
}
