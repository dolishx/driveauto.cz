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
        <svg width="520" height="108" viewBox="0 0 280 58" fill="none">
          <path
            d="M10 43C43 22 82 10 119 12C147 13.5 164 23 194 14.5C221 6.7 247 12.2 270 27.5C248.5 25.8 229 25.7 210.5 27.5C188 29.7 173 31 149 26.8C125 22.6 103.5 21.6 78 27.5C53.2 33.2 32.2 38.8 10 43Z"
            fill="none"
            stroke="#0D0D0D"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
          />
          <path
            d="M107 12C130 8.5 151 10.5 178 17.2C159.5 18.6 145.6 21.5 125.2 20.5"
            fill="none"
            stroke="#0D0D0D"
            strokeLinecap="round"
            strokeWidth="4.2"
          />
          <path d="M70 40C76 29.5 93 29.5 100 40" fill="none" stroke="#1E40AF" strokeLinecap="round" strokeWidth="5" />
          <path d="M197 40C204 29.5 222 29.5 230 40" fill="none" stroke="#1E40AF" strokeLinecap="round" strokeWidth="5" />
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
