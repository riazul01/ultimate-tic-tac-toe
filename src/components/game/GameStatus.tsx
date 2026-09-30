import React from "react";
import type { AIDifficulty, GameState, Player } from "engine/game/types";

interface GameStatusProps {
  gameState: GameState;
  humanSymbol: Player;
  difficulty: AIDifficulty;
  isAiThinking: boolean;
}

const BOARD_NAMES = [
  "Top-Left",
  "Top-Center",
  "Top-Right",
  "Mid-Left",
  "Center",
  "Mid-Right",
  "Bot-Left",
  "Bot-Center",
  "Bot-Right",
];

export const GameStatus: React.FC<GameStatusProps> = ({
  gameState,
  humanSymbol,
  isAiThinking,
}) => {
  const { currentPlayer, activeBoard, gameStatus, winner } = gameState;
  const isHumanTurn = currentPlayer === humanSymbol;

  const getStatusText = () => {
    if (gameStatus === "finished") {
      if (winner === "draw") return "Match ended in a draw";
      if (winner === humanSymbol) return "Victory! You won the game!";
      return "AI Agent won the match";
    }
    if (isAiThinking) {
      return "AI is calculating move...";
    }
    if (activeBoard === null) {
      return "Free Move: Any open board";
    }
    return `Destination: ${BOARD_NAMES[activeBoard]} Board`;
  };

  return (
    <div className="flex items-center justify-between gap-2 pb-0.5 text-xs">
      {/* Turn Indicator Badge */}
      <div className="flex items-center space-x-2">
        <div
          className={`px-2.5 py-1 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            currentPlayer === "X"
              ? "bg-sky-500/15 border-sky-500 text-sky-300"
              : "bg-rose-500/15 border-rose-500 text-rose-300"
          }`}
        >
          {currentPlayer === "X" ? (
            <svg
              className="w-3.5 h-3.5 text-sky-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5 text-rose-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="8" />
            </svg>
          )}
          <span>{isHumanTurn ? "Your Turn" : "AI Turn"}</span>
        </div>

        {isAiThinking && (
          <div className="flex items-center space-x-1 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse [animation-delay:300ms]" />
          </div>
        )}
      </div>

      {/* Destination Board Guidance */}
      <div className="text-right">
        <span className="font-medium text-slate-300 text-[11.5px] truncate block">
          {getStatusText()}
        </span>
      </div>
    </div>
  );
};
