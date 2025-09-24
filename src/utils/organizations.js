import { supabase } from "../lib/supabase";

/** Create new organization */
export async function createOrganization({ id, name, ownerId }) {
  const { data, error } = await supabase
    .from("organizations")
    .insert([{ id, name, owner_id: ownerId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Add member to org */
export async function addOrganizationMember({ organizationId, userId, role }) {
  const { data, error } = await supabase
    .from("organization_members")
    .insert([{ organization_id: organizationId, user_id: userId, role }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Fetch organizations current user belongs to */
export async function fetchUserOrganizations(userId) {
  const { data, error } = await supabase
    .from("organization_members")
    .select(
      `
      organization_id,
      role,
      organizations (*)
    `
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data.map((m) => ({ ...m.organizations, role: m.role }));
}

/** Fetch single organization + members */
export async function fetchOrganizationDetails(orgId) {
  const { data, error } = await supabase
    .from("organizations")
    .select(
      `
      *,
      members:organization_members(
        user_id,
        role,
        profiles(full_name, email, avatar_url)
      )
    `
    )
    .eq("id", orgId)
    .single();

  if (error) throw error;
  return data;
}
