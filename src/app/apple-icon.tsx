import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#FFFFFF",
          border: "8px solid #E6E6E6",
          borderRadius: "40px",
          color: "#0D0D0D",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          fontSize: 72,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <span style={{ color: "#0D0D0D" }}>D</span>
        <span style={{ color: "#1E40AF", fontStyle: "italic" }}>A</span>
      </div>
    ),
    size,
  );
}
