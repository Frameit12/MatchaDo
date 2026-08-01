"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function SortDropdown({
  options,
  currentLabel,
}: {
  options: { value: string; label: string; href: string; active: boolean }[];
  currentLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-[20px] border-[1.5px] border-[oklch(0.75_0.04_145)] px-[18px] py-[7px] text-sm font-semibold text-[oklch(0.35_0.06_145)]"
      >
        Sort: {currentLabel}
        <span className="text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 z-10 mt-2 w-48 overflow-hidden rounded-xl border border-[oklch(0.89_0.02_135)] bg-white py-1.5 shadow-lg">
          {options.map((option) => (
            <Link
              key={option.value}
              href={option.href}
              onClick={() => setOpen(false)}
              className={
                option.active
                  ? "block bg-[oklch(0.94_0.03_145)] px-4 py-2 text-sm font-semibold text-[oklch(0.35_0.06_145)]"
                  : "block px-4 py-2 text-sm text-[oklch(0.3_0.02_100)] hover:bg-[oklch(0.96_0.012_95)]"
              }
            >
              {option.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
