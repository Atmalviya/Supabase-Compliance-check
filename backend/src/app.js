const express = require('express');
const cors = require('cors');
const app = express();
const securityRouter = require('./routes/security');
const authRouter = require('./routes/auth');
const aiRouter = require('./routes/ai');
require('dotenv').config();
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: [
    'https://supabase-compliance-check.atmalviya.cloud',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/security', securityRouter);
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

module.exports = app; 