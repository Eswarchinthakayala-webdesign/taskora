"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function TeamSection() {
  return (
    <section
      id="team"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,90,0,0.04)_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none"></div>

      {/* Heading */}
      <div className="relative text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
        >
          Meet the Founder
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto text-sm md:text-base"
        >
          Taskora is built with passion and vision to make project management
          simpler, faster, and smarter.
        </motion.p>
      </div>

      {/* Founder Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex justify-center"
      >
        <Card
          className="relative w-full max-w-md p-8 rounded-2xl backdrop-blur-md border border-orange-500/20 
                     bg-black/70 shadow-[0_0_20px_rgba(255,122,28,0.15)] hover:shadow-[0_0_35px_rgba(255,122,28,0.3)] 
                     transition-all"
        >
          {/* Profile Picture */}
          <div className="flex flex-col items-center text-center">
            <div className="w-38 h-38 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg mb-4">
              <img
                src="/me.png" // Replace with your own image in public/
                alt="Founder"
                className="w-38 h-50 object-cover"
              />
            </div>

            {/* Name + Badge */}
            <h3 className="text-xl font-semibold text-white mb-1">Eswar Ch</h3>
            <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30 mb-3">
              Founder & Builder
            </Badge>

            {/* Bio */}
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Hi, I’m Eswar  — the creator of Taskora. My goal is to build a
              next-gen project management platform that’s powerful like Jira but
              intuitive, beautiful, and blazing fast. Always pushing boundaries
              in UI/UX, real-time apps, and AI-driven productivity.
            </p>

            {/* Social Links */}
            <div className="flex gap-5">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-orange-400 transition"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-orange-400 transition"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-orange-400 transition"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
