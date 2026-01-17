import React, { useEffect } from "react";
import "./solvedAnimation.css";

export default function SolvedAnimation({
  show,
  durationMs = 1400,
  title = "Unlocked",
  subtitle = "Lock disengaged",
  onDone,
}) {
  useEffect(() => {
    if (!show || !onDone) return;

    const t = window.setTimeout(() => onDone(), durationMs);
    return () => window.clearTimeout(t);
  }, [show, onDone, durationMs]);

  if (!show) return null;

  return (
    <div className="solvedOverlay" role="status" aria-live="polite">
      <div className="solvedCard">
        <div className="solvedRings" aria-hidden="true">
          <span className="ring r1" />
          <span className="ring r2" />
          <span className="ring r3" />
        </div>

        <div className="checkWrap" aria-hidden="true">
          <svg className="check" viewBox="0 0 52 52">
            <path d="M14 27 L22 35 L38 18" />
          </svg>
        </div>

        <div className="solvedText">
          <div className="solvedTitle">{title}</div>
          <div className="solvedSubtitle">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
