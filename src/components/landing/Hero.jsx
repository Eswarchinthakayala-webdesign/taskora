"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Server,
  Users,
  Clock,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import CompanyMarquee from "./CompanyMarquee";
import { useNavigate } from "react-router";

const DARK_BG = "#050505";

// Animated counter hook
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime = performance.now();
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      setCount(value);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [target, duration]);
  return count;
}
const fade = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(6px)" },
  transition: { duration: 0.28, ease: "easeOut" },
};

export default function Hero() {
  const teams = useCounter(120);
  const uptime = useCounter(99);
  const enterprise = useCounter(50);
  const navigate=useNavigate()
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${DARK_BG}, #0b0b0b)` }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="w-full lg:w-1/2">
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold leading-tight"
            >
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
                Taskora
              </span>{" "}
              <span className="text-white">— organize, track, and deliver smarter.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-4 text-zinc-300 text-lg max-w-xl"
            >
              A single workspace for tasks, sprints, and reports. Built for modern teams who want
              clarity, speed, and confidence in every delivery.
            </motion.p>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-black font-semibold shadow-lg"
               
               onClick={()=>navigate("/signup")}>
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <Badge className="flex items-center gap-1 bg-orange-600/90 text-black font-medium px-2 py-1">
                  <Users className="w-4 h-4" /> Teams
                </Badge>
                <span className="text-3xl font-bold text-white">{teams}+</span>
                <span className="text-sm text-zinc-400">Trusted companies</span>
              </div>

              <div className="flex flex-col gap-2">
                <Badge className="flex items-center gap-1 bg-black text-orange-500 font-medium px-2 py-1 border border-orange-600">
                  <Server className="w-4 h-4" /> Uptime
                </Badge>
                <span className="text-3xl font-bold text-white">{uptime}.99%</span>
                <span className="text-sm text-zinc-400">Service reliability</span>
              </div>

              <div className="flex flex-col gap-2">
                <Badge className="flex items-center gap-1 bg-zinc-800 text-orange-400 font-medium px-2 py-1">
                  <ShieldCheck className="w-4 h-4" /> Enterprise
                </Badge>
                <span className="text-3xl font-bold text-white">{enterprise}+</span>
                <span className="text-sm text-zinc-400">Enterprise clients</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-xl bg-black/30">
              <img
                src="/hero.png"
                alt="Taskora dashboard preview"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

       <CompanyMarquee/>
        {/* Feature Highlights Row */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3 bg-black/30 p-4 rounded-lg border border-zinc-800">
            <Clock className="w-6 h-6 text-orange-500 mt-1" />
            <div>
              <h3 className="text-white font-semibold">Plan smarter</h3>
              <p className="text-sm text-zinc-400">Organize sprints and tasks with clear timelines.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-black/30 p-4 rounded-lg border border-zinc-800">
            <CheckCircle2 className="w-6 h-6 text-orange-500 mt-1" />
            <div>
              <h3 className="text-white font-semibold">Track progress</h3>
              <p className="text-sm text-zinc-400">Keep teams aligned with Kanban boards.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-black/30 p-4 rounded-lg border border-zinc-800">
            <BarChart3 className="w-6 h-6 text-orange-500 mt-1" />
            <div>
              <h3 className="text-white font-semibold">Measure outcomes</h3>
              <p className="text-sm text-zinc-400">Gain insights from reports and analytics.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-black/30 p-4 rounded-lg border border-zinc-800">
            <ShieldCheck className="w-6 h-6 text-orange-500 mt-1" />
            <div>
              <h3 className="text-white font-semibold">Enterprise-ready</h3>
              <p className="text-sm text-zinc-400">Scale securely with integrations and compliance.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
