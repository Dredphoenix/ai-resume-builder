import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const _rawChatSession = model.startChat({
  generationConfig,
  history: [],
});

// Provide a safe wrapper around the raw session so all calls get unified error handling.
export const AIChatSession = {
  sendMessage: async (message, opts) => {
    try {
      return await _rawChatSession.sendMessage(message, opts);
    } catch (err) {
      // Log original error for debugging
      console.error("AI API call error:", err);

      const msg = (err && (err.message || String(err))) || "Unknown AI error";

      // Detect common model/version mismatch and provide a helpful suggestion
      let suggestion = "";
      if (/not found/i.test(msg) || /not supported/i.test(msg) || /404/.test(msg)) {
        suggestion =
          " Model may be unsupported for this API version or the model name is incorrect. Run ListModels or pick a supported model. Check your VITE_GOOGLE_API_KEY and model name.";
      }

      const wrapped = new Error(`[AI API Error] ${msg}${suggestion}`);
      wrapped.original = err;
      throw wrapped;
    }
  },
  // expose the raw session in case callers need advanced features
  _raw: _rawChatSession,
};

// Helper to list available models. Use this to discover supported model names
// and supported methods for your API version. Call this from a server-side
// environment (safer) or in dev to inspect what the API supports.
export async function listModels() {
  try {
    if (typeof genAI.listModels === "function") {
      const resp = await genAI.listModels();
      console.log("Available models:", resp);
      return resp;
    }

    // If the SDK version doesn't expose listModels, try a best-effort fetch.
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models";
    const resp = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });
    const json = await resp.json();
    console.log("ListModels fallback response:", json);
    return json;
  } catch (err) {
    console.error("listModels error:", err);
    return { error: err?.message || String(err) };
  }
}

// Analyze skill gaps between a resume and an optional job description.
// Returns structured JSON with extracted skills, matched and missing skills,
// and suggested learning resources. On error returns an object with `error`.
export async function analyzeSkillGap(resumeText, jobDescription = "") {
  const PROMPT = `You are an expert resume analyst and learning advisor.\n\nTask:\n1) Extract normalized skills, tools, frameworks, and certifications mentioned in the resume.\n2) Extract required and preferred skills from the job description (if provided).\n3) Return matchedSkills and missingSkills. For each missing skill provide: priority (High|Medium|Low), short reason, 1-3 concise learning resources (URLs or course names), and an estimated time-to-learn string (e.g. "2-4 weeks").\n4) Also return a short list of quick resume edits (2-5) to improve immediate ATS/keyword match (one-line suggestions).\n\nReturn ONLY valid JSON following this schema EXACTLY (no extra text):\n{\n  "resumeSkills": ["..."],\n  "jobSkills": ["..."],\n  "matchedSkills": ["..."],\n  "missingSkills": [{"skill":"...","priority":"High|Medium|Low","reason":"...","estimatedTime":"...","resources":["...","..."]}],\n  "quickFixes": ["..."]\n}\n\nResume:\n${resumeText}\n\nJobDescription:\n${jobDescription}\n`;

  try {
    const result = await AIChatSession.sendMessage(PROMPT);
    // SDK may return a Response-like object or a direct string
    let rawText = "";
    if (result?.response?.text) rawText = await result.response.text();
    else if (typeof result === "string") rawText = result;
    else rawText = JSON.stringify(result);

    const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      // If parsing fails, return a helpful error with raw output for debugging
      console.error("analyzeSkillGap parse error:", parseErr, cleaned);
      return { error: "Failed to parse AI response as JSON", raw: cleaned };
    }

    // Normalize and ensure required fields exist
    parsed.resumeSkills = Array.isArray(parsed.resumeSkills) ? parsed.resumeSkills : [];
    parsed.jobSkills = Array.isArray(parsed.jobSkills) ? parsed.jobSkills : [];
    parsed.matchedSkills = Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [];
    parsed.missingSkills = Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [];
    parsed.quickFixes = Array.isArray(parsed.quickFixes) ? parsed.quickFixes : [];

    return parsed;
  } catch (err) {
    console.error("analyzeSkillGap error:", err);
    return { error: err?.message || String(err) };
  }
}

// Compute an ATS-style score for a resume. Returns JSON with `score` (0-100),
// `breakdown` (object with category scores) and `suggestions` (array).
export async function computeATSScore(resumeText) {
  const PROMPT = `You are an expert in Applicant Tracking Systems (ATS) and resume optimization.\n\nTask:\n1) Analyze the resume text and compute an ATS-compatibility score (0-100).\n2) Provide a numeric breakdown matching these category weights: ContactInfo(10), HeadingsAndSections(20), Keywords(30), Formatting(20), DatesAndConsistency(20).\n3) For Keywords, include: topMatchedKeywords (list) and topMissingKeywords (list).\n4) Provide 3 prioritized actionable suggestions (one-line each) and 2 example bullet rewrites that increase keyword density without hallucinating facts.\n\nReturn ONLY valid JSON EXACTLY like this schema:\n{\n  "score": 0-100,\n  "breakdown": {"ContactInfo":0,"HeadingsAndSections":0,"Keywords":0,"Formatting":0,"DatesAndConsistency":0},\n  "topMatchedKeywords": ["..."],\n  "topMissingKeywords": ["..."],\n  "suggestions": ["..."],\n  "exampleBullets": ["...","..."]\n}\n\nResume:\n${resumeText}\n`;

  try {
    const result = await AIChatSession.sendMessage(PROMPT);
    let rawText = "";
    if (result?.response?.text) rawText = await result.response.text();
    else if (typeof result === "string") rawText = result;
    else rawText = JSON.stringify(result);

    const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("computeATSScore parse error:", parseErr, cleaned);
      return { error: "Failed to parse AI response as JSON", raw: cleaned };
    }

    // Normalize and ensure types
    parsed.score = typeof parsed.score === "number" ? Math.max(0, Math.min(100, parsed.score)) : null;
    parsed.breakdown = parsed.breakdown && typeof parsed.breakdown === "object" ? parsed.breakdown : {};
    parsed.topMatchedKeywords = Array.isArray(parsed.topMatchedKeywords) ? parsed.topMatchedKeywords : [];
    parsed.topMissingKeywords = Array.isArray(parsed.topMissingKeywords) ? parsed.topMissingKeywords : [];
    parsed.suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
    parsed.exampleBullets = Array.isArray(parsed.exampleBullets) ? parsed.exampleBullets : [];

    return parsed;
  } catch (err) {
    console.error("computeATSScore error:", err);
    return { error: err?.message || String(err) };
  }
}

