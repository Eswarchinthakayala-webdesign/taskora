"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, CalendarDays, BarChart3 } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  DndContext,
  closestCenter,
  useDroppable,
  useDraggable,
  DragOverlay,
} from "@dnd-kit/core";

// ------------------- Demo Data -------------------
const INITIAL_KANBAN = {
  "To Do": ["Research user needs", "Design wireframes"],
  "In Progress": ["Develop authentication", "Setup database"],
  "Done": ["Initial project setup", "CI/CD pipeline"],
};

const EVENTS = {
  "2025-09-20": ["Project kickoff", "Client meeting"],
  "2025-09-21": ["Design review", "Backend sync"],
  "2025-09-22": ["QA testing"],
};

const TIMELINE_PHASES = [
  { title: "Sprint Planning", span: "w-1/3" },
  { title: "Development", span: "w-2/3" },
  { title: "Testing", span: "w-1/4" },
  { title: "Release", span: "w-1/6" },
];

// ------------------- Drag Components -------------------
function KanbanColumn({ title, tasks }) {
  const { setNodeRef } = useDroppable({ id: title });

  return (
    <Card
      ref={setNodeRef}
      className="bg-black/40 border border-zinc-800 rounded-xl shadow-lg min-w-[280px]"
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          {title}
          <Badge className="bg-orange-600/80 text-black">{tasks.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {tasks.map((task) => (
          <DraggableTask key={task} id={task} label={task} />
        ))}
      </CardContent>
    </Card>
  );
}

function DraggableTask({ id, label }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 rounded-lg border text-sm transition select-none cursor-grab ${
        isDragging
          ? "bg-orange-600 text-black shadow-lg"
          : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-orange-500 hover:shadow-lg"
      }`}
    >
      {label}
    </div>
  );
}

// ------------------- Main Component -------------------
export default function InteractiveDemo() {
  const [kanban, setKanban] = useState(INITIAL_KANBAN);
  const [activeTask, setActiveTask] = useState(null);
  const [calendarValue, setCalendarValue] = useState(new Date());

  const today = new Date().toDateString();
  const selectedDateKey = calendarValue.toISOString().split("T")[0];
  const events = EVENTS[selectedDateKey] || [];

  // Drag end logic
  const handleDragEnd = ({ over, active }) => {
    if (!over) return;
    const sourceCol = Object.keys(kanban).find((col) =>
      kanban[col].includes(active.id)
    );
    const destCol = over.id;
    if (sourceCol && destCol && sourceCol !== destCol) {
      setKanban((prev) => {
        const newKanban = { ...prev };
        newKanban[sourceCol] = newKanban[sourceCol].filter(
          (t) => t !== active.id
        );
        newKanban[destCol] = [...newKanban[destCol], active.id];
        return newKanban;
      });
    }
    setActiveTask(null);
  };

  return (
    <section
      id="demo"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,90,0,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      {/* Heading */}
      <div className="relative text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
        >
          Interactive Demo
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-3 text-zinc-400 max-w-2xl mx-auto"
        >
          Explore how Taskora helps your team manage work across Kanban, 
          scheduling, and project timelines — all in one place.
        </motion.p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="kanban" className="relative">
        <div className="flex justify-center">
          <TabsList className="bg-black/40 border border-zinc-800 rounded-xl">
            <TabsTrigger
              value="kanban"
              className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-500 data-[state=active]:text-black"
            >
              <LayoutDashboard className="w-4 h-4" /> Kanban
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-500 data-[state=active]:text-black"
            >
              <CalendarDays className="w-4 h-4" /> Calendar
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-500 data-[state=active]:text-black"
            >
              <BarChart3 className="w-4 h-4" /> Timeline
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Kanban Demo */}
        <TabsContent value="kanban" className="mt-12">
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={(e) => setActiveTask(e.active.id)}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 gap-6 overflow-x-auto  md:grid md:grid-cols-3">
              {Object.entries(kanban).map(([col, tasks]) => (
                <KanbanColumn key={col} title={col} tasks={tasks} />
              ))}
            </div>
            <DragOverlay>
              {activeTask ? (
                <div className="p-3 rounded-lg bg-orange-600 text-black shadow-lg">
                  {activeTask}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </TabsContent>

        {/* Calendar Demo */}
        <TabsContent value="calendar" className="mt-12">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
            {/* Calendar */}
            <Card className="bg-black/40 border border-zinc-800 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Project Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  onChange={setCalendarValue}
                  value={calendarValue}
                  className="custom-calendar"
                  tileClassName={({ date }) =>
                    date.toDateString() === today
                      ? "today-tile"
                      : undefined
                  }
                />
              </CardContent>
            </Card>

            {/* Events */}
            <Card className="bg-black/40 border border-zinc-800 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Events on {calendarValue.toDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {events.length ? (
                  <ul className="space-y-2">
                    {events.map((event, idx) => (
                      <li
                        key={idx}
                        className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200"
                      >
                        {event}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-500">No events for this day.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Demo */}
        <TabsContent value="timeline" className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="relative flex flex-col gap-8"
            >
              {TIMELINE_PHASES.map((task, idx) => (
                <div key={idx} className="relative">
                  <div className="text-sm text-zinc-400 mb-2">{task.title}</div>
                  <div
                    className={`h-3 rounded-md bg-gradient-to-r from-orange-600 to-red-500 ${task.span}`}
                  ></div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* Custom Calendar Styling */}
      <style>{`
        .custom-calendar {
          background: #18181b;
          border-radius: 0.75rem;
          padding: 1rem;
          color: white;
        }
        .custom-calendar button {
          background: transparent;
          color: #d4d4d8;
          border-radius: 0.5rem;
          padding: 0.25rem;
        }
        .custom-calendar button:hover {
          background: rgba(234, 88, 12, 0.15);
          color: white;
        }
        .custom-calendar .react-calendar__tile--active {
          background: linear-gradient(to right, #ea580c, #ef4444);
          color: black !important;
          font-weight: 600;
          border-radius: 0.5rem;
        }
        .today-tile {
          background: linear-gradient(to right, #ea580c, #ef4444) !important;
          color: black !important;
          font-weight: 700;
          border-radius: 0.5rem;
        }
      `}</style>
    </section>
  );
}
