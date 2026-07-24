"use client";

import { useEffect, useState, useTransition } from "react";
import QRCode from "qrcode";
import { Copy, Lock } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { createShareUnlockCheckout } from "@/lib/actions/payments";
import { SHARE_UNLOCK_PRICE_LABEL } from "@/lib/payments/constants";
import { trackShareCopy } from "@/components/experiences/shared/analytics-client";
import { AuthSheet } from "@/components/auth/auth-sheet";

export function ShareSheet({
  open,
  onClose,
  experienceId,
  shareSlug,
  shareUnlocked,
  isAuthenticated,
  returnPath,
}: {
  open: boolean;
  onClose: () => void;
  experienceId?: string;
  shareSlug?: string | null;
  shareUnlocked: boolean;
  isAuthenticated: boolean;
  returnPath: string;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const hasPublicLink = Boolean(shareUnlocked && shareSlug);
  const shareUrl =
    hasPublicLink && typeof window !== "undefined"
      ? `${window.location.origin}/e/${shareSlug}`
      : null;

  useEffect(() => {
    if (!shareUrl) return;
    QRCode.toDataURL(shareUrl, { width: 160, margin: 1 }).then(setQrDataUrl);
  }, [shareUrl]);

  const handleUnlock = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    if (!experienceId) {
      setMessage("Publish your experience first.");
      return;
    }
    startTransition(async () => {
      const result = await createShareUnlockCheckout(experienceId);
      if ("error" in result && result.error) {
        setMessage(result.error);
        return;
      }
      if (result.data?.checkoutUrl) {
        window.location.href = result.data.checkoutUrl;
        return;
      }
      if (result.data?.url) {
        setMessage("Sharing unlocked!");
        window.location.reload();
      }
    });
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    if (experienceId) trackShareCopy(experienceId);
    setMessage("Link copied!");
  };

  return (
    <>
      <BottomSheet open={open} onClose={onClose} title="Share your experience">
        {hasPublicLink && shareUrl ? (
          <div className="space-y-4 pb-4">
            <div className="rounded-2xl bg-muted px-4 py-3 text-sm break-all">{shareUrl}</div>
            <Button type="button" variant="accent" className="w-full" onClick={copyLink}>
              <Copy className="mr-2 h-4 w-4" />
              Copy link
            </Button>
            {qrDataUrl && (
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-muted p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="QR code" className="h-40 w-40" />
                <p className="text-caption">Scan to open on another device</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            <div className="flex items-center gap-2 rounded-2xl bg-accent-soft px-4 py-3 text-sm">
              <Lock className="h-4 w-4 shrink-0 text-accent" />
              <span>No public link yet</span>
            </div>
            <p className="text-caption">
              Browser URLs from publish are private. Pay {SHARE_UNLOCK_PRICE_LABEL} to generate the official shareable link — only that link opens for others.
            </p>
            <Button type="button" variant="accent" className="w-full" onClick={handleUnlock} disabled={pending}>
              {pending ? "Processing..." : `Unlock sharing for ${SHARE_UNLOCK_PRICE_LABEL}`}
            </Button>
          </div>
        )}
        {message && <p className="pb-2 text-caption">{message}</p>}
      </BottomSheet>
      <AuthSheet
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        returnPath={returnPath}
        title="Sign in to share"
      />
    </>
  );
}
