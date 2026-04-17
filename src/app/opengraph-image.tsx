import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Static default OG image — bez data fetchu, runtime na Edge
export const runtime = "edge";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #060a12 0%, #0c1221 50%, #1a1d27 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Red/orange accent top-left */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 60%)",
            display: "flex",
          }}
        />
        {/* Gold accent bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 320,
            height: 320,
            background:
              "radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 60%)",
            display: "flex",
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#f0f2f5",
            letterSpacing: -2,
            display: "flex",
          }}
        >
          K
          <span
            style={{
              background: "linear-gradient(90deg, #ef4444, #f97316)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Cars
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "#94a3b8",
            marginTop: 16,
            display: "flex",
          }}
        >
          Jazdené autá, overená história
        </div>

        {/* Features strip */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 60,
            fontSize: 22,
            color: "#f87171",
          }}
        >
          <div style={{ display: "flex" }}>✓ 67-bodová kontrola</div>
          <div style={{ display: "flex", color: "#fbbf24" }}>✓ Financovanie 0%</div>
          <div style={{ display: "flex", color: "#4ade80" }}>✓ Rezervácia do 24h</div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 24,
            color: "#6b7a94",
            display: "flex",
          }}
        >
          kcars.sk
        </div>
      </div>
    ),
    { ...size }
  );
}
