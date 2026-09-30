import React, { useState } from 'react';
import type { AIDifficulty, GameState } from '../../engine/game/types';

interface GameControlsProps {
  gameState: GameState;
  isAiThinking: boolean;
  difficulty: AIDifficulty;
  onRestart: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDifficultyChange?: (diff: AIDifficulty) => void;
  onGoHome?: () => void;
  onOpenHistory?: () => void;
  onNewGame?: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  isAiThinking,
  onRestart,
  onUndo,
  onRedo,
  onGoHome,
  onOpenHistory,
}) => {
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);

  const hasMoves = gameState.history.length > 0;
  const canUndo = hasMoves && !isAiThinking;
  const canRedo = gameState.redoStack.length > 0 && !isAiThinking;

  const handleRestartClick = () => {
    if (gameState.gameStatus === 'playing' && hasMoves) {
      setShowConfirmRestart(true);
    } else {
      onRestart();
    }
  };

  const confirmRestart = () => {
    setShowConfirmRestart(false);
    onRestart();
  };

  return (
    <div className="w-full pt-2.5 border-t border-slate-800/70 space-y-2">
      {/* Controls Dock */}
      <div className="flex items-center justify-between gap-1.5">
        {/* Left Actions: Home & History */}
        <div className="flex items-center space-x-1.5">
          {onGoHome && (
            <button
              type="button"
              onClick={onGoHome}
              title="Return to Home"
              aria-label="Return to Home"
              className="px-2.5 py-1.5 rounded-lg bg-slate-950/60 text-slate-300 border border-slate-800 transition-all cursor-pointer flex items-center space-x-1 text-xs active:scale-95"
            >
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Home</span>
            </button>
          )}

          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              title="Move History"
              aria-label="Move History"
              className="px-2.5 py-1.5 rounded-lg bg-slate-950/60 text-slate-300 border border-slate-800 transition-all cursor-pointer flex items-center space-x-1.5 text-xs active:scale-95"
            >
              <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 3" />
              </svg>
              <span>History</span>
            </button>
          )}
        </div>

        {/* Right Actions: Undo / Redo & Restart */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo move"
            title="Undo move"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-950/60 disabled:opacity-30 text-slate-300 border border-slate-800 transition-all cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2m-15-7l4-4m-4 4l4 4" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo move"
            title="Redo move"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-950/60 disabled:opacity-30 text-slate-300 border border-slate-800 transition-all cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v2m15-7l-4-4m4 4l-4 4" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleRestartClick}
            disabled={isAiThinking}
            title="Restart Match"
            className="px-3 py-1.5 bg-indigo-600 active:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Restart Confirmation Alert Banner */}
      {showConfirmRestart && (
        <div className="restart-confirm-banner bg-amber-950/80 border border-amber-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-200 animate-victory-pop">
          <span className="font-medium">Restart active match and reset board?</span>
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={confirmRestart}
              className="px-2.5 py-1 bg-amber-600 text-white font-semibold rounded-lg cursor-pointer text-xs active:scale-95 transition-none"
            >
              Restart
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmRestart(false)}
              className="px-2.5 py-1 bg-slate-900 text-slate-300 border border-slate-700 rounded-lg cursor-pointer text-xs active:scale-95 transition-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
