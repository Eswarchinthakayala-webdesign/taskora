"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BarChart3, Target } from "lucide-react";

export default function CustomerStoriesSection() {
  const stories = [
    {
      icon: Users,
      company: "Acme Corp",
      badge: "Enterprise",
      problem: "Struggling with siloed tools and sluggish workflows.",
      solution: "Adopted Taskora to unify project tracking and streamline collaboration.",
      result: "+40% Productivity",
      impact: "Teams reduced wasted time and accelerated delivery cycles by nearly half.",
    },
    {
      icon: BarChart3,
      company: "Growthly",
      badge: "Startup",
      problem: "Deadlines consistently missed due to poor visibility.",
      solution: "Leveraged Taskora’s agile boards and real-time analytics.",
      result: "2x Faster Delivery",
      impact: "Product teams doubled velocity while improving customer satisfaction scores.",
    },
    {
      icon: Target,
      company: "FinEdge",
      badge: "Finance",
      problem: "Compliance and scaling challenges with legacy tools.",
      solution: "Migrated securely to Taskora with enterprise-grade RBAC & SSO.",
      result: "99.9% SLA Compliance",
      impact: "Handled millions of requests daily without a single downtime incident.",
    },
  ];

  return (
    <section
      id="customer-stories"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,122,28,0.05)_1px,transparent_1px)] bg-[length:22px_22px] pointer-events-none"></div>

      {/* Heading */}
      <div className="relative text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
        >
          Customer Stories
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto text-sm md:text-base"
        >
          Discover how innovative teams use <span className="text-orange-400 font-semibold">Taskora</span> to overcome challenges and achieve measurable results.
        </motion.p>
      </div>

      {/* Stories Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateX: 2, rotateY: -2 }}
          >
            <Card
              className="flex flex-col h-full p-6 rounded-2xl backdrop-blur-md
                         border border-orange-500/20 bg-black/60 shadow-[0_0_25px_rgba(255,122,28,0.2)] 
                         transition-all hover:shadow-[0_0_35px_rgba(255,122,28,0.3)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-500/10">
                    <story.icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {story.company}
                  </h3>
                </div>
                <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs px-2 py-0.5">
                  {story.badge}
                </Badge>
              </div>

              {/* Story Content */}
              <div className="flex-1 flex flex-col gap-2 text-sm text-zinc-400">
                <p>
                  <span className="text-white font-medium">Challenge: </span>
                  {story.problem}
                </p>
                <p>
                  <span className="text-white font-medium">Solution: </span>
                  {story.solution}
                </p>
                <p className="text-orange-400 font-semibold text-base mt-2">
                  {story.result}
                </p>
                <p className="italic text-zinc-500 text-xs">{story.impact}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
