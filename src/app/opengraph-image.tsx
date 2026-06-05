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
        <svg width="560" height="126" viewBox="0 0 320 72" fill="none">
          <path
            d="M9 50C42 28 74 15 107 10C132 6 164 8 199 20C172 23 150 28 126 27C100 26 75 31 51 39C32 45 19 49 9 50Z"
            fill="none"
            stroke="#0D0D0D"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5.4"
          />
          <path
            d="M167 24C193 22 216 15 234 19C253 23 276 32 312 25"
            fill="none"
            stroke="#0D0D0D"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5.4"
          />
          <path d="M82 52C91 36 117 36 128 52" fill="none" stroke="#1E40AF" strokeLinecap="round" strokeWidth="5.2" />
          <path d="M232 52C242 36 270 36 281 52" fill="none" stroke="#1E40AF" strokeLinecap="round" strokeWidth="5.2" />
        </svg>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1,
            marginTop: 10,
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
