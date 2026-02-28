import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://luicppaodlualsmwbwce.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_24bJVfkoW3Rd3DWL4e3VYg_U7McZqsa";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
