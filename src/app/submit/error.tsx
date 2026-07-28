"use client";

// Scoped error boundary for /submit. Same idea as global-error.tsx but
// keeps the rest of the app shell intact.
// TEMP: added for debugging the "Submit a Matcha" silent-failure issue.
export default function SubmitError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ fontFamily: "monospace", padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 18, marginBottom: 12 }}>/submit crashed</h1>
      <p style={{ marginBottom: 8 }}>
        <strong>message:</strong> {error.message || "(no message)"}
      </p>
      {error.digest && (
        <p style={{ marginBottom: 8 }}>
          <strong>digest:</strong> {error.digest}
        </p>
      )}
      <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, background: "#f4f4f4", padding: 12 }}>
        {error.stack}
      </pre>
      <button onClick={() => reset()} style={{ marginTop: 16, padding: "8px 16px" }}>
        Try again
      </button>
    </div>
  );
}
