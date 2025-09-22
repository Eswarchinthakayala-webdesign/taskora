"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code2, Compass } from "lucide-react";
import { Link } from "react-router-dom";

const resources = [
  {
    title: "Documentation",
    description:
      "Step-by-step documentation to help you get started quickly and explore Taskora’s advanced features.",
    icon: <BookOpen className="w-8 h-8 text-orange-400" />,
    badge: "Read Docs",
    link: "/docs",
  },
  {
    title: "SDKs & APIs",
    description:
      "Powerful SDKs and REST APIs to integrate Taskora into your workflows, apps, and automation tools.",
    icon: <Code2 className="w-8 h-8 text-orange-400" />,
    badge: "Explore SDK",
    link: "/sdk",
  },
  {
    title: "Guides & Tutorials",
    description:
      "Curated learning resources and tutorials covering Kanban boards, analytics, integrations, and more.",
    icon: <Compass className="w-8 h-8 text-orange-400" />,
    badge: "Start Learning",
    link: "/guides",
  },
];

export default function ResourcesSection() {
  return (
    <section
      id="resources"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto"
    >
      {/* Dotted background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,90,0,0.05)_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none"></div>

      {/* Heading */}
      <div className="relative text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
        >
          Developer Resources
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto"
        >
          Everything you need to build with Taskora — from documentation to SDKs
          and practical guides.
        </motion.p>
      </div>

      {/* Resource Cards */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
        {resources.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card
              className="h-full p-8 flex flex-col justify-between rounded-2xl bg-black/60 
                         border border-orange-500/20 backdrop-blur-md
                         shadow-[0_0_20px_rgba(255,122,28,0.15)] 
                         hover:shadow-[0_0_35px_rgba(255,122,28,0.3)] 
                         transition-all duration-300"
            >
              <div>
                <div className="mb-5 flex items-center justify-center w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-6">
                <Link to={item.link}>
                  <Badge className="bg-orange-600/90 text-black font-semibold px-3 py-1 cursor-pointer hover:bg-orange-500">
                    {item.badge}
                  </Badge>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
