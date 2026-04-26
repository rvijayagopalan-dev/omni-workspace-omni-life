"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 via-white to-indigo-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-8">
        {/* Logo / brand */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">O</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Omni Life
          </h1>
          <p className="text-gray-500 text-sm text-center">
            Your all-in-one life management platform
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-gray-600">Terms</a> and{" "}
          <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
      <path
        d="M47.532 24.552c0-1.636-.132-3.2-.388-4.704H24v9.02h13.22c-.58 3.048-2.32 5.628-4.944 7.356v6.108h8.004c4.676-4.304 7.252-10.648 7.252-17.78z"
        fill="#4285F4"
      />
      <path
        d="M24 48c6.636 0 12.2-2.196 16.268-5.956l-8.004-6.108c-2.22 1.488-5.06 2.368-8.264 2.368-6.352 0-11.728-4.288-13.652-10.052H2.08v6.288C6.128 42.772 14.46 48 24 48z"
        fill="#34A853"
      />
      <path
        d="M10.348 28.252A14.9 14.9 0 0 1 9.6 24c0-1.484.256-2.924.748-4.252V13.46H2.08A23.98 23.98 0 0 0 0 24c0 3.876.928 7.544 2.08 10.54l8.268-6.288z"
        fill="#FBBC05"
      />
      <path
        d="M24 9.548c3.576 0 6.788 1.228 9.312 3.644l6.98-6.98C36.192 2.196 30.636 0 24 0 14.46 0 6.128 5.228 2.08 13.46l8.268 6.288C12.272 13.836 17.648 9.548 24 9.548z"
        fill="#EA4335"
      />
    </svg>
  );
}
