"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Bot,
  Users,
  Link2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Kanban Boards",
    description:
      "Visualize work, manage tasks, and keep projects on track with intuitive drag-and-drop boards.",
    icon: LayoutDashboard,
    badge: "Organize",
    badgeColor: "bg-gradient-to-r from-orange-500 to-red-600 text-black",
  },
  {
    title: "Smart Scheduling",
    description:
      "Plan sprints, deadlines, and calendars with ease and flexibility for all team sizes.",
    icon: Calendar,
    badge: "Schedule",
    badgeColor: "bg-black border border-orange-600 text-orange-400",
  },
  {
    title: "Advanced Metrics",
    description:
      "Measure productivity and outcomes with detailed analytics and progress tracking.",
    icon: BarChart3,
    badge: "Measure",
    badgeColor: "bg-zinc-900 text-orange-500",
  },
  {
    title: "AI Assistance",
    description:
      "Automated task suggestions and insights powered by cutting-edge intelligence.",
    icon: Bot,
    badge: "Smart",
    badgeColor: "bg-gradient-to-r from-red-600 to-orange-500 text-black",
  },
  {
    title: "Collaboration Tools",
    description:
      "Seamless communication and teamwork with comments, mentions, and shared boards.",
    icon: Users,
    badge: "Teamwork",
    badgeColor: "bg-zinc-800 text-orange-400",
  },
  {
    title: "Integrations",
    description:
      "Connect with GitHub, Slack, Google Calendar, and more to unify your workflow.",
    icon: Link2,
    badge: "Connect",
    badgeColor: "bg-orange-700 text-black",
  },
];

export default function KeyFeatures() {
  return (
    <section
      id="features"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      {/* Background dotted grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,90,0,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      {/* Heading */}
      <div className="relative text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
        >
          Key Features
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto"
        >
          Taskora combines the essentials of modern project management with
          intelligent tools to help your team deliver faster and smarter.
        </motion.p>
      </div>

      {/* Features Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.12,
                duration: 0.6,
                type: "spring",
                stiffness: 60,
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 0px 20px rgba(249,115,22,0.35)",
              }}
              className="h-full"
            >
              <Card className="h-full flex flex-col bg-black/40 border border-zinc-800 hover:border-orange-600 transition-colors rounded-xl shadow-lg">
                <CardHeader className="flex flex-col gap-3">
                  <Badge
                    className={`${feature.badgeColor} w-fit px-3 py-1 text-sm font-semibold shadow-md`}
                  >
                    {feature.badge}
                  </Badge>
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 12, scale: 1.15 }}
                      className="p-2 rounded-lg bg-orange-600/20 border border-orange-600"
                    >
                      <Icon className="w-6 h-6 text-orange-500" />
                    </motion.div>
                    <CardTitle className="text-lg font-bold text-white">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
