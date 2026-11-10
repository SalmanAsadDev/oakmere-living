import { ImageResponse } from "next/og";

export const alt = "Oakmere Living — sofas for a life well lived";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          background: "#ece9df",
          color: "#252a23",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "sans-serif",
            fontSize: 22,
            letterSpacing: "0.24em",
          }}
        >
          OAKMERE LIVING
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 78, lineHeight: 1.02 }}>
            A little more room to live.
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#5e6358" }}>
            Corner sofas, sofa sets and recliners for UK homes.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 10,
            background: "#344639",
          }}
        />
      </div>
    ),
    size,
  );
}
