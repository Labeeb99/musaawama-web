"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClientSingleton } from "@/lib/supabase-browser";
import { Container } from "@/components/layout/container";

export default function LoginPage() {
  const supabase = createBrowserClientSingleton();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function syncProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id || !user.email) {
      return;
    }

    await fetch("/api/profile/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
      }),
    });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    await syncProfile();
    setMessage("Login successful.");
    setLoading(false);
    router.push("/app/dashboard");
  }

  async function handleSignup() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    await syncProfile();
    setMessage("Signup successful. Check your email.");
    setLoading(false);
  }

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-8">
          <h1 className="text-2xl font-semibold">Login</h1>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-neutral-900 px-5 py-3 text-white"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="mt-4 w-full rounded-full border px-5 py-3"
          >
            Create account
          </button>

          {message && (
            <p className="mt-4 text-sm text-neutral-600">{message}</p>
          )}
        </div>
      </Container>
    </section>
  );
}
