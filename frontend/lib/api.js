const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let sessionToken = null;

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const token = api.auth.getSessionToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const api = {
  auth: {
    login: async (credentials) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      if (response.ok) {
        sessionToken = data.sessionToken;
        localStorage.setItem('sessionToken', sessionToken);
      }
      return data;
    },
    logout: async () => {
      try {
        sessionToken = null;
        localStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        return { success: true };
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    },
    getSessionToken: () => {
      if (!sessionToken) {
        sessionToken = localStorage.getItem('sessionToken');
      }
      return sessionToken;
    },
    getUser: async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/user`, {
          headers: getHeaders()
        });
        
        if (!response.ok) {
          return null;
        }
        
        return response.json();
      } catch (error) {
        return null;
      }
    },
    signup: async (credentials) => {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return res.json();
    },
  },
  ai: {
    suggest: async (issue) => {
      try {
        console.log('Sending request to AI endpoint:', { issue });
        
        const response = await fetch(`${API_URL}/api/ai/suggest`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ issue })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get AI suggestion');
        }

        return response.json();
      } catch (error) {
        console.error('AI API Error:', error);
        throw error;
      }
    }
  },
  security: {
    getStats: async () => {
      const cacheKey = 'security_stats';
      const cached = cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }

      const response = await fetch(`${API_URL}/api/security/stats`, {
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    },
    enableMFA: async (userId) => {
      const response = await fetch(`${API_URL}/api/security/mfa/enable`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to enable MFA');
      }
      
      return response.json();
    },
    enableRLS: async (tableId) => {
      const response = await fetch(`${API_URL}/api/security/rls/enable`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ tableId })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to enable RLS');
      }
      
      return response.json();
    },
    enablePITR: async (projectId) => {
      const response = await fetch(`${API_URL}/api/security/pitr/enable`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ projectId })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to enable PITR');
      }
      
      return response.json();
    }
  }
}; 