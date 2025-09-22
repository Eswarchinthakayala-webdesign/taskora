"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

export default function BlogArticlesSection() {
  const posts = [
    {
      title: "How Taskora Transforms Agile Workflows",
      excerpt:
        "Learn how modern teams leverage Taskora to streamline project management, cut bottlenecks, and accelerate delivery.",
      author: "Sriram",
      date: "Sep 15, 2025",
      category: "Productivity",
    },
    {
      title: "Scaling Teams Without Chaos: Lessons from Taskora",
      excerpt:
        "Discover strategies for scaling rapidly while maintaining structure and focus, powered by Taskora’s scalable architecture.",
      author: "Eswar",
      date: "Aug 28, 2025",
      category: "Scaling",
    },
    {
      title: "Migrating from Jira to Taskora: A Complete Guide",
      excerpt:
        "Step-by-step guide for migrating from Jira to Taskora seamlessly, with CSV imports, automation, and minimal disruption.",
      author: "Vamsi",
      date: "Aug 12, 2025",
      category: "Migration",
    },
  ];

  return (
    <section
      id="blog-articles"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      {/* Background Dots */}
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
          Latest Articles
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto text-sm md:text-base"
        >
          Insights, tutorials, and stories from the Taskora team to help you get
          the most out of your workflow.
        </motion.p>
      </div>

      {/* Posts Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
          >
            <Card
              className="flex flex-col justify-between h-full p-6 rounded-2xl backdrop-blur-md
                         border border-orange-500/20 bg-black/60 shadow-[0_0_20px_rgba(255,122,28,0.15)]
                         transition-all hover:shadow-[0_0_30px_rgba(255,122,28,0.3)]"
            >
              {/* Category */}
              <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs px-2 py-0.5 mb-4">
                {post.category}
              </Badge>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-zinc-400 mb-4 flex-1">{post.excerpt}</p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-zinc-500 mt-4 pt-4 border-t border-zinc-800">
                <span className="flex items-center gap-1">
                  <User size={14} className="text-orange-400" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-orange-400" />
                  {post.date}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
