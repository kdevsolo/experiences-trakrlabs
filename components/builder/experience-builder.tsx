"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { Rocket, Save, Share2, Trash2, Maximize2 } from "lucide-react";
import { MobileTopBar, OverflowButton } from "@/components/shell/mobile-top-bar";
import { StudioPreview } from "@/components/builder/studio-preview";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { AuthSheet } from "@/components/auth/auth-sheet";
import { ShareSheet } from "@/components/paywall/share-sheet";
import { useToast } from "@/components/ui/toast";
import { getExperiencePluginOrThrow } from "@/lib/templates/registry";
import { saveDraft, deleteDraft } from "@/lib/actions/drafts";
import { publishExperience } from "@/lib/actions/experiences";
import type { Draft, Experience } from "@/types/database";
import { cn } from "@/lib/utils";

const sessionKey = (type: string) => `experience-draft:${type}`;

function readSessionDraft(type: string) {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(sessionKey(type));
    if (!stored) return null;
    return JSON.parse(stored) as { title: string; config: Record<string, unknown> };
  } catch {
    return null;
  }
}

type StudioPanel = "edit" | "preview";

export function ExperienceBuilder({
  experienceType,
  user,
  initialDraft,
  initialExperience,
}: {
  experienceType: string;
  user: User | null;
  initialDraft?: Draft | null;
  initialExperience?: Experience | null;
}) {
  const plugin = useMemo(() => getExperiencePluginOrThrow(experienceType), [experienceType]);
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [panel, setPanel] = useState<StudioPanel>("edit");
  const [title, setTitle] = useState(() => {
    if (initialExperience?.title) return initialExperience.title;
    if (initialDraft?.title) return initialDraft.title;
    if (!initialDraft && !initialExperience && !user) {
      return readSessionDraft(experienceType)?.title ?? plugin.meta.name;
    }
    return plugin.meta.name;
  });
  const [config, setConfig] = useState<Record<string, unknown>>(() => {
    if (initialExperience?.config) return initialExperience.config;
    if (initialDraft?.config) return initialDraft.config;
    if (!initialDraft && !initialExperience && !user) {
      return readSessionDraft(experienceType)?.config ?? plugin.defaultConfig;
    }
    return plugin.defaultConfig;
  });
  const [draftId, setDraftId] = useState<string | undefined>(initialDraft?.id);
  const [experience, setExperience] = useState<Experience | null>(initialExperience ?? null);
  const [authOpen, setAuthOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"save" | "publish" | null>(null);

  const typeSlug = experienceType.replace(/_/g, "-");
  const returnPath = `/create/${typeSlug}${draftId ? `/${draftId}` : ""}`;

  useEffect(() => {
    if (user) return;
    sessionStorage.setItem(sessionKey(experienceType), JSON.stringify({ title, config }));
  }, [title, config, experienceType, user]);

  useEffect(() => {
    if (!user || !draftId) return;
    const timer = setInterval(() => {
      void saveDraft({ id: draftId, experienceType, title, config });
    }, 5000);
    return () => clearInterval(timer);
  }, [user, draftId, experienceType, title, config]);

  const persistDraft = useCallback(async () => {
    if (!user) {
      setPendingAction("save");
      setAuthOpen(true);
      return;
    }
    const result = await saveDraft({
      id: draftId,
      experienceType,
      title,
      config,
    });
    if ("error" in result && result.error) {
      showToast(result.error);
      return;
    }
    if (result.data) {
      setDraftId(result.data.id);
      sessionStorage.removeItem(sessionKey(experienceType));
      showToast("Draft saved");
      router.replace(`/create/${typeSlug}/${result.data.id}`);
    }
  }, [config, draftId, experienceType, router, showToast, title, typeSlug, user]);

  const handlePublish = () => {
    startTransition(async () => {
      if (!user) {
        setPendingAction("publish");
        setAuthOpen(true);
        return;
      }
      const result = await publishExperience({
        draftId,
        experienceType,
        title,
        config,
        experienceId: experience?.id,
      });
      if ("error" in result && result.error) {
        showToast(result.error);
        return;
      }
      if (result.data) {
        setExperience(result.data);
        showToast("Published!");
        setPanel("preview");
        setShareOpen(true);
      }
    });
  };

  const handleDeleteDraft = () => {
    if (!draftId) return;
    startTransition(async () => {
      const result = await deleteDraft(draftId);
      if ("error" in result && result.error) {
        showToast(result.error);
        return;
      }
      showToast("Draft deleted");
      router.push("/library");
    });
  };

  const Editor = plugin.Editor;
  const Viewer = plugin.Viewer;

  return (
    <div className="flex min-h-screen-mobile flex-col bg-background">
      <MobileTopBar
        title={plugin.meta.name}
        backHref="/"
        rightAction={<OverflowButton onClick={() => setMenuOpen(true)} />}
      />

      {/* Preview hero — scaled to fit, with fullscreen option */}
      <StudioPreview
        title={title || plugin.meta.name}
        fullscreenOpen={fullscreenOpen}
        onFullscreenChange={setFullscreenOpen}
      >
        <Viewer config={config as never} title={title} />
      </StudioPreview>

      <div className="px-5 py-4">
        <SegmentedControl
          options={[
            { value: "edit", label: "Edit" },
            { value: "preview", label: "Preview" },
          ]}
          value={panel}
          onChange={setPanel}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28">
        <AnimatePresence mode="wait">
          {panel === "edit" ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <label className="block space-y-2">
                <span className="text-caption">Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex h-12 w-full rounded-2xl bg-muted px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  placeholder="Experience title"
                />
              </label>
              <Editor
                config={config as never}
                onChange={(next) => setConfig(next as Record<string, unknown>)}
                isAuthenticated={Boolean(user)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="rounded-3xl bg-surface p-4 shadow-soft"
            >
              <p className="text-caption">Full preview above. Publish to get a shareable link.</p>
              <button
                type="button"
                onClick={() => setFullscreenOpen(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-muted py-3 text-sm font-medium"
              >
                <Maximize2 className="h-4 w-4" />
                View fullscreen
              </button>
              {experience && (
                <button
                  type="button"
                  onClick={() => setShareOpen(true)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-soft py-3 text-sm font-medium text-accent"
                >
                  <Share2 className="h-4 w-4" />
                  Share experience
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky bottom actions */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t border-border bg-surface/95 px-5 py-3 pb-safe backdrop-blur-xl">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => startTransition(persistDraft)}
            disabled={pending}
          >
            <Save className="mr-2 h-4 w-4" />
            Save draft
          </Button>
          <Button type="button" variant="accent" className="flex-1" onClick={handlePublish} disabled={pending}>
            <Rocket className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <AuthSheet
        open={authOpen}
        onClose={() => {
          setAuthOpen(false);
          setPendingAction(null);
        }}
        returnPath={returnPath}
        title={pendingAction === "publish" ? "Sign in to publish" : "Save your work"}
      />

      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        experienceId={experience?.id}
        shareSlug={experience?.share_slug}
        shareUnlocked={Boolean(experience?.share_unlocked && experience?.share_slug)}
        isAuthenticated={Boolean(user)}
        returnPath={returnPath}
      />

      <BottomSheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Options">
        <div className="space-y-2 pb-6">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setFullscreenOpen(true);
            }}
            className="flex w-full items-center gap-3 rounded-2xl bg-muted px-4 py-3 text-left text-[15px] font-medium"
          >
            <Maximize2 className="h-4 w-4" />
            View fullscreen
          </button>
          {experience && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setShareOpen(true);
              }}
              className="flex w-full items-center gap-3 rounded-2xl bg-muted px-4 py-3 text-left text-[15px] font-medium"
            >
              <Share2 className="h-4 w-4" />
              Share link
            </button>
          )}
          {draftId && !experience && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleDeleteDraft();
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl bg-muted px-4 py-3 text-left text-[15px] font-medium text-red-600"
              )}
            >
              <Trash2 className="h-4 w-4" />
              Delete draft
            </button>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}
