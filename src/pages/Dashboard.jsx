// src/pages/Dashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  BarChart3,
  Settings,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserButton, OrganizationSwitcher } from "@clerk/clerk-react";
import DeleteAccountButton from "../components/DeleteAccountButton";

export default function Dashboard() {
  
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-black/40 border-r border-orange-500/20 p-6">
        {/* Logo */}
        <div className="text-2xl font-bold mb-8">
          <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
            Taskora
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-3">
          <Button variant="ghost" className="justify-start text-zinc-300 hover:text-orange-400">
            <LayoutDashboard className="w-5 h-5 mr-2" /> Dashboard
          </Button>
          <Button variant="ghost" className="justify-start text-zinc-300 hover:text-orange-400">
            <ListTodo className="w-5 h-5 mr-2" /> Tasks
          </Button>
          <Button variant="ghost" className="justify-start text-zinc-300 hover:text-orange-400">
            <Calendar className="w-5 h-5 mr-2" /> Calendar
          </Button>
          <Button variant="ghost" className="justify-start text-zinc-300 hover:text-orange-400">
            <BarChart3 className="w-5 h-5 mr-2" /> Reports
          </Button>
          <Button variant="ghost" className="justify-start text-zinc-300 hover:text-orange-400">
            <Users className="w-5 h-5 mr-2" /> Team
          </Button>
          <Button variant="ghost" className="justify-start text-zinc-300 hover:text-orange-400">
            <Settings className="w-5 h-5 mr-2" /> Settings
          </Button>
        </nav>

        {/* Clerk User + Org */}
        <div className="mt-6 flex flex-col gap-4">
          {/* Organization Switcher */}
          <OrganizationSwitcher
          afterCreateOrganizationUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "flex justify-start",
                organizationSwitcherTrigger:
                  "bg-black/60 border border-orange-500/30 text-white rounded-md px-3 py-2 text-sm hover:bg-black/80",
              },
            }}
          />

          {/* User Account */}
          <UserButton
             redirectUrl="/delete"
            afterSignOutUrl="/delete"
            appearance={{
              elements: {
                userButtonBox: "flex justify-start",
                userButtonAvatarBox: "w-8 h-8",
                userButtonTrigger:
                  "bg-black/60 border border-orange-500/30 rounded-md px-2 py-1 hover:bg-black/80",
              },
            }}
          />

          <DeleteAccountButton/>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Badge className="bg-orange-500/90 text-black px-3 py-1 font-semibold">
            Pro Workspace
          </Badge>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className="p-6 bg-black/40 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="text-orange-500 w-6 h-6" />
              <h3 className="font-semibold">Completed Tasks</h3>
            </div>
            <p className="text-3xl font-bold">132</p>
            <p className="text-sm text-zinc-400">+12 this week</p>
          </Card>

          <Card className="p-6 bg-black/40 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-orange-500 w-6 h-6" />
              <h3 className="font-semibold">Upcoming Deadlines</h3>
            </div>
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm text-zinc-400">Next: Sep 25</p>
          </Card>

          <Card className="p-6 bg-black/40 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-orange-500 w-6 h-6" />
              <h3 className="font-semibold">Active Members</h3>
            </div>
            <p className="text-3xl font-bold">24</p>
            <p className="text-sm text-zinc-400">3 online now</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-black/40 border border-orange-500/20 rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3 text-zinc-300">
            <li>
              ✅ John completed{" "}
              <span className="text-orange-400">“Update Landing Page”</span>
            </li>
            <li>
              📅 Sarah scheduled{" "}
              <span className="text-orange-400">“Sprint Planning Meeting”</span>
            </li>
            <li>
              📊 Report generated for{" "}
              <span className="text-orange-400">Q3 Metrics</span>
            </li>
            <li>
              👥 Alex invited{" "}
              <span className="text-orange-400">2 new team members</span>
            </li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
