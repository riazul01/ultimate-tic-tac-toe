import React from "react";
import type { CellValue, Player } from "engine/game/types";

interface CellProps {
  boardIndex: number;
  cellIndex: number;
  value: CellValue;
  isLegal: boolean;
  isLastMove: boolean;
  isBoardDisabled: boolean;
  currentPlayer: Player;
  isAiThinking: boolean;
  onSelect: (boardIndex: number, cellIndex: number) => void;
}

export const Cell: React.FC<CellProps> = ({
  boardIndex,
  cellIndex,
  value,
  isLegal,
  isLastMove,
  isBoardDisabled,
  currentPlayer,
  isAiThinking,
  onSelect,
}) => {
  const isClickable = isLegal && !value && !isBoardDisabled && !isAiThinking;

  const accessibleLabel = value
    ? `Board ${boardIndex + 1}, cell ${cellIndex + 1}, occupied by ${value}`
    : isClickable
      ? `Board ${boardIndex + 1}, cell ${cellIndex + 1}, available to play`
      : `Board ${boardIndex + 1}, cell ${cellIndex + 1}, unavailable`;

  return (
    <button
      type="button"
      id={`cell-${boardIndex}-${cellIndex}`}
      aria-label={accessibleLabel}
      disabled={!isClickable}
      onClick={() => isClickable && onSelect(boardIndex, cellIndex)}
      className={`
        relative aspect-square w-full flex items-center justify-center rounded-lg
        transition-all duration-150 group select-none
        ${
          value
            ? "bg-slate-800/80 cursor-default"
            : isClickable
              ? "bg-slate-800/50 hover:bg-slate-700/70 hover:scale-[1.03] cursor-pointer shadow-sm hover:shadow-indigo-500/20 active:scale-95"
              : "bg-slate-800/20 cursor-not-allowed opacity-80"
        }
        ${
          isLastMove
            ? "ring-2 ring-amber-400 shadow-md shadow-amber-500/20 z-10"
            : isClickable
              ? "border border-slate-700/60 hover:border-indigo-400/80"
              : "border border-slate-800/40"
        }
        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:z-20
      `}
    >
      {/* Played Symbol */}
      {value === "X" && (
        <svg
          className="w-3/5 h-3/5 text-sky-400 animate-victory-pop drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}

      {value === "O" && (
        <svg
          className="w-3/5 h-3/5 text-rose-400 animate-victory-pop drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="8" />
        </svg>
      )}

      {/* Dead-centered Ghost Preview on Hover */}
      {!value && isClickable && (
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-40 transition-opacity duration-150 pointer-events-none">
          {currentPlayer === "X" ? (
            <svg
              className="w-3/5 h-3/5 text-sky-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              className="w-3/5 h-3/5 text-rose-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="8" />
            </svg>
          )}
        </span>
      )}

      {/* Last move indicator badge */}
      {isLastMove && (
        <span
          className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400"
          aria-hidden="true"
        />
      )}
    </button>
  );
};
