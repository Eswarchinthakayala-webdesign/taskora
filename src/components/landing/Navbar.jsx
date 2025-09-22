"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Icons from lucide-react
import {
  Menu,
  ArrowRight,
  LayoutDashboard,
  Star,
  BookOpen,
  Rocket,
  HelpCircle,
  Users,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

// shadcn/ui components
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";

// Brand color constant
const ORANGE = "#ff7a1c";

export default function NavBar() {
  // State: track desktop view
  const [isDesktop, setIsDesktop] = useState(false);

  // State: track scroll position for blur
  const [scrolled, setScrolled] = useState(false);

  // Handle resize events to detect desktop vs mobile
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle scroll events for blur background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scrolling for anchor navigation
  const handleSmoothScroll = (e, id) => {
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
   
  const navigate=useNavigate()
  return (

    
    <motion.nav
      // Navbar container
      className={`fixed top-0 w-full z-50 transition-colors duration-500 
        ${
          scrolled
            ? "bg-black/60 backdrop-blur-lg border-b border-zinc-800/60"
            : "bg-transparent"
        }`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Navbar Inner Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        
        {/* ========================= Brand ========================= */}
        <div className="flex items-center gap-2">
          {/* Animated Dashboard Icon */}
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{
              repeat: Infinity,
              repeatDelay: 6,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <LayoutDashboard className="w-6 h-6" style={{ color: ORANGE }} />
          </motion.div>

          {/* Brand Name */}
          <motion.div
            className="font-black text-2xl tracking-widest"
            style={{ color: ORANGE }}
            whileHover={{ scale: 1.05 }}
          >
            TASKORA
          </motion.div>
        </div>
        {/* ========================= End Brand ========================= */}

        {/* ========================= Desktop Nav ========================= */}
        <div className="hidden md:flex items-center gap-6">
          {["Features", "Demo", "Roadmap", "Resources"].map((item) => (
            <motion.button
              key={item}
              onClick={(e) => handleSmoothScroll(e, `#${item.toLowerCase()}`)}
              className="text-sm text-zinc-300 relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hover:text-white transition-colors">
                {item}
              </span>
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[var(--orange)] group-hover:w-full transition-all duration-300 ease-out" />
            </motion.button>
          ))}
        </div>
        {/* ========================= End Desktop Nav ========================= */}

        {/* ========================= Desktop Buttons ========================= */}
        <div className="hidden md:flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="border-zinc-700 text-black cursor-pointer hover:border-zinc-600"
              onClick={()=>navigate("/login")}
            >
              Log in
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              style={{
                background: ORANGE,
                color: "#0b0b0b",
              }}
              className="hover:opacity-90 shadow-md cursor-pointer shadow-orange-500/20"
              onClick={()=>navigate("/signup")}
            >
              Start Free
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>
        {/* ========================= End Desktop Buttons ========================= */}

        {/* ========================= Mobile Menu ========================= */}
        <div className="md:hidden">
          {!isDesktop && (
            <Sheet>
              {/* Trigger Button */}
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-zinc-700 cursor-pointer text-white"
                >
                  <Menu className="w-5 h-5 text-black" />
                </Button>
              </SheetTrigger>

              {/* Sheet Content */}
              <SheetContent
                side="right"
                className="overflow-auto bg-gradient-to-b from-black to-zinc-950 text-white border-l border-zinc-800 w-72 shadow-2xl p-4"
              >
                {/* Sidebar Header */}
                <div className="flex items-center gap-2 mb-6">
                  <LayoutDashboard
                    className="w-6 h-6"
                    style={{ color: ORANGE }}
                  />
                  <div
                    className="font-black text-xl tracking-widest"
                    style={{ color: ORANGE }}
                  >
                    TASKORA
                  </div>
                </div>

                <Separator className="my-4 bg-zinc-800" />

                {/* Nav Groups */}
                <motion.div
                  className="flex flex-col gap-5"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.08 },
                    },
                  }}
                >
                  {/* Product Section */}
                  <div>
                    <p className="text-xs uppercase text-zinc-500 mb-2">
                      Product
                    </p>
                    <SheetClose asChild>
                      <motion.button
                        onClick={(e) => handleSmoothScroll(e, "#features")}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-orange-500/10 hover:text-white transition-colors"
                        variants={{
                          hidden: { x: -20, opacity: 0 },
                          visible: { x: 0, opacity: 1 },
                        }}
                      >
                        <Star className="w-4 h-4 text-orange-400" />
                        Features
                      </motion.button>
                    </SheetClose>
                    <SheetClose asChild>
                      <motion.button
                        onClick={(e) => handleSmoothScroll(e, "#demo")}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-orange-500/10 hover:text-white transition-colors"
                        variants={{
                          hidden: { x: -20, opacity: 0 },
                          visible: { x: 0, opacity: 1 },
                        }}
                      >
                        <Rocket className="w-4 h-4 text-orange-400" />
                        Demo
                      </motion.button>
                    </SheetClose>
                    <SheetClose asChild>
                      <motion.button
                        onClick={(e) => handleSmoothScroll(e, "#roadmap")}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-orange-500/10 hover:text-white transition-colors"
                        variants={{
                          hidden: { x: -20, opacity: 0 },
                          visible: { x: 0, opacity: 1 },
                        }}
                      >
                        <Briefcase className="w-4 h-4 text-orange-400" />
                        Roadmap
                      </motion.button>
                    </SheetClose>
                  </div>

                  <Separator className="bg-zinc-800" />

                  {/* Resources Section */}
                  <div>
                    <p className="text-xs uppercase text-zinc-500 mb-2">
                      Resources
                    </p>
                    <SheetClose asChild>
                      <motion.button
                        onClick={(e) => handleSmoothScroll(e, "#resources")}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-orange-500/10 hover:text-white transition-colors"
                        variants={{
                          hidden: { x: -20, opacity: 0 },
                          visible: { x: 0, opacity: 1 },
                        }}
                      >
                        <BookOpen className="w-4 h-4 text-orange-400" />
                        Resources
                      </motion.button>
                    </SheetClose>
                    <SheetClose asChild>
                      <motion.button
                        onClick={(e) => handleSmoothScroll(e, "#faq")}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-orange-500/10 hover:text-white transition-colors"
                        variants={{
                          hidden: { x: -20, opacity: 0 },
                          visible: { x: 0, opacity: 1 },
                        }}
                      >
                        <HelpCircle className="w-4 h-4 text-orange-400" />
                        FAQ
                      </motion.button>
                    </SheetClose>
                  </div>

                  <Separator className="bg-zinc-800" />

                  {/* Company Section */}
                  <div>
                    <p className="text-xs uppercase text-zinc-500 mb-2">
                      Company
                    </p>
                    <SheetClose asChild>
                      <motion.button
                        onClick={(e) => handleSmoothScroll(e, "#team")}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-orange-500/10 hover:text-white transition-colors"
                        variants={{
                          hidden: { x: -20, opacity: 0 },
                          visible: { x: 0, opacity: 1 },
                        }}
                      >
                        <Users className="w-4 h-4 text-orange-400" />
                        Team
                      </motion.button>
                    </SheetClose>
                    <SheetClose asChild>
                      <motion.button
                        onClick={(e) => handleSmoothScroll(e, "#security")}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-orange-500/10 hover:text-white transition-colors"
                        variants={{
                          hidden: { x: -20, opacity: 0 },
                          visible: { x: 0, opacity: 1 },
                        }}
                      >
                        <ShieldCheck className="w-4 h-4 text-orange-400" />
                        Security
                      </motion.button>
                    </SheetClose>
                  </div>
                </motion.div>

                <Separator className="my-6 bg-zinc-800" />

                {/* Sidebar Footer CTA */}
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-black cursor-pointer  hover:border-zinc-600"
                     onClick={()=>navigate("/login")}
                  >
                    Log in
                  </Button>
                  <Button
                    style={{
                      background: ORANGE,
                      color: "#0b0b0b",
                    }}
                    className="hover:opacity-90 cursor-pointer shadow-md shadow-orange-500/20"
                     onClick={()=>navigate("/signup")}
                  >
                    Start Free
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
        {/* ========================= End Mobile Menu ========================= */}
      </div>
    </motion.nav>
  );
}
