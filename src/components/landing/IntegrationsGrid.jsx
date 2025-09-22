"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Slack, CalendarDays, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// ---------------- Integration Data ----------------
const INTEGRATIONS = [
  {
    id: "git",
    title: "GitHub Integration",
    description: "Sync commits, pull requests, and branches directly into Taskora.",
    icon: <GitBranch className="w-6 h-6 " />,
    action: "Connect GitHub",
  },
  {
    id: "slack",
    title: "Slack Integration",
    description: "Get instant project updates and task notifications in Slack.",
    icon: <Slack className="w-6 h-6 " />,
    action: "Connect Slack",
  },
  {
    id: "calendar",
    title: "Calendar Integration",
    description: "Schedule tasks and deadlines seamlessly with your calendar.",
    icon: <CalendarDays className="w-6 h-6 " />,
    action: "Connect Calendar",
  },
];

// ---------------- Framer Motion Variants ----------------
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ---------------- Component ----------------
export default function IntegrationsGrid() {
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
    <section className="relative py-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
        >
          Powerful Integrations
        </motion.h2>
        <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
          Connect your favorite tools and supercharge productivity —
          Taskora works seamlessly with GitHub, Slack, and Calendar.
        </p>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {INTEGRATIONS.map((integration) => (
          <motion.div key={integration.id} variants={itemVariants}>
            <Card className="bg-black/40 border border-zinc-800 rounded-2xl shadow-lg hover:border-orange-600/40 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] transition-all">
              <CardHeader className="flex items-center gap-3">
                <div className="p-3 rounded-xl text-orange-500 flex items-center justify-center bg-orange-500/10 border border-orange-600/30">
                  {integration.icon}
                </div>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  {integration.title}
                  {connected.includes(integration.id) && (
                    <Badge className="bg-orange-600/90 text-white">
                      Connected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-zinc-400 text-sm flex flex-col gap-4">
                <p>{integration.description}</p>
                <Button
                  disabled={
                    loading === integration.id || connected.includes(integration.id)
                  }
                  onClick={() => handleConnect(integration.id, integration.title)}
                  className={`w-full flex items-center cursor-pointer justify-center gap-2 text-white hover:opacity-90 ${
                    connected.includes(integration.id)
                      ? "bg-orange-700/80"
                      : "bg-gradient-to-r from-orange-600 to-red-500"
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
                    <>
                      <p className="text-black">{integration.icon}</p>
                      {integration.action}
                    </>
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
