"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          background: "#fbfaf7",
          color: "#252a23",
          fontFamily: "Arial, Helvetica, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            Something went wrong
          </p>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 400,
              letterSpacing: "-0.045em",
              margin: "0 0 1.5rem",
            }}
          >
            We couldn&apos;t load this page.
          </h1>
          <p style={{ color: "#666b61", marginBottom: "2rem", fontSize: 14 }}>
            An unexpected error occurred. Refreshing usually fixes it.
          </p>
          <div
            style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}
          >
            <button
              onClick={reset}
              style={{
                background: "#344639",
                color: "#fff",
                border: "none",
                padding: "0.75rem 1.5rem",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                border: "1px solid #deded4",
                padding: "0.75rem 1.5rem",
                fontSize: 13,
                textDecoration: "none",
                color: "#252a23",
              }}
            >
              Return home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
