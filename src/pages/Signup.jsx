import { SignUp } from '@clerk/clerk-react';
import { useSyncProfile } from '../hooks/useSyncProfile';

export default function SignUpPage() {
  useSyncProfile();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <SignUp
         signInUrl="/login"                 // 👈 go to your custom login page
          signInFallbackRedirectUrl="/login" // fallback
          fallbackRedirectUrl="/dashboard"

      />
    </div>
  );
}
