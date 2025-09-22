// /api/clerk-webhook.js
import { Webhook } from "@clerk/clerk-sdk-node";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const signature = req.headers["clerk-signature"];
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  let event;
  try {
    // Verify the webhook signature
    event = Webhook.verify(req.body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  try {
    // Handle only user.deleted events
    if (event.type === "user.deleted") {
      const userId = event.data.id;
      console.log("Deleting Supabase profile for user:", userId);

      const { error } = await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        console.error("Supabase delete error:", error.message);
        return res.status(500).json({ error: error.message });
      }

      console.log("Supabase profile deleted successfully");
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
