import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#ffffff",
          background: "linear-gradient(135deg, #f97316, #ef4444)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          letterSpacing: -1,
        }}
      >
        軽
      </div>
    ),
    { ...size },
  );
}
