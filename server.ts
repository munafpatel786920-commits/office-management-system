import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);

// Initialize Gemini SDK if API key is present
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// AI HR Assistant Endpoint
app.post('/api/ai/assistant', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!ai) {
      return res.status(500).json({ 
        error: 'Gemini API Key not configured. Please set GEMINI_API_KEY in secrets.' 
      });
    }

    const systemInstruction = `You are WorkPulse AI, an expert HR assistant and office management advisor in a modern SaaS company. You help HR managers, administrators, and employees with actionable insights, employee engagement tips, policy drafting, productivity tips, and data summary. Be professional, encouraging, concise, and structured.`;

    const fullPrompt = `${systemInstruction}\n\nContext Data:\n${JSON.stringify(context || {})}\n\nUser Question/Request:\n${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate AI response' });
  }
});

// Setup Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
