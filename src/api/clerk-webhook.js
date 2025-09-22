// /api/clerk-webhook.js
import { createClient } from "@supabase/supabase-js";
import { Webhook } from "@clerk/clerk-sdk-node";
import getRawBody from "raw-body";

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// Disable default body parsing (we need raw body for signature verification)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    // Get raw request body
    const buf = await getRawBody(req);
    const rawBody = buf.toString();

    // Get Clerk signature header
    const signature = req.headers["clerk-signature"];
    if (!signature) {
      return res.status(400).json({ error: "Missing Clerk signature header" });
    }

    // Verify webhook
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    let event;
    try {
      event = Webhook.verifyWebhookRequest(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

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
        return res.status(500).json({ error: "Failed to delete profile" });
      }

      console.log("Supabase profile deleted successfully");
    }

    // Respond OK to Clerk
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
