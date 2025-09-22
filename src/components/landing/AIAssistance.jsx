"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, User, Flame, Zap, Feather, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ---------------- Demo Data ----------------
const DEMO_TASKS = [
  { id: 1, title: "Fix login bug", urgency: "high" },
  { id: 2, title: "Write unit tests", urgency: "medium" },
  { id: 3, title: "Update documentation", urgency: "low" },
  { id: 4, title: "Refactor dashboard", urgency: "medium" },
];

const TEAM = ["Eswar", "Sriram", "Vamsi"];

// ---------------- AI Assistance Component ----------------
export default function AIAssistance() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fake AI auto-prioritization
  const handleAutoAssign = () => {
    setLoading(true);

    setTimeout(() => {
      const autoTasks = DEMO_TASKS.map((task) => {
        const assignee =
          TEAM[Math.floor(Math.random() * TEAM.length)];
        let priority =
          task.urgency === "high"
            ? { label: "High", icon: <Flame className="w-3 h-3 mr-1" /> }
            : task.urgency === "medium"
            ? { label: "Medium", icon: <Zap className="w-3 h-3 mr-1" /> }
            : { label: "Low", icon: <Feather className="w-3 h-3 mr-1" /> };

        return { ...task, assignee, priority };
      });

      setTasks(autoTasks);
      setLoading(false);

      // Toast notification
      toast.success("AI successfully prioritized and assigned tasks");
    }, 1200);
  };

  return (
    <section className="relative py-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
        >
          AI Assistance
        </motion.h2>
        <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
          Let AI automatically prioritize and assign tasks to your team —
          speeding up workflow and balancing workloads.
        </p>
      </div>

      {/* AI Button */}
      <div className="flex justify-center mb-10">
        <Button
          onClick={handleAutoAssign}
          disabled={loading}
          className="bg-gradient-to-r from-orange-600 to-red-500 text-white px-6 py-2 rounded-xl shadow-lg hover:opacity-90 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Auto Assign Tasks
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      <div className="grid gap-6 md:grid-cols-2 ">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="bg-black/40 border border-zinc-800 rounded-xl shadow-md hover:border-orange-500 hover:shadow-orange-500/20 transition">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white text-lg">
                    {task.title}
                  </CardTitle>
                  <Badge
                    className={`flex items-center ${
                      task.priority.label === "High"
                        ? "bg-red-600/80 text-white"
                        : task.priority.label === "Medium"
                        ? "bg-orange-500/80 text-black"
                        : "bg-zinc-700 text-zinc-200"
                    }`}
                  >
                    {task.priority.icon}
                    {task.priority.label}
                  </Badge>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-zinc-300">
                  <User className="w-4 h-4 text-orange-500" />
                  Assigned to:{" "}
                  <span className="font-semibold text-white">
                    {task.assignee}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
