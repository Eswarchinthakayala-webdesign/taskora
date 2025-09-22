"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Star, ArrowRight } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

// ✅ Data
const comparisons = [
  { feature: "Modern UI", taskora: true, jira: false, linear: true, clickup: false },
  { feature: "Simple Kanban + Calendar", taskora: true, jira: true, linear: true, clickup: true },
  { feature: "Real-time Collaboration", taskora: true, jira: true, linear: true, clickup: false },
  { feature: "Fast Performance", taskora: true, jira: false, linear: true, clickup: false },
  { feature: "Affordable Pricing", taskora: true, jira: false, linear: false, clickup: true },
  { feature: "Custom Integrations", taskora: true, jira: true, linear: false, clickup: true },
  { feature: "Analytics Dashboard", taskora: true, jira: true, linear: false, clickup: false },
];

// ✅ Helper for check/cross icons with animation
const FeatureIcon = ({ enabled }) => (
  <motion.div
    whileHover={{ scale: 1.15, rotate: enabled ? 5 : -5 }}
    transition={{ type: "spring", stiffness: 200, damping: 10 }}
    className="flex justify-center"
  >
    {enabled ? (
      <CheckCircle2 className="w-5 h-5 text-orange-500" />
    ) : (
      <XCircle className="w-5 h-5 text-zinc-600" />
    )}
  </motion.div>
);

// ✅ Mobile Comparison Card
const ComparisonCard = ({ row }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3 shadow-md"
  >
    <h3 className="text-white font-semibold text-base">{row.feature}</h3>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400">Taskora</span>
        <FeatureIcon enabled={row.taskora} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-400">Jira</span>
        <FeatureIcon enabled={row.jira} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-400">Linear</span>
        <FeatureIcon enabled={row.linear} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-400">ClickUp</span>
        <FeatureIcon enabled={row.clickup} />
      </div>
    </div>
  </motion.div>
);

export default function ComparisonSection() {
  return (
    <section
      id="comparison"
      className="relative py-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto bg-black rounded-2xl"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,90,0,0.05)_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none" />

      {/* Heading */}
      <div className="relative z-10 text-center mb-14 space-y-3">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
        >
          Why Choose Taskora?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto"
        >
          Compare Taskora side-by-side with leading tools like Jira, Linear, and ClickUp.
        </motion.p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block relative z-10">
        <Card className="bg-black/60 border border-zinc-800 shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <ScrollArea className="w-full">
              <Table className="min-w-[720px] bg-black/40">
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-400 text-left text-sm md:text-base">
                      Features
                    </TableHead>
                    <TableHead className="text-white text-center">
                      <Badge className="bg-orange-600/90 text-black font-semibold">
                        Taskora
                      </Badge>
                    </TableHead>
                    <TableHead className="text-zinc-300 text-center">Jira</TableHead>
                    <TableHead className="text-zinc-300 text-center">Linear</TableHead>
                    <TableHead className="text-zinc-300 text-center">ClickUp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisons.map((row, i) => (
                    <motion.tr
                      key={row.feature}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className={`border-zinc-800 hover:bg-zinc-900/30 transition-colors ${
                        i % 2 === 0 ? "bg-black/20" : "bg-transparent"
                      }`}
                    >
                      <TableCell className="text-white font-medium text-sm md:text-base py-3">
                        {row.feature}
                      </TableCell>
                      <TableCell><FeatureIcon enabled={row.taskora} /></TableCell>
                      <TableCell><FeatureIcon enabled={row.jira} /></TableCell>
                      <TableCell><FeatureIcon enabled={row.linear} /></TableCell>
                      <TableCell><FeatureIcon enabled={row.clickup} /></TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-6 md:hidden relative z-10">
        {comparisons.map((row, i) => (
          <ComparisonCard key={i} row={row} />
        ))}
      </div>

      

    
    </section>
  );
}
