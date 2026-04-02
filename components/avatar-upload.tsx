"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const EXT_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

const CROP_PREVIEW_SIZE = 320; // px
const EXPORT_SIZE = 512; // px (square)
const CROP_WINDOW_RATIO = 0.78; // matches the circle overlay size

export interface AvatarUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  disabled?: boolean;
  size?: 96 | 112 | 128;
}

type CropState = {
  objectUrl: string;
  file: File;
  imgW: number;
  imgH: number;
  // zoom multiplier relative to the "cover" baseline scale
  zoom: number;
  // pan offset in preview pixels (relative to center)
  offsetX: number;
  offsetY: number;
};

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
  const [crop, setCrop] = useState<CropState | null>(null);
  const [cropDragging, setCropDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    return () => {
      if (crop?.objectUrl) URL.revokeObjectURL(crop.objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function baseScaleFor(imgW: number, imgH: number) {
    return Math.max(CROP_PREVIEW_SIZE / imgW, CROP_PREVIEW_SIZE / imgH);
  }

  function clampCrop(next: CropState): CropState {
    const scale = baseScaleFor(next.imgW, next.imgH) * next.zoom;
    const scaledW = next.imgW * scale;
    const scaledH = next.imgH * scale;
    // Ensure the image fully covers the crop area.
    const maxX = Math.max(0, (scaledW - CROP_PREVIEW_SIZE) / 2);
    const maxY = Math.max(0, (scaledH - CROP_PREVIEW_SIZE) / 2);
    const ox = Math.min(maxX, Math.max(-maxX, next.offsetX));
    const oy = Math.min(maxY, Math.max(-maxY, next.offsetY));
    return { ...next, offsetX: ox, offsetY: oy };
  }

  /** Same layout math as export canvas — preview DOM must match this or panning shows gaps. */
  function cropPreviewLayout(c: CropState) {
    const scale = baseScaleFor(c.imgW, c.imgH) * c.zoom;
    const iw = c.imgW * scale;
    const ih = c.imgH * scale;
    return {
      iw,
      ih,
      left: (CROP_PREVIEW_SIZE - iw) / 2 + c.offsetX,
      top: (CROP_PREVIEW_SIZE - ih) / 2 + c.offsetY,
    };
  }

  /** Open slightly zoomed for tall portraits so the face fills the circle without user action. */
  function initialZoomFor(imgW: number, imgH: number) {
    return imgH > imgW * 1.12 ? 1.08 : 1;
  }

  async function loadImageDimensions(objectUrl: string): Promise<{ w: number; h: number }> {
    const img = new Image();
    img.decoding = "async";
    img.src = objectUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
    });
    return { w: img.naturalWidth, h: img.naturalHeight };
  }

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

      const objectUrl = URL.createObjectURL(file);
      try {
        const { w, h } = await loadImageDimensions(objectUrl);
        // Initialize crop centered, zoomed to cover.
        const initial: CropState = clampCrop({
          objectUrl,
          file,
          imgW: w,
          imgH: h,
          zoom: initialZoomFor(w, h),
          offsetX: 0,
          offsetY: 0,
        });
        setCrop(initial);
      } catch {
        URL.revokeObjectURL(objectUrl);
        setError("Could not read image. Try another file.");
      }
    },
    [disabled, uploading]
  );

  async function exportCroppedBlob(state: CropState): Promise<Blob> {
    // Render exactly what the user sees in the preview circle (cover + zoom + pan)
    // into a 1:1 preview canvas, then upscale to the export size.
    const previewCanvas = document.createElement("canvas");
    previewCanvas.width = CROP_PREVIEW_SIZE;
    previewCanvas.height = CROP_PREVIEW_SIZE;
    const pctx = previewCanvas.getContext("2d");
    if (!pctx) throw new Error("Canvas not supported");

    const img = new Image();
    img.decoding = "async";
    img.src = state.objectUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
    });

    const coverScale = Math.max(CROP_PREVIEW_SIZE / state.imgW, CROP_PREVIEW_SIZE / state.imgH);
    const scale = coverScale * state.zoom;
    const drawW = state.imgW * scale;
    const drawH = state.imgH * scale;
    const x = (CROP_PREVIEW_SIZE - drawW) / 2 + state.offsetX;
    const y = (CROP_PREVIEW_SIZE - drawH) / 2 + state.offsetY;

    pctx.fillStyle = "#ffffff";
    pctx.fillRect(0, 0, CROP_PREVIEW_SIZE, CROP_PREVIEW_SIZE);
    pctx.imageSmoothingEnabled = true;
    pctx.imageSmoothingQuality = "high";
    pctx.drawImage(img, x, y, drawW, drawH);

    const canvas = document.createElement("canvas");
    canvas.width = EXPORT_SIZE;
    canvas.height = EXPORT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Crop to the exact visible "circle window" region (centered),
    // so the uploaded image matches what the user framed.
    const windowPx = Math.round(CROP_PREVIEW_SIZE * CROP_WINDOW_RATIO);
    const inset = Math.round((CROP_PREVIEW_SIZE - windowPx) / 2);
    ctx.drawImage(
      previewCanvas,
      inset,
      inset,
      windowPx,
      windowPx,
      0,
      0,
      EXPORT_SIZE,
      EXPORT_SIZE
    );

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Failed to export image"))),
        "image/jpeg",
        0.92
      );
    });
  }

  async function uploadAvatarBlob(blob: Blob) {
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be signed in to upload.");
      setUploading(false);
      return;
    }

    const path = `${user.id}/avatar-${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, blob, { upsert: true, contentType: "image/jpeg" });

    if (uploadError) {
      // eslint-disable-next-line no-console
      console.error("Avatar upload failed:", uploadError);
      setError(uploadError.message || "Upload failed. Please try again.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    onChange(urlData.publicUrl);
    setUploading(false);
  }

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
      {crop && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-[520px] rounded-[18px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.35)] ring-1 ring-black/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-border-soft/70 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-primary">Adjust profile photo</p>
                <p className="text-xs text-muted/60 mt-0.5">
                  Drag to reposition. Use the slider to zoom. What you see here is what Save uploads.
                </p>
              </div>
              <button
                type="button"
                className="h-9 w-9 rounded-[10px] hover:bg-[#F1F4F8] text-muted/60 hover:text-primary transition-colors"
                onClick={() => {
                  URL.revokeObjectURL(crop.objectUrl);
                  setCrop(null);
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center">
                <div
                  className={cn(
                    "relative rounded-[18px] overflow-hidden bg-[#F7F8FA] ring-1 ring-black/10 shadow-[0_10px_30px_rgba(15,23,42,0.12)]",
                    "select-none touch-none"
                  )}
                  style={{ width: CROP_PREVIEW_SIZE, height: CROP_PREVIEW_SIZE }}
                  onPointerDown={(e) => {
                    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
                    setCropDragging(true);
                    dragStart.current = { x: e.clientX, y: e.clientY, ox: crop.offsetX, oy: crop.offsetY };
                  }}
                  onPointerMove={(e) => {
                    const start = dragStart.current;
                    if (!cropDragging || !start) return;
                    const dx = e.clientX - start.x;
                    const dy = e.clientY - start.y;
                    setCrop((c) =>
                      c
                        ? clampCrop({
                            ...c,
                            offsetX: start.ox + dx,
                            offsetY: start.oy + dy,
                          })
                        : c
                    );
                  }}
                  onPointerUp={() => {
                    setCropDragging(false);
                    dragStart.current = null;
                  }}
                >
                  {/* Image layer: explicit box + position = same as canvas export (no white bands when dragging) */}
                  <div className="absolute inset-0 overflow-hidden">
                    {(() => {
                      const { iw, ih, left, top } = cropPreviewLayout(crop);
                      return (
                        <div
                          className="absolute"
                          style={{
                            width: iw,
                            height: ih,
                            left,
                            top,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={crop.objectUrl}
                            alt=""
                            className="block h-full w-full select-none"
                            style={{
                              objectFit: "fill",
                              filter: "saturate(1.02) contrast(1.02)",
                            }}
                            draggable={false}
                          />
                        </div>
                      );
                    })()}
                  </div>
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55),inset_0_-30px_60px_rgba(0,0,0,0.05)]" />

                  {/* Circular mask overlay (Instagram-style) */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Important: these dimensions must match CROP_WINDOW_RATIO used for export */}
                    <div
                      className="absolute"
                      style={{
                        width: `${Math.round(CROP_WINDOW_RATIO * 100)}%`,
                        height: `${Math.round(CROP_WINDOW_RATIO * 100)}%`,
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {/* Darken outside the circle */}
                      <div
                        className="absolute inset-0"
                        style={{
                          boxShadow: "0 0 0 9999px rgba(17,19,24,0.48)",
                          borderRadius: "9999px",
                        }}
                      />

                      {/* Crisp circle edge */}
                      <div
                        className="absolute inset-0"
                        style={{
                          border: "1px solid rgba(255,255,255,0.75)",
                          borderRadius: "9999px",
                          boxShadow: "0 0 0 1px rgba(0,0,0,0.08) inset",
                        }}
                      />
                    </div>

                    <div
                      className="absolute inset-0"
                      style={{
                        display: "none",
                      }}
                    />
                    <div
                      className="absolute"
                      style={{
                        display: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-[11px] text-muted/60">
                Only what&#39;s inside the circle will be saved.
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-muted/70 mb-2">
                  <span>Zoom</span>
                  <span className="tabular-nums">{Math.round(crop.zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={2.5}
                  step={0.01}
                  value={crop.zoom}
                  onChange={(e) => {
                    const z = Number(e.target.value);
                    setCrop((c) => (c ? clampCrop({ ...c, zoom: z }) : c));
                  }}
                  className="w-full accent-[color:var(--brand)]"
                />
                <p className="mt-2 text-[11px] text-muted/50">
                  Tip: Upload a 512×512+ image for best quality.
                </p>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-border-soft/70 bg-[#FAFAFB] flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => {
                  URL.revokeObjectURL(crop.objectUrl);
                  setCrop(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={uploading}
                onClick={async () => {
                  try {
                    const state = clampCrop(crop);
                    const blob = await exportCroppedBlob(state);
                    URL.revokeObjectURL(state.objectUrl);
                    setCrop(null);
                    await uploadAvatarBlob(blob);
                  } catch (e: unknown) {
                    setError(e instanceof Error ? e.message : "Failed to process image.");
                  }
                }}
              >
                {uploading ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div
        onClick={onClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "rounded-full overflow-hidden cursor-pointer transition-all duration-200 flex items-center justify-center",
          sizeClass,
          value
            ? "border-2 border-white shadow-[0_2px_12px_rgba(15,23,42,0.1),0_0_0_1px_rgba(15,23,42,0.06)] hover:shadow-[0_4px_16px_rgba(15,23,42,0.14)]"
            : "border-2 border-dashed border-border-soft/80 bg-[#FAFBFC] hover:border-brand/50 hover:bg-[#F5F7FA]",
          dragging && "border-brand ring-2 ring-brand/20 border-solid",
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
