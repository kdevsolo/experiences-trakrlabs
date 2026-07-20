"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { UserAvatar } from "@/components/ui/user-avatar";
import { AuthSheet } from "@/components/auth/auth-sheet";

export function AppHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userName =
    user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/85 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-5 pt-safe">
          <Link href="/" className="text-app-brand transition-opacity active:opacity-70">
            Experiences
          </Link>

          <div className="flex shrink-0 items-center justify-end">
            {!ready ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <Link
                href="/profile"
                className="rounded-full ring-2 ring-transparent transition-transform active:scale-95 hover:ring-accent/30"
                aria-label="Open profile"
              >
                <UserAvatar
                  name={userName}
                  email={user.email}
                  seed={user.id}
                  size="md"
                />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="rounded-full bg-accent-soft px-3.5 py-2 text-sm font-medium text-accent transition-transform active:scale-95"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthSheet
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        returnPath="/"
      />
    </>
  );
}
