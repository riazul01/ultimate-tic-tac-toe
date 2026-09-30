import type { CellValue, MicroBoardStatus, Player, WinningLine } from "./types";

// All 8 possible winning lines on a 3x3 grid
export const WINNING_LINES: WinningLine[] = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Check if a 9-element array has a 3-in-a-row winner
 */
export function check3x3Winner(
  cells: (Player | null)[],
): { winner: Player; line: WinningLine } | null {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    const cellA = cells[a];
    if (cellA !== null && cellA === cells[b] && cellA === cells[c]) {
      return { winner: cellA, line: WINNING_LINES[i] };
    }
  }
  return null;
}

/**
 * Check the status of a single micro-board.
 * Returns { status: 'X' | 'O' | 'draw' | 'playing', line: WinningLine | null }
 */
export function evaluateMicroBoard(cells: CellValue[]): {
  status: MicroBoardStatus;
  line: WinningLine | null;
} {
  const win = check3x3Winner(cells);
  if (win) {
    return { status: win.winner, line: win.line };
  }

  // Check if micro board is completely filled
  const isFull = cells.every((cell) => cell !== null);
  if (isFull) {
    return { status: "draw", line: null };
  }

  return { status: "playing", line: null };
}

/**
 * Check macro-board status based on the 9 micro-board statuses.
 * Returns { winner: Player | 'draw' | null, line: WinningLine | null }
 */
export function evaluateMacroBoard(boardStatuses: MicroBoardStatus[]): {
  winner: Player | "draw" | null;
  line: WinningLine | null;
} {
  // Convert MicroBoardStatus array to (Player | null) for 3x3 check
  const macroCells: (Player | null)[] = boardStatuses.map((status) =>
    status === "X" || status === "O" ? status : null,
  );

  const win = check3x3Winner(macroCells);
  if (win) {
    return { winner: win.winner, line: win.line };
  }

  // Check if no more micro-boards can be played (all 9 are finished)
  const allFinished = boardStatuses.every((status) => status !== "playing");
  if (allFinished) {
    return { winner: "draw", line: null };
  }

  // Check if any winning line is still possible for either player
  const xPossible = isMacroWinPossibleForPlayer(boardStatuses, "X");
  const oPossible = isMacroWinPossibleForPlayer(boardStatuses, "O");

  if (!xPossible && !oPossible) {
    return { winner: "draw", line: null };
  }

  return { winner: null, line: null };
}

/**
 * Checks whether a given player can still achieve 3-in-a-row on the macro board.
 */
export function isMacroWinPossibleForPlayer(
  boardStatuses: MicroBoardStatus[],
  player: Player,
): boolean {
  const opponent: Player = player === "X" ? "O" : "X";

  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    const sA = boardStatuses[a];
    const sB = boardStatuses[b];
    const sC = boardStatuses[c];

    // A line is blocked if any cell is won by the opponent or is a draw
    const aBlocked = sA === opponent || sA === "draw";
    const bBlocked = sB === opponent || sB === "draw";
    const cBlocked = sC === opponent || sC === "draw";

    if (!aBlocked && !bBlocked && !cBlocked) {
      return true; // There is at least one line this player could still theoretically win
    }
  }

  return false;
}
