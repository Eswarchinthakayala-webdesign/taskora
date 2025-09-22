// src/pages/DocumentationPage.jsx
// Large single-file Documentation page — expanded, responsive, animation-safe, search-fixed.
// - React + framer-motion + @react-three/fiber + drei
// - lucide-react icons, shadcn/ui component stubs (adjust imports to your project)
// - Dark (black + orange) theme
// - Responsive sidebar with scroll-spy, mobile drawer, keyboard shortcuts
// - Three.js particle background (constrained to avoid overflow) + light shooting stars
// - Copy-to-clipboard helpers, code snippets, SDK examples, FAQs, Best Practices, Glossary
// NOTE: This file is intentionally verbose to emulate a ~900-line single-file documentation page.
// Adjust imports and component paths to match your codebase.

"use client";

import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// icons
import {
  Menu,
  X,
  BookOpen,
  Code,
  Rocket,
  ShieldCheck,
  Layers,
  Terminal,
  FileJson,
  Users,
  Cpu,
  Zap,
  Lock,
  Search as SearchIcon,
  ArrowUpRight,
  Github,
  Twitter,
  Slack,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Copy,
  Star,
  HelpCircle,
  Info,
  List,
} from "lucide-react";

// shadcn/ui-ish components — in your project these should resolve to actual components
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// -----------------------------
// Theme constants
const ACCENT = "#FF7A2B";
const ACCENT_SOFT = "rgba(255,122,43,0.08)";
const BG = "#050505";
const PANEL = "rgba(12,12,12,0.6)";
const MUTED = "#A39A94";

