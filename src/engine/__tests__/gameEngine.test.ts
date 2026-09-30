import { describe, it, expect } from "vitest";
import {
  evaluateMicroBoard,
  evaluateMacroBoard,
} from "engine/game/winDetection";
import {
  createInitialGameState,
  applyMove,
  isValidMove,
  getLegalMoves,
  undoMove,
  redoMove,
} from "engine/game/gameRules";
import { AIAgent } from "engine/ai/aiAgent";
import type { Player } from "engine/game/types";

describe("Win Detection", () => {
  describe("Micro Board Evaluation", () => {
    it("detects horizontal win (row 0, 1, 2)", () => {
      const cells = [
        "X",
        "X",
        "X",
        null,
        "O",
        null,
        "O",
        null,
        null,
      ] as (Player | null)[];
      const result = evaluateMicroBoard(cells);
      expect(result.status).toBe("X");
      expect(result.line).toEqual([0, 1, 2]);
    });

    it("detects vertical win (col 1, 4, 7)", () => {
      const cells = [
        "X",
        "O",
        null,
        "X",
        "O",
        null,
        null,
        "O",
        "X",
      ] as (Player | null)[];
      const result = evaluateMicroBoard(cells);
      expect(result.status).toBe("O");
      expect(result.line).toEqual([1, 4, 7]);
    });

    it("detects diagonal win (0, 4, 8)", () => {
      const cells = [
        "X",
        "O",
        null,
        "O",
        "X",
        null,
        null,
        null,
        "X",
      ] as (Player | null)[];
      const result = evaluateMicroBoard(cells);
      expect(result.status).toBe("X");
      expect(result.line).toEqual([0, 4, 8]);
    });

    it("detects anti-diagonal win (2, 4, 6)", () => {
      const cells = [
        null,
        "X",
        "O",
        "X",
        "O",
        null,
        "O",
        null,
        "X",
      ] as (Player | null)[];
      const result = evaluateMicroBoard(cells);
      expect(result.status).toBe("O");
      expect(result.line).toEqual([2, 4, 6]);
    });

    it("detects draw when micro-board is full and no winner", () => {
      const cells = [
        "X",
        "O",
        "X",
        "X",
        "O",
        "O",
        "O",
        "X",
        "X",
      ] as (Player | null)[];
      const result = evaluateMicroBoard(cells);
      expect(result.status).toBe("draw");
      expect(result.line).toBeNull();
    });

    it("detects incomplete playing state", () => {
      const cells = [
        "X",
        "O",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ] as (Player | null)[];
      const result = evaluateMicroBoard(cells);
      expect(result.status).toBe("playing");
      expect(result.line).toBeNull();
    });
  });

  describe("Macro Board Evaluation", () => {
    it("detects macro horizontal win", () => {
      const statuses = [
        "X",
        "X",
        "X",
        "O",
        "playing",
        "O",
        "playing",
        "playing",
        "playing",
      ] as any;
      const result = evaluateMacroBoard(statuses);
      expect(result.winner).toBe("X");
      expect(result.line).toEqual([0, 1, 2]);
    });

    it("detects macro vertical win", () => {
      const statuses = [
        "O",
        "X",
        "playing",
        "O",
        "X",
        "playing",
        "O",
        "playing",
        "playing",
      ] as any;
      const result = evaluateMacroBoard(statuses);
      expect(result.winner).toBe("O");
      expect(result.line).toEqual([0, 3, 6]);
    });

    it("detects macro diagonal win", () => {
      const statuses = [
        "X",
        "O",
        "playing",
        "O",
        "X",
        "playing",
        "playing",
        "playing",
        "X",
      ] as any;
      const result = evaluateMacroBoard(statuses);
      expect(result.winner).toBe("X");
      expect(result.line).toEqual([0, 4, 8]);
    });

    it("detects macro draw when all 9 boards are finished without 3-in-a-row", () => {
      const statuses = ["X", "O", "X", "X", "O", "O", "O", "X", "X"] as any;
      const result = evaluateMacroBoard(statuses);
      expect(result.winner).toBe("draw");
    });

    it("detects macro draw when no winning lines remain possible", () => {
      // Board layout where no row, col, or diagonal can be achieved by either player
      const statuses = ["X", "O", "X", "O", "X", "O", "O", "X", "draw"] as any;
      const result = evaluateMacroBoard(statuses);
      expect(result.winner).toBe("draw");
    });
  });
});

