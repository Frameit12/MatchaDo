"use client";

import { useState } from "react";

export type GalleryPhoto = {
  url: string;
  caption: string;
};

export default function PhotoGallery({ photos, alt }: { photos: GalleryPhoto[]; alt: string }) {
  const [index, setIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-[oklch(0.88_0.02_135)] bg-[repeating-linear-gradient(135deg,oklch(0.93_0.03_140)_0px,oklch(0.93_0.03_140)_14px,oklch(0.9_0.03_140)_14px,oklch(0.9_0.03_140)_28px)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-md bg-[oklch(0.98_0.01_135_/_0.85)] px-4 py-2 font-mono text-[13px] text-[oklch(0.38_0.04_145)]">
            product photo
          </span>
        </div>
      </div>
    );
  }

  const current = photos[index];

  function go(delta: number) {
    setIndex((prev) => (prev + delta + photos.length) % photos.length);
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-[oklch(0.88_0.02_135)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.url} alt={alt} className="h-full w-full object-cover" />
        {photos.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[oklch(0.22_0.03_150_/_0.55)] text-lg font-bold text-white"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[oklch(0.22_0.03_150_/_0.55)] text-lg font-bold text-white"
            >
              ›
            </button>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[oklch(0.22_0.03_150_/_0.55)] px-3 py-1 text-xs font-semibold text-white">
              {index + 1} / {photos.length}
            </span>
          </>
        )}
      </div>
      <p className="mt-2 text-center text-[13px] text-[oklch(0.5_0.02_150)]">{current.caption}</p>
    </div>
  );
}
