import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * 🔗 SUPABASE CLIENT SETUP
 * This client uses the Service Role Key for full admin access (no RLS).
 * Best for the backend server to pull all data for the dashboard.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
