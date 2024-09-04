import { createClient, Session } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qbnoxzexeubyphpnnuqv.supabase.co",
  import.meta.env.VITE_APP_ANON_KEY
);

export default supabase;

export interface props {
  session: Session | null;
}
