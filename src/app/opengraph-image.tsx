import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FFFFFF",
          color: "#0D0D0D",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 92,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          <span>DRIVE</span>
          <span style={{ color: "#1E40AF", fontStyle: "italic" }}>AUTO</span>
        </div>
        <div
          style={{
            background: "#1E40AF",
            height: 8,
            marginTop: 34,
            width: 170,
          }}
        />
        <p
          style={{
            color: "#60646C",
            fontSize: 34,
            fontWeight: 700,
            lineHeight: 1.35,
            marginTop: 42,
            maxWidth: 850,
          }}
        >
          Autoprodejna ověřených vozů. Katalog, prohlídky a služby kolem auta.
        </p>
      </div>
    ),
    size,
  );
}
