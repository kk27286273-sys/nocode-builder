import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldhyemuuzghejojduibr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpdWV6d3NkYmN1cWNobnl1cmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODY0ODIsImV4cCI6MjEwNjE2MjQ4Mn0.ObxXNqVtJRcMyZNovgnUhVESPa7El9RKJzIIyvb4N2E1';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
