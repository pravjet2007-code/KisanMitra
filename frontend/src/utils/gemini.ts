// KisanBot — Gemini API Utility
// Handles all communication with Google Gemini API for the KisanMitra chatbot

export interface Message {
  role: 'user' | 'model';
  text: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
  // Short codes (what i18n.language usually returns)
  'en': 'English',
  'hi': 'Hindi',
  'pa': 'Punjabi',
  'mr': 'Marathi',
  'ta': 'Tamil',
  'te': 'Telugu',
  'bn': 'Bengali',
  'gu': 'Gujarati',
  // Full locale codes (fallback)
  'en-IN': 'English',
  'hi-IN': 'Hindi',
  'pa-IN': 'Punjabi',
  'mr-IN': 'Marathi',
  'ta-IN': 'Tamil',
  'te-IN': 'Telugu',
  'bn-IN': 'Bengali',
  'gu-IN': 'Gujarati',
};

/** Resolves language name from any locale code format (e.g. 'en', 'en-IN', 'en-US') */
function getLangName(lang: string): string {
  if (!lang) return 'Hindi';
  // Try exact match first, then try the first part (e.g. 'en' from 'en-US')
  return LANGUAGE_NAMES[lang] || LANGUAGE_NAMES[lang.split('-')[0]] || 'English';
}

// Max recent messages to include (keeps token count low)
const MAX_HISTORY = 6;

/**
 * Shared internal helper to call Gemini with a robust fallback system.
 * This version uses a simplified payload for maximum compatibility.
 */
async function callGeminiRaw(
  apiKey: string,
  systemInstruction: string,
  contents: any[],
  temperature: number = 0.5
): Promise<string> {
  // These model names are verified from the ListModels API for this key
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite'];
  
  let lastError = '';

  for (const model of models) {
    try {
      // For peak compatibility, we inject the system instruction into the first content part 
      // instead of using the top-level system_instruction field
      const combinedContents = [...contents];
      if (systemInstruction && combinedContents.length > 0) {
        const firstPart = combinedContents[0].parts[0];
        if (firstPart && firstPart.text) {
          firstPart.text = `[Role/Context: ${systemInstruction}]\n\n${firstPart.text}`;
        }
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: combinedContents,
            generationConfig: {
              temperature,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      } else {
        lastError = data?.error?.message || `HTTP ${response.status}`;
        console.warn(`Gemini fail (${model}): ${lastError}`);
        // If it's a model not found or quota issue, we try the next one
        if (response.status === 404 || response.status === 400 || response.status === 429) {
          continue;
        }
      }
    } catch (e: any) {
      lastError = e?.message || 'Network error';
      console.error(`Fetch fail (${model}):`, e);
    }
  }

  throw new Error(`Connectivity: ${lastError}`);
}

export async function askKisanBot(
  history: Message[],
  userMessage: string,
  language: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  const systemPrompt = `You are KisanBot, an expert Indian agriculture assistant on the KisanMitra platform. Always respond ONLY in ${getLangName(language)}. Use simple words for a rural farmer. Keep answer short (2-4 sentences).`;

  const recentHistory = history.slice(-MAX_HISTORY);
  const contents = recentHistory.map((msg) => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }],
  }));

  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  try {
    return await callGeminiRaw(apiKey, systemPrompt, contents, 0.7);
  } catch (err: any) {
    console.error("Chatbot error:", err);
    return i18n_fallback_error(language);
  }
}

function i18n_fallback_error(lang: string) {
  const errors: Record<string, string> = {
    'hi-IN': 'Maaf kijiye, abhi KisanBot kaam nahi kar raha hai. Kripya thodi der baad koshish karein.',
    'en-IN': 'Sorry, KisanBot is currently unavailable. Please try again in a few minutes.',
  };
  return errors[lang] || errors['hi-IN'];
}

