import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "./theme";
import { Backdrop, rise, hex } from "./ui";

// Real product frames, captured headlessly from the live deployment.
// Browser chrome + slow push-in so a static screenshot reads as a walkthrough.
export const ShotScene: React.FC<{
  src: string;
  url: string;
  kicker: string;
  caption: string;
  zoom?: [number, number];
  origin?: string;
}> = ({ src, url, kicker, caption, zoom = [1.0, 1.08], origin = "50% 30%" }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], zoom, { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ padding: "70px 120px 150px", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.green,
            ...rise(f, fps, 0),
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            flex: 1,
            borderRadius: 18,
            border: `1px solid ${C.line}`,
            overflow: "hidden",
            boxShadow: `0 30px 80px ${hex("#000000", 0.55)}`,
            background: C.bg2,
            display: "flex",
            flexDirection: "column",
            ...rise(f, fps, 8),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 22px", borderBottom: `1px solid ${C.line}` }}>
            {[C.red, C.amber, C.green].map((c) => (
              <span key={c} style={{ width: 13, height: 13, borderRadius: 7, background: hex(c, 0.75) }} />
            ))}
            <span style={{ fontFamily: MONO, fontSize: 20, color: C.faint, marginLeft: 16, background: C.bg, borderRadius: 8, padding: "6px 18px" }}>
              {url}
            </span>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <Img
              src={staticFile(src)}
              style={{ width: "100%", transform: `scale(${z})`, transformOrigin: origin }}
            />
          </div>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 30, color: C.dim, lineHeight: 1.45, maxWidth: 1400, ...rise(f, fps, 18) }}>
          {caption}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
