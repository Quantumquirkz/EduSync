import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import type { Session } from '@supabase/supabase-js';

/**
 * Small convenience hook to access the current Supabase session and its loading state.
 */
export function useSupabase() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading } as const;
}