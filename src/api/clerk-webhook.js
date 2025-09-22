// /api/clerk-webhook.js
import { createClient } from "@supabase/supabase-js";

// Use the SERVICE_ROLE_KEY here — safe because this runs on the server
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const event = req.body;

  try {
    // Only handle user.deleted events
    if (event.type === "user.deleted") {
      const userId = event.data.id;
      console.log("Deleting Supabase profile for user:", userId);

      const { error } = await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        console.error("Supabase delete error:", error.message);
      } else {
        console.log("Supabase profile deleted successfully");
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
