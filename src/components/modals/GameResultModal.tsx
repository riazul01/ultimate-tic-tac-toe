import React from 'react';
import type { GameState, Player } from '../../engine/game/types';
import { Modal } from '../ui/Modal';

interface GameResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  humanSymbol: Player;
  onPlayAgain: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  isOpen,
  onClose,
  gameState,
  humanSymbol,
  onPlayAgain,
}) => {
  const { winner, boardStatuses } = gameState;
  if (!winner) return null;

  const isHumanWin = winner === humanSymbol;
  const isDraw = winner === 'draw';

  const xSectors = boardStatuses.filter((s) => s === 'X').length;
  const oSectors = boardStatuses.filter((s) => s === 'O').length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Match Finished" maxWidth="max-w-md">
      <div className="text-center py-2 space-y-4">
        {/* Victory Icon / Badge */}
        <div className="flex justify-center">
          {isHumanWin ? (
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-victory-pop">
              <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          ) : isDraw ? (
            <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-victory-pop">
              <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border-2 border-rose-400 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/20 animate-victory-pop">
              <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-2xl font-bold font-heading text-slate-100">
            {isHumanWin
              ? 'Triumphant Victory!'
              : isDraw
              ? 'A Hard-Fought Draw!'
              : 'Defeated by AI Agent'}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {isHumanWin
              ? 'You outsmarted the AI and dominated the macro grid!'
              : isDraw
              ? 'Neither player could claim 3 macro boards in a row.'
              : 'The AI predicted your strategic lines and took the win.'}
          </p>
        </div>

        {/* Sector Control Breakdown */}
        <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 flex items-center justify-around text-xs">
          <div className="text-center">
            <span className="text-sky-400 font-bold text-base block">{xSectors}</span>
            <span className="text-slate-400">X Sectors Won</span>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div className="text-center">
            <span className="text-rose-400 font-bold text-base block">{oSectors}</span>
            <span className="text-slate-400">O Sectors Won</span>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div className="text-center">
            <span className="text-slate-300 font-bold text-base block">
              {gameState.history.length}
            </span>
            <span className="text-slate-400">Total Moves</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Play Again
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 text-slate-300 font-medium rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            Review Board
          </button>
        </div>
      </div>
    </Modal>
  );
};
