import type { GameState, Move, Player, AISearchStats } from '../game/types';
import { applyMove, getLegalMoves } from '../game/gameRules';
import { evaluateBoard, isMicroWinningMove, MACRO_BOARD_WEIGHTS, POSITION_WEIGHTS } from './evaluation';
import { HashFlag, type HashFlagType, TranspositionTable, getGameStateKey } from './transpositionTable';

const INF = 9999999;

export interface SearchOptions {
  maxDepth: number;
  timeLimitMs?: number;
  useTranspositionTable?: boolean;
}

export class MinimaxSearcher {
  private tt: TranspositionTable;
  private nodesEvaluated: number = 0;
  private startTime: number = 0;
  private timeLimitMs: number = 0;
  private isAborted: boolean = false;

  constructor() {
    this.tt = new TranspositionTable();
  }

  public clearTT(): void {
    this.tt.clear();
  }

  /**
   * Order moves to improve alpha-beta pruning efficiency.
   */
  private orderMoves(
    moves: Move[],
    state: GameState,
    player: Player,
    ttBestMove: Move | null
  ): Move[] {
    const opponent: Player = player === 'X' ? 'O' : 'X';

    const scoredMoves = moves.map((move) => {
      let score = 0;

      // 1. Prioritize hash move from Transposition Table
      if (
        ttBestMove &&
        ttBestMove.boardIndex === move.boardIndex &&
        ttBestMove.cellIndex === move.cellIndex
      ) {
        score += 1000000;
      }

      const microCells = state.boards[move.boardIndex];

      // 2. Immediate micro-board win
      if (isMicroWinningMove(microCells, move.cellIndex, player)) {
        score += 50000;
      }

      // 3. Blocking opponent's immediate micro-board win
      if (isMicroWinningMove(microCells, move.cellIndex, opponent)) {
        score += 30000;
      }

      // 4. Prefer moves in center macro board and center micro cell
      score += MACRO_BOARD_WEIGHTS[move.boardIndex] * 10;
      score += POSITION_WEIGHTS[move.cellIndex] * 5;

      // 5. Penalize sending opponent to free choice
      const destStatus = state.boardStatuses[move.cellIndex];
      if (destStatus !== 'playing') {
        score -= 200;
      }

      return { move, score };
    });

    scoredMoves.sort((a, b) => b.score - a.score);
    return scoredMoves.map((sm) => sm.move);
  }

  /**
   * Alpha-Beta Search recursive function
   */
  private alphaBeta(
    state: GameState,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: Player,
    useTT: boolean
  ): { score: number; bestMove: Move | null } {
    this.nodesEvaluated++;

    if ((this.nodesEvaluated & 255) === 0) {
      if (this.timeLimitMs > 0 && Date.now() - this.startTime > this.timeLimitMs) {
        this.isAborted = true;
      }
    }

    if (this.isAborted) {
      return { score: evaluateBoard(state, maximizingPlayer), bestMove: null };
    }

    if (state.gameStatus === 'finished') {
      return { score: evaluateBoard(state, maximizingPlayer), bestMove: null };
    }

    if (depth <= 0) {
      return { score: evaluateBoard(state, maximizingPlayer), bestMove: null };
    }

    const stateKey = useTT ? getGameStateKey(state) : '';
    let ttBestMove: Move | null = null;

    if (useTT) {
      const entry = this.tt.get(stateKey);
      if (entry && entry.depth >= depth) {
        if (entry.flag === HashFlag.EXACT) {
          return { score: entry.score, bestMove: entry.bestMove };
        } else if (entry.flag === HashFlag.LOWERBOUND && entry.score > alpha) {
          alpha = entry.score;
        } else if (entry.flag === HashFlag.UPPERBOUND && entry.score < beta) {
          beta = entry.score;
        }
        if (alpha >= beta) {
          return { score: entry.score, bestMove: entry.bestMove };
        }
        ttBestMove = entry.bestMove;
      }
    }

    const legalMoves = getLegalMoves(state);
    if (legalMoves.length === 0) {
      return { score: evaluateBoard(state, maximizingPlayer), bestMove: null };
    }

    const isMaximizing = state.currentPlayer === maximizingPlayer;
    const orderedMoves = this.orderMoves(
      legalMoves,
      state,
      state.currentPlayer,
      ttBestMove
    );

    let bestMove: Move | null = orderedMoves[0];
    let bestScore = isMaximizing ? -INF : INF;
    const originalAlpha = alpha;

    for (let i = 0; i < orderedMoves.length; i++) {
      const move = orderedMoves[i];
      const nextState = applyMove(state, move.boardIndex, move.cellIndex);

      const result = this.alphaBeta(
        nextState,
        depth - 1,
        alpha,
        beta,
        maximizingPlayer,
        useTT
      );

      if (this.isAborted) {
        break;
      }

      if (isMaximizing) {
        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, bestScore);
      } else {
        if (result.score < bestScore) {
          bestScore = result.score;
          bestMove = move;
        }
        beta = Math.min(beta, bestScore);
      }

      if (alpha >= beta) {
        break;
      }
    }

    if (useTT && !this.isAborted) {
      let flag: HashFlagType = HashFlag.EXACT;
      if (bestScore <= originalAlpha) {
        flag = HashFlag.UPPERBOUND;
      } else if (bestScore >= beta) {
        flag = HashFlag.LOWERBOUND;
      }
      this.tt.set(stateKey, depth, bestScore, flag, bestMove);
    }

    return { score: bestScore, bestMove };
  }

  /**
   * Search for the best move using Iterative Deepening
   */
  public searchBestMove(
    state: GameState,
    options: SearchOptions
  ): { move: Move | null; stats: AISearchStats } {
    this.nodesEvaluated = 0;
    this.startTime = Date.now();
    this.timeLimitMs = options.timeLimitMs ?? 0;
    this.isAborted = false;

    const maximizingPlayer = state.currentPlayer;
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

    if (legalMoves.length === 1) {
      return {
        move: legalMoves[0],
        stats: {
          nodesEvaluated: 1,
          depthReached: 1,
          score: 0,
          timeMs: 0,
          bestMove: legalMoves[0],
        },
      };
    }

    let overallBestMove: Move | null = legalMoves[0];
    let overallBestScore = 0;
    let depthReached = 0;
    const useTT = options.useTranspositionTable ?? true;

    // Iterative Deepening
    for (let depth = 1; depth <= options.maxDepth; depth++) {
      const result = this.alphaBeta(
        state,
        depth,
        -INF,
        INF,
        maximizingPlayer,
        useTT
      );

      if (!this.isAborted && result.bestMove !== null) {
        overallBestMove = result.bestMove;
        overallBestScore = result.score;
        depthReached = depth;
      }

      if (this.isAborted) {
        break;
      }

      if (overallBestScore >= 90000 || overallBestScore <= -90000) {
        break;
      }
    }

    const elapsed = Date.now() - this.startTime;

    return {
      move: overallBestMove,
      stats: {
        nodesEvaluated: this.nodesEvaluated,
        depthReached,
        score: overallBestScore,
        timeMs: elapsed,
        bestMove: overallBestMove,
      },
    };
  }
}
