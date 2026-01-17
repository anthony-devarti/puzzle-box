import React, { useMemo, useReducer, useRef, useEffect } from "react";
import { DEFAULT_CONFIG } from "./config";
import { puzzleReducer } from "./reducer";
import { generatePuzzle } from "./engine";
import { useRingDrag } from "./hooks/useRingDrag";
import { PuzzleSvg } from "./components/PuzzleSvg";
import SolvedAnimation from "../SolvedAnimation/SolvedAnimation";


export default function ConcentricRings() {
    const [state, dispatch] = useReducer(puzzleReducer, {
        rings: generatePuzzle(DEFAULT_CONFIG),
        alerts: 0,
        config: DEFAULT_CONFIG,
        solved: false,
        backlashPulse: 0,
        backlashInfo: null,
    });

    const cx = 210;
    const cy = 210;

    const radii = useMemo(() => {
        const { ringCount, baseRadius, radiusGap } = DEFAULT_CONFIG;
        return Array.from({ length: ringCount }, (_, i) =>
            baseRadius + i * (DEFAULT_CONFIG.ringWidth + radiusGap)
        );
    }, []);

    const loggedRef = useRef(false);

    useEffect(() => {
        if (state.solved && !loggedRef.current) {
            console.log("Puzzle solved");
            loggedRef.current = true;
        }
        if (!state.solved) loggedRef.current = false;
    }, [state.solved]);

    const drag = useRingDrag({
        cx,
        cy,
        radii,
        ringWidth: state.config.ringWidth,
        applyStepDeg: state.config.applyStepDeg,
        disabled: state.solved,
        onStep: (ringIndex, deltaDeg, dragMeta) =>
            dispatch({ type: "ROTATE_STEP", ringIndex, deltaDeg, dragMeta }),
    });


    return (
        <div style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                <button onClick={() => dispatch({ type: "RANDOMIZE" })}>Randomize</button>
                <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
                <div style={{ marginLeft: "auto" }}>Alert: {state.alerts}</div>
            </div>

            <div style={{ position: "relative", width: 420, height: 420 }}>
                <PuzzleSvg
                    rings={state.rings}
                    config={state.config}
                    cx={cx}
                    cy={cy}
                    radii={radii}
                    drag={drag}
                    solved={state.solved}
                    backlashPulse={state.backlashPulse}
                    backlashInfo={state.backlashInfo}
                />


                <SolvedAnimation
                    show={state.solved}
                    title="Unlocked"
                    subtitle="Lock disengaged"
                    durationMs={1400}
                />
            </div>
        </div>
    );

}
