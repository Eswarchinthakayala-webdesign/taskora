"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Brush, LayoutTemplate, Building2 } from "lucide-react";

export default function CustomBrandingSection() {
  const [theme, setTheme] = useState("dark");

  const features = [
    {
      icon: Palette,
      title: "Custom Themes",
      desc: "Switch between light, dark, or brand palettes — tuned for your identity.",
      reveal: (
        <div className="mt-4 hidden group-hover:flex gap-2">
          <span className="w-5 h-5 rounded-full bg-orange-500"></span>
          <span className="w-5 h-5 rounded-full bg-zinc-500"></span>
          <span className="w-5 h-5 rounded-full bg-white"></span>
        </div>
      ),
    },
    {
      icon: Brush,
      title: "White-Label Options",
      desc: "Add your own logo, domain, and custom styles. Taskora bends to your brand.",
      reveal: (
        <div className="mt-4 hidden group-hover:block text-xs text-orange-400">
          Your Brand • Your Style
        </div>
      ),
    },
    {
      icon: LayoutTemplate,
      title: "Flexible Layouts",
      desc: "Boards, timelines, dashboards — choose layouts that fit your workflow.",
      reveal: (
        <div className="mt-4 hidden group-hover:flex gap-2 text-xs text-zinc-300">
          <span className="px-2 py-1 rounded bg-zinc-800">Board</span>
          <span className="px-2 py-1 rounded bg-zinc-800">Timeline</span>
          <span className="px-2 py-1 rounded bg-zinc-800">Dashboard</span>
        </div>
      ),
    },
    {
      icon: Building2,
      title: "Enterprise Branding",
      desc: "Deliver consistent branding across teams and clients with white-labeling.",
      reveal: (
        <div className="mt-4 hidden group-hover:block text-xs text-zinc-400">
          Enterprise Ready
        </div>
      ),
    },
  ];

  return (
    <section
      id="custom-branding"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      {/* Background dots */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,122,28,0.07)_1px,transparent_1px)] bg-[length:22px_22px] pointer-events-none"></div>

      {/* Heading */}
      <div className="relative text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
        >
          Custom Branding & Theming
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto"
        >
          White-label Taskora for your business — tailor colors, logos, and layouts
          to create a fully branded project management experience.
        </motion.p>
      </div>

      {/* Theme Toggle */}
      <div className="relative mb-12 flex justify-center">
        <Tabs value={theme} onValueChange={setTheme}>
          <TabsList className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-xl p-1 flex gap-2">
            {["light", "dark", "brand"].map((val) => (
              <TabsTrigger
                key={val}
                value={val}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500
                  data-[state=active]:text-black text-zinc-400 hover:text-white`}
              >
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Features Grid */}
      <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2 }}
            className="group h-full"
          >
            <Card
              className={`flex flex-col justify-between h-full p-6 rounded-2xl transition-all backdrop-blur-md shadow-[0_0_25px_rgba(255,122,28,0.15)]`}
              style={{
                border: "1px solid transparent",
                background:
                  theme === "light"
                    ? "linear-gradient(#fafafa, #fafafa) padding-box, linear-gradient(90deg,#ff7a1c,#ff4d00) border-box "
                    : theme === "brand"
                    ? "linear-gradient(#05060a,#05060a) padding-box, linear-gradient(90deg,#38bdf8,#0ea5e9) border-box"
                    : "linear-gradient(#05060a,#05060a) padding-box, linear-gradient(90deg,#ff7a1c,#ff4d00) border-box",
              }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500/10"
                  >
                    <f.icon className="w-5 h-5 text-orange-400" />
                  </motion.div>
                 <h3
  className={`text-lg font-semibold ${
    theme === "light" ? "text-black" : "text-white"
  }`}
>
  {f.title}
</h3>

                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
              {f.reveal}
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
