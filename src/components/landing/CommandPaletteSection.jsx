"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Command, Search, Calendar, BarChart3, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// List of available commands
const COMMANDS = [
  { icon: Search, label: "Quick Search", shortcut: "⌘ P" },
  { icon: Calendar, label: "Open Calendar", shortcut: "⌘ C" },
  { icon: BarChart3, label: "View Analytics", shortcut: "⌘ A" },
  { icon: Users, label: "Manage Team", shortcut: "⌘ T" },
];

export default function CommandPaletteSection() {
  const [query, setQuery] = useState("");

  // Filter commands by search query
  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section
      id="command-palette"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      {/* Background dots */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,90,0,0.05)_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none"></div>

      {/* Heading */}
      <div className="relative text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
        >
          Command Palette
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto"
        >
          Supercharge productivity with instant access to tasks, scheduling, and
          insights — all without leaving your keyboard.
        </motion.p>
      </div>

      {/* Command Palette Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative flex justify-center"
      >
        <Card className="w-full max-w-2xl bg-black/50 backdrop-blur-sm border border-orange-500/20 shadow-[0_0_20px_rgba(255,122,28,0.2)] rounded-2xl overflow-hidden">
          {/* Input Row */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 focus-within:shadow-[0_0_12px_rgba(255,122,28,0.4)] transition-shadow">
            <Command className="w-5 h-5 text-orange-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent focus:outline-none text-white placeholder-zinc-500 text-sm"
            />
            <div className="flex items-center gap-1 text-xs text-zinc-400 animate-pulse">
              <Badge className="bg-black text-orange-400 border border-orange-600 px-1.5 py-0.5">
                ⌘
              </Badge>
              <Badge className="bg-black text-orange-400 border border-orange-600 px-1.5 py-0.5">
                K
              </Badge>
            </div>
          </div>

          {/* Command List */}
          <div className="divide-y divide-zinc-800">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ backgroundColor: "rgba(255,90,0,0.07)", x: 4 }}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                >
                  <cmd.icon className="w-4 h-4 text-orange-500" />
                  <span className="text-white text-sm flex-1">
                    {cmd.label}
                  </span>
                  <kbd className="text-xs text-zinc-400">{cmd.shortcut}</kbd>
                </motion.div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-zinc-500 text-sm">
                No matching commands
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
