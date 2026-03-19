import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fdvmvgqlsknkwbyvgxwf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkdm12Z3Fsc2tua3dieXZneHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTE5MjgsImV4cCI6MjA4ODg4NzkyOH0.G_8aK9RzM0EopgXJAxExqlez5J-ADgIc3avL-ACujXs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);