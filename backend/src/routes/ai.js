const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/suggest', async (req, res) => {
  try {
    const { issue } = req.body;
    if (!issue) {
      return res.status(400).json({ error: 'No security issue provided' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a Supabase security expert. Provide a clear and concise solution for this security concern: ${issue}. 
    Focus only on the specific issue and provide practical steps to address it. Keep the response conversational and direct.
    If the input is unclear or too brief, ask for clarification instead of providing generic advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    let suggestion = response.text()
      .replace(/\*\*/g, '')
      .replace(/Analysis of the Security Risk:|Recommended Solutions:|Best Practices to Prevent Similar Issues:|Supabase-Specific Security Features:/g, '')
      .trim();

    if (issue.length < 10) {
      suggestion = "Could you please provide more details about your security concern? This will help me give you specific and actionable advice.";
    }

    return res.json({ suggestion });
  } catch (error) {
    console.error('AI Error:', error);
    return res.status(500).json({ 
      error: 'Failed to get AI suggestion',
      details: error.message 
    });
  }
});

module.exports = router; 