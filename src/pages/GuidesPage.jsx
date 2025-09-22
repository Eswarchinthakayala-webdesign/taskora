"use client";

import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial } from "@react-three/drei";
import {
  BookOpen,
  PlayCircle,
  Code,
  Users,
  Cpu,
  Zap,
  ChevronRight,
  Check,
  Copy,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ----------------------------- Theme Constants -----------------------------
const ACCENT = "#FF7A2B";
const BG = "#050505";

// ----------------------------- Helpers -----------------------------
function useIsomorphicLayoutEffect(effect, deps) {
  if (typeof window !== "undefined") {
    useEffect(effect, deps);
  }
}

// Simple code block with copy
function CodeBlock({ children, language = "bash" }) {
  const [copied, setCopied] = useState(false);
  const text = typeof children === "string" ? children : String(children);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }
  return (
    <div className="my-3 rounded-lg border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 text-xs text-zinc-400">
        <div className="font-mono">{language}</div>
        <div className="flex items-center gap-2">
          <button onClick={copy} className="flex items-center gap-2 text-zinc-300 hover:text-orange-400">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-orange-400" />}
            <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
      <pre className="p-4 text-sm text-orange-100 font-mono overflow-x-auto whitespace-pre-wrap">{text}</pre>
    </div>
  );
}

// ----------------------------- Particle Field -----------------------------
function ParticleField({ base = 1200, radius = 9 }) {
  const pointsRef = useRef();
  const [count, setCount] = useState(base);

  useIsomorphicLayoutEffect(() => {
    function adjust() {
      const w = window.innerWidth;
      if (w < 480) setCount(Math.floor(base * 0.28));
      else if (w < 768) setCount(Math.floor(base * 0.46));
      else if (w < 1024) setCount(Math.floor(base * 0.7));
      else setCount(base);
    }
    adjust();
    window.addEventListener("resize", adjust);
    return () => window.removeEventListener("resize", adjust);
  }, [base]);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = radius * (0.3 + Math.random() * 0.7);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      const z = r * Math.cos(phi);
      arr[i * 3 + 0] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.03;
    pointsRef.current.rotation.x = Math.sin(t * 0.08) * 0.01;
    const s = 1 + Math.sin(t * 0.16) * 0.01;
    pointsRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={pointsRef}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color={ACCENT} size={0.01} sizeAttenuation depthWrite={false} alphaTest={0.001} />
      </Points>
    </group>
  );
}

// ----------------------------- Guides Content -----------------------------
const GUIDES = [
  {
    id: "getting-started",
    title: "Getting Started with Taskora",
    summary: "Set up Taskora, create your first workspace, invite teammates and configure your first project.",
    icon: <BookOpen className="w-6 h-6 text-orange-500" aria-hidden="true" />,
    difficulty: "Beginner",
    duration: "10–20m",
    content: `
## Overview

This guide helps you bootstrap Taskora for your team. We'll cover signing up, creating a workspace, inviting teammates, and creating your first project with tasks and members.

## Steps

1. Create an account at Taskora or sign in via SSO.
2. Create a new workspace from the side menu.
3. Add teammates via the Invite dialog (email invites).
4. Create your first project and add a few tasks.

### Best Practices
- Use consistent naming for projects (e.g., "team-product-feature").
- Create templates for recurring project types.
- Add default tags and statuses in workspace settings.

### Example: Create a project using the API
`,
    examples: [
      `curl -X POST \\
  https://api.taskora.com/v1/projects \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Website Redesign" }'`,
    ],
  },
  {
    id: "kanban-board",
    title: "Build a Kanban Board",
    summary: "Render tasks as columns, enable drag-and-drop, and persist status changes to the API.",
    icon: <Code className="w-6 h-6 text-orange-500" aria-hidden="true" />,
    difficulty: "Intermediate",
    duration: "30–60m",
    content: `
## Overview

A Kanban board visualizes work-in-progress by placing tasks into columns that represent status. We'll fetch tasks grouped by status and implement drag-and-drop to change status.

## Key concepts
- Columns map to Taskora statuses (backlog, todo, in_progress, review, done).
- Use optimistic updates on drag to keep UI responsive.
- Implement server-side reconciliation for conflict resolution.

## Example: Patch status API
    `,
    examples: ['PATCH /v1/tasks/:id\n{ "status": "in_progress" }'],
  },
  {
    id: "sprints",
    title: "Plan Sprints Effectively",
    summary: "Use sprints to timebox work, define goals, and track velocity.",
    icon: <Zap className="w-6 h-6 text-orange-500" aria-hidden="true" />,
    difficulty: "Intermediate",
    duration: "20–40m",
    content: `
## Overview

Sprints are fixed-length iterations used to plan and complete work. Learn how to create sprints, bulk-assign tasks, and measure team velocity.

## Tips
- Keep sprint scope small and measurable.
- Use story points and estimate consistently.
- Review completed vs committed tasks to compute velocity.
    `,
    examples: [
      `POST /v1/sprints
{ "projectId": "proj_001", "name": "Sprint 1", "starts_at": "2025-09-01", "ends_at": "2025-09-14" }`,
    ],
  },
  {
    id: "collaboration",
    title: "Collaborate with Teams",
    summary: "Mentions, comments, permissions and shared tasks — collaborate without friction.",
    icon: <Users className="w-6 h-6 text-orange-500" aria-hidden="true" />,
    difficulty: "Beginner",
    duration: "10–30m",
    content: `
## Overview

Collaboration features include mentions, threaded comments, file attachments, and granular permissions. This guide shows patterns for team collaboration.

## Recommendations
- Use @mentions for clear assignee notifications.
- Use comments for discussion, not task descriptions.
- Configure role-based permissions for cross-team projects.
    `,
    examples: [],
  },
  {
    id: "automation",
    title: "Advanced Automation",
    summary: "Automate recurring tasks, webhooks, and integrations for repeatable workflows.",
    icon: <Cpu className="w-6 h-6 text-orange-500" aria-hidden="true" />,
    difficulty: "Advanced",
    duration: "30–90m",
    content: `
## Overview

Automation helps remove repetitive work. Use webhooks, scheduled functions, and third-party integrations to automate task management.

## Recipes
- Auto-assign tasks when a label is added.
- Close stale tasks automatically after N days.
- Sync issues from GitHub to Taskora tasks.
    `,
    examples: [],
  },
];

