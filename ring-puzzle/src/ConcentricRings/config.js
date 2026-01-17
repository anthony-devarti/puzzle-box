export const DEFAULT_CONFIG = {
  ringCount: 3,
  ringWidth: 30,
  baseRadius: 95,
  radiusGap: 18,

  coupledArcDeg: 150,
  coupleRatio: 0.65,

  applyStepDeg: 0.35,

  // Complication: over-rotation backlash
  useBacklash: true,
  backlashDeg: 12,        // how far from solution counts as "over-rotated"
  backlashRatio: 0.5,     // how strong the counter-rotation is
  alertPerBacklash: 1,    // alert added when backlash triggers
};
