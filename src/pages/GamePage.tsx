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
import { MoveHistoryModal } from '../components/modals/MoveHistoryModal';
import { DebugPanel } from '../components/game/DebugPanel';
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
  isAiThinking,
  aiSearchStats,
  lastMove,
  makeHumanMove,
  startNewGame,
  handleUndo,
  handleRedo,
  updateSettings,
}) => {
  const navigate = useNavigate();
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (gameState.gameStatus === 'finished' && gameState.winner) {
      const timer = setTimeout(() => {
        setShowResultModal(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus, gameState.winner]);

  const handleRestart = () => {
    startNewGame(settings.humanSymbol);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center px-3 sm:px-4 py-4 sm:py-6 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Grid Pattern & Ambient Lighting */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Game Arena Card */}
      <div className="w-full max-w-[460px] sm:max-w-[500px] bg-slate-900/85 border border-slate-800/90 rounded-2xl p-3.5 sm:p-4 space-y-3 backdrop-blur-xl shadow-2xl shadow-black/40 relative z-10">
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
          onRestart={handleRestart}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onDifficultyChange={(diff) => updateSettings({ difficulty: diff })}
          onGoHome={() => navigate('/')}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
        />
      </div>

      {settings.debugMode && (
        <div className="w-full max-w-[460px] sm:max-w-[500px] mt-3 relative z-10">
          <DebugPanel
            gameState={gameState}
            aiStats={aiSearchStats}
            isAiThinking={isAiThinking}
          />
        </div>
      )}

      <MoveHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={gameState.history}
      />

      <GameResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        gameState={gameState}
        humanSymbol={settings.humanSymbol}
        onPlayAgain={() => {
          setShowResultModal(false);
          startNewGame(settings.humanSymbol);
        }}
      />
    </div>
  );
};
