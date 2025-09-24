// src/hooks/useDeleteOrganization.js
import { useUser } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

// Use Supabase service role key to bypass RLS safely
const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

export function useDeleteOrganization() {
  const { user, isSignedIn } = useUser();

  const deleteOrganization = async (orgId) => {
    if (!isSignedIn || !user) return;

    try {
      console.log("Deleting organization from Supabase:", orgId);

      // Delete organization row from Supabase using service role key
      const { error: supabaseError, data } = await supabaseAdmin
        .from("organizations")
        .delete()
        .eq("id", orgId);

      if (supabaseError) {
        console.error("Supabase delete error:", supabaseError.message);
      } else {
        console.log("Organization deleted successfully:", data);
      }
    } catch (err) {
      console.error("Failed to delete organization:", err);
    }
  };

  return { deleteOrganization };
}
