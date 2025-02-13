const { createClient } = require('@supabase/supabase-js');

const createSupabaseClient = (url, key) => {
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

module.exports = { createSupabaseClient }; 