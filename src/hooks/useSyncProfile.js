// src/hooks/useSyncProfile.js
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/supabase";

export function useSyncProfile() {
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user || !isLoaded) return;

    const sync = async () => {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        full_name: user.fullName,
        avatar_url: user.imageUrl,
        github_id:
          user.externalAccounts.find((acc) => acc.provider === "oauth_github")
            ?.providerUserId || null,
        google_id:
          user.externalAccounts.find((acc) => acc.provider === "oauth_google")
            ?.providerUserId || null,
        updated_at: new Date().toISOString(),
      });

      if (error) console.error("Profile sync failed:", error);
    };

    sync();
  }, [isSignedIn, isLoaded, user]);
}
