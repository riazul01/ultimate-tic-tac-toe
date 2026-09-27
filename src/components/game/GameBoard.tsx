import React, { useEffect, useCallback } from 'react';
import type { GameState, Move, Player } from '../../engine/game/types';
import { isBoardPlayable } from '../../engine/game/gameRules';
import { MicroBoard } from './MicroBoard';

interface GameBoardProps {
  gameState: GameState;
  humanSymbol: Player;
  isAiThinking: boolean;
  lastMove: Move | null;
  onCellClick: (boardIndex: number, cellIndex: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  isAiThinking,
  lastMove,
  onCellClick,
}) => {
  const {
    boards,
    boardStatuses,
    microWinningLines,
    activeBoard,
    currentPlayer,
    macroWinningLine,
    winner,
  } = gameState;

  // Keyboard navigation support
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const keyNum = parseInt(e.key, 10);
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 9) {
        const cellIdx = keyNum - 1;
        if (activeBoard !== null && isBoardPlayable(boardStatuses[activeBoard])) {
          onCellClick(activeBoard, cellIdx);
        }
      }
    },
    [activeBoard, boardStatuses, onCellClick]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderMacroWinningStrike = () => {
    if (!macroWinningLine || !winner || winner === 'draw') return null;

    const [a, , c] = macroWinningLine;
    const getPos = (idx: number) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      return { x: col * 33.33 + 16.66, y: row * 33.33 + 16.66 };
    };

    const start = getPos(a);
    const end = getPos(c);

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
        viewBox="0 0 100 100"
      >
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={winner === 'X' ? '#38bdf8' : '#f43f5e'}
          strokeWidth="4"
          strokeLinecap="round"
          className="winning-strike-line drop-shadow-[0_0_16px_rgba(255,255,255,0.8)]"
        />
      </svg>
    );
  };

  return (
    <div className="relative w-full max-w-[580px] mx-auto p-2 sm:p-3.5 bg-slate-900/95 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md">
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full relative">
        {boards.map((cells, boardIdx) => {
          const isActive =
            gameState.gameStatus === 'playing' &&
            (activeBoard === null || activeBoard === boardIdx) &&
            isBoardPlayable(boardStatuses[boardIdx]);

          return (
            <MicroBoard
              key={boardIdx}
              boardIndex={boardIdx}
              cells={cells}
              status={boardStatuses[boardIdx]}
              winningLine={microWinningLines[boardIdx]}
              isActive={isActive}
              currentPlayer={currentPlayer}
              isAiThinking={isAiThinking}
              lastMove={lastMove}
              onCellClick={onCellClick}
            />
          );
        })}

        {renderMacroWinningStrike()}
      </div>
    </div>
  );
};