// -----------------------------
// Helper utilities
function copyToClipboard(text) {
  try {
    navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.warn("copy failed", e);
    return false;
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString();
}

// -----------------------------
// Large dataset: API rows, code snippets, CLI, SDKs (expanded)
const API_ROWS = [
  { method: "GET", endpoint: "/v1/projects", description: "List projects in workspace" },
  { method: "POST", endpoint: "/v1/projects", description: "Create a new project" },
  { method: "GET", endpoint: "/v1/projects/:id", description: "Get project details" },
  { method: "GET", endpoint: "/v1/projects/:id/tasks", description: "List project tasks" },
  { method: "POST", endpoint: "/v1/tasks", description: "Create a new task" },
  { method: "PATCH", endpoint: "/v1/tasks/:id", description: "Update a task" },
  { method: "DELETE", endpoint: "/v1/tasks/:id", description: "Delete a task" },
  { method: "POST", endpoint: "/v1/webhooks", description: "Register a webhook" },
  { method: "GET", endpoint: "/v1/users", description: "List users" },
  { method: "POST", endpoint: "/v1/invites", description: "Invite user to workspace" },
  { method: "POST", endpoint: "/v1/auth/token", description: "Exchange code for OAuth token" },
  { method: "GET", endpoint: "/v1/analytics/burndown", description: "Get burndown chart data" },
];

const CLI_SNIPPET = `# Install CLI
npm install -g @taskora/cli

# Initialize a workspace
taskora init my-workspace

# Create a project
taskora projects create --name "Website Redesign"

# List tasks
taskora tasks list --project "Website Redesign"
`;

const SDK_JS = `import TaskoraClient from "@taskora/sdk";

const client = new TaskoraClient({ apiKey: process.env.TASKORA_KEY });

async function main() {
  const projects = await client.projects.list();
  console.log(projects);
}
main().catch(console.error);`;

const SDK_PY = `from taskora import Taskora

client = Taskora(api_key="YOUR_KEY")

projects = client.projects.list()
print(projects)`;

const SDK_GO = `package main

import (
  "fmt"
  "github.com/taskora/sdk-go"
)

func main() {
  client := taskora.NewClient("YOUR_KEY")
  projects, _ := client.Projects.List()
  fmt.Println(projects)
}
`;

// expanded examples & how-tos
const EXAMPLES = {
  createTaskCurl: `curl -X POST https://api.taskora.com/v1/tasks \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "title": "Fix login bug", "project_id": "proj_123", "assignee": "user_456" }'`,
  webhookVerifyNode: `const sig = req.headers['x-taskora-signature'];
const expected = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET).update(req.rawBody).digest('hex');
if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return res.status(401).end();`,
};

// -----------------------------
// Sections master data builder (with searchText)
const buildSections = () => {
  return [
    {
      id: "introduction",
      title: "Introduction",
      icon: BookOpen,
      searchText:
        "Taskora introduction next gen project management platform kanban calendar analytics realtime collaboration ci cd developer workflows",
      content: (
        <>
          <p className="text-zinc-300 mb-4">
            Taskora is a next-gen project management platform built for product teams who value speed, clarity, and extensibility.
            This documentation covers quickstarts, APIs, SDKs, security, and advanced automation.
          </p>

          <Card className="mb-4 p-4 bg-black/50 border border-orange-500/8">
            <h4 className="text-white font-semibold">Overview</h4>
            <p className="text-zinc-300 mt-2">Kanban, Calendar, Analytics, and Realtime collaboration — integrated with CI/CD and developer workflows.</p>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Card className="p-4 bg-black/50 border border-orange-500/8">
              <h5 className="text-sm text-zinc-300 mb-2">Who is Taskora for?</h5>
              <p className="text-zinc-300 text-sm">Product teams, engineering squads, and cross-functional organizations.</p>
            </Card>

            <Card className="p-4 bg-black/50 border border-orange-500/8">
              <h5 className="text-sm text-zinc-300 mb-2">Core features</h5>
              <ul className="text-zinc-300 list-disc list-inside text-sm">
                <li>Drag & drop Kanban</li>
                <li>Calendar & scheduling with sync</li>
                <li>Analytics & burndown</li>
                <li>Automations & AI prioritization</li>
              </ul>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 bg-black/50 border border-orange-500/8">
              <h6 className="text-sm text-zinc-300 mb-1">Get started</h6>
              <p className="text-zinc-300 text-sm">Sign up, create a workspace, and invite your team.</p>
            </Card>
            <Card className="p-4 bg-black/50 border border-orange-500/8">
              <h6 className="text-sm text-zinc-300 mb-1">Integrations</h6>
              <p className="text-zinc-300 text-sm">Connect GitHub, Slack, and calendar providers.</p>
            </Card>
            <Card className="p-4 bg-black/50 border border-orange-500/8">
              <h6 className="text-sm text-zinc-300 mb-1">Security</h6>
              <p className="text-zinc-300 text-sm">SSO, RBAC, audit logs, and enterprise-grade compliance.</p>
            </Card>
          </div>
        </>
      ),
    },

    {
      id: "getting-started",
      title: "Getting Started",
      icon: Rocket,
      searchText: "create account install cli first api call examples quickstart init workspace",
      content: (
        <>
          <h3 className="text-white font-semibold mb-2">Create an account</h3>
          <p className="text-zinc-300 mb-3">Sign up with email, Google, or GitHub. Create a workspace and invite teammates.</p>

          <h3 className="text-white font-semibold mb-2">Install the CLI</h3>
          <pre className="bg-zinc-900/60 border border-orange-500/10 rounded-lg p-4 text-sm overflow-x-auto text-orange-100 mb-6">
            <code>{CLI_SNIPPET}</code>
          </pre>

          <h3 className="text-white font-semibold mb-2">First API call</h3>
          <pre className="bg-zinc-900/60 border border-orange-500/10 rounded-lg p-4 text-sm overflow-x-auto text-orange-100 mb-6">
            <code>{`curl -H "Authorization: Bearer YOUR_API_KEY" https://api.taskora.com/v1/projects`}</code>
          </pre>

          <div className="flex gap-3 items-center">
            <Button onClick={() => copyToClipboard(CLI_SNIPPET)} className="bg-orange-500 text-black">Copy CLI</Button>
            <Button variant="outline">Open Quickstart</Button>
          </div>
        </>
      ),
    },

    {
      id: "authentication",
      title: "Authentication",
      icon: ShieldCheck,
      searchText:
        "oauth2 api keys server to server browser flows short-lived oauth tokens header example authorization bearer oauth authorization code grant /v1/auth/token",
      content: (
        <>
          <p className="text-zinc-300 mb-3">Taskora supports OAuth2 and API keys. Use API keys for server-to-server calls. For browser flows, use short-lived OAuth tokens.</p>
          <h4 className="text-white font-semibold mb-2">Header example</h4>
          <pre className="bg-zinc-900/60 rounded-lg p-4 mb-4 text-sm overflow-x-auto">
            <code>{`Authorization: Bearer YOUR_API_KEY`}</code>
          </pre>
          <h4 className="text-white font-semibold mb-2">OAuth flow</h4>
          <p className="text-zinc-300 mb-2">Use the authorization code grant. Exchange codes at <code className="font-mono">POST /v1/auth/token</code>.</p>
          <ul className="text-zinc-300 list-disc list-inside">
            <li>Use refresh tokens with rotating refresh strategy</li>
            <li>Rotate keys periodically for security</li>
            <li>Use short-lived tokens for browser usage</li>
          </ul>
        </>
      ),
    },

    {
      id: "projects",
      title: "Projects API",
      icon: Layers,
      searchText: "projects api create list project details settings members task lists visibility permissions curl example",
      content: (
        <>
          <p className="text-zinc-300 mb-3">Projects contain settings, members, and task lists. Projects are first-class objects with visibility & permission controls.</p>

          <div className="mb-4">
            <h4 className="text-white font-semibold mb-2">API Table</h4>
            <div className="overflow-x-auto mb-6 rounded-lg border border-orange-500/10">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="bg-black/40">
                  <tr>
                    <th className="text-left p-3 text-zinc-300 font-medium">Method</th>
                    <th className="text-left p-3 text-zinc-300 font-medium">Endpoint</th>
                    <th className="text-left p-3 text-zinc-300 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {API_ROWS.map((r, i) => (
                    <tr key={i} className="odd:bg-black/10 hover:bg-orange-500/6">
                      <td className="p-3 font-mono text-orange-400">{r.method}</td>
                      <td className="p-3 text-zinc-300">{r.endpoint}</td>
                      <td className="p-3 text-zinc-400">{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h4 className="text-white font-semibold mb-2">Create Project (example)</h4>
          <pre className="bg-zinc-900/60 rounded-lg p-4 mb-4 text-sm overflow-x-auto">
            <code>{`curl -X POST https://api.taskora.com/v1/projects \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Website Redesign" }'`}</code>
          </pre>
        </>
      ),
    },

    {
      id: "tasks",
      title: "Tasks API",
      icon: Code,
      searchText: "tasks api create update delete attachments comments dependencies custom fields list tasks curl sdk example post patch",
      content: (
        <>
          <p className="text-zinc-300 mb-3">Tasks support rich fields, attachments, comments, dependencies, and custom fields.</p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
           <Card className="p-4 bg-black/60 border  rounded-lg  mb-6 text-sm overflow-x-auto border-orange-500/8">
  <h4 className="text-white font-semibold mb-2">Create Task (cURL)</h4>
  <div className="max-w-full overflow-x-auto">
    <pre className="bg-zinc-900/70 rounded-lg p-3 text-orange-500 overflow-auto text-sm">
      <code className="break-all">{EXAMPLES.createTaskCurl}</code>
    </pre>
  </div>
  <div className="mt-3 flex flex-wrap gap-2">
    <Button onClick={() => copyToClipboard(EXAMPLES.createTaskCurl)} className="bg-orange-500 text-black">Copy</Button>
    <Button variant="outline">Try in Console</Button>
  </div>
</Card>

<Card className="p-4 bg-black/60 border  rounded-lg  mb-6 text-sm overflow-x-auto border-orange-500/8">
  <h4 className="text-white font-semibold mb-2">Create Task (JS SDK)</h4>
  <div className="max-w-full overflow-x-auto">
    <pre className="bg-zinc-900/70 rounded-lg p-3 text-orange-500 overflow-auto text-sm">
      <code className="break-all">{SDK_JS}</code>
    </pre>
  </div>
  <div className="mt-3 flex flex-wrap gap-2">
    <Button onClick={() => copyToClipboard(SDK_JS)} className="bg-orange-500 text-black">Copy</Button>
    <Button variant="outline">Open SDK Docs</Button>
  </div>
</Card>

          </div>

          <h4 className="text-white font-semibold mb-2">Batch operations</h4>
          <p className="text-zinc-300 mb-3">Use bulk endpoints to update or import tasks at scale; prefer asynchronous processing for large imports.</p>
        </>
      ),
    },

    {
      id: "users",
      title: "Users & Permissions",
      icon: Users,
      searchText: "users permissions roles admin manager member invites admin api manage invites roles sso saml enterprise",
      content: (
        <>
          <p className="text-zinc-300 mb-3">Teams and roles manage access. Roles: Member, Manager, Admin. Use the Admin API to manage invites and roles.</p>
          <pre className="bg-zinc-900/60 rounded-lg p-3 mb-4 text-sm overflow-x-auto">
            <code>{`POST /v1/invites
{ "email": "user@example.com", "role": "member" }`}</code>
          </pre>

          <h4 className="text-white font-semibold mb-2">SSO / Enterprise</h4>
          <p className="text-zinc-300">We support SAML and OIDC for enterprise SSO. Contact sales for self-hosting and on-prem deployment options.</p>
        </>
      ),
    },

    {
      id: "integrations",
      title: "Integrations",
      icon: Zap,
      searchText: "integrations github slack google calendar notion webhooks custom flows post webhooks events notifications",
      content: (
        <>
          <p className="text-zinc-300 mb-3">Built-in integrations: GitHub, Slack, Google Calendar, Notion. Use webhooks for custom flows.</p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-4 bg-black/60 border overflow-auto border-orange-500/8">
              <h4 className="text-white font-semibold mb-2">GitHub integration</h4>
              <pre className="bg-zinc-900/70 rounded-lg p-3 text-orange-300 overflow-x-auto text-sm">
                <code>{`POST /v1/integrations/github/events
{ "repo": "team/repo", "event": "push" }`}</code>
              </pre>
              <p className="text-zinc-300 text-sm mt-2">Use GitHub webhooks to create tasks from PRs and mention IDs in commits to attach metadata.</p>
            </Card>

            <Card className="p-4 bg-black/60 border border-orange-500/8">
              <h4 className="text-white font-semibold mb-2">Slack notifications</h4>
              <p className="text-zinc-300">Configure channel notifications for task assignments and mentions. Use ephemeral messages for confirmations.</p>
            </Card>
          </div>

          <h4 className="text-white font-semibold mb-2">Webhooks</h4>
          <pre className="bg-zinc-900/60 rounded-lg p-3 mb-4 text-sm overflow-x-auto">
            <code>{`POST /v1/webhooks
{
  "url": "https://hooks.example.com/taskora",
  "events": ["task.created", "task.updated"]
}`}</code>
          </pre>

          <h5 className="text-white font-semibold mb-2">Verify webhook signature (Node)</h5>
          <pre className="bg-zinc-900/60 rounded-lg p-3 mb-4 text-sm overflow-x-auto">
            <code>{EXAMPLES.webhookVerifyNode}</code>
          </pre>
        </>
      ),
    },

    {
      id: "sdk",
      title: "SDK Usage",
      icon: FileJson,
      searchText: "sdk usage javascript python go node official sdk examples cli js py go snippets",
      content: (
        <>
          <p className="text-zinc-300 mb-3">Official SDKs for Node.js, Python, and Go simplify API usage and handle retries, backoff, and pagination.</p>

          <Tabs defaultValue="js" className="mb-4">
            <TabsList className="bg-orange-500 border border-orange-500/10 rounded-lg p-1">
              <TabsTrigger  className="data-[state=active]:bg-white cursor-pointer" value="js">JavaScript</TabsTrigger>
              <TabsTrigger className="data-[state=active]:bg-white cursor-pointer"  value="py">Python</TabsTrigger>
              <TabsTrigger className="data-[state=active]:bg-white cursor-pointer"  value="go">Go</TabsTrigger>
            </TabsList>
            <TabsContent value="js">
              <pre className="bg-zinc-900/70 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{SDK_JS}</code>
              </pre>
            </TabsContent>
            <TabsContent value="py">
              <pre className="bg-zinc-900/70 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{SDK_PY}</code>
              </pre>
            </TabsContent>
            <TabsContent value="go">
              <pre className="bg-zinc-900/70 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{SDK_GO}</code>
              </pre>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3">
            <Button onClick={() => copyToClipboard(SDK_JS)} className="bg-orange-500 text-black">Copy JS</Button>
            <Button onClick={() => copyToClipboard(SDK_PY)} className="bg-orange-500/80 text-black">Copy Py</Button>
          </div>
        </>
      ),
    },

    {
      id: "ai",
      title: "AI Features",
      icon: Cpu,
      searchText: "ai features prioritize estimates anomaly detection automation ai prioritize example post /v1/ai/prioritize",
      content: (
        <>
          <p className="text-zinc-300 mb-3">Taskora provides optional AI tooling: auto-prioritization, estimate prediction, and anomaly detection.</p>

          <h4 className="text-white font-semibold mb-2">AI priority example</h4>
          <pre className="bg-zinc-900/60 rounded-lg p-3 mb-4 text-sm overflow-x-auto">
            <code>{`POST /v1/ai/prioritize
{
  "task": {"title":"Fix login bug","description":"..."}
}`}</code>
          </pre>

          <p className="text-zinc-300">AI features are opt-in and configurable per workspace. Use audit logs to inspect AI-driven changes.</p>
        </>
      ),
    },

    {
      id: "security",
      title: "Security & Compliance",
      icon: Lock,
      searchText: "security compliance tls aes 256 rbac audit logs sso saml soc2 tls 1.2 encryption roles policies",
      content: (
        <>
          <p className="text-zinc-300 mb-3">Security-first design: TLS, AES-256 at rest, RBAC, audit logs, SSO/SAML for enterprise, SOC2 available.</p>
          <ul className="text-zinc-300 list-disc list-inside">
            <li>TLS 1.2+ enforced</li>
            <li>AES-256 encrypted storage</li>
            <li>Role-based access controls</li>
            <li>Periodic penetration testing and vulnerability scans</li>
          </ul>

          <h5 className="text-white font-semibold mt-4">Compliance</h5>
          <p className="text-zinc-300">We provide SOC2 reports on request and follow industry best practices for data handling.</p>
        </>
      ),
    },

    {
      id: "faq",
      title: "FAQ",
      icon: SearchIcon,
      searchText: "faq migrate from jira self host import jira wizard json csv map fields self hosting enterprise contact sales",
      content: (
        <>
          <Accordion type="single" collapsible>
            <AccordionItem value="faq-1">
              <AccordionTrigger>How do I migrate from Jira?</AccordionTrigger>
              <AccordionContent>
                Use the Import &gt; Jira wizard. Upload JSON or CSV and map fields.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger>Is Taskora self-hostable?</AccordionTrigger>
              <AccordionContent>
                Self-hosting is available for enterprise under special agreements. Contact sales.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger>How do billing and metering work?</AccordionTrigger>
              <AccordionContent>
                Billing is based on active users and storage. Metering is daily; invoices are monthly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      ),
    },

    {
      id: "best-practices",
      title: "Best Practices",
      icon: Info,
      searchText: "best practices project management naming conventions branching policies automation policies webhooks retries idempotency",
      content: (
        <>
          <h4 className="text-white font-semibold mb-2">Naming & Organization</h4>
          <ul className="text-zinc-300 list-disc list-inside mb-4">
            <li>Standardize project naming for discoverability</li>
            <li>Use labels and custom fields sparingly for clarity</li>
          </ul>

          <h4 className="text-white font-semibold mb-2">API Practices</h4>
          <ul className="text-zinc-300 list-disc list-inside mb-4">
            <li>Use idempotency keys for retryable write operations</li>
            <li>Respect rate limits and exponential backoff</li>
            <li>Validate webhook payloads using HMAC signatures</li>
          </ul>

          <h4 className="text-white font-semibold mb-2">Automation</h4>
          <p className="text-zinc-300">Design automations to be composable and observable. Log actions and provide undo where possible.</p>
        </>
      ),
    },

    {
      id: "glossary",
      title: "Glossary",
      icon: List,
      searchText: "glossary terms definitions api oauth webhook webhook signature idempotency rbac",
      content: (
        <>
          <dl className="text-zinc-300 grid gap-4">
            <div>
              <dt className="font-semibold text-white">Idempotency</dt>
              <dd>Guarantee that the same operation can be performed multiple times without side effects.</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">RBAC</dt>
              <dd>Role-based access control — an authorization model that assigns roles to users.</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Webhook</dt>
              <dd>A callback mechanism that posts event payloads to a configured URL.</dd>
            </div>
          </dl>
        </>
      ),
    },
  ];
};

// -----------------------------
// Three.js: Particle field + shooting stars
function ParticleField({ count = 1200, radius = 6 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * radius;
      const theta = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(theta) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2; // reduced vertical spread to prevent overflow
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    return arr;
  }, [count, radius]);

  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.02;
    ref.current.rotation.x = Math.sin(t * 0.03) * 0.01;
  });

  return (
    <group ref={ref}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color={ACCENT} size={0.01} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
}

