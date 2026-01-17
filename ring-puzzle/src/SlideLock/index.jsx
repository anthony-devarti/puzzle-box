// src/SlideLock/index.jsx
import { useRef, useState } from "react";
import { INITIAL_STATE, BOARD } from "./state";
import { resolveMove } from "./resolveMove";

export default function Slidelock() {
  const [state, setState] = useState(INITIAL_STATE);

  const cell = 48;
  const pad = 10;

  const cols = BOARD.cols;
  const rows = BOARD.rows;

  // Exit is 1 cell tall because the key is a horizontal 3x1 block.
  const exitRow = BOARD.exitRow;
  const exitX = pad + cols * cell - 2;
  const exitY = pad + exitRow * cell + 2;

  // Drag tracking
  const dragRef = useRef(null);
  const DRAG_THRESHOLD_PX = 10;

  const onSvgPointerMove = (e) => {
    if (!dragRef.current) return;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
  };

  const commitDrag = (e) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;

    const endX = d.lastX ?? e.clientX;
    const endY = d.lastY ?? e.clientY;

    const dx = endX - d.startX;
    const dy = endY - d.startY;

    const piece = state.pieces.find((p) => p.id === d.id);
    if (!piece) return;

    const axisDelta = piece.orientation === "h" ? dx : dy;
    if (Math.abs(axisDelta) < DRAG_THRESHOLD_PX) return;

    const dir = axisDelta > 0 ? 1 : -1;
    setState((s) => resolveMove(s, d.id, dir));
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setState(INITIAL_STATE)}>Reset</button>

        <button onClick={() => setState((s) => resolveMove(s, "key", -1))}>
          Key Left
        </button>
        <button onClick={() => setState((s) => resolveMove(s, "key", 1))}>
          Key Right
        </button>

        <div style={{ marginLeft: "auto" }}>
          Solved: {state.solved ? "yes" : "no"}
        </div>
      </div>

      <svg
        width={pad * 2 + cols * cell + 28}
        height={pad * 2 + rows * cell}
        style={{ border: "1px solid #111", background: "#1b1b1b", touchAction: "none" }}
        onPointerMove={onSvgPointerMove}
        onPointerUp={commitDrag}
        onPointerLeave={() => (dragRef.current = null)}
        onPointerCancel={() => (dragRef.current = null)}
      >
        {/* board border */}
        <rect
          x={pad}
          y={pad}
          width={cols * cell}
          height={rows * cell}
          fill="none"
          stroke="rgba(0,0,0,0.85)"
          strokeWidth={4}
        />

        {/* exit notch on the right wall, 1 cell tall */}
        <rect
          x={exitX}
          y={exitY}
          width={26}
          height={cell - 4}
          rx={6}
          ry={6}
          fill="rgba(0,0,0,0.65)"
          stroke="rgba(255,255,255,0.18)"
        />

        {/* grid */}
        {Array.from({ length: cols + 1 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={pad + i * cell}
            y1={pad}
            x2={pad + i * cell}
            y2={pad + rows * cell}
            stroke="rgba(255,255,255,0.10)"
          />
        ))}
        {Array.from({ length: rows + 1 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1={pad}
            y1={pad + i * cell}
            x2={pad + cols * cell}
            y2={pad + i * cell}
            stroke="rgba(255,255,255,0.10)"
          />
        ))}

        {/* pieces */}
        {state.pieces.map((p) => {
          const w = p.orientation === "h" ? 3 : 1;
          const h = p.orientation === "v" ? 3 : 1;

          return (
            <rect
              key={p.id}
              x={pad + p.x * cell + 2}
              y={pad + p.y * cell + 2}
              width={w * cell - 4}
              height={h * cell - 4}
              rx={8}
              ry={8}
              fill={p.id === "key" ? "#b07d2b" : "#555"}
              stroke="rgba(0,0,0,0.6)"
              style={{ cursor: "grab" }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.setPointerCapture(e.pointerId);
                dragRef.current = {
                  id: p.id,
                  startX: e.clientX,
                  startY: e.clientY,
                  lastX: e.clientX,
                  lastY: e.clientY,
                };
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

// optional exports for reuse/tests
export { resolveMove } from "./resolveMove";
export { INITIAL_STATE, BOARD } from "./state";
