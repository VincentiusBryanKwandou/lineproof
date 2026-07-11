import React from "react";
import { Composition, AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { C } from "./theme";
import {
  SceneHook,
  SceneTurn,
  SceneLogo,
  SceneStages,
  SceneBoard,
  SceneTxline,
  SceneProof,
  SceneWhy,
  SceneCTA,
} from "./scenes";
import { ShotScene } from "./walkthrough";

const SITE = "lineproof-rho.vercel.app";
const WalkHero: React.FC = () => (
  <ShotScene src="shots/hero.png" url={SITE} kicker="Live walkthrough · real deployment"
    caption="The production app, as captured from the live URL. The agent chip in the corner is not decoration — the scheduler has been running unattended for days." />
);
const WalkBoard: React.FC = () => (
  <ShotScene src="shots/board.png" url={`${SITE}/#live`} kicker="Live walkthrough · integrity board" origin="50% 20%"
    caption="Real World Cup fixtures from the TxLINE feed: quoted 1X2 next to the recomputed fair line, the margin, and an integrity score per fixture." />
);
const WalkForensics: React.FC = () => (
  <ShotScene src="shots/forensics.png" url={`${SITE}/#forensics`} kicker="Live walkthrough · forensics" origin="50% 25%"
    caption="The agent replays every recorded tick and audits its own archive between scans — a tournament track record derived entirely from real data." />
);
const WalkVerify: React.FC = () => (
  <ShotScene src="shots/verify.png" url={`${SITE}/#chain`} kicker="Live walkthrough · closed-loop verification" origin="50% 32%" zoom={[1.02, 1.14]}
    caption="Run live in the page: the archived report is re-hashed and compared with the digest inside the on-chain memo. MATCH — and a ledger of attestations landing every scheduler tick." />
);
const WalkExplorer: React.FC = () => (
  <ShotScene src="shots/explorer.png" url="explorer.solana.com" kicker="Live walkthrough · Solana explorer" origin="50% 35%"
    caption="The same attestation on the public explorer: finalized, signed by the agent wallet, carrying the report digest in the memo. This record outlives us." />
);

loadInter();

const FPS = 30;
// Scene durations in frames — tuned so narration/reading lands comfortably.
const D = {
  hook: 150,
  turn: 140,
  logo: 110,
  stages: 210,
  board: 220,
  txline: 200,
  proof: 220,
  why: 200,
  cta: 190,
};
const OVERLAP = 15;

const scenes: [React.FC, number][] = [
  [SceneHook, D.hook],
  [SceneTurn, D.turn],
  [SceneLogo, D.logo],
  [SceneStages, D.stages],
  [SceneTxline, D.txline],
  [WalkHero, 170],
  [WalkBoard, 190],
  [WalkForensics, 180],
  [WalkVerify, 230],
  [WalkExplorer, 200],
  [SceneProof, D.proof],
  [SceneWhy, D.why],
  [SceneCTA, D.cta],
];

const TOTAL =
  scenes.reduce((a, [, d]) => a + d, 0) - OVERLAP * (scenes.length - 1);

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  const w = interpolate(f, [0, TOTAL], [0, 100], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, height: 5, width: `${w}%`, background: `linear-gradient(90deg, ${C.green}, ${C.accent})`, zIndex: 100 }} />
  );
};

const Film: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <TransitionSeries>
      {scenes.map(([S, dur], i) => (
        <React.Fragment key={i}>
          <TransitionSeries.Sequence durationInFrames={dur}>
            <S />
          </TransitionSeries.Sequence>
          {i < scenes.length - 1 && (
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: OVERLAP })}
            />
          )}
        </React.Fragment>
      ))}
    </TransitionSeries>
    <Progress />
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LineProofDemo"
      component={Film}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
