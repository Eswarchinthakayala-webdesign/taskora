"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ListChecks,
  Users,
  BarChart3,
  Calendar,
  Smartphone,
  Store,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TASK_SETS = [
  [
    { icon: Calendar, label: "Design Sprint", detail: "Due Today" },
    { icon: Users, label: "Team Standup", detail: "10:00 AM" },
    { icon: BarChart3, label: "Weekly Report", detail: "Ready" },
  ],
  [
    { icon: ListChecks, label: "Product Roadmap", detail: "Review" },
    { icon: Users, label: "Hiring Round", detail: "3:00 PM" },
    { icon: Calendar, label: "Investor Call", detail: "Tomorrow" },
  ],
];

export default function MobileAppPreview() {
  const [taskIndex, setTaskIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Auto-cycle content every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setTaskIndex((prev) => (prev + 1) % TASK_SETS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="mobile-preview"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      {/* Background dots with shimmer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,90,0,0.07)_1px,transparent_1px)] [background-size:22px_22px] animate-[pulse_8s_ease-in-out_infinite] pointer-events-none"></div>

      {/* Heading */}
      <div className="relative text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
        >
          Taskora on Mobile
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto"
        >
          Stay productive anywhere with Taskora for iOS and Android. Manage
          tasks, collaborate with your team, and track progress on the go.
        </motion.p>
      </div>

      {/* Mockups */}
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-10">
        {/* iOS style mockup */}
        <FloatingMockup
          title="My Tasks"
          tasks={TASK_SETS[taskIndex]}
          onExpand={() => setDialogOpen(true)}
        />

        {/* Android style mockup */}
        <FloatingAnalytics />
      </div>

      {/* CTA Store Badges */}
      <div className="relative text-center mt-16">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-black font-semibold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <Smartphone size={18} /> Download on iOS
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-black font-semibold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <Store size={18} /> Get it on Android
          </Button>
        </motion.div>
      </div>

      {/* Expandable Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border border-orange-500/30 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-orange-400">Taskora Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {TASK_SETS[taskIndex].map((task, idx) => (
              <Card
                key={idx}
                className="bg-black/40 border border-zinc-800 p-3 flex items-center gap-2"
              >
                <task.icon className="w-4 h-4 text-orange-400" />
                <span className="text-zinc-300 text-sm">{task.label}</span>
                <span className="ml-auto text-zinc-500 text-xs">{task.detail}</span>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* Floating mockup for iOS tasks */
function FloatingMockup({ title, tasks, onExpand }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      viewport={{ once: true }}
      whileHover={{ rotateX: 5, rotateY: -5 }}
      className="w-[260px] md:w-[300px] rounded-[2rem] bg-black/60 backdrop-blur-md border border-transparent shadow-[0_0_40px_rgba(255,122,28,0.2)] p-4"
      style={{
        background:
          "linear-gradient(#05060a, #05060a) padding-box, linear-gradient(to right, #ff7a1c, #ff4d00) border-box",
      }}
      onClick={onExpand}
    >
      <div className="text-white font-semibold mb-3 flex items-center gap-2">
        <ListChecks className="w-4 h-4 text-orange-400" /> {title}
      </div>
      {tasks.map((task, idx) => (
        <Card
          key={idx}
          className="bg-zinc-900/70 p-3 mb-3 border border-zinc-800 flex items-center gap-2"
        >
          <task.icon className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-zinc-300 flex-1">{task.label}</span>
          <span className="text-xs text-zinc-500">{task.detail}</span>
        </Card>
      ))}
    </motion.div>
  );
}

/* Floating mockup for Android analytics */
function FloatingAnalytics() {
  const [users, setUsers] = useState(0);

  // Count-up animation
  useEffect(() => {
    let start = 0;
    const end = 124;
    const duration = 1500;
    const step = Math.ceil(end / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(interval);
      }
      setUsers(start);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      viewport={{ once: true }}
      whileHover={{ rotateX: -5, rotateY: 5 }}
      className="w-[260px] md:w-[300px] rounded-[1.5rem] bg-black/60 backdrop-blur-md border border-transparent shadow-[0_0_40px_rgba(255,122,28,0.2)] p-4"
      style={{
        background:
          "linear-gradient(#05060a, #05060a) padding-box, linear-gradient(to right, #ff7a1c, #ff4d00) border-box",
      }}
    >
      <div className="text-white font-semibold mb-3 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-orange-400" /> Analytics
      </div>
      <Card className="bg-zinc-900/70 p-3 mb-3 border-zinc-800 text-sm text-zinc-300">
        Project Progress <span className="float-right text-orange-400">76%</span>
      </Card>
      <Card className="bg-zinc-900/70 p-3 mb-3 border-zinc-800 text-sm text-zinc-300">
        Active Users <span className="float-right text-orange-400">{users}</span>
      </Card>
      <Card className="bg-zinc-900/70 p-3 border-zinc-800 text-sm text-zinc-300">
        Open Issues <span className="float-right text-orange-400">12</span>
      </Card>
    </motion.div>
  );
}
