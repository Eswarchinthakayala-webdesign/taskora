// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useUser, UserButton, OrganizationSwitcher } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Users,
  Building2,
  TrendingUp,
  Plus,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  Grid,
  BarChart2,
  LifeBuoy,
  Settings,
  Home,
  Database,
  Bell,
  User,
  LogOut,
} from "lucide-react";
import { supabase } from "../lib/supabase";

// shadcn/ui components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Dashboard.jsx — improved responsive + Supabase-like sidebar style
 *
 * - Collapsible desktop sidebar (icon-only collapsed state) + mobile slide-over
 * - Improved search bar with expand-on-focus, clear button & debouncing
 * - Prevent page overflow, responsive grid/layout fixes
 * - Sidebar links use lucide-react icons and match Supabase-style subtle UI
 * - Preserves original data fetching / analytics logic
 */

/* ---------------------------
   Utilities
   --------------------------- */

// format YYYY-MM-DD
function toYMD(date) {
  return new Date(date).toISOString().slice(0, 10);
}

/**
 * Generate an array of dates (YYYY-MM-DD) between start and end inclusive
 */
function generateDateRange(start, end) {
  const arr = [];
  const cur = new Date(start);
  cur.setUTCHours(0, 0, 0, 0);
  while (cur <= end) {
    arr.push(toYMD(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return arr;
}

/**
 * Fill daily time-series from rawCounts: [{ date: 'YYYY-MM-DD', org_count: n }, ...]
 */
function fillDailySeries(rawCounts = [], startDate, endDate) {
  const baseMap = new Map(rawCounts.map((r) => [r.date, r.org_count]));
  return generateDateRange(startDate, endDate).map((date) => ({
    date,
    org_count: baseMap.get(date) ?? 0,
  }));
}

/* ---------------------------
   Sparkline
   --------------------------- */
function Sparkline({ data = [], width = 80, height = 28, stroke = "#ff8a1f" }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);
  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  const firstY = data.length ? height - ((data[0] - min) / range) * (height - 4) - 2 : height / 2;
  const lastY = data.length ? height - ((data[data.length - 1] - min) / range) * (height - 4) - 2 : height / 2;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="sparkline">
      <defs>
        <linearGradient id="sparkGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.45" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path d={`M0 ${height} L ${points} L ${width} ${height} Z`} fill="url(#sparkGrad)" stroke="none" opacity="0.9" />
      <circle cx={0} cy={firstY} r={2.5} fill={stroke} />
      <circle cx={width} cy={lastY} r={2.5} fill={stroke} />
    </svg>
  );
}

/* ---------------------------
   KPI Card
   --------------------------- */
function KPICard({ title, value, hint, Icon, sparkData = [], className = "", accent = "orange" }) {
  const accentBg = accent === "orange" ? "bg-gradient-to-br from-orange-400 to-orange-300 text-black" : "bg-zinc-700 text-white";

  return (
    <Card className={`p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm ${className}`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-3 rounded-lg ${accentBg} flex items-center justify-center shrink-0`}>
          {Icon && <Icon size={18} />}
        </div>
        <div className="min-w-0">
          <div className="text-sm text-zinc-400 truncate">{title}</div>
          <div className="text-2xl font-bold leading-none truncate">{value}</div>
          {hint && <div className="text-xs text-zinc-400 mt-1 truncate">{hint}</div>}
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="mb-1">
          <Sparkline data={sparkData} />
        </div>
        <div className="text-xs text-zinc-400">trend</div>
      </div>
    </Card>
  );
}

/* ---------------------------
   RecentOrganizationsList
   --------------------------- */
function RecentOrganizationsList({ ownerId, dark, searchTerm = "" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingErr, setLoadingErr] = useState(null);

  useEffect(() => {
    if (!ownerId) return;
    let mounted = true;

    const fetch = async () => {
      setLoading(true);
      setLoadingErr(null);
      try {
        const resp = await supabase
          .from("organizations")
          .select("id, name, created_at")
          .eq("owner_id", ownerId)
          .order("created_at", { ascending: false })
          .limit(200);

        if (!mounted) return;
        if (resp.error) {
          setLoadingErr(resp.error);
          setItems([]);
        } else {
          setItems(resp.data || []);
        }
      } catch (err) {
        if (mounted) {
          setLoadingErr(err);
          setItems([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => {
      mounted = false;
    };
  }, [ownerId]);

  const filtered = useMemo(() => {
    if (!searchTerm) return items;
    const q = searchTerm.trim().toLowerCase();
    return items.filter((it) => (it.name || "").toLowerCase().includes(q) || (it.id || "").toLowerCase().includes(q));
  }, [items, searchTerm]);

  if (loading) return <div className="py-6 text-zinc-400">Loading organizations…</div>;
  if (loadingErr) return <div className="py-6 text-red-400">Error loading organizations</div>;
  if (!filtered.length) return <div className="py-6 text-zinc-400">No organizations found.</div>;

  return (
    <ScrollArea className="max-h-96">
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((org) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={`p-1 rounded-md`}
          >
            <Link
              to={`/organization/${org.id}`}
              className={`flex items-start justify-between gap-2 p-3 rounded-lg border hover:border-orange-400 hover:bg-orange-500/8 transition-colors ${
                dark ? "border-zinc-800 bg-zinc-900/40" : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs text-zinc-400">
                  {new Date(org.created_at).toLocaleDateString()}
                </div>
                <div className="font-medium mt-1 text-sm truncate">{org.name || "Untitled"}</div>
              </div>
              <div className="text-xs text-zinc-500 font-mono ml-3">{(org.id || "").slice(0, 6)}</div>
            </Link>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}

/* ---------------------------
   Main Dashboard
   --------------------------- */
export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // theme
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("prefers-dark");
      if (saved !== null) return saved === "true";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return true;
    }
  });

  // sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop

  // analytics & data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalOrgs, setTotalOrgs] = useState(0);
  const [rawDailyCounts, setRawDailyCounts] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return toYMD(d);
  });
  const [endDate, setEndDate] = useState(() => toYMD(new Date()));
  const [preset, setPreset] = useState("30");

  // search state (debounced)
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimerRef = useRef(null);

  // reduced motion
  const [reducedMotion, setReducedMotion] = useState(() => {
    try {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  });

  // sync dark class to root
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("prefers-dark", "true");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("prefers-dark", "false");
    }
  }, [dark]);

  // debounce search input -> searchTerm
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 350);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchInput]);

  // fetch analytics whenever user or date range changes
  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const s = new Date(`${startDate}T00:00:00.000Z`);
        const e = new Date(`${endDate}T23:59:59.999Z`);

        const totalPromise = supabase
          .from("organizations")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", user.id);

        const rowsPromise = supabase
          .from("organizations")
          .select("id, created_at")
          .eq("owner_id", user.id)
          .gte("created_at", s.toISOString())
          .lte("created_at", e.toISOString())
          .order("created_at", { ascending: true })
          .limit(10000);

        const [totalResp, rowsResp] = await Promise.all([totalPromise, rowsPromise]);

        if (!mounted) return;

        setTotalOrgs(totalResp?.count ?? 0);

        const rows = rowsResp.data || [];
        const map = new Map();
        for (const r of rows) {
          const d = new Date(r.created_at);
          if (Number.isNaN(d.getTime())) continue;
          const dateKey = toYMD(d);
          map.set(dateKey, (map.get(dateKey) || 0) + 1);
        }
        const arr = Array.from(map.entries())
          .map(([date, org_count]) => ({ date, org_count }))
          .sort((a, b) => (a.date < b.date ? -1 : 1));

        if (mounted) {
          setRawDailyCounts(arr);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAnalytics();
    return () => {
      mounted = false;
    };
  }, [user, startDate, endDate]);

  // derived chart data (filled daily series)
  const chartData = useMemo(() => {
    const s = new Date(`${startDate}T00:00:00.000Z`);
    const e = new Date(`${endDate}T23:59:59.999Z`);
    return fillDailySeries(rawDailyCounts, s, e);
  }, [rawDailyCounts, startDate, endDate]);

  // sparkline, totalInRange, activeOrgsCount
  const sparkForKPI = useMemo(() => {
    const arr = chartData.map((d) => d.org_count);
    const slice = arr.slice(Math.max(0, arr.length - 12));
    if (slice.length < 6) {
      const pad = new Array(6 - slice.length).fill(0);
      return pad.concat(slice);
    }
    return slice;
  }, [chartData]);

  const totalInRange = useMemo(() => chartData.reduce((s, r) => s + r.org_count, 0), [chartData]);

  const activeOrgsCount = useMemo(() => {
    const ed = new Date(`${endDate}T23:59:59.999Z`);
    const sd = new Date(ed);
    sd.setDate(ed.getDate() - 29);
    const filled = fillDailySeries(rawDailyCounts, sd, ed);
    return filled.reduce((s, r) => s + r.org_count, 0);
  }, [rawDailyCounts, endDate]);

  // convenience handlers
  function applyPreset(days) {
    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - (days - 1));
    setStartDate(toYMD(start));
    setEndDate(toYMD(now));
    setPreset(String(days));
  }

  function onCustomDatesApply(s, e) {
    const sd = new Date(`${s}T00:00:00.000Z`);
    const ed = new Date(`${e}T23:59:59.999Z`);
    if (sd > ed) {
      alert("Start date must be before end date");
      return;
    }
    const diff = Math.ceil((ed - sd) / (1000 * 60 * 60 * 24)) + 1;
    if (diff > 3650) {
      alert("Please select a range shorter than 10 years");
      return;
    }
    setStartDate(s);
    setEndDate(e);
    setPreset("custom");
  }

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">Loading user…</div>;
  }
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">Please sign in to view the dashboard.</div>;
  }

  const bgClass = dark ? "bg-black text-white" : "bg-orange-50 text-zinc-900";
  const cardBg = dark ? "bg-zinc-900/70 border border-zinc-800" : "bg-white border border-zinc-200";

  /* ---------------------------
     Layout helper classes to prevent overflow and keep responsive widths
     --------------------------- */
  return (
    <div className={`${bgClass} min-h-screen transition-colors duration-200`}>
      <div className="max-w-screen-2xl mx-auto px-4 py-6">

<header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-6 px-2 sm:px-4 md:px-6">
  {/* Top row: Left controls */}
  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
    {/* Mobile menu toggle */}
    <button
      className="md:hidden p-2 rounded-lg hover:bg-zinc-800/10"
      onClick={() => setSidebarOpen((v) => !v)}
      aria-label="Toggle menu"
    >
      {sidebarOpen ? <X /> : <Menu />}
    </button>

    {/* Desktop collapse toggle */}
    <button
      className="hidden md:inline-flex p-2 rounded-lg hover:bg-zinc-800/10"
      onClick={() => setSidebarCollapsed((v) => !v)}
      aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {sidebarCollapsed ? <Grid /> : <BarChart2 />}
    </button>

    {/* Logo / Title */}
    <div className="min-w-0">
      <div className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-orange-500 to-yellow-400">
        Taskora
      </div>
      <div className="hidden sm:block text-xs md:text-sm text-zinc-400">
        Organization analytics · Overview
      </div>
    </div>
  </div>

  {/* Bottom row: Right controls */}
  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
    {/* Search expands full width on xs */}
    <div className="relative flex-1 sm:flex-none min-w-[100px] max-w-full sm:max-w-xs">
      <div
        className={`flex items-center gap-2 border rounded-lg px-2 py-1 transition-all duration-150 ${
          dark ? "bg-zinc-900/60 border-zinc-800" : "bg-white"
        } ${searchInput ? "shadow-sm" : "shadow-none"}`}
      >
        <Search className="opacity-80 w-4 h-4 shrink-0" />
        <input
          type="search"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="bg-transparent outline-none border-none text-xs sm:text-sm w-full placeholder:text-zinc-400"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput("")}
            className="p-1 rounded hover:bg-zinc-800/10 shrink-0"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>

    {/* Org Switcher */}
    <OrganizationSwitcher
      afterCreateOrganizationUrl="/organizations"
      appearance={{
        elements: {
          organizationSwitcherTrigger: `px-2 sm:px-3 py-1.5 rounded-lg text-sm sm:text-base ${
            dark ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"
          }`,
        },
      }}
    />

    {/* Theme toggle */}
    <button
      onClick={() => setDark((d) => !d)}
      className={`p-2 rounded-lg ${
        dark ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-zinc-200"
      }`}
      aria-label="Toggle theme"
    >
      {dark ? <Moon size={16} className="text-orange-400" /> : <Sun size={16} className="text-yellow-500" />}
    </button>

    {/* User Button */}
    <div
      className={`rounded-lg p-0.5 ${
        dark
          ? "bg-gradient-to-br from-zinc-800 to-zinc-700"
          : "bg-white/90 border border-zinc-200"
      }`}
    >
      <UserButton afterSignOutUrl="/login" />
    </div>
  </div>
