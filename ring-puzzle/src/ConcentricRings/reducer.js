// reducer.js
import { applyStep, generatePuzzle, isSolved } from "./engine";

export function puzzleReducer(state, action) {
    switch (action.type) {
        case "RANDOMIZE": {
            const rings = generatePuzzle(state.config);
            return { ...state, rings, alerts: 0, solved: false };
        }

        case "ROTATE_STEP": {
            const { ringIndex, deltaDeg, dragMeta } = action;
            const next = applyStep(state, ringIndex, deltaDeg, state.config, dragMeta);

            // Loosen this if needed (see step 2)
            const solved = isSolved(next.rings, 2);

            const backlashEvent = next.events?.find(e => e.type === "BACKLASH");

            return {
                ...next,
                solved,
                backlashPulse: backlashEvent ? state.backlashPulse + 1 : state.backlashPulse,
                backlashInfo: backlashEvent ?? null,
            };

        }

        case "RESET": {
            const rings = state.rings.map((r) => ({ ...r, angle: 0 }));
            return { ...state, rings, alerts: 0, solved: isSolved(rings, 8) };
        }

        default:
            return state;
    }
}
