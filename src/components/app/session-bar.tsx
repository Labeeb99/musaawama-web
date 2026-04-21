"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase-browser";

export function SessionBar() {
  const supabase = createBrowserClient();
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? null);
      setLoading(false);
    }

    loadUser();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/app/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="text-sm text-neutral-500">
        Loading session...
      </div>
    );
  }

  if (!email) {
    return (
      <div className="text-sm text-neutral-500">
        Not signed in
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-neutral-600">{email}</span>
      <button
        onClick={handleLogout}
        className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
      >
        Logout
      </button>
    </div>
  );
}
