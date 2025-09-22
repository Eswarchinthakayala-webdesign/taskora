"use client";

import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowRight } from "lucide-react";

export default function NewsletterSignup() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Stay in the Loop
          </h2>
          <p className="mt-4 text-zinc-400 text-lg">
            Subscribe to the Taskora newsletter and get updates on features,
            guides, and productivity tips. No spam — promise.
          </p>
        </motion.div>

        <Card className="bg-black/60 border border-orange-500/20 shadow-xl p-8">
          <form className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
              <Input
                type="email"
                required
                placeholder="Enter your email"
                className="pl-10 pr-4 py-3 bg-black/40 border-orange-500/20 text-white placeholder:text-zinc-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-black font-semibold shadow hover:opacity-90 transition"
            >
              Subscribe
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Trust Badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-zinc-400">
            <Badge className="bg-zinc-900 text-orange-400 border border-orange-600/40">
              No Spam
            </Badge>
            <Badge className="bg-zinc-900 text-orange-400 border border-orange-600/40">
              Unsubscribe Anytime
            </Badge>
            <Badge className="bg-zinc-900 text-orange-400 border border-orange-600/40">
              Weekly Updates
            </Badge>
          </div>
        </Card>
      </div>
    </section>
  );
}
