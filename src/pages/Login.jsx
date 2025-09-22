// src/pages/SignInPage.jsx
import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { dark } from '@clerk/themes'
import { useSyncProfile } from "../hooks/useSyncProfile";
export default function SignInPage() {
 useSyncProfile()
  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md p-6 bg-zinc-900/70 rounded-2xl border border-orange-500/30 shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-4 text-white">
          Sign in
        </h1>
        <SignIn
        signUpUrl="/signup" 
         signUpFallbackRedirectUrl="/signup"
         fallbackRedirectUrl="/dashboard"
          // go here if they don’t have an account
        />
      </div>
    </div>
  );
}
