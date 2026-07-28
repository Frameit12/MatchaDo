"use client";

import { useEffect, useState } from "react";

// TEMP: catches JS errors the moment they happen anywhere on the site and
// shows them as a visible banner on the page. Unlike a React error boundary
// (error.tsx / global-error.tsx), this also catches errors thrown inside
// event handlers (e.g. a button/link onClick), which error boundaries
// cannot see. No devtools needed — the error just appears on screen.
export default function OnScreenErrorOverlay() {
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    function record(label: string, detail: string) {
      setErrors((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${label}: ${detail}`]);
    }

    function onError(event: ErrorEvent) {
      record(
        "JS error",
        `${event.message} (${event.filename ?? "?"}:${event.lineno ?? "?"}:${event.colno ?? "?"})\n${event.error?.stack ?? ""}`
      );
    }

    function onRejection(event: PromiseRejectionEvent) {
      const reason = event.reason;
      const detail =
        reason instanceof Error ? `${reason.name}: ${reason.message}\n${reason.stack ?? ""}` : String(reason);
      record("Unhandled promise rejection", detail);
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (errors.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
        maxHeight: "50vh",
        overflowY: "auto",
        background: "#3b0d0d",
        color: "#ffdede",
        fontFamily: "monospace",
        fontSize: 12,
        padding: 12,
        borderBottom: "3px solid #ff4d4d",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <strong style={{ color: "#ff8080" }}>
          {errors.length} error{errors.length > 1 ? "s" : ""} caught on this page
        </strong>
        <button
          onClick={() => setErrors([])}
          style={{ background: "#ff4d4d", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer" }}
        >
          Clear
        </button>
      </div>
      {errors.map((err, i) => (
        <pre key={i} style={{ whiteSpace: "pre-wrap", marginBottom: 8, borderTop: i > 0 ? "1px solid #5a1a1a" : undefined, paddingTop: i > 0 ? 8 : 0 }}>
          {err}
        </pre>
      ))}
    </div>
  );
}
