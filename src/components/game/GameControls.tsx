import React, { useState } from 'react';
import type { AIDifficulty, GameState } from '../../engine/game/types';

interface GameControlsProps {
  gameState: GameState;
  isAiThinking: boolean;
  difficulty: AIDifficulty;
  onNewGame: () => void;
  onRestart: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onDifficultyChange: (diff: AIDifficulty) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  isAiThinking,
  onNewGame,
  onRestart,
  onUndo,
  onRedo,
  onOpenRules,
  onOpenStats,
  onOpenSettings,
}) => {
  const [showConfirmNew, setShowConfirmNew] = useState(false);

  const hasMoves = gameState.history.length > 0;
  const canUndo = hasMoves && !isAiThinking;
  const canRedo = gameState.redoStack.length > 0 && !isAiThinking;

  const handleNewGameClick = () => {
    if (gameState.gameStatus === 'playing' && hasMoves) {
      setShowConfirmNew(true);
    } else {
      onNewGame();
    }
  };

  const confirmNewGame = () => {
    setShowConfirmNew(false);
    onNewGame();
  };

  return (
    <div className="w-full max-w-[620px] mx-auto mt-4 space-y-3">
      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          {/* New Game Button */}
          <button
            type="button"
            onClick={handleNewGameClick}
            disabled={isAiThinking}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Game</span>
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={onRestart}
            disabled={!hasMoves || isAiThinking}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 disabled:opacity-40 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="Restart current game"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo move"
            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="Undo move"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2m-15-7l4-4m-4 4l4 4" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo move"
            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="Redo move"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v2m15-7l-4-4m4 4l-4 4" />
            </svg>
          </button>
        </div>

        {/* Secondary Modals: Rules, Stats, Settings */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={onOpenRules}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/80 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="How to play rules"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onOpenStats}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/80 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="Game Statistics"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/80 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="Settings"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Confirmation Banner */}
      {showConfirmNew && (
        <div className="bg-amber-950/70 border border-amber-800/80 rounded-xl p-3 flex items-center justify-between text-xs text-amber-200 animate-victory-pop">
          <span>Abandon active game and start a new match?</span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={confirmNewGame}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded cursor-pointer"
            >
              Yes, Restart
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmNew(false)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
