// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

// Pages
import LandingPage from "./pages/LandingPage";
import DocumentationPage from "./pages/DocumentationPage";
import SDKPage from "./pages/SDKPage";
import GuidesPage from "./pages/GuidesPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import CheckEmail from "./pages/CheckEmail";
import Dashboard from "./pages/Dashboard";

// shadcn sonner toast
import { Toaster } from "@/components/ui/sonner";
import { useSyncProfile } from "./hooks/useSyncProfile";
import DeleteAccountButton from "./components/DeleteAccountButton";

// 🔒 Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();

  // Only sync profile if user is fully loaded & signed in


  if (!isLoaded) return null; 

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const emailVerified = user?.emailAddresses?.some(
    (e) => e.verification?.status === "verified"
  );

  if (!emailVerified) {
    return <Navigate to="/check-email" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/sdk" element={<SDKPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/delete" element={<DeleteAccountButton/>}/>
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toaster */}
        <Toaster
          theme="dark"
          position="top-right"
          closeButton
          richColors
          duration={4000}
        />
      </div>
    </Router>
  );
}

export default App;
