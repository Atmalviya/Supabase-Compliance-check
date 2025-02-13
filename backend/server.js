require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { router: authRoutes, getAdminClient } = require('./src/routes/auth');
const securityRoutes = require('./src/routes/security');
const aiRoutes = require('./src/routes/ai');

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

// Use admin client middleware for protected routes
app.use('/api/security', getAdminClient, securityRoutes);
app.use('/api/ai', getAdminClient, aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 