import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

app.post('/api/generate-report', async (req, res) => {
  try {
    const {
      reportType = 'case-study',
      targetLanguage = 'English',
      projectName = '',
      clientName = '',
      timeframe = '',
      notes = '',
      fileData = '',
      images = [],
      tone = 'executive-sharp',
      highlightFocus = '',
    } = req.body;

    if (!notes && !fileData && (!images || images.length === 0)) {
      return res.status(400).json({
        error: 'Please provide some notes, upload a document, or paste screenshot data.',
      });
    }

    const promptInstructions = `
You are an elite Chief Strategy Officer, VP of Marketing, and Master Case Study Architect.
Your job is to transform raw, unstructured user input (which may be provided in Hindi, Hinglish, informal shorthand, broken notes, or any mixed language) into a WORLD-CLASS, highly attractive, executive-ready, professional business deliverable.

Deliverable Type: ${reportType.toUpperCase()}
Target Language for Output: ${targetLanguage}
Client / Brand: ${clientName || 'Not explicitly specified (infer if in notes)'}
Project / Title: ${projectName || 'Auto-generate a compelling title'}
Timeframe: ${timeframe || 'Recent period'}
Tone & Polish: ${tone}
Specific Highlights / User Priorities: ${highlightFocus || 'Identify and emphasize the highest ROI impact, growth metrics, and wins.'}

CRITICAL RULES:
1. TARGET LANGUAGE: The final report MUST be written strictly in "${targetLanguage}".
   Even if the user gave input in Hindi, Hinglish, or informal slang like "kaha se kam kiya kitna resutl aaya screenshot dekh ke bna do", translate and elevate the ideas into pristine, persuasive, high-converting ${targetLanguage}.
2. DECIDE WHAT TO HIGHLIGHT: Analyze the raw input, screenshots, and numbers. Detect key metrics (growth %, revenue, leads, ranking positions, cost reductions, conversion rates, traffic). Highlight before-vs-after improvements.
3. EXECUTIVE STRUCTURE:
   - Compelling Hook / Title & Subtitle
   - Executive Summary (crisp, data-backed)
   - 4 to 6 High-Impact Key Performance Indicators (KPIs) with baseline vs current & % uplift
   - The Challenge / Problem Statement / Baseline Audit
   - Strategic Solution & Core Pillars (3-4 pillars)
   - Step-by-step Execution Roadmap / Timeline
   - Visual Chart Data (provide structured data points for at least 1 or 2 visual charts like Bar, Line, or Donut)
   - Before vs After comparison matrix
   - If Audit or Competitor Analysis: Action Matrix with priority (High/Med/Low) or Competitor Benchmark table
   - Client Testimonial / Stakeholder Endorsement quote (realistic and polished)
   - Key Strategic Takeaways & Next Steps / Recommendations
4. PROFESSIONAL VISUAL FORMAT: Format numbers with clear units (e.g. "+312%", "$48.5K", "1.2M", "1st Page Rank #1").
5. Return ONLY a valid JSON object matching the requested schema. No markdown formatting outside the JSON, no backticks surrounding the answer unless strictly valid JSON.

USER NOTES & RAW INPUT:
${notes}

${fileData ? `UPLOADED SPREADSHEET / DOCUMENT TEXT:\n${fileData}` : ''}

JSON Schema structure expected:
{
  "title": "string",
  "subtitle": "string",
  "reportType": "${reportType}",
  "language": "${targetLanguage}",
  "meta": {
    "client": "string",
    "project": "string",
    "timeframe": "string",
    "preparedBy": "ReportCraft Executive Intelligence",
    "status": "Final Approved"
  },
  "executiveSummary": "string (2-3 paragraphs of compelling, executive-level synthesis)",
  "keyMetrics": [
    {
      "label": "string",
      "value": "string (e.g. +340% or $128,400)",
      "previousValue": "string (e.g. 12,000)",
      "changePercent": "string (e.g. +340%)",
      "isPositive": true,
      "description": "string (brief context)"
    }
  ],
  "challenge": {
    "headline": "string",
    "overview": "string",
    "painPoints": ["string", "string", "string"]
  },
  "solution": {
    "headline": "string",
    "overview": "string",
    "pillars": [
      {
        "title": "string",
        "description": "string",
        "tags": ["string", "string"]
      }
    ]
  },
  "executionPhases": [
    {
      "phase": "Phase 1: Discovery & Audit",
      "timeline": "Week 1-2",
      "highlights": ["string", "string"]
    },
    {
      "phase": "Phase 2: Implementation & Optimization",
      "timeline": "Week 3-6",
      "highlights": ["string", "string"]
    },
    {
      "phase": "Phase 3: Scaling & Automation",
      "timeline": "Week 7+",
      "highlights": ["string", "string"]
    }
  ],
  "charts": [
    {
      "id": "chart_1",
      "title": "Performance Growth Trajectory",
      "type": "bar",
      "unit": "string",
      "dataPoints": [
        { "label": "Month 1", "value": 1500, "baseline": 1200 },
        { "label": "Month 2", "value": 3400, "baseline": 1300 },
        { "label": "Month 3", "value": 6800, "baseline": 1400 },
        { "label": "Month 4", "value": 11200, "baseline": 1500 }
      ]
    }
  ],
  "beforeAfter": [
    {
      "metric": "string",
      "before": "string",
      "after": "string",
      "impact": "string"
    }
  ],
  "actionMatrix": [
    {
      "area": "string",
      "status": "critical" | "warning" | "good",
      "finding": "string",
      "recommendation": "string",
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "quote": {
    "statement": "string",
    "author": "string",
    "role": "string"
  },
  "nextSteps": [
    {
      "step": "string",
      "owner": "string",
      "timeline": "string"
    }
  ],
  "concludingRemarks": "string",
  "suggestedFileName": "string"
}
`;

    // Build contents payload with optional images
    const contentParts: any[] = [];

    // Add screenshots/images if provided
    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (img.data && img.mimeType) {
          contentParts.push({
            inlineData: {
              data: img.data,
              mimeType: img.mimeType,
            },
          });
        }
      }
    }

    // Add main text prompt
    contentParts.push({
      text: promptInstructions,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: contentParts,
      },
      config: {
        systemInstruction:
          'You are an executive business writer and data visualization strategist. Analyze the provided text, screenshots, spreadsheets, or notes in any language, translate to the requested target language, highlight key wins and metrics, and format as high-fidelity structured JSON.',
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const text = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseErr) {
      // Clean possible wrapper if needed
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Gemini Report Generation Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate report. Please try again.',
    });
  }
});

// Dev and Prod Static / Vite Middlewares
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
