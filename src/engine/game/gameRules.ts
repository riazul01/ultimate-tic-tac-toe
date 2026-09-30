import type { GameState, Move, Player, MicroBoardStatus } from "./types";
import { evaluateMicroBoard, evaluateMacroBoard } from "./winDetection";

/**
 * Determine if a micro-board is still open for moves.
 * A board is open if its status is 'playing' and has at least one empty cell.
 */
export function isBoardPlayable(status: MicroBoardStatus): boolean {
  return status === "playing";
}

/**
 * Determine which micro-board the next player must play in.
 * If the target board is won or full (not 'playing'), the player can play in any playable board (activeBoard = null).
 */
export function getNextActiveBoard(
  targetBoardIndex: number,
  boardStatuses: MicroBoardStatus[],
): number | null {
  if (isBoardPlayable(boardStatuses[targetBoardIndex])) {
    return targetBoardIndex;
  }
  return null; // Unrestricted move state (any playable board)
}

/**
 * Checks if a specific move is legal given the current GameState.
 */
export function isValidMove(
  state: GameState,
  boardIndex: number,
  cellIndex: number,
  player?: Player,
): boolean {
  // 1. Game must be in playing state
  if (state.gameStatus !== "playing" || state.winner !== null) {
    return false;
  }

  // 2. Validate player turn if player is provided
  if (player && player !== state.currentPlayer) {
    return false;
  }

  // 3. Validate indices
  if (boardIndex < 0 || boardIndex > 8 || cellIndex < 0 || cellIndex > 8) {
    return false;
  }

  // 4. If an activeBoard is enforced, move must be in that board
  if (state.activeBoard !== null && state.activeBoard !== boardIndex) {
    return false;
  }

  // 5. The micro-board must still be in 'playing' status
  if (!isBoardPlayable(state.boardStatuses[boardIndex])) {
    return false;
  }

  // 6. The target cell must be empty
  if (state.boards[boardIndex][cellIndex] !== null) {
    return false;
  }

  return true;
}

/**
 * Generates all legal moves for the current player in the given GameState.
 */
export function getLegalMoves(state: GameState): Move[] {
  if (state.gameStatus !== "playing" || state.winner !== null) {
    return [];
  }

  const moves: Move[] = [];
  const player = state.currentPlayer;

  // If a specific board is active, only search that board
  if (state.activeBoard !== null) {
    const boardIdx = state.activeBoard;
    if (isBoardPlayable(state.boardStatuses[boardIdx])) {
      const boardCells = state.boards[boardIdx];
      for (let cellIdx = 0; cellIdx < 9; cellIdx++) {
        if (boardCells[cellIdx] === null) {
          moves.push({ boardIndex: boardIdx, cellIndex: cellIdx, player });
        }
      }
    }
    return moves;
  }

  // Unrestricted: can play in any playable micro-board
  for (let boardIdx = 0; boardIdx < 9; boardIdx++) {
    if (isBoardPlayable(state.boardStatuses[boardIdx])) {
      const boardCells = state.boards[boardIdx];
      for (let cellIdx = 0; cellIdx < 9; cellIdx++) {
        if (boardCells[cellIdx] === null) {
          moves.push({ boardIndex: boardIdx, cellIndex: cellIdx, player });
        }
      }
    }
  }

  return moves;
}

/**
 * Creates a fresh, initial GameState
 */
export function createInitialGameState(firstPlayer: Player = "X"): GameState {
  const boards = Array.from({ length: 9 }, () => Array(9).fill(null));
  const boardStatuses = Array<MicroBoardStatus>(9).fill("playing");
  const microWinningLines = Array(9).fill(null);

  return {
    boards,
    boardStatuses,
    microWinningLines,
    currentPlayer: firstPlayer,
    activeBoard: null,
    winner: null,
    macroWinningLine: null,
    gameStatus: "playing",
    history: [],
    redoStack: [],
  };
}

/**
 * Applies a move to the game state and returns a new updated GameState (immutable).
 * Throws an error if the move is illegal.
 */
