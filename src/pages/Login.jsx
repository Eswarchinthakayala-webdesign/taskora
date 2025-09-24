// src/pages/SignInPage.jsx
import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { KeyRound, Sparkles, ShieldCheck } from "lucide-react";

// Futuristic glowing core
function EnergyCore() {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      {/* Outer Torus */}
      <mesh>
        <torusGeometry args={[2, 0.1, 16, 100]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={1.2}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Inner sphere */}
      <mesh>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial
          color="#ffedd5"
          emissive="#ff7e33"
          emissiveIntensity={1.5}
          wireframe
        />
      </mesh>
    </Float>
  );
}

// Starfield background
function Starfield({ count = 5000 }) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
  }
  return (
    <Points positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#f97316"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-black via-zinc-950 to-black text-white">
      {/* Left Panel - Animation + Content */}
      <motion.div
        initial={{ opacity: 0, x: -60, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative flex-1 flex flex-col justify-center items-center p-10 overflow-hidden"
      >
        {/* Futuristic 3D Canvas */}
        <Canvas className="absolute inset-0">
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <EnergyCore />
          <Starfield />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
        </Canvas>

        {/* Overlay Content */}
        <div className="relative z-10 text-center md:text-left space-y-6 max-w-lg">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">
            Welcome Back to Taskora
          </h1>
          <p className="text-zinc-300 text-lg leading-relaxed">
            Re-enter your workspace and keep building the future.  
            <span className="text-orange-400"> Taskora </span> is ready to power your productivity journey.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2 text-sm">
            <span className="flex items-center gap-2 text-orange-400">
              <KeyRound className="w-5 h-5" /> Secure Access
            </span>
            <span className="flex items-center gap-2 text-orange-400">
              <Sparkles className="w-5 h-5" /> AI Boosted
            </span>
            <span className="flex items-center gap-2 text-orange-400">
              <ShieldCheck className="w-5 h-5" /> Encrypted & Private
            </span>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Clerk SignIn */}
      <motion.div
        initial={{ opacity: 0, x: 60, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="flex-1 flex justify-center items-center p-6 bg-black/70 backdrop-blur-md border-l border-orange-500/20"
      >
        <div className="max-w-md bg-black/90 rounded-2xl border border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.4)] p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-orange-400">
            Sign In to Your Account
          </h2>
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg px-4 py-2 transition-all duration-300",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
              },
            }}
            signUpUrl="/signup"
            signUpFallbackRedirectUrl="/signup"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </motion.div>
    </div>
  );
}
