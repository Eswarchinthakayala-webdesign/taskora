"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CalendarCheck2 } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-zinc-950 to-black text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
        >
          Ready to supercharge your workflow?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto"
        >
          Taskora helps your team plan, track, and deliver work without the
          chaos. Start today — no credit card required.
        </motion.p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-black font-semibold shadow-lg">
              Start Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              className="px-6 py-3 border border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
            >
              Request Demo
              <CalendarCheck2 className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Extra reassurance card */}
        <Card className="mt-10 bg-black/60 border border-orange-500/20 shadow-lg p-6 max-w-lg mx-auto">
          <p className="text-sm text-zinc-400">
            ✨ Join <span className="text-orange-400 font-semibold">5,000+</span>{" "}
            teams already using Taskora for smarter project management.
          </p>
        </Card>
      </div>
    </section>
  );
}