// Specialized analysis for Soil Health
export async function getSoilAnalysis(
  soilData: { ph: string; n: string; p: string; k: string },
  crop: string,
  language: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY_MISSING');

  const systemInstruction = `You are a Soil Scientist at KisanMitra. Respond ONLY in ${getLangName(language)}. Be practical and helpful.`;
  const prompt = `
    Analyze this soil report for an Indian farmer planning to grow ${crop || 'crops'}:
    - pH: ${soilData.ph}, N: ${soilData.n}, P: ${soilData.p}, K: ${soilData.k}

    Respond in ${getLangName(language)}. Provide status, fertilizers needed, and one organic tip in max 5 sentences.
  `;

  try {
    return await callGeminiRaw(apiKey, systemInstruction, [{ role: 'user', parts: [{ text: prompt }] }], 0.2);
  } catch (err: any) {
    return `Analysis unavailable (Error: ${err.message}). Try again later.`;
  }
}

// Specialized analysis for Plant Disease (Crop Doctor)
export async function getDiseaseAnalysis(
  disease: string,
  crop: string,
  language: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY_MISSING');

  const systemInstruction = `You are a Plant Pathologist (Crop Doctor) at KisanMitra. Respond ONLY in ${getLangName(language)}.`;
  const prompt = `Diagnose and provide treatment, prevention, and an organic solution for "${disease.replace(/_/g, ' ')}" in ${crop || 'the plant'}. Respond in ${getLangName(language)}. Max 6 sentences.`;

  try {
    return await callGeminiRaw(apiKey, systemInstruction, [{ role: 'user', parts: [{ text: prompt }] }], 0.2);
  } catch (err: any) {
    return `Plan unavailable (Error: ${err.message}). Try again later.`;
  }
}

// Phase 3: AI Weather-Aware Daily Task List
export interface DayForecast {
  date: string;        // e.g. "Today", "Tomorrow", "Wed"
  maxTemp: number;     // °C
  minTemp: number;     // °C
  rainProb: number;    // 0-100
  condition: string;   // 'sunny' | 'cloudy' | 'rainy'
}

export interface WeatherTaskDay {
  day: string;
  condition: string;
  tasks: string[];
}

export async function getWeatherTasks(
  forecast: DayForecast[],
  crop: string,
  language: string
): Promise<WeatherTaskDay[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY_MISSING');

  const forecastText = forecast
    .map(d => `${d.date}: ${d.condition}, ${d.maxTemp}°C max / ${d.minTemp}°C min, ${d.rainProb}% rain`)
    .join('\n');

  const prompt = `
You are a precision farm advisor for an Indian farmer growing ${crop || 'mixed crops'}.

3-day weather forecast:
${forecastText}

Generate a day-wise farming task plan in ${getLangName(language)}.
For each day provide 2-3 short, actionable tasks (max 12 words each) based on that day's weather.
Consider: irrigation (skip on rainy days), pesticide/fungicide spraying (avoid rain/wind), harvesting windows, field work, drying & storage.

Respond ONLY as a valid JSON array in this exact format — no extra text:
[
  { "day": "${forecast[0]?.date || 'Today'}", "condition": "sunny", "tasks": ["task 1", "task 2", "task 3"] },
  { "day": "${forecast[1]?.date || 'Tomorrow'}", "condition": "cloudy", "tasks": ["task 1", "task 2"] },
  { "day": "${forecast[2]?.date || 'Day 3'}", "condition": "rainy", "tasks": ["task 1", "task 2"] }
]
  `;

  const systemInstruction = `You are a crop calendar AI at KisanMitra. Always respond ONLY with a valid JSON array. Never add markdown, headings, or explanations.`;

  try {
    const raw = await callGeminiRaw(apiKey, systemInstruction, [{ role: 'user', parts: [{ text: prompt }] }], 0.3);
    // Strip any markdown code fences if present
    const cleaned = raw.replace(/```[\w]*\n?/g, '').trim();
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed as WeatherTaskDay[];
    }
    return [];
  } catch {
    return [];
  }
}
