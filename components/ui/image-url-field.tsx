"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { uploadExperienceImage } from "@/lib/storage/experience-media";
import { cn } from "@/lib/utils";

type ImageUrlFieldProps = {
  value: string;
  onChange: (url: string) => void;
  isAuthenticated: boolean;
  label?: string;
  urlPlaceholder?: string;
  className?: string;
};

export function ImageUrlField({
  value,
  onChange,
  isAuthenticated,
  label = "Photo",
  urlPlaceholder = "Or paste an image URL",
  className,
}: ImageUrlFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadExperienceImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <Label>{label}</Label> : null}

      {!isAuthenticated ? (
        <p className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">Sign in to upload photos from your device.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="sr-only"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload image"}
          </Button>
          {value ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
              Remove
            </Button>
          ) : null}
        </div>
      )}

      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={urlPlaceholder} />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {value ? <img src={value} alt="" className="h-32 w-full rounded-xl object-cover" /> : null}
    </div>
  );
}

type ExperienceImageUploadButtonProps = {
  isAuthenticated: boolean;
  onUploaded: (url: string) => void;
  label?: string;
  className?: string;
};

/** Upload only — for adding to a list of images. */
export function ExperienceImageUploadButton({
  isAuthenticated,
  onUploaded,
  label = "Upload photo",
  className,
}: ExperienceImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadExperienceImage(file);
      onUploaded(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  if (!isAuthenticated) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>Sign in to upload photos from your device.</p>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="sr-only"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
        <Upload className="h-4 w-4" />
        {uploading ? "Uploading…" : label}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
