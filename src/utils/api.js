// src/utils/api.js
import { supabase } from "../lib/supabase";

/**
 * All functions accept a Clerk `userId` to respect RLS
 */

/** Fetch projects for the logged-in user */
export async function fetchProjects(userId) {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      project_members!inner(user_id)
    `)
    .or(`project_members.user_id.eq."${userId}"`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/** Fetch tasks assigned to the user or their projects */
export async function fetchTasks(userId) {
  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      task_assignees!inner(user_id),
      project:projects!inner(project_members!inner(user_id))
    `)
    .or(`task_assignees.user_id.eq."${userId}",project.project_members.user_id.eq."${userId}"`)
    .order("due_date", { ascending: true });

  if (error) throw error;
  return data;
}

/** Fetch notifications for the logged-in user */
export async function fetchNotifications(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/** Fetch events for projects the user belongs to */
export async function fetchEvents(userId) {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      project:projects!inner(project_members!inner(user_id))
    `)
    .or(`project.project_members.user_id.eq."${userId}"`)
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data;
}

/** Fetch AI suggestions for the logged-in user */
export async function fetchAISuggestions(userId) {
  const { data, error } = await supabase
    .from("ai_suggestions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