export function applyMove(
  state: GameState,
  boardIndex: number,
  cellIndex: number,
): GameState {
  if (!isValidMove(state, boardIndex, cellIndex)) {
    throw new Error(
      `Illegal move: board=${boardIndex}, cell=${cellIndex}, player=${state.currentPlayer}`,
    );
  }

  const player = state.currentPlayer;

  // Clone boards
  const newBoards = state.boards.map((b, idx) =>
    idx === boardIndex ? [...b] : b,
  );
  newBoards[boardIndex][cellIndex] = player;

  // Clone statuses and winning lines
  const newBoardStatuses = [...state.boardStatuses];
  const newMicroWinningLines = [...state.microWinningLines];

  // Evaluate the micro-board that was just played in
  const microResult = evaluateMicroBoard(newBoards[boardIndex]);
  const prevBoardStatus = state.boardStatuses[boardIndex];
  const prevMicroWinningLine = state.microWinningLines[boardIndex];

  if (microResult.status !== prevBoardStatus) {
    newBoardStatuses[boardIndex] = microResult.status;
    newMicroWinningLines[boardIndex] = microResult.line;
  }

  // Evaluate the macro board
  const macroResult = evaluateMacroBoard(newBoardStatuses);
  const isGameOver = macroResult.winner !== null;

  // Determine next active board
  const nextActiveBoard = isGameOver
    ? null
    : getNextActiveBoard(cellIndex, newBoardStatuses);

  const nextPlayer: Player = player === "X" ? "O" : "X";

  const historyItem = {
    move: { boardIndex, cellIndex, player },
    previousActiveBoard: state.activeBoard,
    previousBoardStatus: prevBoardStatus,
    previousMicroWinningLine: prevMicroWinningLine,
    previousWinner: state.winner,
    previousMacroWinningLine: state.macroWinningLine,
    timestamp: Date.now(),
  };

  return {
    boards: newBoards,
    boardStatuses: newBoardStatuses,
    microWinningLines: newMicroWinningLines,
    currentPlayer: isGameOver ? player : nextPlayer,
    activeBoard: nextActiveBoard,
    winner: macroResult.winner,
    macroWinningLine: macroResult.line,
    gameStatus: isGameOver ? "finished" : "playing",
    history: [...state.history, historyItem],
    redoStack: [],
  };
}

/**
 * Undo a single move or a pair of moves.
 */
export function undoMove(state: GameState, steps: number = 1): GameState {
  if (state.history.length === 0 || steps <= 0) {
    return state;
  }

  let currentState = state;
  const actualSteps = Math.min(steps, currentState.history.length);

  for (let i = actualSteps - 1; i >= 0; i--) {
    const lastHistory = currentState.history[currentState.history.length - 1];
    const { move } = lastHistory;

    const newBoards = currentState.boards.map((b, idx) =>
      idx === move.boardIndex ? [...b] : b,
    );
    newBoards[move.boardIndex][move.cellIndex] = null;

    const newBoardStatuses = [...currentState.boardStatuses];
    newBoardStatuses[move.boardIndex] = lastHistory.previousBoardStatus;

    const newMicroWinningLines = [...currentState.microWinningLines];
    newMicroWinningLines[move.boardIndex] =
      lastHistory.previousMicroWinningLine;

    const newHistory = currentState.history.slice(0, -1);

    currentState = {
      boards: newBoards,
      boardStatuses: newBoardStatuses,
      microWinningLines: newMicroWinningLines,
      currentPlayer: move.player,
      activeBoard: lastHistory.previousActiveBoard,
      winner: lastHistory.previousWinner,
      macroWinningLine: lastHistory.previousMacroWinningLine,
      gameStatus: "playing",
      history: newHistory,
      redoStack: [lastHistory, ...currentState.redoStack],
    };
  }

  return currentState;
}

/**
 * Redo a previously undone move or pair of moves.
 */
export function redoMove(state: GameState, steps: number = 1): GameState {
  if (state.redoStack.length === 0 || steps <= 0) {
    return state;
  }

  let currentState = state;
  const actualSteps = Math.min(steps, currentState.redoStack.length);

  for (let i = 0; i < actualSteps; i++) {
    const itemToRedo = currentState.redoStack[0];
    const nextRedoStack = currentState.redoStack.slice(1);

    const afterMove = applyMove(
      currentState,
      itemToRedo.move.boardIndex,
      itemToRedo.move.cellIndex,
    );

    currentState = {
      ...afterMove,
      redoStack: nextRedoStack,
    };
  }

  return currentState;
}
