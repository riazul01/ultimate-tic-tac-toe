import type { AIDifficulty, GameState, Move, Player } from '../game/types';
import { getLegalMoves } from '../game/gameRules';
import { isMicroWinningMove } from './evaluation';
import type { SearchOptions } from './minimax';

export interface DifficultyConfig {
  searchOptions: SearchOptions;
  blunderRate: number;
  tacticalAwareness: number;
  minThinkingTimeMs: number;
  maxThinkingTimeMs: number;
}

export const DIFFICULTY_CONFIGS: Record<AIDifficulty, DifficultyConfig> = {
  easy: {
    searchOptions: { maxDepth: 1, timeLimitMs: 150, useTranspositionTable: false },
    blunderRate: 0.35,
    tacticalAwareness: 0.65,
    minThinkingTimeMs: 300,
    maxThinkingTimeMs: 500,
  },
  medium: {
    searchOptions: { maxDepth: 3, timeLimitMs: 300, useTranspositionTable: true },
    blunderRate: 0.12,
    tacticalAwareness: 0.95,
    minThinkingTimeMs: 400,
    maxThinkingTimeMs: 650,
  },
  hard: {
    searchOptions: { maxDepth: 5, timeLimitMs: 600, useTranspositionTable: true },
    blunderRate: 0.0,
    tacticalAwareness: 1.0,
    minThinkingTimeMs: 450,
    maxThinkingTimeMs: 750,
  },
  expert: {
    searchOptions: { maxDepth: 7, timeLimitMs: 900, useTranspositionTable: true },
    blunderRate: 0.0,
    tacticalAwareness: 1.0,
    minThinkingTimeMs: 500,
    maxThinkingTimeMs: 850,
  },
};

/**
 * Checks for immediate tactical moves
 */
export function findImmediateTacticalMove(
  state: GameState,
  player: Player
): { winMove: Move | null; blockMove: Move | null } {
  const opponent: Player = player === 'X' ? 'O' : 'X';
  const legalMoves = getLegalMoves(state);

  let winMove: Move | null = null;
  let blockMove: Move | null = null;

  for (const move of legalMoves) {
    const microCells = state.boards[move.boardIndex];
    if (isMicroWinningMove(microCells, move.cellIndex, player)) {
      winMove = move;
      break;
    }
    if (!blockMove && isMicroWinningMove(microCells, move.cellIndex, opponent)) {
      blockMove = move;
    }
  }

  return { winMove, blockMove };
}
