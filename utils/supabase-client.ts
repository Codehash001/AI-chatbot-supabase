// supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tohjtbydvwdnckwjekkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvaGp0YnlkdndkbmNrd2pla2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyNDIyOTksImV4cCI6MjAyOTgxODI5OX0.qq30GQvaSUt_a69TzpBOuakWBwKudU597FFwkoiNQTY';

export const supabase = createClient(supabaseUrl, supabaseKey);
