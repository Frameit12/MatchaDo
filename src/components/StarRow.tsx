export default function StarRow({
  rating,
  size = 15,
  gap = 2,
}: {
  rating: number;
  size?: number;
  gap?: number;
}) {
  const filled = Math.round(rating);

  return (
    <div className="flex" style={{ gap }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: size,
            color: i < filled ? "oklch(0.55 0.13 145)" : "oklch(0.85 0.02 140)",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
