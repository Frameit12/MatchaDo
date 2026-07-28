"use client";

// Catches any render-time error that isn't handled by a closer error
// boundary and shows it on the page instead of a blank screen.
// TEMP: added for debugging the "Submit a Matcha" silent-failure issue.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ fontFamily: "monospace", padding: 24, background: "#fff", color: "#000" }}>
        <h1 style={{ fontSize: 18, marginBottom: 12 }}>Something crashed</h1>
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
      </body>
    </html>
  );
}