function ShootingStars({ frequency = 4 }) {
  const group = useRef();
  const pool = useRef([]);
  const last = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (t - last.current > (Math.random() * 3 + 1)) {
      spawn();
      last.current = t;
    }

    pool.current.forEach((star) => {
      star.age += 0.016;
      if (star.age > star.life) {
        star.mesh.visible = false;
        pool.current = pool.current.filter((s) => s !== star);
      } else {
        const p = star.path(star.age / star.life);
        star.mesh.position.set(p.x, p.y, p.z);
        if (star.mesh.material) star.mesh.material.opacity = 1 - star.age / star.life;
      }
    });
  });

  function spawn() {
    const start = new THREE.Vector3((Math.random() * 2 + 2.5), (Math.random() * 1.5) + 0.8, -0.5 - Math.random() * 1.2);
    const end = new THREE.Vector3(-(Math.random() * 2 + 2.5), (Math.random() * 1.2) - 0.8, -0.5 - Math.random() * 1.2);
    const life = Math.random() * 0.9 + 0.7;

    const curve = new THREE.CubicBezierCurve3(
      start,
      new THREE.Vector3((start.x + end.x) / 2, start.y + 0.6, start.z),
      new THREE.Vector3((start.x + end.x) / 2, end.y - 0.6, end.z),
      end
    );

    const mat = new THREE.MeshBasicMaterial({ color: "#ffd2b0", transparent: true, opacity: 1, depthWrite: false });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), mat);
    mesh.position.copy(start);
    mesh.visible = true;
    group.current?.add(mesh);

    const star = {
      mesh,
      age: 0,
      life,
      path: (t) => curve.getPoint(t),
    };
    pool.current.push(star);

    setTimeout(() => {
      try {
        group.current?.remove(mesh);
        mesh.geometry.dispose();
        if (mesh.material) mesh.material.dispose();
      } catch (e) {}
    }, (life + 0.6) * 1000);
  }

  return <group ref={group} />;
}

