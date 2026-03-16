"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const MIN_PASSWORD_LENGTH = 8;

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCheckingAuth(false);
      if (session) router.replace("/app/builder");
    });
  }, [router]);

  async function handleGoogleSignUp() {
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) {
        setError(oauthError.message);
        setLoading(false);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      router.replace("/app/builder");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="rounded-[18px] bg-white p-8 shadow-[0_25px_60px_rgba(0,0,0,0.45)] flex justify-center">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="rounded-[18px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/5 animate-auth-fade-in">
      <div className="p-5 lg:p-6">
        <div className="space-y-1 mb-4">
          <h1 className="text-xl font-semibold text-primary tracking-tight">
            Create your account
          </h1>
          <p className="text-[13px] text-muted/90 leading-relaxed">
            Get access to your verified media kit and close more deals.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-[10px] px-4 py-2">
              {error}
            </p>
          )}
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-sm font-medium text-primary">
              Your Name
            </label>
            <Input
              id="fullName"
              className="h-10"
              type="text"
              placeholder="Jordan Lee"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-primary">
              Email
            </label>
            <Input
              id="email"
              className="h-10"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-primary">
              Password
            </label>
            <Input
              id="password"
              className="h-10"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-primary">
              Confirm password
            </label>
            <Input
              id="confirmPassword"
              className="h-10"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              disabled={loading}
            />
          </div>
          <div className="space-y-3 pt-0.5">
            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium tracking-wide !bg-gradient-to-r from-[#3B6FFF] to-[#5B8AFF] shadow-[0_4px_14px_rgba(59,111,255,0.35)] hover:shadow-[0_8px_24px_rgba(59,111,255,0.45)] hover:-translate-y-[2px] hover:brightness-105 transition-all duration-200 disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_14px_rgba(59,111,255,0.35)] disabled:hover:brightness-100"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-[11px] text-muted text-center">
              No setup fees • Cancel anytime • Secure sign-in
            </p>
            <p className="text-xs text-muted text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-brand font-medium hover:underline">
                Sign in
              </Link>
            </p>
            <div className="relative pt-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border-soft" />
              </div>
              <div className="relative flex justify-center text-[11px] pt-3">
                <span className="bg-white px-2 text-muted">or continue with</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-sm font-medium border-border-soft hover:bg-[#E6E8EC]/40"
              onClick={handleGoogleSignUp}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
