// src/hooks/useSyncOrganization.js
import { useEffect } from "react";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/supabase";

export function useSyncOrganization() {
  const { organization } = useOrganization();
  const { user } = useUser();

  useEffect(() => {
    if (!organization || !user) return;

    const syncOrg = async () => {
      const { id, name } = organization;

      const { error } = await supabase
        .from("organizations")
        .upsert(
          {
            id, // Clerk org_id
            name,
            owner_id: user.id, // ✅ use Clerk user.id mapped to profiles.id
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

      if (error) {
        console.error("Error syncing organization:", error);
      }
    };

    syncOrg();
  }, [organization, user]);
}
