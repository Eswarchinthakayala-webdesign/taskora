"use client";

import React, { Suspense, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, TrendingUp, CalendarCheck, Info } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ---------------- Three.js Animated Particles ----------------
function ParticleField() {
  const particles = useMemo(() => {
    const arr = new Float32Array(3000);
    for (let i = 0; i < 3000; i++) {
      arr[i] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  const ref = React.useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={ref}>
      <Points positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ff7a1c"
          size={0.018}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// ---------------- Roadmap Data ----------------
const roadmapData = {
  now: [
    {
      icon: Clock,
      title: "Advanced Command Palette",
      desc: "Keyboard-first navigation with global actions.",
      badge: "Shipped",
      status: "Complete",
      progress: 100,
      detail:
        "Released to all users. Command palette supports quick actions, search, and navigation.",
    },
    {
      icon: Clock,
      title: "Migration Tools",
      desc: "Import from Jira, Trello, and CSV seamlessly.",
      badge: "In Progress",
      status: "Ongoing",
      progress: 70,
      detail:
        "CSV import/export and Trello migration available. Jira migration rolling out next month.",
    },
  ],
  next: [
    {
      icon: TrendingUp,
      title: "Custom Branding",
      desc: "White-label theming options for enterprises.",
      badge: "Planned",
      status: "Upcoming",
      progress: 30,
      detail:
        "Admins will soon be able to fully customize brand colors, logos, and workspace themes.",
    },
    {
      icon: TrendingUp,
      title: "Mobile App",
      desc: "Native iOS + Android apps with offline mode.",
      badge: "Planned",
      status: "Upcoming",
      progress: 10,
      detail:
        "iOS and Android builds in beta testing. Public release planned for Q4.",
    },
  ],
  later: [
    {
      icon: CalendarCheck,
      title: "AI Insights",
      desc: "Predictive task suggestions and smart analytics.",
      badge: "Future",
      status: "Exploration",
      progress: 0,
      detail:
        "AI roadmap includes intelligent task creation, predictive deadlines, and risk analysis.",
    },
    {
      icon: CalendarCheck,
      title: "Marketplace",
      desc: "Integrations hub for 3rd party apps and plugins.",
      badge: "Future",
      status: "Exploration",
      progress: 0,
      detail:
        "Planned marketplace for integrations with Slack, Notion, GitHub, and more.",
    },
  ],
};

// ---------------- Custom Animated Progress ----------------
function AnimatedProgress({ value }) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="relative h-2 w-full rounded-full overflow-hidden bg-zinc-800"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 shadow-[0_0_10px_rgba(255,122,28,0.7)]"
        style={{ width: `${value}%` }}
      />
    </motion.div>
  );
}

// ---------------- Roadmap Section ----------------
export default function RoadmapSection() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleOpen = (item) => {
    setSelected(item);
    setOpen(true);
  };

  return (
    <section
      id="roadmap"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      {/* Background Three.js */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.4} />
          <Suspense fallback={null}>
            <ParticleField />
          </Suspense>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.25} />
        </Canvas>
      </div>

      {/* Heading */}
      <div className="relative text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
        >
          Product Roadmap
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto text-sm md:text-base"
        >
          What’s available <span className="text-orange-400">now</span>, what’s
          coming <span className="text-orange-400">next</span>, and our plans
          for <span className="text-orange-400">later</span>.
        </motion.p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="now" className="relative">
        <TabsList className="flex justify-center gap-4 mb-10 bg-black/40 p-2 rounded-xl border border-zinc-800 backdrop-blur">
          {["now", "next", "later"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="text-white data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 rounded-md px-4 py-2 transition"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content */}
        {Object.entries(roadmapData).map(([key, items]) => (
          <TabsContent value={key} key={key}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateX: 2, rotateY: -2 }}
                  onClick={() => handleOpen(item)}
                  className="cursor-pointer"
                >
                  <Card
                    className="flex flex-col h-full p-6 rounded-2xl backdrop-blur-md
                               border border-orange-500/20 bg-black/70 shadow-[0_0_20px_rgba(255,122,28,0.15)]
                               transition-all hover:shadow-[0_0_35px_rgba(255,122,28,0.3)]"
                  >
                    {/* Icon + Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-500/10">
                        <item.icon className="w-6 h-6 text-orange-400" />
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs px-2 py-0.5">
                        {item.badge}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-zinc-400 mb-3">{item.desc}</p>

                    {/* Progress + Tooltip */}
                    {item.progress > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 mb-2">
                              <AnimatedProgress value={item.progress} />
                              <Info className="w-4 h-4 text-orange-400" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-black/90 text-zinc-200 border border-orange-500/30 shadow-xl rounded-lg">
                            {item.status} ({item.progress}% done)
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Flowing Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-20 flex items-center justify-center gap-8 text-sm text-zinc-400 relative"
      >
        {["Now", "Next", "Later"].map((step, i) => (
          <React.Fragment key={step}>
            <motion.div
              className="flex flex-col items-center"
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
            >
              <div className="w-3 h-3 rounded-full bg-orange-400 mb-1 animate-pulse" />
              {step}
            </motion.div>
            {i < 2 && (
              <motion.div
                className="w-16 h-0.5 bg-gradient-to-r from-orange-500/50 to-red-500/50"
                animate={{ scaleX: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </React.Fragment>
        ))}
      </motion.div>

      {/* Dialog for Expanded Details */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg bg-black/95 border border-orange-500/20 text-white backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-orange-400">
              {selected?.title}
            </DialogTitle>
          </DialogHeader>
          <p className="mt-3 text-sm text-zinc-300">{selected?.detail}</p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