</header>

        <div className="flex gap-6 min-h-[60vh]">
          {/* Sidebar - desktop (collapsible) */}
          <aside
            className={`hidden md:flex flex-col gap-4 transition-all duration-200 ${cardBg} overflow-hidden`}
            style={{
              width: sidebarCollapsed ? 72 : 256,
            }}
            aria-hidden={false}
          >
            <div className="flex items-center justify-between px-3 py-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-tr from-orange-400 to-yellow-300 text-black">
                  <Building2 size={16} />
                </div>
                {!sidebarCollapsed && (
                  <div className="min-w-0">
                    <div className="font-semibold truncate">Workspace</div>
                    <div className="text-xs text-zinc-400 truncate">Overview</div>
                  </div>
                )}
              </div>

              {!sidebarCollapsed && (
                <div>
                  <Button variant="ghost" onClick={() => navigate("/settings")} className="hidden sm:inline-flex">Settings</Button>
                </div>
              )}
            </div>

            <Separator />

            <nav className="flex flex-col gap-1 px-2">
              <SidebarButton collapsed={sidebarCollapsed} onClick={() => navigate("/dashboard")} Icon={Home} label="Dashboard" />
              <SidebarButton collapsed={sidebarCollapsed} onClick={() => navigate("/organizations")} Icon={Database} label="Organizations" />
              <SidebarButton collapsed={sidebarCollapsed} onClick={() => navigate("/analytics")} Icon={BarChart2} label="Analytics" />
              <SidebarButton collapsed={sidebarCollapsed} onClick={() => navigate("/projects")} Icon={Users} label="Projects" />
              <SidebarButton collapsed={sidebarCollapsed} onClick={() => navigate("/help")} Icon={LifeBuoy} label="Help" />
            </nav>

            <div className="mt-auto px-3 py-3">
              <Separator />
              {!sidebarCollapsed ? (
                <div className="mt-3 text-xs text-zinc-400">
                  Signed in as
                  <div className="font-medium mt-1 truncate">{user.firstName ?? (user.emailAddresses?.[0]?.email ?? user.primaryEmailAddress?.email)}</div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-2 text-xs text-zinc-400">Signed in</div>
              )}
            </div>
          </aside>

          {/* Mobile slide-over sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={reducedMotion ? { opacity: 1 } : { x: -320, opacity: 0 }}
                animate={reducedMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { x: -320, opacity: 0 }}
                className={`md:hidden fixed z-50 inset-y-12 left-4 w-[85vw] max-w-xs p-4 rounded-2xl ${cardBg} shadow-lg`}
                role="dialog"
                aria-modal="true"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold">Menu</div>
                  <button onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X /></button>
                </div>
                <nav className="flex flex-col gap-2">
                  <Button variant="ghost" onClick={() => { navigate("/dashboard"); setSidebarOpen(false); }} className="justify-start w-full"><div className="flex items-center gap-3"><Home /> <span>Dashboard</span></div></Button>
                  <Button variant="ghost" onClick={() => { navigate("/organizations"); setSidebarOpen(false); }} className="justify-start w-full"><div className="flex items-center gap-3"><Database /> <span>Organizations</span></div></Button>
                  <Button variant="ghost" onClick={() => { navigate("/analytics"); setSidebarOpen(false); }} className="justify-start w-full"><div className="flex items-center gap-3"><BarChart2 /> <span>Analytics</span></div></Button>
                  <Separator />
                  <div className="text-xs text-zinc-400 mt-2">Signed in as</div>
                  <div className="font-medium">{user.firstName ?? (user.emailAddresses?.[0]?.email ?? user.primaryEmailAddress?.email)}</div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content (safe container to prevent overflow) */}
          <main className="flex-1 min-w-0">
            {/* KPI row */}
            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold">Overview</h2>
                  <div className="text-sm text-zinc-400">Quick stats & trends</div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <div className="text-sm text-zinc-400">Dates</div>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="max-w-[140px]"
                    aria-label="Start date"
                  />
                  <span className="text-zinc-400">—</span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="max-w-[140px]"
                    aria-label="End date"
                  />
                  <Button onClick={() => onCustomDatesApply(startDate, endDate)}>Apply</Button>
                </div>
              </div>

              <div className="overflow-x-auto pb-2 -mx-2 px-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <KPICard
                    title="Organizations Created"
                    value={loading ? "…" : totalOrgs}
                    hint="Total created by you"
                    Icon={Building2}
                    sparkData={sparkForKPI}
                    className={cardBg}
                    accent="orange"
                  />
                  <KPICard
                    title="Active Organizations"
                    value={loading ? "…" : activeOrgsCount}
                    hint="Created in last 30 days"
                    Icon={Users}
                    sparkData={sparkForKPI}
                    className={cardBg}
                    accent="zinc"
                  />
                  <KPICard
                    title="Trend (range)"
                    value={loading ? "…" : totalInRange}
                    hint={`${chartData.length} days`}
                    Icon={TrendingUp}
                    sparkData={sparkForKPI}
                    className={cardBg}
                    accent="orange"
                  />
                </div>
              </div>
            </section>

            {/* Charts + List */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className={`${cardBg} lg:col-span-2 p-4 overflow-hidden`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">Organizations — Daily</h3>
                    <div className="text-sm text-zinc-400">From {startDate} to {endDate}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{chartData.length} days</Badge>
                    <Button variant="ghost" onClick={() => applyPreset(7)}>7d</Button>
                    <Button variant="ghost" onClick={() => applyPreset(30)}>30d</Button>
                    <Button variant="ghost" onClick={() => applyPreset(90)}>90d</Button>
                  </div>
                </div>

                <div className="w-full h-72 md:h-96 min-h-[260px]">
                  {loading ? (
                    <div className="h-full flex items-center justify-center text-zinc-400">Loading chart…</div>
                  ) : error ? (
                    <div className="h-full flex items-center justify-center text-red-400">Error loading data</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 8, right: 20, left: -10, bottom: 2 }}>
                        <defs>
                          <linearGradient id="gradOrgs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff8a1f" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#ff8a1f" stopOpacity={0.06} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(v) => {
                            try {
                              const d = new Date(v);
                              return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                            } catch {
                              return v;
                            }
                          }}
                          tick={{ fontSize: 12, fill: dark ? "#cbd5e1" : "#475569" }}
                        />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: dark ? "#cbd5e1" : "#475569" }} />
                        <Tooltip
                          wrapperStyle={{ borderRadius: 8, background: dark ? "#0b0b0b" : "#ffffff" }}
                          contentStyle={{ borderRadius: 8, border: "none" }}
                          labelFormatter={(v) => {
                            try {
                              return new Date(v).toLocaleDateString();
                            } catch {
                              return v;
                            }
                          }}
                        />
                        <Area type="monotone" dataKey="org_count" stroke="#ff8a1f" fill="url(#gradOrgs)" strokeWidth={2} />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>

              <Card className={`${cardBg} p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">Your Organizations</h3>
                    <div className="text-sm text-zinc-400">Recent</div>
                  </div>
                  <div className="text-sm text-zinc-400">Total: {loading ? "…" : totalOrgs}</div>
                </div>

                <RecentOrganizationsList ownerId={user.id} dark={dark} searchTerm={searchTerm} />
              </Card>
            </section>
          </main>
        </div>
      </div>

      {/* Floating New Organization Button */}
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
        animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="fixed right-6 bottom-6 z-40"
      >
        <Button onClick={() => navigate("/organizations/new")} className="inline-flex items-center gap-2 px-4 py-3 rounded-full shadow-lg bg-gradient-to-br from-orange-500 to-orange-400 text-black">
          <Plus size={16} />
          <span className="hidden sm:inline">New Organization</span>
        </Button>
      </motion.div>
    </div>
  );
}

/* ---------------------------
   SidebarButton — small helper component
   Keeps main file tidy and ensures consistent look with lucide icons
   --------------------------- */
function SidebarButton({ collapsed = false, Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full text-sm p-2 rounded-md hover:bg-orange-500/6 transition-colors ${
        collapsed ? "justify-center" : "justify-start"
      }`}
    >
      <div className="p-2 rounded-md bg-transparent flex items-center justify-center">
        <Icon size={16} />
      </div>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
