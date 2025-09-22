"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// ---------------- Mock Data ----------------
const burndownData = [
  { day: "Mon", tasks: 50 },
  { day: "Tue", tasks: 42 },
  { day: "Wed", tasks: 38 },
  { day: "Thu", tasks: 28 },
  { day: "Fri", tasks: 20 },
  { day: "Sat", tasks: 12 },
  { day: "Sun", tasks: 5 },
];

const teamPerformance = [
  { name: "Eswar", tasks: 18 },
  { name: "Sriram", tasks: 12 },
  { name: "Vamsi", tasks: 15 },
  { name: "Sai", tasks: 20 },
];

const statusDistribution = [
  { name: "To Do", value: 12 },
  { name: "In Progress", value: 25 },
  { name: "Review", value: 8 },
  { name: "Done", value: 45 },
];

const COLORS = ["#f97316", "#ef4444", "#22c55e", "#f97316"];

// ---------------- Custom Tooltip ----------------
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-orange-600 rounded-lg px-3 py-2 text-sm shadow-md">
        <p className="text-orange-400 font-semibold">{label}</p>
        <p className="text-zinc-200">
          {payload[0].name}: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// ---------------- Main Dashboard ----------------
export default function AnalyticsDashboard() {
  return (
    <section
      id="analytics"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      {/* Heading */}
      <div className="relative text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 bg-clip-text text-transparent"
        >
          Analytics Dashboard
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto"
        >
          Track progress, measure outcomes, and optimize delivery with
          real-time insights.
        </motion.p>
      </div>

      {/* Analytics Grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Burndown Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-black/40 border border-zinc-800 hover:border-orange-600 transition-colors rounded-xl shadow-lg h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Burndown Chart
                <Badge className="bg-orange-600/80 text-black">Sprint</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={burndownData}>
                  <defs>
                    <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke="#f97316"
                    fillOpacity={1}
                    fill="url(#orangeGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Performance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Card className="bg-black/40 border border-zinc-800 hover:border-orange-600 transition-colors rounded-xl shadow-lg h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Team Performance
                <Badge className="bg-black border border-orange-600 text-orange-400">
                  Members
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="tasks" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-black/40 border border-zinc-800 hover:border-orange-600 transition-colors rounded-xl shadow-lg h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Status Distribution
                <Badge className="bg-zinc-900 text-orange-400">Tasks</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#f97316"
                    dataKey="value"
                    label
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
