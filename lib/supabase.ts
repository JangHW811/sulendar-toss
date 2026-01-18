import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://spaieqwgqpaxmhmkvdqp.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwYWllcXdncXBheG1obWt2ZHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTQyMDAsImV4cCI6MjA4Mzk3MDIwMH0.rstkMjV-M1lUy5RoB2uWV_w-gRbDac-BJAQxZIsKMaA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
