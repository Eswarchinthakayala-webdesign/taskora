"use client";

import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "What is Taskora?",
    a: "Taskora is a modern project management tool inspired by Jira but designed to be simpler, faster, and more user-friendly. It offers Kanban boards, calendars, analytics, and real-time collaboration.",
  },
  {
    q: "How is Taskora different from Jira or ClickUp?",
    a: "Unlike Jira, Taskora focuses on speed, simplicity, and a clean UI. Compared to ClickUp, it avoids feature bloat while still providing essentials like analytics, integrations, and real-time sync.",
  },
  {
    q: "Does Taskora support team collaboration?",
    a: "Yes! Taskora includes real-time collaboration features, ensuring updates from teammates appear instantly without page reloads.",
  },
  {
    q: "Is Taskora free to use?",
    a: "Taskora will offer a generous free plan with essential features, plus affordable premium tiers for teams that need advanced integrations, analytics, and enterprise-grade options.",
  },
  {
    q: "Can I migrate from Jira, Trello, or Linear?",
    a: "Yes. Taskora includes migration tools to import tasks and projects from Jira, Trello, Linear, and even CSV files seamlessly.",
  },
  {
    q: "What’s coming next?",
    a: "Upcoming features include a mobile app, custom branding for enterprises, AI-powered insights, and a marketplace for third-party integrations.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto"
    >
      {/* Background pattern */}
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
          Frequently Asked Questions
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto text-sm md:text-base"
        >
          Answers to the most common questions about Taskora.
        </motion.p>
      </div>

      {/* Accordion */}
      <Accordion type="single" collapsible className="relative space-y-4">
        {faqs.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <AccordionItem
              value={`faq-${i}`}
              className="border border-zinc-800 rounded-xl overflow-hidden bg-black/50 backdrop-blur-md"
            >
              <AccordionTrigger className="flex items-center gap-2 px-4 py-3 text-left text-white hover:text-orange-400">
                <HelpCircle className="w-5 h-5 text-orange-400" />
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-zinc-400 text-sm leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </section>
  );
}
