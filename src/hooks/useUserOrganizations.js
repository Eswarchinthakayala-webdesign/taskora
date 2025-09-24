// src/hooks/useUserOrganizations.js
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/supabase";

export function useUserOrganizations() {
  const { user } = useUser();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrgs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("owner_id", user.id);

      if (error) {
        console.error("Error fetching orgs:", error);
      } else {
        setOrgs(data || []);
      }
      setLoading(false);
    };

    fetchOrgs();
  }, [user]);

  return { orgs, loading };
}
