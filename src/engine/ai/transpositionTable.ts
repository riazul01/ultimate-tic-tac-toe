import type { GameState, Move } from "engine/game/types";

export const HashFlag = {
  EXACT: 0,
  LOWERBOUND: 1,
  UPPERBOUND: 2,
} as const;

export type HashFlagType = (typeof HashFlag)[keyof typeof HashFlag];

export interface TTEntry {
  key: string;
  depth: number;
  score: number;
  flag: HashFlagType;
  bestMove: Move | null;
}

/**
 * Generates a fast string key representation of the GameState.
 */
export function getGameStateKey(state: GameState): string {
  let key = `${state.currentPlayer}:${state.activeBoard ?? "any"}:`;
  for (let b = 0; b < 9; b++) {
    for (let c = 0; c < 9; c++) {
      const val = state.boards[b][c];
      key += val === null ? "." : val;
    }
    key += ",";
  }
  return key;
}

export class TranspositionTable {
  private table: Map<string, TTEntry>;
  private readonly maxSize: number;

  constructor(maxSize: number = 200000) {
    this.table = new Map();
    this.maxSize = maxSize;
  }

  public get(key: string): TTEntry | undefined {
    return this.table.get(key);
  }

  public set(
    key: string,
    depth: number,
    score: number,
    flag: HashFlagType,
    bestMove: Move | null,
  ): void {
    if (this.table.size >= this.maxSize) {
      this.table.clear();
    }
    this.table.set(key, { key, depth, score, flag, bestMove });
  }

  public clear(): void {
    this.table.clear();
  }
}
