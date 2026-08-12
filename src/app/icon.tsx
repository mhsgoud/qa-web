import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d7a63, #085242)",
          borderRadius: 9,
          position: "relative",
        }}
      >
        {/* ? hook */}
        <div
          style={{
            position: "absolute",
            left: 7,
            top: 7,
            width: 10,
            height: 10,
            border: "2px solid #a8e635",
            borderTop: "none",
            borderRight: "none",
            borderRadius: "0 0 0 6px",
            transform: "rotate(-45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 11,
            bottom: 8,
            width: 3,
            height: 3,
            borderRadius: 999,
            background: "#a8e635",
          }}
        />
        {/* answer arrow */}
        <div
          style={{
            position: "absolute",
            right: 6,
            top: 14,
            width: 10,
            height: 2,
            background: "white",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 6,
            top: 11,
            width: 6,
            height: 6,
            borderTop: "2px solid white",
            borderRight: "2px solid white",
            transform: "rotate(45deg)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
