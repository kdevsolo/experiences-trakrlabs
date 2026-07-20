"use client";

import { useTransition } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/actions/auth";

export function AuthSheet({
  open,
  onClose,
  returnPath,
  title = "Save your work",
  description = "Sign in with Google to save drafts, publish, and share your experiences.",
}: {
  open: boolean;
  onClose: () => void;
  returnPath: string;
  title?: string;
  description?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <p className="mb-6 text-caption">{description}</p>
      <Button
        type="button"
        variant="accent"
        className="w-full"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await signInWithGoogle(returnPath);
          })
        }
      >
        Continue with Google
      </Button>
    </BottomSheet>
  );
}
