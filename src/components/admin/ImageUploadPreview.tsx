"use client";

/**
 * ImageUploadPreview — admin UI pre drag-drop image upload s preview.
 * UI-only: zobrazí thumbnails, umoznuje reorder (up/down) a delete.
 * Neupload-uje zatial na server — callback onChange s pole File+URL.
 *
 * Integracia: caller si vezme File[] a upload-uje cez Supabase Storage / Vercel Blob.
 */

import { useCallback, useRef, useState, useEffect } from "react";

interface Props {
  initialUrls?: string[];
  maxFiles?: number;
  accept?: string;
  onChange?: (images: Array<{ file?: File; url: string }>) => void;
  locale?: "sk" | "en" | string;
}

const COPY = {
  sk: {
    dropzone: "Presuňte obrázky sem alebo kliknite pre výber",
    hint: "JPG, PNG alebo WEBP · max {max} súborov",
    reorderUp: "Presunúť vyššie",
    reorderDown: "Presunúť nižšie",
    remove: "Odstrániť",
    count: "obrázkov",
  },
  en: {
    dropzone: "Drop images here or click to select",
    hint: "JPG, PNG or WEBP · max {max} files",
    reorderUp: "Move up",
    reorderDown: "Move down",
    remove: "Remove",
    count: "images",
  },
} as const;

export default function ImageUploadPreview({
  initialUrls = [],
  maxFiles = 20,
  accept = "image/jpeg,image/png,image/webp",
  onChange,
  locale = "sk",
}: Props) {
  const copy = COPY[locale === "en" ? "en" : "sk"];
  const inputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<Array<{ file?: File; url: string }>>(
    initialUrls.map((url) => ({ url }))
  );
  const [dragOver, setDragOver] = useState(false);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((it) => {
        if (it.file && it.url.startsWith("blob:")) {
          URL.revokeObjectURL(it.url);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const incoming = Array.from(fileList).filter((f) =>
        accept.split(",").some((mime) => f.type === mime.trim())
      );
      setItems((prev) => {
        const combined = [
          ...prev,
          ...incoming.map((file) => ({
            file,
            url: URL.createObjectURL(file),
          })),
        ].slice(0, maxFiles);
        onChange?.(combined);
        return combined;
      });
    },
    [accept, maxFiles, onChange]
  );

  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      onChange?.(next);
      return next;
    });
  }

  function remove(index: number) {
    setItems((prev) => {
      const next = [...prev];
      const [rm] = next.splice(index, 1);
      if (rm?.file && rm.url.startsWith("blob:")) {
        URL.revokeObjectURL(rm.url);
      }
      onChange?.(next);
      return next;
    });
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`rounded-xl border-2 border-dashed px-4 py-10 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-[#ef4444] bg-[#ef4444]/5"
            : "border-white/10 hover:border-[#ef4444]/40 bg-black/20"
        }`}
      >
        <div className="text-4xl mb-2">⇪</div>
        <div className="text-sm text-[#cbd5e1] font-medium">
          {copy.dropzone}
        </div>
        <div className="text-xs text-[#8b9bb4] mt-1">
          {copy.hint.replace("{max}", String(maxFiles))}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {items.length > 0 && (
        <>
          <div className="mt-3 text-xs text-[#8b9bb4]">
            {items.length} / {maxFiles} {copy.count}
          </div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item, i) => (
              <div
                key={item.url}
                className="relative aspect-square rounded-lg overflow-hidden bg-black/40 border border-white/10 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={`Image ${i + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Index badge */}
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur text-white text-xs font-bold px-2 py-0.5 rounded">
                  {i + 1}
                </div>

                {/* Actions */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      className="bg-white/10 hover:bg-white/20 text-white rounded p-1.5"
                      aria-label={copy.reorderUp}
                      title={copy.reorderUp}
                    >
                      ←
                    </button>
                  )}
                  {i < items.length - 1 && (
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      className="bg-white/10 hover:bg-white/20 text-white rounded p-1.5"
                      aria-label={copy.reorderDown}
                      title={copy.reorderDown}
                    >
                      →
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="bg-red-600/80 hover:bg-red-600 text-white rounded p-1.5"
                    aria-label={copy.remove}
                    title={copy.remove}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
