// src/components/RequireAuth.jsx
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

/**
 * Protect routes: must be signed in AND have a verified email address.
 */
export default function RequireAuth({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();

  // while Clerk is loading user state, render nothing (or a spinner)
  if (!isLoaded) return null;

  if (!isSignedIn) {
    // not signed in — send to sign in
    return <Navigate to="/signin" replace />;
  }

  // check email verification — look for any verified email address
  const emailVerified = Boolean(
    user?.emailAddresses?.some((e) => e?.verification?.status === "verified")
  );

  if (!emailVerified) {
    // signed in but not verified — send to check-email instructions
    return <Navigate to="/check-email" replace />;
  }

  // ok — signed in and verified
  return children;
}
