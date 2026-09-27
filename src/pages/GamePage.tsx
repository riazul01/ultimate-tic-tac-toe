import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type {
  AISearchStats,
  GameSettings,
  GameState,
  GameStats,
  Move,
  Player,
} from '../engine/game/types';
import { GameBoard } from '../components/game/GameBoard';
import { GameStatus } from '../components/game/GameStatus';
import { GameControls } from '../components/game/GameControls';
import { MoveHistory } from '../components/game/MoveHistory';
import { DebugPanel } from '../components/game/DebugPanel';
import { RulesModal } from '../components/modals/RulesModal';
import { StatsModal } from '../components/modals/StatsModal';
import { SettingsModal } from '../components/modals/SettingsModal';
import { GameResultModal } from '../components/modals/GameResultModal';

interface GamePageProps {
  gameState: GameState;
  settings: GameSettings;
  stats: GameStats;
  isAiThinking: boolean;
  aiSearchStats: AISearchStats | null;
  lastMove: Move | null;
  makeHumanMove: (boardIndex: number, cellIndex: number) => void;
  startNewGame: (symbol?: Player) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  resetStats: () => void;
  updateSettings: (partial: Partial<GameSettings>) => void;
}

export const GamePage: React.FC<GamePageProps> = ({
  gameState,
  settings,
  stats,
  isAiThinking,
  aiSearchStats,
  lastMove,
  makeHumanMove,
  startNewGame,
  handleUndo,
  handleRedo,
  resetStats,
  updateSettings,
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<
    'rules' | 'stats' | 'settings' | 'result' | null
  >(null);

  useEffect(() => {
    if (gameState.gameStatus === 'finished' && gameState.winner) {
      const timer = setTimeout(() => {
        setActiveModal('result');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus, gameState.winner]);

  const handleRestart = () => {
    startNewGame(settings.humanSymbol);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Game Header with Back to Home Button */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="Return to Home"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Home</span>
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center font-heading font-bold text-white text-sm">
                U
              </div>
              <h1 className="text-sm sm:text-base font-bold font-heading tracking-tight text-slate-100">
                Ultimate Tic-Tac-Toe
              </h1>
            </div>
          </div>

          {/* Action Modals */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setActiveModal('rules')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Rules</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('stats')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Stats</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('settings')}
              aria-label="Settings"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="flex-1 flex flex-col justify-center px-3 sm:px-4 py-4 max-w-3xl mx-auto w-full">
        <GameStatus
          gameState={gameState}
          humanSymbol={settings.humanSymbol}
          difficulty={settings.difficulty}
          isAiThinking={isAiThinking}
        />

        <GameBoard
          gameState={gameState}
          humanSymbol={settings.humanSymbol}
          isAiThinking={isAiThinking}
          lastMove={lastMove}
          onCellClick={makeHumanMove}
        />

        <GameControls
          gameState={gameState}
          isAiThinking={isAiThinking}
          difficulty={settings.difficulty}
          onNewGame={() => startNewGame(settings.humanSymbol)}
          onRestart={handleRestart}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onOpenRules={() => setActiveModal('rules')}
          onOpenStats={() => setActiveModal('stats')}
          onOpenSettings={() => setActiveModal('settings')}
          onDifficultyChange={(diff) => updateSettings({ difficulty: diff })}
        />

        <MoveHistory history={gameState.history} />

        {settings.debugMode && (
          <DebugPanel
            gameState={gameState}
            aiStats={aiSearchStats}
            isAiThinking={isAiThinking}
          />
        )}
      </main>

      <footer className="py-3 text-center text-xs text-slate-500 border-t border-slate-900">
        <span>Ultimate Tic-Tac-Toe &bull; Built with React & Minimax Engine</span>
      </footer>

      <RulesModal isOpen={activeModal === 'rules'} onClose={() => setActiveModal(null)} />
      <StatsModal
        isOpen={activeModal === 'stats'}
        onClose={() => setActiveModal(null)}
        stats={stats}
        onResetStats={resetStats}
      />
      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />
      <GameResultModal
        isOpen={activeModal === 'result'}
        onClose={() => setActiveModal(null)}
        gameState={gameState}
        humanSymbol={settings.humanSymbol}
        onPlayAgain={() => {
          setActiveModal(null);
          startNewGame(settings.humanSymbol);
        }}
      />
    </div>
  );
};
