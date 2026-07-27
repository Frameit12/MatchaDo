"use client";

export default function StarRatingInput({
  value,
  onChange,
  size = 26,
  gap = 6,
}: {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  gap?: number;
}) {
  return (
    <div className="flex" style={{ gap }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          role="button"
          tabIndex={0}
          onClick={() => onChange(i + 1)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onChange(i + 1);
          }}
          className="cursor-pointer leading-none transition-[color,transform] duration-[120ms] hover:scale-[1.12]"
          style={{
            fontSize: size,
            color: i < value ? "oklch(0.7 0.15 85)" : "oklch(0.85 0.02 140)",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
