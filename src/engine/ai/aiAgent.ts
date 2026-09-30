import type {
  AIDifficulty,
  GameState,
  Move,
  AISearchStats,
} from "engine/game/types";
import { getLegalMoves } from "engine/game/gameRules";
import { DIFFICULTY_CONFIGS, findImmediateTacticalMove } from "./difficulty";
import { MinimaxSearcher } from "./minimax";

export class AIAgent {
  private searcher: MinimaxSearcher;

  constructor() {
    this.searcher = new MinimaxSearcher();
  }

  public reset(): void {
    this.searcher.clearTT();
  }

  /**
   * Chooses the best move for current player according to difficulty level.
   */
  public computeMove(
    state: GameState,
    difficulty: AIDifficulty,
  ): { move: Move | null; stats: AISearchStats } {
    const legalMoves = getLegalMoves(state);
    if (legalMoves.length === 0) {
      return {
        move: null,
        stats: {
          nodesEvaluated: 0,
          depthReached: 0,
          score: 0,
          timeMs: 0,
          bestMove: null,
        },
      };
    }

    const config = DIFFICULTY_CONFIGS[difficulty];
    const player = state.currentPlayer;

    // Check immediate tactical win/block based on tactical awareness
    if (Math.random() < config.tacticalAwareness) {
      const { winMove, blockMove } = findImmediateTacticalMove(state, player);
      if (winMove) {
        return {
          move: winMove,
          stats: {
            nodesEvaluated: 1,
            depthReached: 1,
            score: 50000,
            timeMs: 2,
            bestMove: winMove,
          },
        };
      }
      if (blockMove) {
        return {
          move: blockMove,
          stats: {
            nodesEvaluated: 1,
            depthReached: 1,
            score: 30000,
            timeMs: 2,
            bestMove: blockMove,
          },
        };
      }
    }

    // Run Minimax search
    const searchResult = this.searcher.searchBestMove(
      state,
      config.searchOptions,
    );

    // Blunder chance for easier difficulties
    if (config.blunderRate > 0 && Math.random() < config.blunderRate) {
      const randomMove =
        legalMoves[Math.floor(Math.random() * legalMoves.length)];
      return {
        move: randomMove,
        stats: {
          ...searchResult.stats,
          bestMove: randomMove,
        },
      };
    }

    return {
      move: searchResult.move ?? legalMoves[0],
      stats: searchResult.stats,
    };
  }
}
