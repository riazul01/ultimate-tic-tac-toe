import type { GameState, Player, MicroBoardStatus } from '../game/types';
import { WINNING_LINES } from '../game/winDetection';

// Positional weight matrices (Center is strongest, corners second, edges third)
export const POSITION_WEIGHTS = [
  3, 2, 3,
  2, 4, 2,
  3, 2, 3,
];

// Macro positional weights (Center board is crucial in Ultimate Tic-Tac-Toe)
export const MACRO_BOARD_WEIGHTS = [
  6, 4, 6,
  4, 10, 4,
  6, 4, 6,
];

const WIN_SCORE = 100000;
const MACRO_TWO_IN_ROW = 600;
const MACRO_ONE_IN_ROW = 80;
const MICRO_WIN_BASE = 150;
const MICRO_TWO_IN_ROW = 20;
const MICRO_ONE_IN_ROW = 3;
const SEND_FREE_CHOICE_PENALTY = 70;

/**
 * Heuristic evaluation function for an Ultimate Tic-Tac-Toe state.
 * Returns a positive score if the state favors `forPlayer`, negative if favors opponent.
 */
export function evaluateBoard(state: GameState, forPlayer: Player): number {
  const opponent: Player = forPlayer === 'X' ? 'O' : 'X';

  // 1. Terminal states
  if (state.winner === forPlayer) {
    return WIN_SCORE;
  }
  if (state.winner === opponent) {
    return -WIN_SCORE;
  }
  if (state.winner === 'draw') {
    return 0;
  }

  let score = 0;

  // 2. Macro-board line evaluation
  score += evaluateMacroLines(state.boardStatuses, forPlayer, opponent);

  // 3. Micro-board evaluation & positional control
  for (let b = 0; b < 9; b++) {
    const bStatus = state.boardStatuses[b];
    const bWeight = MACRO_BOARD_WEIGHTS[b];

    if (bStatus === forPlayer) {
      score += MICRO_WIN_BASE * bWeight;
    } else if (bStatus === opponent) {
      score -= MICRO_WIN_BASE * bWeight;
    } else if (bStatus === 'playing') {
      const microScore = evaluateMicroState(state.boards[b], forPlayer, opponent);
      score += microScore * (bWeight / 4);
    }
  }

  // 4. Strategic destination evaluation
  if (state.activeBoard === null) {
    if (state.currentPlayer === opponent) {
      score -= SEND_FREE_CHOICE_PENALTY;
    } else {
      score += SEND_FREE_CHOICE_PENALTY;
    }
  } else {
    const targetBoard = state.activeBoard;
    const targetStatus = state.boardStatuses[targetBoard];
    if (targetStatus === 'playing') {
      const targetMicroCells = state.boards[targetBoard];
      const forPlayerThreats = countThreats(targetMicroCells, forPlayer);
      const oppThreats = countThreats(targetMicroCells, opponent);

      if (state.currentPlayer === opponent) {
        if (forPlayerThreats > 0 && oppThreats === 0) {
          score += 40;
        } else if (oppThreats > 0) {
          score -= 50;
        }
      }
    }
  }

  return score;
}

/**
 * Evaluates macro-board potential combinations
 */
function evaluateMacroLines(
  boardStatuses: MicroBoardStatus[],
  forPlayer: Player,
  opponent: Player
): number {
  let score = 0;

  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    const sA = boardStatuses[a];
    const sB = boardStatuses[b];
    const sC = boardStatuses[c];

    let forCount = 0;
    let oppCount = 0;
    let blocked = false;

    for (const s of [sA, sB, sC]) {
      if (s === forPlayer) forCount++;
      else if (s === opponent) oppCount++;
      else if (s === 'draw') blocked = true;
    }

    if (blocked) continue;

    if (forCount > 0 && oppCount === 0) {
      if (forCount === 2) {
        score += MACRO_TWO_IN_ROW;
      } else if (forCount === 1) {
        score += MACRO_ONE_IN_ROW;
      }
    } else if (oppCount > 0 && forCount === 0) {
      if (oppCount === 2) {
        score -= MACRO_TWO_IN_ROW * 1.2;
      } else if (oppCount === 1) {
        score -= MACRO_ONE_IN_ROW;
      }
    }
  }

  return score;
}

/**
 * Evaluates a single 3x3 micro-board internal state
 */
function evaluateMicroState(
  cells: (Player | null)[],
  forPlayer: Player,
  opponent: Player
): number {
  let score = 0;

  for (let c = 0; c < 9; c++) {
    if (cells[c] === forPlayer) {
      score += POSITION_WEIGHTS[c];
    } else if (cells[c] === opponent) {
      score -= POSITION_WEIGHTS[c];
    }
  }

  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    const cA = cells[a];
    const cB = cells[b];
    const cC = cells[c];

    let forCount = 0;
    let oppCount = 0;

    for (const cell of [cA, cB, cC]) {
      if (cell === forPlayer) forCount++;
      else if (cell === opponent) oppCount++;
    }

    if (forCount > 0 && oppCount === 0) {
      if (forCount === 2) {
        score += MICRO_TWO_IN_ROW;
      } else if (forCount === 1) {
        score += MICRO_ONE_IN_ROW;
      }
    } else if (oppCount > 0 && forCount === 0) {
      if (oppCount === 2) {
        score -= MICRO_TWO_IN_ROW * 1.2;
      } else if (oppCount === 1) {
        score -= MICRO_ONE_IN_ROW;
      }
    }
  }

  return score;
}

/**
 * Counts how many immediate winning lines a player has ready in a single micro board
 */
export function countThreats(cells: (Player | null)[], player: Player): number {
  let threats = 0;
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    const triplet = [cells[a], cells[b], cells[c]];
    const count = triplet.filter((c) => c === player).length;
    const emptyCount = triplet.filter((c) => c === null).length;
    if (count === 2 && emptyCount === 1) {
      threats++;
    }
  }
  return threats;
}

/**
 * Check if playing in `cellIndex` inside `boardIndex` immediately wins that micro board
 */
export function isMicroWinningMove(
  cells: (Player | null)[],
  cellIndex: number,
  player: Player
): boolean {
  if (cells[cellIndex] !== null) return false;
  const simulated = [...cells];
  simulated[cellIndex] = player;

  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (simulated[a] === player && simulated[b] === player && simulated[c] === player) {
      return true;
    }
  }
  return false;
}
