"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
  Slack,
  CalendarDays,
  Trello,
  FileText,
  Mail,
  Zap,
  Loader2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// ---------------- Integration Data ----------------
const INTEGRATIONS = [
  {
    id: "github",
    title: "Git Integration",
    description: "Sync pull requests, commits, and branches.",
    icon: <GitBranch className="w-6 h-6 text-orange-500" />,
  },
  {
    id: "slack",
    title: "Slack Integration",
    description: "Get instant project updates in Slack.",
    icon: <Slack className="w-6 h-6 text-orange-500" />,
  },
  {
    id: "calendar",
    title: "Calendar Integration",
    description: "Sync deadlines with your calendar.",
    icon: <CalendarDays className="w-6 h-6 text-orange-500" />,
  },
  {
    id: "trello",
    title: "Trello Integration",
    description: "Import boards and cards from Trello.",
    icon: <Trello className="w-6 h-6 text-orange-500" />,
  },
  {
    id: "docs",
    title: "Documentation",
    description: "Attach docs and collaborate with your team.",
    icon: <FileText className="w-6 h-6 text-orange-500" />,
  },
  {
    id: "email",
    title: "Email Sync",
    description: "Receive task reminders via email.",
    icon: <Mail className="w-6 h-6 text-orange-500" />,
  },
  {
    id: "automation",
    title: "Zap Automation",
    description: "Automate workflows across apps.",
    icon: <Zap className="w-6 h-6 text-orange-500" />,
  },
  // add more valid icons as needed...
];

// ---------------- Framer Motion Variants ----------------
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ---------------- Component ----------------
export default function IntegrationMarketplace() {
  const [loading, setLoading] = useState(null);
  const [connected, setConnected] = useState([]);

  const handleConnect = (integrationId, title) => {
    setLoading(integrationId);
    setTimeout(() => {
      setConnected((prev) => [...prev, integrationId]);
      setLoading(null);
      toast.success(`${title} connected successfully!`);
    }, 1200);
  };

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,90,0,0.07),transparent_70%)] pointer-events-none"></div>

      {/* Heading */}
      <div className="relative text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
        >
          Integration Marketplace
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-4 text-zinc-400 max-w-2xl mx-auto"
        >
          Connect the tools you already use and love — all in one place.
        </motion.p>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {INTEGRATIONS.map((integration) => (
          <motion.div key={integration.id} variants={itemVariants}>
            <Card className="bg-black/40 border border-zinc-800 rounded-2xl shadow-lg hover:border-orange-600/40 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] transition-all flex flex-col justify-between h-full">
              <CardHeader className="flex items-center gap-3">
                <div className="p-3 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-600/30">
                  {integration.icon}
                </div>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  {integration.title}
                  {connected.includes(integration.id) && (
                    <Badge className="bg-orange-600/90 text-white text-xs">
                      Connected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-4 text-zinc-400 text-sm mt-2">
                <p>{integration.description}</p>
                <Button
                  disabled={
                    loading === integration.id || connected.includes(integration.id)
                  }
                  onClick={() => handleConnect(integration.id, integration.title)}
                  className={`w-full flex items-center justify-center gap-2 text-white hover:opacity-90 ${
                    connected.includes(integration.id)
                      ? "bg-orange-700/80"
                      : "bg-gradient-to-r from-orange-600 to-orange-600"
                  }`}
                >
                  {loading === integration.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : connected.includes(integration.id) ? (
                    "Connected"
                  ) : (
                    "Connect"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
