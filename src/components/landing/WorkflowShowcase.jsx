"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { CalendarCheck2, Code2, Rocket } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ACCENT = "#FF7A2B"; 
const DARK_BG = "#050505";

const steps = [
  {
    key: "plan",
    title: "Plan",
    desc: "Define goals, create sprints, and prioritize tasks with clarity before development.",
    icon: CalendarCheck2,
    badge: "Step 1",
  },
  {
    key: "build",
    title: "Build",
    desc: "Collaborate, assign tasks, and track progress with Kanban boards and sprints.",
    icon: Code2,
    badge: "Step 2",
  },
  {
    key: "ship",
    title: "Ship",
    desc: "Deliver with confidence, measure outcomes, and celebrate results.",
    icon: Rocket,
    badge: "Step 3",
  },
];

export default function WorkflowShowcase() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const cardRefs = useRef([]);
  const [boxes, setBoxes] = useState([]);

  // Measure card centers after render
  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const b = steps.map((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: (r.left + r.right) / 2 - rect.left,
          y: (r.top + r.bottom) / 2 - rect.top,
        };
      }).filter(Boolean);
      setBoxes(b);
    }

    // measure after paint
    setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  // Three.js scene
  useEffect(() => {
    if (!boxes.length) return; // no cards measured yet

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      0,
      container.clientWidth,
      container.clientHeight,
      0,
      -1000,
      1000
    );
    camera.position.z = 10;

    // Glow line
    function createConnectorLine(curve) {
      const pts = curve.getPoints(60);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.25 });
      return new THREE.Line(geo, mat);
    }

    // Particle dots
    function createParticles(curve, count = 20) {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const p = curve.getPoint(t);
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = 0;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.PointsMaterial({
        color: ACCENT,
        size: 4,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geo, mat);
      points.userData = { curve, count, offsets: new Float32Array(count) };
      for (let i = 0; i < count; i++) points.userData.offsets[i] = i / count;
      return points;
    }

    const group = new THREE.Group();
    scene.add(group);

    // Build connectors
    for (let i = 0; i < boxes.length - 1; i++) {
      const a = boxes[i], b = boxes[i + 1];
      const curve = new THREE.CubicBezierCurve(
        new THREE.Vector2(a.x, a.y),
        new THREE.Vector2((a.x + b.x) / 2, a.y - 50),
        new THREE.Vector2((a.x + b.x) / 2, b.y + 50),
        new THREE.Vector2(b.x, b.y)
      );
      group.add(createConnectorLine(curve));
      group.add(createParticles(curve));
    }

    // Animate
    const clock = new THREE.Clock();
    let rafId;
    function animate() {
      const dt = clock.getDelta();
      group.children.forEach((child) => {
        if (child.type === "Points") {
          const { curve, count, offsets } = child.userData;
          const pos = child.geometry.attributes.position;
          for (let i = 0; i < count; i++) {
            offsets[i] += dt * 0.1;
            if (offsets[i] > 1) offsets[i] -= 1;
            const p = curve.getPoint(offsets[i]);
            pos.array[i * 3] = p.x;
            pos.array[i * 3 + 1] = p.y;
          }
          pos.needsUpdate = true;
        }
      });
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
    };
  }, [boxes]);

  return (
    <section
      id="workflow"
      className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
      style={{ background: `linear-gradient(180deg, ${DARK_BG}, #0b0b0b)` }}
    >
      {/* Background */}
      <div ref={containerRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Title */}
      <div className="relative z-10 text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
        >
          Workflow Showcase
        </motion.h2>
      </div>

      {/* Step Cards */}
      <div className="relative flex flex-col lg:flex-row gap-8 z-10">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
                 <motion.div
              key={s.key}
              ref={(el) => (cardRefs.current[i] = el)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="flex-1"
            >
              <Card className="h-full text-center bg-black/40 border border-zinc-800 p-6 hover:border-orange-600 transition">
                <div className="flex justify-center mb-3">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-black px-3 py-1">
                    {s.badge}
                  </Badge>
                </div>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-orange-600/12 border border-orange-600">
                    <Icon className="w-7 h-7 text-orange-400" />
                  </div>
                </div>
                <CardHeader className="p-0">
                  <CardTitle className="text-lg font-bold text-white">{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-3">
                  <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
