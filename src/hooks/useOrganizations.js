// src/hooks/useOrganizations.js (or similar)
import { useState, useEffect } from "react";
import { useUser , useOrganizationList, useOrganization } from "@clerk/clerk-react";
import {
  fetchUser Organizations, // Supabase: Fetch orgs user is member of (using Clerk user.id)
  fetchOrganizationDetails, // Supabase: Fetch custom org details by Clerk orgId
  createOrganization, // Supabase: Insert org with Clerk orgId
  addOrganizationMember, // Supabase: Add member (optional, since Clerk handles it)
} from "../utils/organizations";

// Custom hook: User's organizations (Clerk-synced with Supabase details)
export function useUser Organizations() {
  const { user } = useUser ();
  const { isLoaded, userMemberships } = useOrganizationList({
    userMemberships: { infinite: true }, // Clerk's real-time list
  });
  const [supabaseOrgs, setSupabaseOrgs] = useState([]); // Enrich Clerk data with Supabase
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !isLoaded) return;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Step 1: Get Clerk's org memberships (real IDs, roles, etc.)
        const clerkOrgs = userMemberships.data || [];

        // Step 2: Fetch/enrich with Supabase custom data (e.g., extra fields like description)
        // Assuming fetchUser Organizations returns Supabase rows with Clerk orgId as key
        const supabaseData = await fetchUser Organizations(user.id);
        
        // Merge: Use Clerk as primary, add Supabase extras
        const mergedOrgs = clerkOrgs.map((clerkOrg) => {
          const supabaseOrg = supabaseData.find((sOrg) => sOrg.id === clerkOrg.organization.id);
          return {
            id: clerkOrg.organization.id, // Real Clerk orgId
            name: clerkOrg.organization.name,
            role: clerkOrg.role, // From Clerk
            ...supabaseOrg, // Merge custom fields (e.g., description, created_at)
          };
        });

        setSupabaseOrgs(mergedOrgs);
      } catch (err) {
        console.error("Error fetching organizations", err);
        setError(err.message || "Failed to load organizations");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, isLoaded, userMemberships.data]);

  // Expose Clerk's pagination too
  return { 
    orgs: supabaseOrgs, 
    loading: loading || !isLoaded, 
    error,
    hasNextPage: userMemberships.hasNextPage,
    fetchNext: userMemberships.fetchNext,
  };
}

// Custom hook: Organization details (Clerk active org + Supabase extras)
export function useOrganizationDetails(orgId) {
  const { organization: activeOrg } = useOrganization(); // Clerk's active org
  const [supabaseOrg, setSupabaseOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orgId) {
      setSupabaseOrg(null);
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Step 1: Get Clerk's org data (if active)
        const clerkOrgData = activeOrg?.id === orgId ? activeOrg : null;

        // Step 2: Fetch Supabase extras (using real Clerk orgId)
        const supabaseData = await fetchOrganizationDetails(orgId);

        // Merge
        setSupabaseOrg({
          id: orgId, // Real Clerk orgId
          ...clerkOrgData, // Clerk fields (name, members, etc.)
          ...supabaseData, // Custom fields (e.g., logo, settings)
        });
      } catch (err) {
        console.error("Error fetching org details", err);
        setError(err.message || "Failed to load organization details");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [orgId, activeOrg]);

  return { org: supabaseOrg, loading, error };
}

// Updated: Handle org creation (Clerk first, then sync to Supabase)
// This is a utility function—call it from a component's afterCreate callback
// Option 1: For <CreateOrganization> component (recommended for your OrganizationsPage)
export async function syncOrganizationToSupabaseAfterCreate(org, user) {
  // org: From Clerk's afterCreateOrganization callback (has real org.id)
  // user: From useUser ()
  try {
    // Insert into Supabase using real Clerk org.id
    const supabaseOrg = await createOrganization({
      id: org.id, // Real Clerk orgId (e.g., org_2abc123def)
      name: org.name,
      ownerId: user.id, // Clerk user.id
      // Add other fields as needed (e.g., created_at: new Date().toISOString())
    });

    // Optional: Sync membership (Clerk auto-adds owner, but if you need custom roles in Supabase)
    // Skip if Supabase members table is just a mirror—use Clerk's useOrganizationMemberships instead
    await addOrganizationMember({
      organizationId: org.id, // Real Clerk orgId
      userId: user.id,
      role: "owner", // From Clerk's default
    });

    console.log("✅ Synced org to Supabase:", supabaseOrg);
    return supabaseOrg;
  } catch (err) {
    console.error("❌ Failed to sync org to Supabase:", err);
    // Optionally, handle rollback (delete from Clerk via backend API—not frontend-safe)
    throw err;
  }
}

// Option 2: Full custom creation (via backend API—secure for forms without <CreateOrganization>)
// Assume you have a server endpoint (e.g., /api/organizations/create) that calls Clerk's backend API
// (See Clerk docs: https://clerk.com/docs/reference/backend-api/organizations#create-organization)
export async function handleCreateOrganization(user, orgName) {
  if (!user) throw new Error("User  not authenticated");

  try {
    // Step 1: Call your backend to create in Clerk (returns real orgId)
    const response = await fetch("/api/organizations/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: orgName,
        // Optional: publicUrl, imageUrl, etc. (Clerk params)
      }),
    });

    if (!response.ok) throw new Error("Failed to create organization in Clerk");

    const { id: clerkOrgId, name } = await response.json(); // Real Clerk orgId

    // Step 2: Sync to Supabase (Clerk auto-adds user as owner)
    const supabaseOrg = await createOrganization({
      id: clerkOrgId, // Real Clerk orgId
      name,
      ownerId: user.id,
    });

    // Optional: Add member if needed (usually not, as Clerk handles)
    // await addOrganizationMember({ organizationId: clerkOrgId, userId: user.id, role: "owner" });

    console.log("✅ Created and synced org:", supabaseOrg);
    return { ...supabaseOrg, id: clerkOrgId };
  } catch (err) {
    console.error("❌ Error creating organization:", err);
    throw err;
  }
}