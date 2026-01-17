// src/ConcentricRings/complications/overRotationBacklash.js

const mod360 = (x) => ((x % 360) + 360) % 360;

const angularDiffDeg = (a, b) => {
  const d = mod360(a - b);
  return Math.min(d, 360 - d);
};

/**
 * Over-rotation backlash (simple, readable)
 *
 * Triggers when the rotated ring is "too far" from its solution.
 * Applies a counter-rotation to that ring's target ring and emits an event.
 */
export function applyOverRotationBacklash({
  rings,
  rotatedRingIndex,
  deltaDeg,
  config,
  alerts,
}) {
  const backlashDeg = typeof config?.backlashDeg === "number" ? config.backlashDeg : 12;
  const backlashRatio = typeof config?.backlashRatio === "number" ? config.backlashRatio : 0.5;
  const alertPerBacklash =
    typeof config?.alertPerBacklash === "number" ? config.alertPerBacklash : 1;

  const r = rings[rotatedRingIndex];
  if (!r) return { rings, alerts, events: [] };

  const diff = angularDiffDeg(r.angle, r.solutionAngle);
  if (diff <= backlashDeg) return { rings, alerts, events: [] };

  const victimIndex = r.targetIndex;
  const victim = rings[victimIndex];
  if (!victim) return { rings, alerts, events: [] };

  const backlashDelta = -deltaDeg * backlashRatio;
  victim.angle = mod360(victim.angle + backlashDelta);

  return {
    rings,
    alerts: alerts + alertPerBacklash,
    events: [
      {
        type: "BACKLASH",
        rotatedRingIndex,
        victimIndex,
        strength: Math.abs(backlashDelta),
      },
    ],
  };
}
