export type Player = "X" | "O";

export type CellValue = Player | null;

export type MicroBoardStatus = "playing" | "X" | "O" | "draw";

export type WinningLine = [number, number, number];

export interface Move {
  boardIndex: number; // 0 to 8 (macro board index)
  cellIndex: number; // 0 to 8 (micro board cell index)
  player: Player;
}

export interface GameState {
  // 9 micro-boards, each with 9 cells (81 cells total)
  boards: CellValue[][];
  // Status of each of the 9 micro-boards ('playing', 'X', 'O', 'draw')
  boardStatuses: MicroBoardStatus[];
  // Winning lines for each micro-board if won (null if not won)
  microWinningLines: (WinningLine | null)[];
  // Current player turn
  currentPlayer: Player;
  // Active micro-board index (0-8) or null if player can play anywhere
  activeBoard: number | null;
  // Game winner: 'X', 'O', 'draw', or null if still playing
  winner: Player | "draw" | null;
  // Macro winning line if game is won
  macroWinningLine: WinningLine | null;
  // Status: 'playing' or 'finished'
  gameStatus: "playing" | "finished";
  // Move history for undo/redo and log
  history: GameHistoryItem[];
  // Redo stack
  redoStack: GameHistoryItem[];
}

export interface GameHistoryItem {
  move: Move;
  previousActiveBoard: number | null;
  previousBoardStatus: MicroBoardStatus;
  previousMicroWinningLine: WinningLine | null;
  previousWinner: Player | "draw" | null;
  previousMacroWinningLine: WinningLine | null;
  timestamp: number;
}

export type AIDifficulty = "easy" | "medium" | "hard" | "expert";

export interface AISearchStats {
  nodesEvaluated: number;
  depthReached: number;
  score: number;
  timeMs: number;
  bestMove: Move | null;
  principalVariation?: Move[];
}

export interface GameStats {
  gamesPlayed: number;
  humanWins: number;
  aiWins: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
}

export interface GameSettings {
  difficulty: AIDifficulty;
  humanSymbol: Player;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  debugMode: boolean;
  theme: "dark" | "light" | "system";
}
