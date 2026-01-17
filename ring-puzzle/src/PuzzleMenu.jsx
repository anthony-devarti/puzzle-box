import { useState } from "react";
import ConcentricRings from "./ConcentricRings";
import SlideLock from "./SlideLock/index.jsx";

export default function PuzzleMenu() {
  const [activePuzzle, setActivePuzzle] = useState(null);

  if (activePuzzle === "rings") {
    return <ConcentricRings />;
  }
  if (activePuzzle === "slide") {
    return <SlideLock />;
  }

  return (
    <div style={{ padding: 40 }}>
      <button onClick={() => setActivePuzzle("rings")}>
        Ring Puzzle
      </button>
      <button onClick={() => setActivePuzzle("slide")}>
        Slide Lock
      </button>
      {/* later: more buttons */}
    </div>
  );
}
