"use client";

/**
 * SDKPage (Enhanced) — Taskora Developer Docs
 *
 * - Fully enhanced docs page with:
 *   • Polished dark/orange theme
 *   • Responsive sidebar + mobile drawer
 *   • Rich content for Install, Auth, Endpoints, SDK Examples, Guides, FAQ, Changelog
 *   • Interactive endpoint table with details dialog & copy-to-clipboard
 *   • Improved Three.js particle field (subtle, performant)
 *   • Framer Motion transitions & micro-interactions
 *   • Search/filter for endpoints and quick-jump links
 *   • Accessible markup & keyboard-friendly interactions
 *
 * Notes:
 * - Uses @react-three/fiber + drei for a lightweight particle field background.
 * - Replace the `@/components/*` imports with your actual shadcn UI components paths if different.
 * - The file is intentionally verbose and annotated so you can easily adapt pieces independently.
 */

import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import {
  Menu,
  X,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  ShieldCheck,
  Zap,
  Users,
  BookOpen,
  Code,
  Terminal,
  HelpCircle,
  Calendar,
  Box,
  Globe,
  ArrowRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// ----------------------------- Theme Constants -----------------------------
const ACCENT = "#FF7A2B";
const DARK_BG = "#050505";
const SOFT_ACCENT = "rgba(255,122,43,0.12)";

// ----------------------------- Particle Field (refined) -----------------------------
function ParticleField({ count = 1600, radius = 8 }) {
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // place points within a flattened sphere with slight bias
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = radius * (0.4 + Math.random() * 0.6);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.55; // squash vertically
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
    // gentle rotation + breathing scale
    pointsRef.current.rotation.y = t * 0.04;
    pointsRef.current.rotation.x = Math.sin(t * 0.12) * 0.02;
    pointsRef.current.scale.x = 1 + Math.sin(t * 0.22) * 0.01;
    pointsRef.current.scale.y = 1 + Math.cos(t * 0.18) * 0.01;
  });

  return (
    <group ref={pointsRef}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={ACCENT}
          size={0.01}
          sizeAttenuation
          depthWrite={false}
          alphaTest={0.001}
        />
      </Points>
    </group>
  );
}

