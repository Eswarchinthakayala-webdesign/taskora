"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-orange-500/20 text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">

        {/* Bottom bar */}
        <div className=" flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} <span className="text-orange-500">Taskora.</span> All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-orange-400">Privacy Policy</a>
            <a href="#" className="hover:text-orange-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
