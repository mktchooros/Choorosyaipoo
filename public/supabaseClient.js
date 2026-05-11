// Initialize Supabase client
const config = window.SUPABASE_CONFIG || {};
const SUPABASE_URL = config.url;
const SUPABASE_ANON_KEY = config.anonKey;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY ||
    SUPABASE_URL.includes('YOUR_PROJECT_ID') ||
    SUPABASE_ANON_KEY.includes('YOUR_ANON_KEY')) {
  throw new Error('Missing Supabase credentials. Please update config.js with your project credentials.');
}

window.supabase = window.supabase || supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
