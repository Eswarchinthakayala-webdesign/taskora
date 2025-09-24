// src/hooks/useOrgAnalytics.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "@clerk/clerk-react";

export function useOrgAnalytics() {
  const { user } = useUser();
  const [data, setData] = useState({
    totalOrgs: 0,
    monthlyOrgs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);

      // Total orgs created
      const { count: total } = await supabase
        .from("organizations")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", user.id);

      // Monthly org counts
      const { data: monthly, error } = await supabase.rpc("get_monthly_org_counts", {
        user_id: user.id,
      });

      if (error) {
        console.error("Error fetching org analytics:", error);
      }

      setData({
        totalOrgs: total || 0,
        monthlyOrgs: monthly || [],
      });
      setLoading(false);
    };

    fetchData();
  }, [user]);

  return { data, loading };
}
