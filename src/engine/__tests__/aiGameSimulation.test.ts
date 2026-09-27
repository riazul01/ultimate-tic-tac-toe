import { describe, it, expect } from 'vitest';
import { AIAgent } from '../ai/aiAgent';
import { applyMove, createInitialGameState, getLegalMoves, isValidMove } from '../game/gameRules';
import type { AIDifficulty, Player } from '../game/types';

describe('End-to-End AI Game Simulation', () => {
  const difficulties: AIDifficulty[] = ['easy', 'medium', 'hard'];

  for (const diff of difficulties) {
    it(
      `plays complete simulated games at ${diff} difficulty without illegal moves`,
      () => {
        const agent = new AIAgent();
        let state = createInitialGameState('X');
        let moveCount = 0;
        const maxMoves = 81;

        while (state.gameStatus === 'playing' && moveCount < maxMoves) {
          const legalMoves = getLegalMoves(state);
          expect(legalMoves.length).toBeGreaterThan(0);

          const { move } = agent.computeMove(state, diff);
          expect(move).not.toBeNull();

          const isLegal = isValidMove(
            state,
            move!.boardIndex,
            move!.cellIndex,
            state.currentPlayer
          );
          expect(isLegal).toBe(true);

          if (state.activeBoard !== null) {
            expect(move!.boardIndex).toBe(state.activeBoard);
          }

          const prevPlayer: Player = state.currentPlayer;
          state = applyMove(state, move!.boardIndex, move!.cellIndex);
          moveCount++;

          if (state.gameStatus === 'playing') {
            expect(state.currentPlayer).not.toBe(prevPlayer);
          }
        }

        expect(state.gameStatus).toBe('finished');
        expect(state.winner).not.toBeNull();
      },
      15000
    );
  }

  it(
    'expert AI produces valid moves on initial and mid-game states',
    () => {
      const expertAgent = new AIAgent();
      let state = createInitialGameState('X');

      // Make 6 opening moves and verify expert selects strictly legal moves each time
      for (let i = 0; i < 6; i++) {
        const { move } = expertAgent.computeMove(state, 'expert');
        expect(move).not.toBeNull();
        expect(isValidMove(state, move!.boardIndex, move!.cellIndex, state.currentPlayer)).toBe(true);
        state = applyMove(state, move!.boardIndex, move!.cellIndex);
      }

      expect(state.history.length).toBe(6);
    },
    15000
  );
});