// ----------------------------- Helpers -----------------------------
function useAnimatedCounter(target, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = null;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-3 py-1 rounded bg-black/30 border border-zinc-800 text-sm text-zinc-200 hover:bg-black/40"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-orange-400" />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

// ----------------------------- Data -----------------------------
const endpoints = [
  { method: "GET", path: "/v1/projects", desc: "List projects", example: `[{ "id":"proj_1", "name":"Orion" }]` },
  { method: "POST", path: "/v1/projects", desc: "Create project", example: `{ "name":"My Project" }` },
  { method: "GET", path: "/v1/projects/:id", desc: "Get project", example: `{ "id":"proj_1","name":"Orion" }` },
  { method: "PATCH", path: "/v1/projects/:id", desc: "Update project" },
  { method: "GET", path: "/v1/tasks", desc: "List tasks" },
  { method: "POST", path: "/v1/tasks", desc: "Create task" },
  { method: "GET", path: "/v1/tasks/:id", desc: "Get task" },
  { method: "PATCH", path: "/v1/tasks/:id", desc: "Update task" },
  { method: "DELETE", path: "/v1/tasks/:id", desc: "Delete task" },
  { method: "POST", path: "/v1/webhooks", desc: "Register webhook" },
  { method: "GET", path: "/v1/users", desc: "List users" },
  { method: "POST", path: "/v1/invite", desc: "Invite user" },
  { method: "GET", path: "/v1/sprints", desc: "List sprints" },
  { method: "POST", path: "/v1/sprints", desc: "Create sprint" },
];

// ----------------------------- Main Page -----------------------------
export default function SDKPage() {
  // UI state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("api");
  const [showCodeModal, setShowCodeModal] = useState(false);

  // animated counters
  const teamsCount = useAnimatedCounter(120);
  const uptimeCount = useAnimatedCounter(99);
  const sdkCount = useAnimatedCounter(4);

  // filtered endpoints (search/quick filter)
  const filtered = useMemo(() => {
    if (!query) return endpoints;
    const q = query.toLowerCase();
    return endpoints.filter((e) => {
      const method = (e.method || "").toString().toLowerCase();
      const path = (e.path || "").toString().toLowerCase();
      const desc = (e.desc || "").toString().toLowerCase();
      return method.includes(q) || path.includes(q) || desc.includes(q);
    });
  }, [query]);

  // handle endpoint click to open dialog
  function openEndpoint(ep) {
    setSelected(ep);
    setDialogOpen(true);
  }

  // keyboard shortcut: Cmd/Ctrl+K to focus search
  useEffect(() => {
    function onKey(e) {
      try {
        const isMac = navigator.platform?.toUpperCase()?.indexOf("MAC") >= 0;
        if ((isMac && e.metaKey && e.key === "k") || (!isMac && e.ctrlKey && e.key === "k")) {
          e.preventDefault();
          const el = document.getElementById("global-search");
          if (el) {
            el.focus();
            // set cursor to end
            const len = (el.value || "").length;
            if (el.setSelectionRange) el.setSelectionRange(len, len);
            return;
          }
          // fallback: try to focus any data-search-input input (mobile drawer)
          const fallback = document.querySelector('[data-search-input="true"]');
         if (fallback && fallback.focus) {
            fallback.focus();
            }

        }
      } catch (err) {
        // swallow any errors
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ensure canvas pointer toggle for mobile performance (prevent accidental drag)
  useEffect(() => {
    function togglePointer() {
      const canv = document.querySelector(".r3f-canvas");
      if (!canv) return;
      canv.style.pointerEvents = window.innerWidth < 640 ? "none" : "auto";
    }
    togglePointer();
    window.addEventListener("resize", togglePointer);
    return () => window.removeEventListener("resize", togglePointer);
  }, []);

  return (
    <div className="min-h-screen flex  bg-[#05060a]
                 bg-[radial-gradient(circle,_rgba(255,122,28,0.25)_1px,transparent_1px)]
                 bg-[length:20px_20px] text-white relative">
      {/* Particle Background (full-screen) */}
      <div className="fixed inset-0 -z-20 opacity-90">
        <Canvas className="r3f-canvas" camera={{ position: [0, 0, 10], fov: 55 }}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[0, 10, 5]} intensity={0.1} />
          <Suspense fallback={null}>
            <ParticleField count={1600} radius={11} />
          </Suspense>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.12} enablePan={false} />
        </Canvas>
      </div>


     


      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        {/* Header / Hero inside docs */}
        <section id="intro" className="mb-10">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl md:text-5xl  font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500 mb-3">
            Taskora SDK — Integrate, Automate, Ship
          </motion.h1>
          <p className="text-zinc-300 max-w-3xl mb-6">
            Build integrations and automation on top of Taskora. This documentation covers the REST API, SDK usage, webhooks, example recipes, and migration guides to help you ship faster.
          </p>

          <div className="grid bg-black grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            <Card className="p-4 bg-black/50 border border-zinc-800">
              <div className="text-sm text-zinc-400">Trusted by</div>
              <div className="text-2xl font-bold text-white">{teamsCount}+</div>
            </Card>
            <Card className="p-4 bg-black/50 border border-zinc-800">
              <div className="text-sm text-zinc-400">Uptime</div>
              <div className="text-2xl font-bold text-white">{uptimeCount}.99%</div>
            </Card>
            <Card className="p-4 bg-black/50 border border-zinc-800">
              <div className="text-sm text-zinc-400">SDKs</div>
              <div className="text-2xl font-bold text-white">v{sdkCount}</div>
            </Card>
          </div>
        </section>

        {/* Tabs for main docs content */}
        <section id="docs-tabs" className="mb-12">
          <Tabs defaultValue="api" onValueChange={(v) => setActiveTab(v)}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-orange-300 border border-zinc-800 rounded-xl px-1 py-1">
                <TabsTrigger value="api" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-500 data-[state=active]:text-black">API Reference</TabsTrigger>
                <TabsTrigger value="sdk" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-500 data-[state=active]:text-black">SDK Examples</TabsTrigger>
                <TabsTrigger value="guides" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-500 data-[state=active]:text-black">Guides</TabsTrigger>
                <TabsTrigger value="webhooks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-500 data-[state=active]:text-black">Webhooks</TabsTrigger>
        
              </TabsList>

              
            </div>

            {/* API Reference Tab */}
            <TabsContent value="api" className="pt-2">
              <div id="endpoints" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: endpoints table */}
                <Card className="col-span-2 p-0 bg-black/40 border border-zinc-800 overflow-hidden">
                  <div className="p-4 flex items-center justify-between border-b border-zinc-800">
                    <div>
                      <div className="font-semibold text-white">API Endpoints</div>
                      <div className="text-sm text-zinc-400">Commonly used endpoints & quick examples</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-500/90 text-black">REST</Badge>
                      <CopyButton text={JSON.stringify(endpoints, null, 2)} />
                    </div>
                  </div>

                  <div className="p-4 bg-black overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-zinc-400">
                        <tr>
                          <th className="p-2 text-left">Method</th>
                          <th className="p-2 text-left">Endpoint</th>
                          <th className="p-2 text-left">Description</th>
                          <th className="p-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((ep, idx) => (
                          <tr key={idx} className="hover:bg-orange-500/6">
                            <td className="p-2 font-mono text-orange-400">{ep.method}</td>
                            <td className="p-2 text-zinc-200">{ep.path}</td>
                            <td className="p-2 text-zinc-400">{ep.desc}</td>
                            <td className="p-2">
                              <div className="flex gap-2">
                                <Button onClick={() => openEndpoint(ep)} className="px-3 py-1 bg-black/30 text-zinc-200 border border-zinc-800">Details</Button>
                                <CopyButton text={`${ep.method} https://api.taskora.com${ep.path}`} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Right: quick reference / code snippets */}
                <div className="flex flex-col gap-6">
                  <Card className="p-4 bg-black/40 border border-zinc-800">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm text-zinc-400">Authentication</div>
                        <div className="font-mono text-orange-300 text-xs">Bearer tokens</div>
                      </div>
                      <Badge className="bg-zinc-900 text-orange-400">Security</Badge>
                    </div>
                    <CodeBlockSimple language="bash">{`curl -H "Authorization: Bearer YOUR_API_KEY" https://api.taskora.com/v1/projects`}</CodeBlockSimple>
                  </Card>

                  <Card className="p-4 bg-black/40 border border-zinc-800">
                    <div className="text-sm text-zinc-400 mb-2">Rate Limits</div>
                    <p className="text-zinc-300 text-sm">Standard plans: 300 requests/minute. Use exponential backoff on 429 responses.</p>
                  </Card>

                  <Card className="p-4 bg-black/40 border border-zinc-800">
                    <div className="text-sm text-zinc-400 mb-2">Support</div>
                    <p className="text-zinc-300 text-sm">Contact <a className="text-orange-400">dev@taskora.com</a> for API access & enterprise support.</p>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* SDK Examples Tab */}
            <TabsContent value="sdk" className="pt-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4 bg-black/40 border border-zinc-800">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">JavaScript (Node)</div>
                      <div className="text-sm text-zinc-400">Quickstart</div>
                    </div>
                    <Badge className="bg-orange-500/90 text-black">npm</Badge>
                  </div>

                  <CodeBlockSimple language="bash">{`npm install @taskora/sdk`}</CodeBlockSimple>

                  <CodeBlockSimple language="javascript">{`import Taskora from "@taskora/sdk";
const client = new Taskora({ apiKey: process.env.TASKORA_API_KEY });

async function createTask() {
  const task = await client.tasks.create({
    title: "Implement SDK docs",
    projectId: "proj_001",
    assignees: ["user_001"]
  });
  console.log(task);
}`}</CodeBlockSimple>
                </Card>

                <Card className="p-4 bg-black/40 border border-zinc-800">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">Python</div>
                      <div className="text-sm text-zinc-400">Quickstart</div>
                    </div>
                    <Badge className="bg-orange-500/90 text-black">pip</Badge>
                  </div>

                  <CodeBlockSimple language="bash">{`pip install taskora-sdk`}</CodeBlockSimple>

                  <CodeBlockSimple language="python">{`from taskora import Taskora
client = Taskora(api_key="YOUR_API_KEY")
task = client.tasks.create(title="Implement SDK docs", project_id="proj_001")
print(task)`}</CodeBlockSimple>
                </Card>

                <Card className="p-4 bg-black/40 border border-zinc-800 lg:col-span-2">
                  <div className="mb-3">
                    <div className="font-semibold text-white">Webhooks Example</div>
                    <div className="text-sm text-zinc-400">Express handler</div>
                  </div>

                  <CodeBlockSimple language="javascript">{`app.post('/hooks/taskora', verifySignature, (req, res) => {
  const event = req.body;
  if (event.type === 'task.created') {
    // handle event
  }
  res.status(200).end();
});`}</CodeBlockSimple>
                </Card>
              </div>
            </TabsContent>

            {/* Guides Tab */}
            <TabsContent value="guides" className="pt-2">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-4 bg-black/40 border border-zinc-800">
                  <h3 className="font-semibold text-white mb-2">Build a Kanban board</h3>
                  <p className="text-zinc-300 text-sm mb-3">Fetch tasks, render columns, and update status with PATCH requests.</p>
                  <ol className="list-decimal list-inside text-zinc-300 text-sm space-y-2">
                    <li>List tasks by project</li>
                    <li>Render columns based on status</li>
                    <li>Update status on drop using PATCH /v1/tasks/:id</li>
                  </ol>
                </Card>

                <Card className="p-4 bg-black/40 border border-zinc-800">
                  <h3 className="font-semibold text-white mb-2">Migrate from Jira</h3>
                  <p className="text-zinc-300 text-sm mb-3">Export from Jira, map fields, and import using the Taskora CLI.</p>
                  <CodeBlockSimple language="bash">{`jira export --project ABC --format=json
taskora import --source jira-export.json`}</CodeBlockSimple>
                </Card>

                <Card className="p-4 bg-black/40 border border-zinc-800">
                  <h3 className="font-semibold text-white mb-2">Automation Recipes</h3>
                  <p className="text-zinc-300 text-sm mb-3">Common automations using webhooks & serverless functions.</p>
                  <ul className="list-disc list-inside text-zinc-300 text-sm space-y-2">
                    <li>Auto-assign on label</li>
                    <li>Close stale tasks</li>
                    <li>Sync with GitHub issues</li>
                  </ul>
                </Card>
              </div>
            </TabsContent>

            {/* Webhooks Tab */}
            <TabsContent value="webhooks" className="pt-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4 bg-black/40 border border-zinc-800">
                  <h3 className="font-semibold text-white mb-2">Webhooks Overview</h3>
                  <p className="text-zinc-300 text-sm mb-3">Subscribe to workspace events and securely receive updates to your backend services.</p>
                  <CodeBlockSimple language="javascript">{`POST /v1/webhooks
{ "url": "https://yourapp.com/hooks", "events": ["task.created", "task.updated"] }`}</CodeBlockSimple>
                </Card>

                <Card className="p-4 bg-black/40 border border-zinc-800">
                  <h3 className="font-semibold text-white mb-2">Verify Signatures</h3>
                  <p className="text-zinc-300 text-sm mb-3">Use your webhook secret to verify HMAC signatures on incoming requests.</p>
                  <CodeBlockSimple language="javascript">{`const sig = req.headers['x-taskora-signature'];
if (!verify(sig, rawBody, secret)) return res.status(400).end();`}</CodeBlockSimple>
                </Card>
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="pt-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="a1">
                  <AccordionTrigger className="text-orange-200">How do I get started?</AccordionTrigger>
                  <AccordionContent>Install the SDK, set TASKORA_API_KEY, and call client.projects.list() to verify access.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="a2">
                  <AccordionTrigger className="text-orange-200">How are rate limits handled?</AccordionTrigger>
                  <AccordionContent>We return Retry-After headers. Use exponential backoff and request higher limits for enterprise plans.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="a3">
                  <AccordionTrigger className="text-orange-200">What authentication methods are supported?</AccordionTrigger>
                  <AccordionContent>API keys (server) and OAuth2 (user-based) are supported.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </section>

        {/* End of tabs */}

        {/* Endpoint details dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className=" bg-black">
            <DialogHeader>
              <DialogTitle>{selected ? `${selected.method} ${selected.path}` : "Endpoint details"}</DialogTitle>
            </DialogHeader>
            <div className="p-4 text-zinc-300">
              {selected ? (
                <>
                  <div className="mb-3 text-sm text-zinc-400">{selected.desc}</div>

                  <div className="mb-4">
                    <div className="text-xs text-zinc-400 mb-1">Request</div>
                    <CodeBlockSimple language="bash">{`${selected.method} https://api.taskora.com${selected.path}`}</CodeBlockSimple>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-zinc-400 mb-1">Example response</div>
                    <CodeBlockSimple language="json">{selected.example ?? `{"message":"example"}`}</CodeBlockSimple>
                  </div>

                  <div className="flex gap-2">
                    <CopyButton className="cursor-pointer" text={`${selected.method} https://api.taskora.com${selected.path}`} />
                    <Button onClick={() => setShowCodeModal(true)} className="bg-orange-500 cursor-pointer hover:bg-amber-600 text-black">Show SDK Example</Button>
                    <Button className="cursor-pointer bg-white text-black hover:bg-white" onClick={() => setDialogOpen(false)}>Close</Button>
                  </div>
                </>
              ) : (
                <p>No endpoint selected.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Code modal (simple dialog) */}
        <AnimatePresence>
          {showCodeModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/70" onClick={() => setShowCodeModal(false)} />
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="relative max-w-3xl w-full p-6">
                <Card className="p-4 bg-black/80 border border-zinc-800">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="font-semibold text-white">SDK Example</div>
                    <button onClick={() => setShowCodeModal(false)} className="text-zinc-400">Close</button>
                  </div>
                  <CodeBlockSimple language="javascript">{`// Example: fetch tasks (node)
import Taskora from "@taskora/sdk";
const client = new Taskora({ apiKey: process.env.TASKORA_API_KEY });
const tasks = await client.tasks.list({ projectId: "proj_001" });
console.log(tasks);`}</CodeBlockSimple>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guides and other long sections */}
        <section id="guides-long" className="mt-10 mb-12">
          <h3 className="text-2xl font-bold text-white mb-4">Deep Guides</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 bg-black/40 border border-zinc-800">
              <h4 className="font-semibold text-white mb-2">Building a Real-time Kanban</h4>
              <p className="text-zinc-300 text-sm mb-3">Use realtime updates (websockets) to sync board changes across clients. Use optimistic UI updates for low-latency UX.</p>
              <CodeBlockSimple language="javascript">{`// Subscribe to realtime channel
const channel = client.realtime.channel("projects:proj_001");
channel.on("task.updated", (payload) => { /* update UI */ });`}</CodeBlockSimple>
            </Card>

            <Card className="p-4 bg-black/40 border border-zinc-800">
              <h4 className="font-semibold text-white mb-2">Advanced Analytics</h4>
              <p className="text-zinc-300 text-sm mb-3">Aggregate task events to compute burndown and cycle time metrics. Export CSVs for BI tools.</p>
              <CodeBlockSimple language="bash">{`# export tasks CSV
GET /v1/projects/proj_001/export?format=csv`}</CodeBlockSimple>
            </Card>
          </div>
        </section>

        {/* FAQ & Changelog condensed */}
        <section id="faq-changelog" className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4 bg-black/40 border border-zinc-800">
            <h4 className="font-semibold text-white mb-3">FAQ</h4>
            <Accordion type="single" collapsible>
              <AccordionItem value="f1">
                <AccordionTrigger className="text-orange-200">How to handle pagination?</AccordionTrigger>
                <AccordionContent className="text-white">Use `page` and `limit` query parameters. Responses include meta pagination info.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="f2">
                <AccordionTrigger className="text-orange-200">How to request higher rate limits?</AccordionTrigger>
                <AccordionContent className="text-white">Contact sales with your expected volume and use-case for enterprise plans.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          <Card className="p-4 bg-black/40 border border-zinc-800">
            <h4 className="font-semibold text-white mb-3">Changelog</h4>
            <div className="space-y-3 text-zinc-300">
              <div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-500/90 text-black">v1.3.2</Badge>
                  <div className="font-semibold">2025-08-10</div>
                </div>
                <p className="mt-1 text-sm">Security patch and webhook retry fixes.</p>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-500/90 text-black">v1.3.0</Badge>
                  <div className="font-semibold">2025-05-01</div>
                </div>
                <p className="mt-1 text-sm">Added Sprints API and AI prioritization endpoints.</p>
              </div>
            </div>
          </Card>
        </section>

        <footer className="text-zinc-400 text-sm py-6 border-t border-orange-500/8">
          © {new Date().getFullYear()} Taskora • Developer documentation — Built with ❤️ and fast UX.
        </footer>
      </main>
    </div>
  );
}

// ----------------------------- Small helper components -----------------------------
function CodeBlockSimple({ language = "bash", children }) {
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
        <div>{language}</div>
        <div className="flex items-center gap-2">
          <button onClick={copy} className="text-zinc-300 hover:text-orange-400 flex items-center gap-2">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-orange-400" />}
            <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
      <pre className="p-4 text-sm text-orange-100 font-mono overflow-x-auto whitespace-pre-wrap">{text}</pre>
    </div>
  );
}
