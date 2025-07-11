// src/routes/ai.js
const express = require('express');
const { OpenAI } = require('openai');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/ai/ask -> { prompt: "..." }
router.post('/ask', async (req, res) => {
  const { prompt = '' } = req.body;
  if (!prompt.trim()) {
    return res.status(400).json({ error: 'prompt required' });
  }
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    const answer = response.choices[0].message.content.trim();
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ai_request_failed' });
  }
});

module.exports = router;
