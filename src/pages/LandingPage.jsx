
import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ArrowRight, Kanban, Calendar, BarChart2, Cpu, Users, Cloud, GitMerge, Slack, FileText, PieChart, Globe } from "lucide-react";

const ORANGE = "#ff7a1c";
const DARK_900 = "#050505";
const DARK_800 = "#0b0b0b";
const SURFACE = "rgba(255,255,255,0.02)"; // subtle surface texture


import NavBar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import KeyFeatures from "../components/landing/KeyFeatures";
import WorkflowShowcase from "../components/landing/WorkflowShowcase";
import InteractiveDemo from "../components/landing/InteractiveDemo";
import AIAssistance from "../components/landing/AIAssistance";
import IntegrationsGrid from "../components/landing/IntegrationsGrid";
import IntegrationMarketplace from "../components/landing/IntegrationMarketplace";
import AnalyticsDashboard from "../components/landing/AnalyticsDashboard";
import CommandPaletteSection from "../components/landing/CommandPaletteSection";
import MobileAppPreview from "../components/landing/MobileAppPreview";
import CustomBrandingSection from "../components/landing/CustomBrandingSection";
import SecurityComplianceSection from "../components/landing/SecurityComplianceSection";
import PerformanceBenchmarksSection from "../components/landing/PerformanceBenchmarksSection";
import ComparisonTable from "../components/landing/ComparisonTable";
import MigrationToolsSection from "../components/landing/MigrationToolsSection";
import CustomerStoriesSection from "../components/landing/CustomerStoriesSection";
import BlogArticlesSection from "../components/landing/BlogArticlesSection";
import RoadmapSection from "../components/landing/RoadmapSection";
import FAQSection from "../components/landing/FAQSection";
import TeamSection from "../components/landing/TeamSection";
import ResourcesSection from "../components/landing/ResourcesSection.jsx";
import NewsletterSignup from "../components/landing/NewsletterSignup.jsx";
import CTASection from "../components/landing/CTASection.jsx";
import Footer from "../components/landing/Footer.jsx";
/* ---------------------------
  Full LandingPage component
----------------------------*/
export default function LandingPage() {
  return (
    <div className="min-h-screen relative text-slate-100 overflow-hidden
                 bg-[#05060a]
                 bg-[radial-gradient(circle,_rgba(255,122,28,0.25)_1px,transparent_1px)]
                 bg-[length:20px_20px]">
      {/* Decorative background texture */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -20, backgroundImage: `radial-gradient(circle, ${SURFACE} 1px, transparent 1px)`, backgroundSize: "20px 20px", opacity: 0.04 }} />

      <NavBar />
      <main>
        <Hero />
        <KeyFeatures/>
        <WorkflowShowcase/>
        <InteractiveDemo/>
        <AIAssistance/>
        <IntegrationsGrid/>
       <AnalyticsDashboard/>
       <CommandPaletteSection/>
       <MobileAppPreview/>
       <CustomBrandingSection/>
       <SecurityComplianceSection/>
       <PerformanceBenchmarksSection/>
       <ComparisonTable/>
      <MigrationToolsSection/>
      <CustomerStoriesSection/>
      <BlogArticlesSection/>
      <RoadmapSection/>
      <FAQSection/>
      <TeamSection/>
      <ResourcesSection/>
      <NewsletterSignup/>
      <CTASection/>
      <Footer/>
        {/* <DemoSection />
        <AISection />
        <IntegrationsSection />
        <RoadmapSection />
        <FAQSection />
        <ResourcesSection />
        <TeamSection />
        <CTASection /> */} 
      </main>
      {/* <Footer /> */}
    </div>
  );
}
