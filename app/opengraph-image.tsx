import { ImageResponse } from "next/og";

export const alt = "Zura Beridze — Web Developer & IT Specialist, Tbilisi, Georgia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", background: "#F8F9FF", padding: "80px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", color: "#365BFF", fontSize: 24, letterSpacing: 5 }}>PORTFOLIO / TBILISI, GEORGIA</div>
      <div style={{ display: "flex", marginTop: 40, fontSize: 112, fontWeight: 700, letterSpacing: -7, color: "#111114" }}>Hello, I’m Zura.</div>
      <div style={{ display: "flex", marginTop: 30, fontSize: 34, color: "#66666e" }}>Web Developer &amp; IT Specialist</div>
      <div style={{ display: "flex", marginTop: 55, width: 160, height: 8, background: "#365BFF" }} />
    </div>,
    size,
  );
}