// ----------------------------- Modals -----------------------------
function GuideModal({ guide, open, onClose, onOpenInEditor }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && guide && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ y: 20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 12, scale: 0.98 }}
            transition={{ type: "spring", damping: 18, stiffness: 300 }}
            className="relative max-w-4xl w-full"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#070707] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-5 flex items-start gap-4">
                <div className="flex-shrink-0">{guide.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{guide.title}</h3>
                  <div className="mt-1 text-sm text-zinc-400">{guide.summary}</div>
                </div>
                <button aria-label="Close guide" onClick={onClose} className="ml-4 p-2 text-zinc-300 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 border-t border-zinc-800 text-zinc-300 max-h-[60vh] overflow-y-auto">
                {guide.content?.split("\n\n").map((block, i) => {
                  const trimmed = block.trim();
                  if (!trimmed) return null;
                  if (trimmed.startsWith("## ")) return (
                    <h4 key={i} className="text-lg font-semibold text-white mt-4">{trimmed.replace("## ", "")}</h4>
                  );
                  if (trimmed.startsWith("### ")) return (
                    <h5 key={i} className="text-md font-medium text-white mt-3">{trimmed.replace("### ", "")}</h5>
                  );
                  if (/^\d+\./.test(trimmed)) return <p key={i} className="mt-2 text-sm text-zinc-300">{trimmed}</p>;
                  return <p key={i} className="mt-2 text-sm text-zinc-300">{trimmed}</p>;
                })}

                {guide.examples?.map((ex, idx) => (
                  <CodeBlock key={idx} language="bash">{ex}</CodeBlock>
                ))}

                <div className="mt-6">
                  <h5 className="text-sm text-white font-semibold mb-2">Key takeaways</h5>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li>✅ Follow step-by-step for consistent results.</li>
                    <li>✅ Use the API examples to automate common tasks.</li>
                    <li>✅ Apply best practices for naming and permissions.</li>
                  </ul>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Button className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-black px-4 py-2" onClick={() => onOpenInEditor(guide)}>Open Guide in Editor</Button>
                  <Button variant="ghost" className="cursor-pointer bg-white text-black hover:bg-white" onClick={onClose}>Close</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function VideoModal({ open, onClose, title }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 12 }} className="relative max-w-3xl w-full">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div className="relative bg-[#070707] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="text-sm text-zinc-400 mt-1">Video demo</p>
                </div>
                <button onClick={onClose} className="text-zinc-300 hover:text-white p-2" aria-label="Close video">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 aspect-video bg-black/60 rounded-lg flex items-center justify-center border border-zinc-800">
                <PlayCircle className="w-16 h-16 text-orange-400" />
                <div className="absolute text-sm text-zinc-400 mt-28">Video embed placeholder — integrate react-player or iframe</div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" className="bg-white text-black hover:bg-white cursor-pointer" onClick={onClose}>Close</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OnboardingModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 12 }} className="relative max-w-2xl w-full">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div className="relative bg-[#070707] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Guided Onboarding</h3>
                  <p className="text-sm text-zinc-400 mt-1">Provision a sample workspace and sample project to explore Taskora features.</p>
                </div>
                <button onClick={onClose} className="text-zinc-300 hover:text-white p-2" aria-label="Close onboarding">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-zinc-300">
                <p>This demo onboarding provisions a sample workspace, creates a sample project, and seeds a few tasks so you can explore the UI and APIs quickly.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Provision workspace</li>
                  <li>Create sample project: "Demo Project"</li>
                  <li>Seed 6 tasks and 2 sample sprints</li>
                </ul>
                <div className="mt-4 flex justify-end gap-3">
                  <Button className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-black" onClick={() => { toast.success("Onboarding started (demo)"); onClose(); }}>Start Onboarding</Button>
                  <Button variant="outline" className="text-black cursor-pointer" onClick={onClose}>Cancel</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ----------------------------- UI pieces -----------------------------
function GuideCard({ guide, onOpen, onSave }) {
  return (
    <motion.div whileHover={{ y: -6 }} whileTap={{ scale: 0.995 }} className="h-full">
      <Card className="h-full bg-gradient-to-br from-black/60 to-black/50 border border-zinc-800 hover:shadow-lg transition-shadow rounded-2xl overflow-hidden">
        <CardHeader className="flex items-start gap-3 p-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-orange-700/10 to-orange-500/8">{guide.icon}</div>
          <div className="flex-1">
            <CardTitle className="text-lg text-white font-semibold">{guide.title}</CardTitle>
            <div className="text-sm text-zinc-400 mt-1">{guide.summary}</div>
            <div className="flex items-center gap-2 mt-3">
              <Badge className="bg-zinc-900 text-orange-400">{guide.difficulty}</Badge>
              <div className="text-xs text-zinc-500">{guide.duration}</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-end">
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={() => onOpen(guide)} className="flex items-center gap-2 hover:bg-orange-600 cursor-pointer bg-orange-500 text-black px-4 py-2">
              Read Guide <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline"  onClick={() => onSave(guide)} className="px-3 cursor-pointer py-2">Save</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ----------------------------- FAQ -----------------------------
function FAQAccordion() {
  const faqs = [
    { q: "How do I get started with Taskora?", a: "Sign up, create a workspace, invite teammates, create a project and add tasks." },
    { q: "Is there an API?", a: "Yes — Taskora exposes a REST API and official SDKs in JS/Python." },
    { q: "How are webhooks handled?", a: "Use webhook secrets to verify payloads; we retry failed deliveries with backoff." },
  ];
  return (
    <Accordion type="single" collapsible>
      {faqs.map((f, i) => (
        <AccordionItem value={`faq-${i}`} key={i}>
          <AccordionTrigger className="text-orange-200">{f.q}</AccordionTrigger>
          <AccordionContent className="text-white">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// ----------------------------- Main Page -----------------------------
export default function GuidesPagePro() {
  const [search, setSearch] = useState("");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [readingList, setReadingList] = useState([]);
  const [layoutCompact, setLayoutCompact] = useState(false);

  useEffect(() => {
    function onResize() {
      setLayoutCompact(window.innerWidth < 900);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // keyboard shortcut to focus search (Ctrl/Cmd+K)
  useEffect(() => {
    function onKey(e) {
      const isMac = navigator.platform?.toUpperCase().indexOf("MAC") >= 0;
      if ((isMac && e.metaKey && e.key === "k") || (!isMac && e.ctrlKey && e.key === "k")) {
        e.preventDefault();
        const el = document.getElementById("guide-search");
        if (el) {
          el.focus();
          const len = (el.value || "").length;
          if (el.setSelectionRange) el.setSelectionRange(len, len);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return GUIDES;
    const q = search.toLowerCase();
    return GUIDES.filter((g) => g.title.toLowerCase().includes(q) || g.summary.toLowerCase().includes(q) || (g.content || "").toLowerCase().includes(q));
  }, [search]);

  function openGuide(guide) {
    setSelectedGuide(guide);
    setGuideModalOpen(true);
  }

  function closeGuide() {
    setGuideModalOpen(false);
    setTimeout(() => setSelectedGuide(null), 220);
  }

  function saveGuide(guide) {
    setReadingList((prev) => {
      if (prev.find((g) => g.id === guide.id)) return prev;
      return [...prev, guide];
    });
    // small UX feedback
    toast.success(`Saved "${guide.title}" to reading list.`);
  }

  function openVideo(title) {
    setVideoTitle(title);
    setVideoModalOpen(true);
  }

  function openOnboarding() {
    setOnboardingOpen(true);
  }

  function openInEditor(guide) {
    // placeholder: open in editor workflow (could route to editor page)
    toast.success(`Open in editor: ${guide.title} (demo)`);
  }

  function contactSales() {
    // placeholder: open contact form or mailto
    window.location.href = "mailto:sales@taskora.com?subject=Enterprise%20Inquiry";
  }

  return (
    <div className="relative min-h-screen bg-[#05060a]
                 bg-[radial-gradient(circle,_rgba(255,122,28,0.25)_1px,transparent_1px)]
                 bg-[length:20px_20px] text-white">
      {/* Background canvas */}
      <div className="fixed inset-0 -z-20">
        <Canvas className="r3f-canvas" camera={{ position: [0, 0, 9], fov: 55 }}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[10, 10, 10]} intensity={0.05} />
          <Suspense fallback={null}>
            <ParticleField base={1200} radius={10} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.06} />
        </Canvas>
      </div>

      {/* Header - responsive */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-black font-bold">T</div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">Taskora Guides</h1>
              <p className="text-sm text-zinc-400 mt-1">In-depth tutorials, recipes and best practices to ship faster.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 hidden sm:block">
              <Input id="guide-search" placeholder="Search guides, examples... (Ctrl/Cmd+K)" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-black/30 text-zinc-200" />
            </div>

            <div className="sm:hidden flex-1">
              <Input id="guide-search-mobile" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-black/30 text-zinc-200" />
            </div>

            <div className="flex gap-2">
              <Button className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-black" onClick={() => { const el = document.getElementById("guide-search"); if (el) el.focus(); }}>Search</Button>
              <Button variant="ghost" className="bg-white text-black cursor-pointer" onClick={() => setSearch("")}>Clear</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        {/* Featured */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-black/60 border border-zinc-800 p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-white">Featured Guides</h2>
                    <p className="text-zinc-400 mt-1">Hand-picked tutorials to get you productive quickly.</p>

                    <div className={`grid mt-6 gap-4 ${layoutCompact ? "grid-cols-1" : "grid-cols-2"}`}>
                      {GUIDES.slice(0, 4).map((g) => (
                        <div key={g.id} className="p-2">
                          <Card className="h-full bg-gradient-to-br from-black/50 to-black/40 border border-zinc-800 rounded-xl shadow-md overflow-hidden">
                            <div className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-orange-900/10 flex items-center justify-center">{g.icon}</div>
                                <div className="flex-1">
                                  <div className="font-semibold text-white">{g.title}</div>
                                  <div className="text-xs text-zinc-400 mt-1">{g.summary}</div>
                                </div>
                              </div>
                              <div className="mt-4 flex items-center gap-3">
                                <Button onClick={() => openGuide(g)} className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-black px-3 py-2 flex items-center gap-2">Read Guide <ChevronRight className="w-4 h-4" /></Button>
                                <Button variant="outline"  onClick={() => saveGuide(g)} className="px-3 py-2 cursor-pointer">Save</Button>
                               
                              </div>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full lg:w-48">
                    <Card className="p-4 bg-black/50 border border-zinc-800 rounded-xl">
                      <div className="text-sm text-zinc-400">Quick Links</div>
                      <div className="mt-3 flex flex-col gap-2">
                        <a href="#getting-started" className="text-sm text-orange-400">Getting Started</a>
                        <a href="#kanban-board" className="text-sm text-orange-400">Kanban</a>
                        <a href="#sprints" className="text-sm text-orange-400">Sprints</a>
                        <a href="#automation" className="text-sm text-orange-400">Automation</a>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6 bg-black/60 border border-zinc-800 rounded-2xl">
                <h3 className="text-lg font-semibold text-white">Learning Tracks</h3>
                <p className="text-zinc-400 mt-2">Choose a track to follow a curated path.</p>
                <div className="mt-4 grid gap-3">
                  <Button className="w-full text-left  bg-orange-400 hover:bg-orange-600 cursor-pointer px-4 py-3" onClick={() => toast.success("Onboarding track selected (demo)")}><span>Onboarding Track</span> <span className="text-xs text-zinc-400 ml-2">(4 guides)</span></Button>
                  <Button className="w-full text-left bg-orange-400 hover:bg-orange-600 cursor-pointer px-4 py-3" onClick={() => toast.success("Productivity track selected (demo)")}>Productivity Track</Button>
                  <Button className="w-full text-left bg-orange-400 hover:bg-orange-600 cursor-pointer px-4 py-3" onClick={() => openOnboarding()}>Automation Track</Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* All Guides Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">All Guides</h2>
            <div className="flex items-center gap-3">
              <Badge className="bg-zinc-900 text-orange-400">{GUIDES.length} Guides</Badge>
              <div className="hidden sm:block">
                <Input placeholder="Filter guides..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64 bg-black/30" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((g) => (
              <GuideCard key={g.id} guide={g} onOpen={openGuide} onSave={saveGuide} />
            ))}
          </div>
        </section>

        {/* Tabs with deeper content and snippets */}
        <section className="mb-16">
          <Tabs defaultValue="guides">
            <TabsList className="bg-orange-500 border border-zinc-800 rounded-xl p-1 mb-4">
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            <TabsContent value="guides">
              <Card className="p-6 bg-black/60 border border-zinc-800 rounded-2xl">
                <h3 className="text-lg font-semibold text-white">Deep Dive: Realtime Kanban</h3>
                <p className="text-zinc-400 mt-2">Example patterns for building a collaborative Kanban board with optimistic updates.</p>
                <div className="mt-4 grid gap-4">
                  <CodeBlock language="javascript">{`// Optimistic update pattern example\nfunction moveTaskLocal(tasks, taskId, newStatus) {\n  return tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)\n}`}</CodeBlock>

                  <CodeBlock language="bash">{`# API example to change status\nPATCH /v1/tasks/:id\n{ "status": "in_progress" }`}</CodeBlock>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="tutorials">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-black/60 border border-zinc-800 rounded-2xl">
                  <h4 className="font-semibold text-white">Build a Kanban App (tutorial)</h4>
                  <p className="text-zinc-400 mt-2">Full tutorial with drag-drop, realtime and UX tips.</p>
                </Card>
                <Card className="p-6 bg-black/60 border border-zinc-800 rounded-2xl">
                  <h4 className="font-semibold text-white">Automation Recipes</h4>
                  <p className="text-zinc-400 mt-2">Examples for rules and webhooks.</p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-black/60 border border-zinc-800 rounded-2xl">
                  <CardContent className="p-0">
                    <div className="p-6 text-center">
                      <PlayCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" aria-hidden="true" />
                      <h4 className="font-semibold text-white">Intro to Taskora</h4>
                      <p className="text-sm text-zinc-400">Short product walkthrough.</p>
                      <div className="mt-4">
                        <Button className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-black" onClick={() => openVideo("Intro to Taskora")}>Watch Video</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-black/60 border border-zinc-800 rounded-2xl">
                  <CardContent className="p-0">
                    <div className="p-6 text-center">
                      <PlayCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" aria-hidden="true" />
                      <h4 className="font-semibold text-white">Sprint Planning</h4>
                      <p className="text-sm text-zinc-400">How to run efficient sprints with examples.</p>
                      <div className="mt-4">
                        <Button className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-black" onClick={() => openVideo("Sprint Planning")}>Watch Video</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* FAQ and CTA */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-black/60 border border-zinc-800 rounded-2xl">
            <h3 className="text-lg font-semibold text-white">FAQ</h3>
            <div className="mt-4">
              <FAQAccordion />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-black/60 to-black/50 border border-zinc-800 rounded-2xl">
            <h3 className="text-lg font-semibold text-white">Get started faster</h3>
            <p className="text-zinc-400 mt-2">Follow a guided onboarding to provision environments and sample projects.</p>
            <div className="mt-4 flex items-center gap-3">
              <Button className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-black px-4 py-2" onClick={openOnboarding}>Start Onboarding</Button>
              <Button variant="outline" className="cursor-pointer" onClick={contactSales}>Contact Sales</Button>
            </div>
          </Card>
        </section>

        <footer className="text-zinc-400 text-sm py-2 border-t border-zinc-800 mt-10">
          © {new Date().getFullYear()} Taskora • Pro Guides — Built with care.
        </footer>
      </main>

      {/* Modals */}
      <GuideModal guide={selectedGuide} open={guideModalOpen} onClose={closeGuide} onOpenInEditor={openInEditor} />
      <VideoModal open={videoModalOpen} onClose={() => setVideoModalOpen(false)} title={videoTitle} />
      <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
    </div>
  );
}
