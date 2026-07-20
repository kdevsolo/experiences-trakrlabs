"use client";

import { useEffect, useState, useTransition } from "react";
import QRCode from "qrcode";
import { Copy, Lock, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createShareUnlockCheckout } from "@/lib/actions/payments";
import { signInWithGoogle } from "@/lib/actions/auth";
import { trackShareCopy } from "@/components/experiences/shared/analytics-client";

export function ShareUnlockPanel({
  experienceId,
  shareSlug,
  shareUnlocked,
  isAuthenticated,
  returnPath,
}: {
  experienceId?: string;
  shareSlug?: string | null;
  shareUnlocked: boolean;
  isAuthenticated: boolean;
  returnPath: string;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const hasPublicLink = Boolean(shareUnlocked && shareSlug);
  const shareUrl =
    hasPublicLink && typeof window !== "undefined"
      ? `${window.location.origin}/e/${shareSlug}`
      : null;

  useEffect(() => {
    if (!shareUrl) return;
    QRCode.toDataURL(shareUrl, { width: 180, margin: 1 }).then(setQrDataUrl);
  }, [shareUrl]);

  const handleUnlock = () => {
    if (!isAuthenticated) {
      startTransition(async () => {
        await signInWithGoogle(returnPath);
      });
      return;
    }
    if (!experienceId) {
      setMessage("Publish your experience first to get a shareable link.");
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
    <div className="rounded-2xl bg-surface p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        {hasPublicLink ? <Copy className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
        {hasPublicLink ? "Public share link" : "Sharing locked"}
      </div>

      {hasPublicLink && shareUrl ? (
        <div className="space-y-3">
          <div className="rounded-xl bg-muted px-3 py-2 text-sm break-all">{shareUrl}</div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" className="w-full sm:w-auto" onClick={copyLink}>
              Copy link
            </Button>
          </div>
          {qrDataUrl && (
            <div className="flex items-center gap-3 rounded-xl border p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="QR code" className="h-[90px] w-[90px]" />
              <div className="text-sm text-muted-foreground">
                <QrCode className="mb-1 h-4 w-4" />
                Scan to open on mobile
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Publish URLs are private. Pay ₹10 to generate the official link that opens for anyone.
          </p>
          <Button type="button" className="w-full" onClick={handleUnlock} disabled={pending}>
            {pending ? "Processing..." : "Unlock sharing for ₹20"}
          </Button>
        </div>
      )}

      {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
