import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : null;

// Inserts one RSVP. The table's RLS policy allows anonymous inserts only, so the
// public anon key cannot read back anyone's responses.
export async function saveRsvp({ name, company, attendance }) {
  if (!supabase) throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.');
  const { error } = await supabase.from('rsvps').insert({ name, company, attending: attendance === 'yes' });
  if (error) {
    console.error('Supabase insert failed', error);
    throw new Error('Could not save your response. Please try again.');
  }
}
