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
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <svg width="134" height="82" viewBox="0 0 96 56" fill="none">
          <path
            d="M5.5 45.5H31.8C49.1 45.5 60.8 35.9 60.8 23.4C60.8 11.1 50.2 4.5 34.4 4.5H16.2L10.7 15.6H33.2C41.2 15.6 46.2 19.9 46.2 26.5C46.2 33.8 40.7 38.3 31.3 38.3H9.2L5.5 45.5Z"
            fill="#0D0D0D"
          />
          <path
            d="M47.2 45.5L74.1 4.5H89.6L93.5 45.5H79.7L79.1 38H63.3L58.6 45.5H47.2ZM69 28.7H78.3L77.5 15.8L69 28.7Z"
            fill="#1E40AF"
          />
          <path
            d="M17.2 1.8H44.8C56.8 1.8 66 4.6 72.2 10.2"
            fill="none"
            stroke="#0D0D0D"
            strokeLinecap="round"
            strokeWidth="4.6"
          />
        </svg>
      </div>
    ),
    size,
  );
}
