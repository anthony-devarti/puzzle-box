export function Ring({
  cx,
  cy,
  radius,
  width,
  angle,
  triggerAngle,
  solutionAngle,
  coupled,
  label,
}) {
  const toXY = (deg) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  };

  const beadR = 12;
  const socketR = beadR + 3;

  // Where the bead is now (driven by current ring angle)
  const beadPos = toXY(angle);

  // Where the bead should go (finish line)
  const socketPos = toXY(solutionAngle ?? triggerAngle);

  return (
    <g>
      {/* main metal groove */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="url(#ironGroove)"
        strokeWidth={width}
        filter="url(#grooveDarken)"
        strokeLinecap="round"
      />

      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth={width - 4}
        strokeLinecap="round"
        pointerEvents="none"
      />

      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={width - 8}
        strokeLinecap="round"
        pointerEvents="none"
      />

      {/* engraved bevel: dark outer edge */}
      <circle
        cx={cx}
        cy={cy}
        r={radius + width / 2 - 1}
        fill="none"
        stroke="rgba(0,0,0,0.45)"
        strokeWidth={2}
      />

      {/* engraved bevel: subtle inner highlight */}
      <circle
        cx={cx}
        cy={cy}
        r={radius - width / 2 + 1}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={2}
      />

      {/* destination socket (recessed dip) */}
      <circle cx={socketPos.x} cy={socketPos.y} r={socketR} fill="rgba(0,0,0,0.38)" />
      <circle cx={socketPos.x} cy={socketPos.y} r={socketR - 2} fill="rgba(0,0,0,0.22)" />
      <circle cx={socketPos.x} cy={socketPos.y} r={socketR - 4} fill="rgba(255,255,255,0.07)" />

      {/* bead (spherical) */}
      {/* solid base to guarantee opacity */}
      <circle
        cx={beadPos.x}
        cy={beadPos.y}
        r={beadR}
        fill="#5a4634"
      />

      {/* texture */}
      <circle
        cx={beadPos.x}
        cy={beadPos.y}
        r={beadR}
        fill="url(#rustedIron)"
      />

      {/* shading */}
      <circle
        cx={beadPos.x}
        cy={beadPos.y}
        r={beadR}
        fill="url(#beadShade)"
      />

      {/* highlight */}
      <circle
        cx={beadPos.x}
        cy={beadPos.y}
        r={beadR}
        fill="url(#beadHighlight)"
      />

      <circle
        cx={beadPos.x}
        cy={beadPos.y}
        r={beadR}
        fill="none"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth={1}
      />
    </g>
  );
}
