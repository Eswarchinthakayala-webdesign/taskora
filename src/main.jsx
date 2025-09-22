import React from "react";
import ReactDOM from "react-dom/client";   // ✅ import from react-dom/client
import { ClerkProvider } from '@clerk/clerk-react'
import App from "./App";
import "./index.css";
import { dark, neobrutalism } from '@clerk/themes'
// ✅ Add your Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Set VITE_CLERK_PUBLISHABLE_KEY in your .env");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider 
    appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#FB923C', // blue
          colorForeground: '#FFEDD5', // black
        },
         captcha: {
          theme: 'dark',
          size: 'flexible',
          language: 'es-ES',
        },
      }}
    publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
