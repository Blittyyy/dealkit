"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const EXT_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

export interface AvatarUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  disabled?: boolean;
  size?: 96 | 112 | 128;
}

export function AvatarUpload({
  value,
  onChange,
  disabled = false,
  size = 112,
}: AvatarUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file || disabled || uploading) return;
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Please use PNG, JPEG, or WebP images.");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError("Image must be under 5MB.");
        return;
      }

      setUploading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in to upload.");
        setUploading(false);
        return;
      }

      const ext = EXT_MAP[file.type] ?? "png";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setError("Upload failed. Please try again.");
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      onChange(urlData.publicUrl);
      setUploading(false);
    },
    [disabled, uploading, onChange]
  );

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled && !uploading) setDragging(true);
  }

  function onDragLeave() {
    setDragging(false);
  }

  function onClick() {
    if (disabled || uploading) return;
    inputRef.current?.click();
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  const sizeClass = {
    96: "w-24 h-24",
    112: "w-28 h-28",
    128: "w-32 h-32",
  }[size];

  return (
    <div className="space-y-2">
      <div
        onClick={onClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "rounded-full overflow-hidden cursor-pointer transition-all duration-200 flex items-center justify-center border-2 border-dashed",
          sizeClass,
          value
            ? "border-border-soft hover:border-brand/40"
            : "border-border-soft bg-base/50 hover:border-brand/60 hover:bg-base",
          dragging && "border-brand ring-2 ring-brand/20",
          (disabled || uploading) && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={onInputChange}
          className="hidden"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-1">
            <svg
              className="animate-spin h-6 w-6 text-brand"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-xs text-muted">Uploading…</span>
          </div>
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs font-medium text-muted text-center px-3">
            Upload profile photo
          </span>
        )}
      </div>
      {value && !uploading && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) inputRef.current?.click();
          }}
          className="text-xs font-medium text-brand hover:underline"
        >
          Change photo
        </button>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
