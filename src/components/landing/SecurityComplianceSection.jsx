"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, KeyRound, Users2 } from "lucide-react";

export default function SecurityComplianceSection() {
  const [openDialog, setOpenDialog] = useState(null);

  const badges = [
    {
      icon: ShieldCheck,
      title: "SOC 2 Compliant",
      desc: "Rigorous audits ensure enterprise-grade data security.",
      details:
        "Taskora undergoes annual SOC 2 Type II audits, ensuring enterprise-grade data security and operational excellence.",
    },
    {
      icon: Lock,
      title: "GDPR Ready",
      desc: "Privacy-first design aligned with global compliance standards.",
      details:
        "Taskora adheres to GDPR guidelines with robust data privacy, consent management, and user rights handling.",
    },
    {
      icon: Users2,
      title: "Role-Based Access Control",
      desc: "Granular permissions to keep your workspace secure.",
      details:
        "Advanced RBAC ensures teams and clients only see what they should. Fine-grained access, scalable for enterprises.",
    },
    {
      icon: KeyRound,
      title: "Single Sign-On (SSO)",
      desc: "Seamless and secure authentication for all your users.",
      details:
        "Integrations with SAML, OAuth, and major identity providers enable secure, one-click authentication.",
    },
  ];

  return (
    <section
      id="security"
      className="relative py-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      {/* Background dots */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,122,28,0.07)_1px,transparent_1px)] bg-[length:22px_22px] pointer-events-none"></div>

      {/* Heading */}
      <div className="relative text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          Security & Compliance
        </h2>
        <p className="mt-3 text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
          Taskora is built with security at its core — enterprise-grade
          compliance, privacy protections, and secure authentication you can
          trust.
        </p>
      </div>

      {/* Mobile: Horizontal Scroll Strip */}
      <div className="relative md:hidden -mx-6 px-6 overflow-x-auto scrollbar-hide grid grid-cols-1 gap-4 snap-x snap-mandatory">
        {badges.map((badge, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="snap-center min-w-[260px] flex-shrink-0"
          >
            <Card className="flex flex-col justify-between h-full p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-orange-500/20 shadow-[0_0_20px_rgba(255,122,28,0.15)]">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-500/10 mb-3">
                  <badge.icon className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {badge.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">{badge.desc}</p>
              </div>
              <Button
                onClick={() => setOpenDialog(badge)}
                className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-black hover:brightness-90"
              >
                Learn More
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Desktop: Previous Logic (Flip/Click) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 perspective">
        {badges.map((badge, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true }}
            className="group relative h-52 w-full [transform-style:preserve-3d] cursor-pointer"
            onClick={() => setOpenDialog(badge)}
          >
            {/* Front of Card */}
            <Card
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl shadow-[0_0_25px_rgba(255,122,28,0.2)]
                         border border-transparent bg-black/60 backdrop-blur-md transition-all
                         [backface-visibility:hidden] group-hover:rotate-y-180"
              style={{
                background:
                  "linear-gradient(#05060a,#05060a) padding-box,linear-gradient(135deg,#ff7a1c,#ff4d00) border-box",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-500/10 mb-3"
              >
                <badge.icon className="w-7 h-7 text-orange-400" />
              </motion.div>
              <h3 className="text-lg font-semibold text-white">{badge.title}</h3>
            </Card>

            {/* Back of Card */}
            <Card
              className="absolute inset-0 flex flex-col items-center justify-center p-4 rounded-2xl shadow-[0_0_25px_rgba(255,122,28,0.2)]
                         border border-orange-500/20 bg-zinc-900/90 text-sm text-zinc-300 text-center
                         rotate-y-180 [backface-visibility:hidden] group-hover:rotate-y-0"
            >
              <p>{badge.desc}</p>
              <span className="mt-3 text-orange-400 text-xs underline">
                Click for details
              </span>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="bg-zinc-950 border border-orange-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-orange-400">
              {openDialog?.title}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-300 mt-2">{openDialog?.details}</p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
