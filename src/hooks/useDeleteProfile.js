// src/hooks/useDeleteProfile.js
import { useUser } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

// Use Supabase service role key to bypass RLS safely
const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

export function useDeleteProfile() {
  const { user, isSignedIn } = useUser();

  const deleteProfile = async () => {
    if (!isSignedIn || !user) return;

    try {
      console.log("Deleting Supabase profile for user:", user.id);

      // Delete user row from Supabase using service role key
      const { error: supabaseError } = await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (supabaseError) {
        console.error("Supabase delete error:", supabaseError.message);
      } else {
        console.log("Supabase profile deleted successfully");
      }

      // Delete Clerk user account
      await user.delete();
      console.log("Clerk user deleted successfully");

      // Redirect to signup page
      window.location.href = "/signup";
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  return { deleteProfile };
}
