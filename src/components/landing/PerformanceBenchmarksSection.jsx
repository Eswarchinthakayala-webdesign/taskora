"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Zap, Activity, Server } from "lucide-react";

export default function PerformanceBenchmarksSection() {
  const metrics = [
    {
      icon: Zap,
      label: "API Response Speed",
      value: 120,
      unit: "ms",
      desc: "Blazing-fast API responses ensure smooth user experiences.",
      badge: "Fast",
      tooltip: "Average response across global regions.",
    },
    {
      icon: Activity,
      label: "99.99% Uptime",
      value: 99.99,
      unit: "%",
      desc: "Always available, monitored 24/7 with enterprise SLAs.",
      badge: "Reliable",
      tooltip: "Last 30 days SLA report.",
    },
    {
      icon: Server,
      label: "Global Scaling",
      value: "Millions",
      unit: " req/day",
      desc: "Built to scale reliably across teams of any size.",
      badge: "Scalable",
      tooltip: "Auto-scaling with zero downtime.",
    },
  ];

  // count-up animation for number values
  const [counts, setCounts] = useState(metrics.map(() => 0));
  useEffect(() => {
    metrics.forEach((m, i) => {
      if (typeof m.value === "number") {
        let start = 0;
        const end = m.value;
        const duration = 1500;
        const step = end / (duration / 16);

        const interval = setInterval(() => {
          start += step;
          if (start >= end) {
            start = end;
            clearInterval(interval);
          }
          setCounts((prev) => {
            const newCounts = [...prev];
            newCounts[i] = Number(start.toFixed(2));
            return newCounts;
          });
        }, 16);
      } else {
        // non-number values (e.g., "Millions")
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[i] = m.value;
          return newCounts;
        });
      }
    });
  }, []);

  return (
    <section
      id="performance-benchmarks"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      {/* Background dots */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,122,28,0.06)_1px,transparent_1px)] bg-[length:22px_22px] pointer-events-none"></div>

      {/* Heading */}
      <div className="relative text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
        >
          Performance Benchmarks
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto"
        >
          Built for speed, reliability, and scalability — so Taskora grows with your team without slowing you down.
        </motion.p>
      </div>

      {/* Badge Group */}
      <div className="relative flex justify-center gap-2 mb-10">
        <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/30">Benchmarked</Badge>
        <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/30">Verified</Badge>
        <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/30">Trusted</Badge>
      </div>

      {/* Metrics Grid */}
      <div className="relative grid md:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
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
              className="flex flex-col justify-between h-full p-8 rounded-2xl backdrop-blur-md 
                         border border-orange-500/20 bg-black/60 shadow-[0_0_25px_rgba(255,122,28,0.2)] transition-all"
            >
              {/* Icon + Badge */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative flex flex-col items-center mb-4"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-500/10">
                  <m.icon className="w-7 h-7 text-orange-400" />
                </div>
                <span className="absolute -top-2 -right-2">
                  <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs px-2 py-0.5">
                    {m.badge}
                  </Badge>
                </span>
              </motion.div>

              {/* Value */}
              <h3 className="text-3xl font-extrabold text-white mb-1 text-center">
                {typeof m.value === "number" ? counts[i] : m.value}
                <span className="text-orange-400 text-xl font-semibold ml-1">
                  {m.unit}
                </span>
              </h3>

              {/* Tooltip for extra info */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-zinc-400 cursor-help text-center">
                      {m.label}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 text-zinc-200 border border-orange-500/30">
                    {m.tooltip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <p className="mt-3 text-xs text-zinc-500 text-center">{m.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
