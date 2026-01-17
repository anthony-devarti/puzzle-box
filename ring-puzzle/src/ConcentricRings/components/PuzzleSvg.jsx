import { Ring } from "./Ring";
import { isCoupled } from "../engine";
import { useEffect, useState } from "react";


export function PuzzleSvg({
    rings,
    config,
    cx,
    cy,
    radii,
    drag,
    backlashPulse
}) {
    if (!Array.isArray(rings)) {
        console.log("PuzzleSvg rings is:", rings);
        return null;
    }

    const [backlashActive, setBacklashActive] = useState(false);

    useEffect(() => {
        if (!backlashPulse) return;

        setBacklashActive(true);
        const t = setTimeout(() => setBacklashActive(false), 250);
        return () => clearTimeout(t);
    }, [backlashPulse]);


    return (
        <svg
            width={420}
            height={420}
            style={{ touchAction: "none", border: "1px solid #111" }}
            onPointerDown={(e) => drag.pointerDown(e, e.currentTarget)}
            onPointerMove={(e) => drag.pointerMove(e, e.currentTarget)}
            onPointerUp={drag.pointerUp}
            onPointerLeave={drag.pointerUp}
            className={backlashActive ? "backlash" : ""}
        >
            {/* DEFINITIONS */}
            <defs>
                {/* Background: pitted iron */}
                <pattern id="bgMetal" patternUnits="userSpaceOnUse" width="420" height="420">
                    <image href="/textures/pittedIron.jpg" width="420" height="420" />
                </pattern>

                <filter id="bgGrade">
                    <feColorMatrix
                        type="matrix"
                        values="0.30 0 0 0 0  0 0.30 0 0 0  0 0 0.30 0 0  0 0 0 1 0"
                    />
                </filter>

                {/* Rings: pitted iron, but darker */}
                <pattern id="ironGroove" patternUnits="userSpaceOnUse" width="240" height="240">
                    <image href="/textures/pittedIron.jpg" width="240" height="240" />
                </pattern>

                <filter id="metalGrade">
                    <feColorMatrix
                        type="matrix"
                        values="0.42 0 0 0 0  0 0.42 0 0 0  0 0 0.42 0 0  0 0 0 1 0"
                    />
                    <feComponentTransfer>
                        <feFuncR type="gamma" exponent="1.4" />
                        <feFuncG type="gamma" exponent="1.4" />
                        <feFuncB type="gamma" exponent="1.4" />
                    </feComponentTransfer>
                </filter>

                <filter id="grooveDepth" x="-50%" y="-50%" width="200%" height="200%">
                    {/* crush midtones */}
                    <feComponentTransfer>
                        <feFuncR type="gamma" exponent="1.8" />
                        <feFuncG type="gamma" exponent="1.8" />
                        <feFuncB type="gamma" exponent="1.8" />
                    </feComponentTransfer>

                    {/* subtle inner occlusion */}
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" result="blur" />
                    <feOffset dy="1.2" result="off" />
                    <feComposite
                        in="off"
                        in2="SourceAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                        result="inner"
                    />

                    <feColorMatrix
                        in="inner"
                        type="matrix"
                        values="0 0 0 0 0
            0 0 0 0 0
            0 0 0 0 0
            0 0 0 0.75 0"
                    />

                    <feComposite in2="SourceGraphic" operator="over" />
                </filter>


                {/* Beads: rusted Iron */}
                <pattern id="rustedIron" patternUnits="userSpaceOnUse" width="120" height="120">
                    <image href="/textures/rustedIron.jpg" width="120" height="120" />
                </pattern>

                <radialGradient id="beadHighlight" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.70)" />
                    <stop offset="35%" stopColor="rgba(255,255,255,0.18)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>

                <radialGradient id="beadShade" cx="65%" cy="70%" r="80%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                    <stop offset="65%" stopColor="rgba(0,0,0,0.18)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
                </radialGradient>

                <filter id="grooveDarken">
                    <feColorMatrix
                        type="matrix"
                        values="0.22 0 0 0 0
            0 0.22 0 0 0
            0 0 0.22 0 0
            0 0 0 1 0"
                    />
                </filter>

            </defs>

            {/* BACKGROUND PLATE */}
            <rect
                x="0"
                y="0"
                width="420"
                height="420"
                fill="url(#bgMetal)"
                filter="url(#bgGrade)"
            />

            {/* CENTER DOT */}
            <circle cx={cx} cy={cy} r={4} fill="#999" />

            {/* RINGS */}
            {(rings ?? []).map((r, i) => (
                <Ring
                    key={i}
                    cx={cx}
                    cy={cy}
                    radius={radii[i]}
                    width={config.ringWidth}
                    angle={r.angle}
                    triggerAngle={r.triggerAngle}
                    coupled={isCoupled(r.angle, r.triggerAngle, config.coupledArcDeg)}
                    label={i + 1}
                    solutionAngle={r.solutionAngle}
                />
            ))}
        </svg>
    );
}
