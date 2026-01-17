// src/ConcentricRings/engine.js
import { applyOverRotationBacklash } from "./complications/overRotationBacklash";

export const mod360 = (x) => ((x % 360) + 360) % 360;

export function isCoupled(angle, triggerAngle, coupledArcDeg) {
  const a = mod360(angle - triggerAngle);
  return a > 0 && a <= coupledArcDeg;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function angularDiffDeg(a, b) {
  const d = mod360(a - b);
  return Math.min(d, 360 - d);
}

export function isSolved(rings, toleranceDeg = 4) {
  return rings.every((r) => angularDiffDeg(r.angle, r.solutionAngle) <= toleranceDeg);
}

export function applyStep(state, ringIndex, deltaDeg, config, dragMeta) {
  const { coupledArcDeg, coupleRatio } = config;

  // Always return a predictable shape
  const rings = state.rings.map((r) => ({ ...r }));
  const wasCoupled = rings.map((r) => isCoupled(r.angle, r.triggerAngle, coupledArcDeg));

  // Rotate dragged ring
  rings[ringIndex].angle = mod360(rings[ringIndex].angle + deltaDeg);

  // Propagate coupling chain
  let currentIdx = ringIndex;
  let currentDelta = deltaDeg * coupleRatio;

  for (let i = 0; i < rings.length; i++) {
    const r = rings[currentIdx];
    if (!isCoupled(r.angle, r.triggerAngle, coupledArcDeg)) break;

    const target = r.targetIndex;
    rings[target].angle = mod360(rings[target].angle + currentDelta);

    currentIdx = target;
    currentDelta *= coupleRatio;
  }

  // Alerts: entering coupling zone (per drag)
  let alerts = state.alerts;
  for (let i = 0; i < rings.length; i++) {
    const nowCoupled = isCoupled(rings[i].angle, rings[i].triggerAngle, coupledArcDeg);
    if (!wasCoupled[i] && nowCoupled && dragMeta?.entered && !dragMeta.entered[i]) {
      dragMeta.entered[i] = true;
      alerts++;
    }
  }

  // Complication events
  let events = [];

  // Over-rotation backlash (always on by default)
  const backlashRes = applyOverRotationBacklash({
    rings,
    rotatedRingIndex: ringIndex,
    deltaDeg,
    config,
    alerts,
  });

  alerts = backlashRes.alerts;
  if (Array.isArray(backlashRes.events) && backlashRes.events.length) {
    events = events.concat(backlashRes.events);
  }

  return { ...state, rings, alerts, events };
}

export function generatePuzzle(config) {
  const ringCount = config?.ringCount;

  if (typeof ringCount !== "number" || ringCount <= 0) {
    throw new Error(`generatePuzzle: invalid config.ringCount (${ringCount})`);
  }

  const targets = Array.from({ length: ringCount }, (_, i) => {
    let t = i;
    while (t === i) t = randInt(0, ringCount - 1);
    return t;
  });

  return Array.from({ length: ringCount }, (_, i) => {
    const triggerAngle = randInt(0, 359);

    return {
      angle: randInt(0, 359),
      triggerAngle,
      targetIndex: targets[i],

      // Solvable win condition: align bead marker to the notch
      solutionAngle: triggerAngle,
    };
  });
}
