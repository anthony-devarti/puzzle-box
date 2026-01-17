import { useRef } from "react";

function deltaAngleRad(prev, next) {
  let d = next - prev;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

export function useRingDrag({
  cx,
  cy,
  radii,
  ringWidth,
  applyStepDeg,
  onStep,
  disabled = false,
}) {
  const ref = useRef({
    active: false,
    ringIndex: -1,
    lastTheta: 0,
    carry: 0,
    entered: [],
  });

  function hitTest(x, y) {
    const dx = x - cx;
    const dy = y - cy;
    const d = Math.sqrt(dx * dx + dy * dy);

    for (let i = radii.length - 1; i >= 0; i--) {
      const r = radii[i];
      if (d >= r - ringWidth / 2 && d <= r + ringWidth / 2) return i;
    }
    return -1;
  }

  function pointerDown(e, svg) {
    if (disabled) return
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const idx = hitTest(x, y);
    if (idx === -1) return;

    svg.setPointerCapture(e.pointerId);
    ref.current = {
      active: true,
      ringIndex: idx,
      lastTheta: Math.atan2(y - cy, x - cx),
      carry: 0,
      entered: [],
    };
  }

  function pointerMove(e, svg) {
    if (disabled) return;
    if (!ref.current.active) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const theta = Math.atan2(y - cy, x - cx);
    const dRad = deltaAngleRad(ref.current.lastTheta, theta);
    ref.current.lastTheta = theta;

    ref.current.carry += (dRad * 180) / Math.PI;

    while (Math.abs(ref.current.carry) >= applyStepDeg) {
      const step = ref.current.carry > 0 ? applyStepDeg : -applyStepDeg;
      ref.current.carry -= step;
      onStep(ref.current.ringIndex, step, ref.current);
    }
  }

  function pointerUp() {
    ref.current.active = false;
  }

  return { pointerDown, pointerMove, pointerUp };
}
