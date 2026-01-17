// slidelock/resolveMove.js

import { BOARD } from "./state";

function cellsForPiece(piece) {
    const cells = [];
    if (piece.orientation === "h") {
        for (let i = 0; i < 3; i++) {
            cells.push({ x: piece.x + i, y: piece.y });
        }
    } else {
        for (let i = 0; i < 3; i++) {
            cells.push({ x: piece.x, y: piece.y + i });
        }
    }
    return cells;
}

function buildOccupancy(pieces, ignoreId) {
    const set = new Set();
    for (const p of pieces) {
        if (p.id === ignoreId) continue;
        for (const c of cellsForPiece(p)) {
            set.add(`${c.x},${c.y}`);
        }
    }
    return set;
}

export function resolveMove(state, pieceId, dir) {
    const piece = state.pieces.find(p => p.id === pieceId);
    if (!piece) return state;

    const occ = buildOccupancy(state.pieces, pieceId);

    let dx = 0;
    let dy = 0;

    if (piece.orientation === "h") dx = dir;
    else dy = dir;

    let x = piece.x;
    let y = piece.y;

    while (true) {
        const nextX = x + dx;
        const nextY = y + dy;

        // check each leading cell
        const testCells = [];
        if (piece.orientation === "h") {
            const edgeX = dir > 0 ? nextX + 2 : nextX;
            testCells.push({ x: edgeX, y: y });
        } else {
            const edgeY = dir > 0 ? nextY + 2 : nextY;
            testCells.push({ x: x, y: edgeY });
        }

        let blocked = false;

        for (const c of testCells) {
            // exit check for key
            if (
                piece.id === "key" &&
                piece.orientation === "h" &&
                dir > 0 &&
                c.x >= BOARD.cols &&
                c.y === BOARD.exitRow
            ) {
                // Move key partially out through the notch so it is visible.
                const exitX = BOARD.cols - 2; // for a 3-wide piece: cells at x, x+1, x+2; rightmost becomes BOARD.cols
                return {
                    ...state,
                    solved: true,
                    pieces: state.pieces.map((p) =>
                        p.id === "key" ? { ...p, x: exitX } : p
                    ),
                };
            }


            if (
                c.x < 0 ||
                c.y < 0 ||
                c.x >= BOARD.cols ||
                c.y >= BOARD.rows ||
                occ.has(`${c.x},${c.y}`)
            ) {
                blocked = true;
                break;
            }
        }

        if (blocked) break;

        x = nextX;
        y = nextY;
    }

    if (x === piece.x && y === piece.y) return state;

    return {
        ...state,
        pieces: state.pieces.map(p =>
            p.id === pieceId ? { ...p, x, y } : p
        ),
    };
}
