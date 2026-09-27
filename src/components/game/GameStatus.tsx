import React from 'react';
import type { AIDifficulty, GameState, Player } from '../../engine/game/types';

interface GameStatusProps {
  gameState: GameState;
  humanSymbol: Player;
  difficulty: AIDifficulty;
  isAiThinking: boolean;
}

const BOARD_NAMES = [
  'Top-Left', 'Top-Center', 'Top-Right',
  'Middle-Left', 'Center', 'Middle-Right',
  'Bottom-Left', 'Bottom-Center', 'Bottom-Right'
];

export const GameStatus: React.FC<GameStatusProps> = ({
  gameState,
  humanSymbol,
  difficulty,
  isAiThinking,
}) => {
  const { currentPlayer, activeBoard, gameStatus, winner } = gameState;
  const isHumanTurn = currentPlayer === humanSymbol;

  const getDestinationMessage = () => {
    if (gameStatus === 'finished') {
      if (winner === 'draw') return 'Game ended in a draw!';
      if (winner === humanSymbol) return 'Victory! You won the game!';
      return 'AI Agent won the match.';
    }

    if (isAiThinking) {
      return 'AI is calculating move...';
    }

    if (activeBoard === null) {
      return 'Forced board complete — play in any open board';
    }

    return `Destination: ${BOARD_NAMES[activeBoard]} Board`;
  };

  const getDifficultyBadge = () => {
    const colors: Record<AIDifficulty, string> = {
      easy: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
      medium: 'bg-blue-950/80 text-blue-400 border-blue-800/60',
      hard: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
      expert: 'bg-purple-950/80 text-purple-400 border-purple-800/60',
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${colors[difficulty]}`}
      >
        {difficulty} AI
      </span>
    );
  };

  return (
    <div className="w-full max-w-[620px] mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 mb-3 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md">
      {/* Player turn indicator */}
      <div className="flex items-center space-x-3">
        <div
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all duration-200 ${
            isHumanTurn && !isAiThinking
              ? 'bg-sky-950/70 border-sky-500/60 text-sky-300'
              : 'bg-rose-950/70 border-rose-500/60 text-rose-300'
          }`}
        >
          {currentPlayer === 'X' ? (
            <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="12" cy="12" r="8" strokeLinecap="round" />
            </svg>
          )}
          <span className="text-sm font-bold">
            {isHumanTurn ? 'Your Turn' : 'AI Agent'}
          </span>
        </div>

        {/* AI Thinking Animation */}
        {isAiThinking && (
          <div className="flex items-center space-x-1.5 text-xs text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse [animation-delay:200ms]" />
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse [animation-delay:400ms]" />
          </div>
        )}
      </div>

      {/* Destination Board / Turn Advice */}
      <div className="text-center sm:text-right">
        <p className="text-xs sm:text-sm font-medium text-slate-200">
          {getDestinationMessage()}
        </p>
      </div>

      {/* Difficulty badge */}
      <div>{getDifficultyBadge()}</div>
    </div>
  );
};
