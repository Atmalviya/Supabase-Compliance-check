const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { loginLogger } = require('../lib/logger');

const adminSessions = new Map();

router.post('/login', async (req, res) => {
  const { supabaseUrl, serviceKey } = req.body;
  
  try {
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;

    const sessionToken = require('crypto').randomBytes(32).toString('hex');
    
    adminSessions.set(sessionToken, {
      supabaseUrl,
      serviceKey,
      createdAt: new Date()
    });

    loginLogger.info(`Admin logged in successfully for project ${supabaseUrl}`);
    
    return res.status(200).json({ 
      sessionToken,
      message: 'Logged in successfully'
    });
  } catch (error) {
    console.error('Login error:', error);
    loginLogger.error(`Admin login failed for project ${supabaseUrl}: ${error.message}`);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

const getAdminClient = (req, res, next) => {
  const sessionToken = req.headers.authorization?.split(' ')[1];
  if (!sessionToken) {
    return res.status(401).json({ error: 'No session token provided' });
  }

  const adminSession = adminSessions.get(sessionToken);
  if (!adminSession) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  const sessionAge = Date.now() - adminSession.createdAt.getTime();
  if (sessionAge > 24 * 60 * 60 * 1000) {
    adminSessions.delete(sessionToken);
    return res.status(401).json({ error: 'Session expired' });
  }

  req.supabaseAdmin = createClient(adminSession.supabaseUrl, adminSession.serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  next();
};

router.get('/user', async (req, res) => {
  const sessionToken = req.headers.authorization?.split(' ')[1];
  if (!sessionToken) {
    return res.status(401).json({ error: 'No session token provided' });
  }

  const adminSession = adminSessions.get(sessionToken);
  if (!adminSession) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  return res.status(200).json({ 
    user: {
      id: sessionToken,
      email: 'admin@supabase',
      role: 'admin',
      project_url: adminSession.supabaseUrl,
      last_sign_in: adminSession.createdAt
    }
  });
});

module.exports = { router, getAdminClient }; 