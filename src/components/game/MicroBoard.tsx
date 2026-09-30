import React from "react";
import type {
  CellValue,
  MicroBoardStatus,
  Move,
  Player,
  WinningLine,
} from "engine/game/types";
import { Cell } from "./Cell";

interface MicroBoardProps {
  boardIndex: number;
  cells: CellValue[];
  status: MicroBoardStatus;
  winningLine: WinningLine | null;
  isActive: boolean;
  currentPlayer: Player;
  isAiThinking: boolean;
  lastMove: Move | null;
  onCellClick: (boardIndex: number, cellIndex: number) => void;
}

const BOARD_NAMES = [
  "Top-Left",
  "Top-Center",
  "Top-Right",
  "Middle-Left",
  "Center",
  "Middle-Right",
  "Bottom-Left",
  "Bottom-Center",
  "Bottom-Right",
];

export const MicroBoard: React.FC<MicroBoardProps> = ({
  boardIndex,
  cells,
  status,
  winningLine,
  isActive,
  currentPlayer,
  isAiThinking,
  lastMove,
  onCellClick,
}) => {
  const isCompleted = status !== "playing";

  const renderWinningStrike = () => {
    if (!winningLine) return null;
    const [a, , c] = winningLine;

    const getPos = (idx: number) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      return { x: col * 33.33 + 16.66, y: row * 33.33 + 16.66 };
    };

    const start = getPos(a);
    const end = getPos(c);

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        viewBox="0 0 100 100"
      >
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={status === "X" ? "#38bdf8" : "#f43f5e"}
          strokeWidth="6"
          strokeLinecap="round"
          className="winning-strike-line drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        />
      </svg>
    );
  };

  return (
    <div
      id={`board-${boardIndex}`}
      aria-label={`Micro-board ${boardIndex + 1} (${BOARD_NAMES[boardIndex]}): ${status}`}
      className={`
        relative p-1.5 sm:p-2 rounded-xl transition-all duration-300 flex flex-col justify-center overflow-hidden
        ${
          isActive && !isCompleted
            ? "bg-indigo-950/50 border-2 border-indigo-400 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500/40"
            : isCompleted
              ? "bg-slate-900/40 border border-slate-800/80 opacity-90"
              : "bg-slate-900/60 border border-slate-800"
        }
      `}
    >
      {/* 3x3 Grid of Cells */}
      <div className="grid grid-cols-3 gap-1 sm:gap-1.5 relative w-full">
        {cells.map((val, cellIdx) => {
          const isCellLastMove =
            lastMove?.boardIndex === boardIndex &&
            lastMove?.cellIndex === cellIdx;
          const isLegal = isActive && !isCompleted && val === null;

          return (
            <Cell
              key={cellIdx}
              boardIndex={boardIndex}
              cellIndex={cellIdx}
              value={val}
              isLegal={isLegal}
              isLastMove={isCellLastMove}
              isBoardDisabled={isCompleted}
              currentPlayer={currentPlayer}
              isAiThinking={isAiThinking}
              onSelect={onCellClick}
            />
          );
        })}

        {renderWinningStrike()}

        {/* Won Overlay Banner */}
        {isCompleted && (
          <div
            className={`
              absolute inset-0 rounded-lg flex items-center justify-center z-10 backdrop-blur-[2px] animate-victory-pop
              ${
                status === "X"
                  ? "bg-sky-950/75 text-sky-400 border-2 border-sky-400/60"
                  : status === "O"
                    ? "bg-rose-950/75 text-rose-400 border-2 border-rose-400/60"
                    : "bg-slate-900/85 text-slate-400 border border-slate-700/50"
              }
            `}
          >
            {status === "X" && (
              <svg
                className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              </svg>
            )}
            {status === "O" && (
              <svg
                className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <circle cx="12" cy="12" r="8" strokeLinecap="round" />
              </svg>
            )}
            {status === "draw" && (
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-800 rounded border border-slate-700">
                Draw
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
