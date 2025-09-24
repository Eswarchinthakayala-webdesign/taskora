// src/hooks/useOrganizationDetails.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useOrganizationDetails(orgId) {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;

    const fetchOrg = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("organizations")
        .select("id, name, owner_id, created_at, updated_at")
        .eq("id", orgId)
        .single();

      if (error) {
        console.error("Error fetching org:", error);
      } else {
        setOrg(data);
      }
      setLoading(false);
    };

    fetchOrg();
  }, [orgId]);

  return { org, loading };
}
