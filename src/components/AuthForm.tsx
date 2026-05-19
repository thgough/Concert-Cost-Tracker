"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError } from "@/lib/auth-messages";
import FormField from "@/components/FormField";
import FadeIn from "@/components/motion/FadeIn";

export default function AuthForm() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        toast.error(friendlyAuthError(error.message));
        return;
      }
      toast.success(
        "Account created! Check your email to confirm, or sign in if confirmation is off."
      );
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(friendlyAuthError(error.message));
      return;
    }

    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <FadeIn delay={0.2}>
      <div className="card bg-base-100/90 backdrop-blur-sm shadow-2xl w-full max-w-md rounded-2xl border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-2xl">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm opacity-70">
            {mode === "signin"
              ? "Sign in to track your concert spending and fun."
              : "Sign up free and start logging your shows."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            <FormField label="Email" htmlFor="email">
              <input
                id="email"
                type="email"
                className="input input-bordered w-full"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </FormField>

            <FormField
              label="Password"
              htmlFor="password"
              hint="At least 6 characters"
            >
              <input
                id="password"
                type="password"
                className="input input-bordered w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
              />
            </FormField>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full mt-4 gap-2 active:scale-[0.98] transition-transform"
              disabled={loading}
            >
              {loading && (
                <span className="loading loading-spinner loading-sm" />
              )}
              {loading
                ? "Please wait…"
                : mode === "signin"
                  ? "Sign in"
                  : "Sign up"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            {mode === "signin" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  className="link link-primary"
                  onClick={() => setMode("signup")}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="link link-primary"
                  onClick={() => setMode("signin")}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </FadeIn>
  );
}
