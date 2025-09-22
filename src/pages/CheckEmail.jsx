// src/pages/CheckEmail.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function CheckEmail() {
  const navigate = useNavigate();
  const { isLoaded, user } = useUser();

  // detect if user has a verified email
  const hasVerifiedEmail =
    isLoaded &&
    user?.emailAddresses?.some(
      (e) => e?.verification?.status === "verified"
    );

  // auto-redirect when verified
  useEffect(() => {
    if (hasVerifiedEmail) {
      navigate("/dashboard", { replace: true });
    }
  }, [hasVerifiedEmail, navigate]);

  // optional: poll Clerk every 5s in case status updates after page load
  useEffect(() => {
    if (!isLoaded) return;
    const interval = setInterval(() => {
      user?.reload?.(); // reload Clerk user object
    }, 5000);
    return () => clearInterval(interval);
  }, [isLoaded, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-xl p-8 bg-zinc-900/70 rounded-2xl border border-orange-500/30 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Check your inbox</h2>
        <p className="text-zinc-300 mb-6">
          We sent a verification link to your email. Once you verify, you’ll be
          redirected automatically to your dashboard.
        </p>

        {/* fallback manual action */}
        <button
          className="px-4 py-2 rounded-lg bg-orange-500 text-black font-semibold hover:brightness-90"
          onClick={() => window.location.reload()}
        >
          Refresh Now
        </button>

        <p className="text-zinc-500 text-sm mt-5">
          Tip: If you didn’t receive the email, check your spam folder or request
          a resend from the sign-up form.
        </p>
      </div>
    </div>
  );
}