// -----------------------------
// Main component
export default function DocumentationPage() {
  // UI state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("introduction");
  const mainRef = useRef(null);
  const sectionsRef = useRef({});
  const sections = useMemo(() => buildSections(), []);

  // keyboard shortcuts (search focus, navigate home)
  useEffect(() => {
    function onKey(e) {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        const el = document.querySelector('input[placeholder="Search docs..."]');
        if (el) {
          e.preventDefault();
          el.focus();
          el.select?.();
        }
      }
      if (e.key === "g" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        document.getElementById("introduction")?.scrollIntoView({ behavior: "smooth" });
      }
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        // toggles the search input on desktop
        const el = document.querySelector('input[placeholder="Search docs..."]');
        if (el) {
          e.preventDefault();
          el.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Filter logic — uses section.searchText fields (fixes previous stringify issue)
  const filteredSections = useMemo(() => {
    if (!query.trim()) return sections;
    const q = query.toLowerCase();
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.searchText && s.searchText.toLowerCase().includes(q))
    );
  }, [query, sections]);

  // Scroll spy: update active id based on scroll position
  useEffect(() => {
    const handler = () => {
      if (!mainRef.current) return;
      let current = sections[0]?.id ?? null;
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - 140 <= 0) current = sec.id;
      }
      if (current) setActiveId(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [sections]);

  // smooth scroll helper
  function goTo(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setDrawerOpen(false);
    }
  }

  // clamp background to avoid overflow and excessive GPU usage on mobile
  const canvasStyles = {
    position: "fixed",
    inset: 0,
    zIndex: -20,
    pointerEvents: "none",
    overflow: "hidden",
    maxHeight: "100vh",
    maxWidth: "100vw",
    // subtle clip path to prevent stray particles from visually overflowing on odd viewports
    clipPath: "inset(0 0 0 0)",
  };

  // Render
  return (
    <div className="relative min-h-screen flex  bg-[#05060a]
                 bg-[radial-gradient(circle,_rgba(255,122,28,0.25)_1px,transparent_1px)]
                 bg-[length:20px_20px] text-white overflow-x-hidden">
   

      {/* Mobile top menu */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setDrawerOpen(true)} className="bg-black/70 border border-orange-500/20 p-2 rounded-md text-orange-400">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:flex-col md:w-72 lg:w-80 border-r border-orange-500/8 p-4 bg-black/60 backdrop-blur-md sticky top-0 h-screen z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center font-bold text-black">T</div>
            <div>
              <div className="font-semibold text-white">Taskora Docs</div>
              <div className="text-xs text-zinc-400">v1 • API v1</div>
            </div>
          </div>
          <div className="text-xs text-zinc-400">Docs</div>
        </div>

        <div className="mb-4">
          <Input placeholder="Search docs..." value={query} onChange={(e) => setQuery(e.target.value)} className="bg-black/40 border-orange-500/8 text-zinc-200" />
        </div>

        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-2 pb-6">
            {filteredSections.map((s) => (
              <button
                key={s.id}
                onClick={() => goTo(s.id)}
                className={`w-full text-left flex items-center gap-3 p-2 rounded hover:bg-orange-500/6 transition ${activeId === s.id ? "bg-orange-500/6 ring-1 ring-orange-500/10" : "text-zinc-300"}`}
                aria-current={activeId === s.id ? "true" : "false"}
              >
                <s.icon className="w-4 h-4 text-orange-400" />
                <span className="text-sm">{s.title}</span>
              </button>
            ))}
          </nav>
        </ScrollArea>

        <div className="mt-4">
          <a href="/sdk" className="block w-full text-center py-2 bg-orange-500 text-black rounded-md font-medium">Get SDKs</a>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-60 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
            <motion.aside initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} className="absolute left-0 top-0 bottom-0 w-80 bg-black/95 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white font-semibold">Taskora Docs</div>
                <button onClick={() => setDrawerOpen(false)} className="p-2"><X className="w-5 h-5 text-orange-400" /></button>
              </div>
              <Input placeholder="Search docs..." value={query} onChange={(e) => setQuery(e.target.value)} className="mb-4 bg-black/40" />
              <nav className="flex flex-col gap-2">
                {filteredSections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} onClick={() => goTo(s.id)} className="p-2 rounded hover:bg-orange-500/6 text-zinc-300">{s.title}</a>
                ))}
              </nav>

              <Separator className="my-4" />
              <div className="text-zinc-400 text-sm">Tips</div>
              <ul className="text-zinc-300 text-sm mt-2 list-disc list-inside">
                <li>Press <span className="font-mono">/</span> to focus search</li>
                <li>Press <span className="font-mono">Ctrl/Cmd + G</span> to jump to Introduction</li>
              </ul>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10 max-w-full">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Taskora Documentation</h1>
              <p className="text-zinc-400 mt-2 max-w-2xl">Everything you need to integrate, extend, and operate Taskora — quickstarts, API reference, SDK examples, and security info.</p>

              <div className="mt-4 flex items-center gap-3">
                <Badge className="bg-orange-500/90 text-black">v1</Badge>
                <span className="text-sm text-zinc-400">Updated: {formatDate(new Date())}</span>
                <a href="/changelog" className="text-sm text-zinc-300 hover:text-orange-400 flex items-center gap-2">Changelog <ArrowUpRight className="w-4 h-4" /></a>
              </div>
            </div>

            <div className="hidden md:flex flex-col gap-3 items-end">
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-2 rounded-md bg-black/40 border border-orange-500/10 text-orange-300">Docs</button>
                    </TooltipTrigger>
                    <TooltipContent>Documentation index and guides</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="text-sm text-zinc-400">Need help? <a href="/support" className="text-orange-400">Contact support</a></div>
              </div>
            </div>
          </div>
        </header>

        {/* Render sections */}
        {filteredSections.map((sec, idx) => (
          <section id={sec.id} key={sec.id} className="mb-16" ref={(el) => (sectionsRef.current[sec.id] = el)}>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }}>
              <div className="flex items-center gap-3 mb-4">
                <sec.icon className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-orange-400">{sec.title}</h2>
              </div>

              <div className="prose prose-invert max-w-none text-zinc-300">
                {sec.content ?? <p className="text-zinc-300">Content coming soon.</p>}
              </div>
            </motion.div>
          </section>
        ))}

        {/* Consolidated API Reference (additional details) */}
        <section id="api-reference" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-bold text-orange-400">API Reference (consolidated)</h2>
          </div>

          <p className="text-zinc-300 mb-4">Use Bearer tokens for service calls. For web flows, prefer OAuth short-lived tokens. Use the consolidated endpoints below to get started quickly.</p>

          <div className="mb-6">
            <div className="overflow-x-auto rounded-lg border border-orange-500/10">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-black/40">
                  <tr>
                    <th className="text-left p-3 text-zinc-300 font-medium">Method</th>
                    <th className="text-left p-3 text-zinc-300 font-medium">Endpoint</th>
                    <th className="text-left p-3 text-zinc-300 font-medium">Description</th>
                    <th className="text-left p-3 text-zinc-300 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {API_ROWS.map((r, i) => (
                    <tr key={i} className="odd:bg-black/10 hover:bg-orange-500/6">
                      <td className="p-3 font-mono text-orange-400">{r.method}</td>
                      <td className="p-3 text-zinc-300">{r.endpoint}</td>
                      <td className="p-3 text-zinc-400">{r.description}</td>
                      <td className="p-3 text-zinc-400">{r.method === "POST" ? "Requires write access" : "Read"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h4 className="text-white font-semibold mb-2">Create Task (server example)</h4>
          <pre className="bg-zinc-900/60 rounded-lg p-4 mb-6 text-sm overflow-x-auto">
            <code>{`// Node (Express)
app.post('/create-task', async (req, res) => {
  const r = await fetch('https://api.taskora.com/v1/tasks', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + process.env.TASKORA_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  const json = await r.json();
  res.json(json);
});`}</code>
          </pre>

          <h4 className="text-white font-semibold mb-2">Pagination</h4>
          <p className="text-zinc-300 mb-3">Most list endpoints support cursor-based pagination using <code className="font-mono">?limit=&cursor=</code>.</p>

          <h4 className="text-white font-semibold mb-2">Rate limits</h4>
          <p className="text-zinc-300">Standard rate limits apply per API key. For higher throughput, contact support for rate limit increases and a service agreement.</p>
        </section>

        {/* SDK examples */}
        <section id="sdk-examples" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <FileJson className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-bold text-orange-400">SDK Examples</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
           <Card className="p-4 bg-black/60 border rounded-lg mb-6 text-sm overflow-x-auto border-orange-500/8">
  <h4 className="text-white font-semibold mb-2">JavaScript</h4>
  <div className="max-w-full overflow-x-auto">
    <pre className="bg-zinc-900/70 rounded-lg p-3 text-orange-300 overflow-x-auto text-sm mb-3">
      <code className="break-all">{SDK_JS}</code>
    </pre>
  </div>
  <div className="flex flex-wrap gap-2">
    <Button onClick={() => copyToClipboard(SDK_JS)} className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-black">Copy</Button>
    <Button variant="outline">Open API Playground</Button>
  </div>
</Card>

<Card className="p-4 bg-black/60 border border-orange-500/8">
  <h4 className="text-white font-semibold mb-2">Python</h4>
  <div className="max-w-full overflow-x-auto">
    <pre className="bg-zinc-900/70 rounded-lg p-3 text-orange-300 overflow-auto text-sm mb-3">
      <code className="break-all">{SDK_PY}</code>
    </pre>
  </div>
  <div className="flex flex-wrap gap-2">
    <Button onClick={() => copyToClipboard(SDK_PY)} className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-black">Copy</Button>
    <Button variant="outline">Open Docs</Button>
  </div>
</Card>

          </div>

          <div className="mt-6">
            <h5 className="text-white font-semibold mb-2">Retry & backoff</h5>
            <p className="text-zinc-300">All official SDKs include automatic retry with exponential backoff for transient 5xx errors and 429 responses.</p>
          </div>
        </section>

        {/* Webhooks & Integrations section */}
        <section id="webhooks" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-bold text-orange-400">Webhooks & Integrations</h2>
          </div>

          <p className="text-zinc-300 mb-3">Webhooks push events to configured endpoints; always validate HMAC signatures to ensure authenticity.</p>

          <Card className="p-4 bg-black/60 border border-orange-500/8 mb-4">
            <h4 className="text-white font-semibold mb-2">Webhook payload example</h4>
            <pre className=" bg-gray-900/50 rounded-lg p-3 text-orange-300 overflow-x-auto text-sm">
              <code>{`{
  "event": "task.created",
  "data": {
    "id": "task_123",
    "title": "Fix bug",
    "project_id": "proj_123"
  },
  "created_at": "2025-09-20T00:00:00Z"
}`}</code>
            </pre>
          </Card>

          <h4 className="text-white font-semibold mb-2">Verify webhook signature (Node)</h4>
          <pre className="bg-zinc-900/60 rounded-lg p-3 mb-4 text-sm overflow-x-auto">
            <code>{EXAMPLES.webhookVerifyNode}</code>
          </pre>
        </section>

        {/* Advanced: AI & Automation */}
        <section id="advanced" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-bold text-orange-400">AI & Automation</h2>
          </div>

          <Card className="p-4 bg-black/60 border border-orange-500/8 mb-4">
            <h4 className="text-white font-semibold mb-2">Rules & Triggers</h4>
            <p className="text-zinc-300">Define rule-based automations to triage tasks, assign owners, or notify channels.</p>
          </Card>

          <h4 className="text-white font-semibold mb-2">AI Prioritization (example)</h4>
          <pre className="bg-zinc-900/60 rounded-lg p-3 mb-4 text-sm overflow-x-auto">
            <code>{`POST /v1/ai/prioritize
{
  "task": {"title":"Fix login bug","description":"..."}
}`}</code>
          </pre>

          <p className="text-zinc-300">AI-driven changes are logged and can be audited. Use "suggest-only" mode to review suggestions before applying them.</p>
        </section>

        {/* Support CTA */}
        <section className="mb-12">
          <Card className="p-6 bg-black/60 border border-orange-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold">Need help integrating?</h3>
              <p className="text-zinc-300 text-sm">Get API keys, request a demo, or reach out to enterprise support for migration assistance.</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-orange-500 hover:bg-orange-600 text-black">Get API Key</Button>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </Card>
        </section>

        <footer className="text-zinc-400 text-sm py-6 border-t border-orange-500/8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} Taskora — Built for teams who ship.</div>
            <div className="flex items-center gap-3">
              <a href="#" className="text-zinc-400 hover:text-orange-400"><Github className="w-4 h-4" /></a>
              <a href="#" className="text-zinc-400 hover:text-orange-400"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="text-zinc-400 hover:text-orange-400"><Slack className="w-4 h-4" /></a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
