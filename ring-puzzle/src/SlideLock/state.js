// slidelock/state.js

export const BOARD = {
  cols: 8,
  rows: 6,
  exitRow: 2, // y coordinate of the 3-cell exit
};

export const INITIAL_STATE = {
  pieces: [
    {
      id: "key",
      x: 1,
      y: 2,
      orientation: "h",
    },
    {
      id: "A",
      x: 4,
      y: 0,
      orientation: "v",
    },
    {
      id: "B",
      x: 6,
      y: 1,
      orientation: "v",
    },
  ],
  solved: false,
};
