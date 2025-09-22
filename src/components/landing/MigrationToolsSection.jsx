"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, FileSpreadsheet, RefreshCw } from "lucide-react";

export default function MigrationToolsSection() {
  const tools = [
    {
      icon: Upload,
      title: "Easy Import",
      desc: "Bring your existing projects from Jira, Trello, or CSV in a few clicks.",
      badge: "Import",
    },
    {
      icon: Download,
      title: "One-Click Export",
      desc: "Export projects, tasks, and reports in CSV or JSON anytime.",
      badge: "Export",
    },
    {
      icon: FileSpreadsheet,
      title: "CSV Compatible",
      desc: "Seamless CSV uploads for tasks and projects with field mapping.",
      badge: "CSV",
    },
    {
      icon: RefreshCw,
      title: "Smooth Transition",
      desc: "Keep teams moving with minimal disruption during migration.",
      badge: "Seamless",
    },
  ];

  return (
    <section
      id="migration-tools"
      className="relative py-20 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,122,28,0.06)_1px,transparent_1px)] bg-[length:22px_22px] pointer-events-none"></div>

      {/* Heading */}
      <div className="relative text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
        >
          Migration Tools
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto text-sm md:text-base"
        >
          Switch to Taskora without missing a beat — simple import/export options make migrating from Jira or Trello effortless.
        </motion.p>
      </div>

      {/* Tools Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateX: 2, rotateY: -2 }}
            className="h-full"
          >
            <Card
              className="flex flex-col justify-between h-full p-6 rounded-2xl backdrop-blur-md
                         border border-orange-500/20 bg-black/60 shadow-[0_0_25px_rgba(255,122,28,0.2)] transition-all"
            >
              {/* Icon + Badge */}
              <div className="relative flex flex-col items-center text-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-500/10 mb-2"
                >
                  <tool.icon className="w-7 h-7 text-orange-400" />
                </motion.div>
                <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs px-2 py-0.5 mb-2">
                  {tool.badge}
                </Badge>
                <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
              </div>

              {/* Description */}
              <p className="text-sm md:text-base text-zinc-400 text-center">
                {tool.desc}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