describe("Game Rules & State Transitions", () => {
  it("starts in clean state with 81 empty cells and unrestricted activeBoard", () => {
    const state = createInitialGameState("X");
    expect(state.currentPlayer).toBe("X");
    expect(state.activeBoard).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.gameStatus).toBe("playing");
    expect(getLegalMoves(state).length).toBe(81);
  });

  it("correctly updates activeBoard to cellIndex after a move", () => {
    const state = createInitialGameState("X");
    // X plays in board 4 (center), cell 2 (top-right)
    const nextState = applyMove(state, 4, 2);

    expect(nextState.currentPlayer).toBe("O");
    expect(nextState.activeBoard).toBe(2);
    expect(nextState.boards[4][2]).toBe("X");

    // O must now play in board 2
    const legalMoves = getLegalMoves(nextState);
    expect(legalMoves.length).toBe(9);
    expect(legalMoves.every((m) => m.boardIndex === 2)).toBe(true);
  });

  it("handles forced-board exception: if target board is already won, next player has free choice", () => {
    let state = createInitialGameState("X");

    // Simulate winning board 3 for X:
    // Move 1: X plays (3, 0) -> sends O to 0
    state = applyMove(state, 3, 0);
    // Move 2: O plays (0, 3) -> sends X to 3
    state = applyMove(state, 0, 3);
    // Move 3: X plays (3, 1) -> sends O to 1
    state = applyMove(state, 3, 1);
    // Move 4: O plays (1, 3) -> sends X to 3
    state = applyMove(state, 1, 3);
    // Move 5: X plays (3, 2) -> wins board 3! And sends O to board 2
    state = applyMove(state, 3, 2);

    expect(state.boardStatuses[3]).toBe("X");
    expect(state.activeBoard).toBe(2);

    // Now O plays (2, 3) -> sends X to board 3 (which is WON!)
    state = applyMove(state, 2, 3);

    // X should now have unrestricted choice (activeBoard === null) because board 3 is won!
    expect(state.activeBoard).toBeNull();
    const legalMoves = getLegalMoves(state);
    // All playable boards excluding board 3 (which has 3 cells used, but won so 0 playable)
    // Board 0 has 8 open, board 1 has 8 open, board 2 has 8 open, boards 4-8 have 9 open = 8*3 + 5*9 = 24 + 45 = 69
    expect(legalMoves.some((m) => m.boardIndex === 3)).toBe(false);
    expect(legalMoves.length).toBeGreaterThan(0);
  });

  it("rejects invalid moves (occupied cell, wrong board, after game finished)", () => {
    let state = createInitialGameState("X");
    state = applyMove(state, 0, 4); // activeBoard is now 4

    // Attempt to play in occupied cell (0, 4)
    expect(isValidMove(state, 0, 4)).toBe(false);

    // Attempt to play in wrong board (board 1 instead of activeBoard 4)
    expect(isValidMove(state, 1, 0)).toBe(false);

    // Valid move in activeBoard 4
    expect(isValidMove(state, 4, 0)).toBe(true);
  });

  it("supports undo and redo functionality correctly", () => {
    let state = createInitialGameState("X");
    state = applyMove(state, 0, 4); // X move
    state = applyMove(state, 4, 8); // O move

    expect(state.history.length).toBe(2);
    expect(state.boards[0][4]).toBe("X");
    expect(state.boards[4][8]).toBe("O");

    // Undo 2 steps (returns to start)
    const undone = undoMove(state, 2);
    expect(undone.currentPlayer).toBe("X");
    expect(undone.boards[0][4]).toBeNull();
    expect(undone.boards[4][8]).toBeNull();
    expect(undone.history.length).toBe(0);
    expect(undone.redoStack.length).toBe(2);

    // Redo 1 step
    const redone = redoMove(undone, 1);
    expect(redone.currentPlayer).toBe("O");
    expect(redone.boards[0][4]).toBe("X");
    expect(redone.boards[4][8]).toBeNull();
    expect(redone.history.length).toBe(1);
    expect(redone.redoStack.length).toBe(1);
  });
});

describe("AI Agent", () => {
  const agent = new AIAgent();

  it("takes immediate micro-board winning move", () => {
    let state = createInitialGameState("X");
    // Set up board 0 with X at 0, 1
    state.boards[0][0] = "X";
    state.boards[0][1] = "X";
    state.activeBoard = 0;
    state.currentPlayer = "X";

    const { move } = agent.computeMove(state, "expert");
    expect(move).toBeDefined();
    expect(move?.boardIndex).toBe(0);
    expect(move?.cellIndex).toBe(2); // Completes row [0, 1, 2]
  });

  it("blocks immediate micro-board win for opponent", () => {
    let state = createInitialGameState("O");
    // Set up board 4 with opponent X at 0, 4
    state.boards[4][0] = "X";
    state.boards[4][4] = "X";
    state.activeBoard = 4;
    state.currentPlayer = "O";

    const { move } = agent.computeMove(state, "expert");
    expect(move).toBeDefined();
    expect(move?.boardIndex).toBe(4);
    expect(move?.cellIndex).toBe(8); // Blocks diagonal [0, 4, 8]
  });

  it("always generates legal moves across all difficulty levels", () => {
    const difficulties = ["easy", "medium", "hard", "expert"] as const;
    for (const diff of difficulties) {
      let state = createInitialGameState("X");
      state = applyMove(state, 4, 4); // X played center-center

      const { move } = agent.computeMove(state, diff);
      expect(move).not.toBeNull();
      expect(isValidMove(state, move!.boardIndex, move!.cellIndex, "O")).toBe(
        true,
      );
    }
  });

  it("never plays inside an already won or full board", () => {
    let state = createInitialGameState("O");
    state.boardStatuses[0] = "X"; // Board 0 is won
    state.activeBoard = null; // Unrestricted

    const { move } = agent.computeMove(state, "hard");
    expect(move).not.toBeNull();
    expect(move!.boardIndex).not.toBe(0);
  });
});
