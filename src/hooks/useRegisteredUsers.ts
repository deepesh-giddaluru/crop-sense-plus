import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export function useRegisteredUsers() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
      if (!active) return;
      setUsers(data ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { users, loading };
}
