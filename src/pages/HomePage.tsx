import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import type { AIDifficulty, GameSettings, GameStats, Player } from '../engine/game/types';
import { RulesModal } from '../components/modals/RulesModal';
import { StatsModal } from '../components/modals/StatsModal';
import { SettingsModal } from '../components/modals/SettingsModal';
import { soundManager } from '../utils/sound';

interface HomePageProps {
  settings: GameSettings;
  stats: GameStats;
  onUpdateSettings: (partial: Partial<GameSettings>) => void;
  onResetStats: () => void;
  onStartNewGame: (symbol?: Player) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  stats,
  onUpdateSettings,
  onResetStats,
  onStartNewGame,
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<'rules' | 'stats' | 'settings' | null>(null);

  const difficulties: {
    id: AIDifficulty;
    name: string;
    description: string;
    depth: string;
  }[] = [
      {
        id: 'easy',
        name: 'Easy',
        description: 'Relaxed tactical play with occasional openings',
        depth: '1-Ply',
      },
      {
        id: 'medium',
        name: 'Medium',
        description: 'Solid defense, blocks immediate win threats',
        depth: '3-Ply',
      },
      {
        id: 'hard',
        name: 'Hard',
        description: 'Deep alpha-beta lookahead and sector routing',
        depth: '5-Ply',
      },
      {
        id: 'expert',
        name: 'Expert',
        description: 'Iterative deepening with transposition cache',
        depth: '7-Ply',
      },
    ];

  const handleStartGame = () => {
    soundManager.playPlayerMove();
    onStartNewGame(settings.humanSymbol);
    navigate('/play');
  };

  const handleDifficultySelect = (diff: AIDifficulty) => {
    soundManager.playAiMove();
    onUpdateSettings({ difficulty: diff });
  };

  const handleSymbolSelect = (symbol: Player) => {
    soundManager.playPlayerMove();
    onUpdateSettings({ humanSymbol: symbol });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between items-center px-4 py-8 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
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

      {/* Brand Header */}
      <div className="w-full max-w-md text-center space-y-2 pt-2 relative z-10">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-indigo-400 text-xs font-semibold tracking-wide backdrop-blur-sm">
          <span>81-Cell Strategy Game</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
          Ultimate Tic-Tac-Toe
        </h1>
        <p className="text-xs text-slate-400">
          Play against a search-driven strategic AI agent
        </p>
      </div>

      {/* Main Clean Configuration Card */}
      <div className="w-full max-w-md bg-slate-900/85 border border-slate-800/90 rounded-2xl p-5 space-y-5 my-auto backdrop-blur-xl relative z-10">
        {/* Clean Difficulty Selector - Interactive Vertical Stack */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            AI Difficulty Level
          </label>

          <div className="space-y-1.5">
            {difficulties.map((d) => {
              const isSelected = settings.difficulty === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleDifficultySelect(d.id)}
                  className={`w-full p-3 rounded-xl border text-left cursor-pointer flex items-center justify-between ${isSelected
                      ? 'bg-slate-800/90 border-indigo-500 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-slate-700 bg-transparent'
                        }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {d.name}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                        {d.description}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {d.depth}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Side / Symbol Picker */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            Play Side
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSymbolSelect('X')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer ${settings.humanSymbol === 'X'
                  ? 'bg-slate-800 border-sky-500 text-sky-300'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
            >
              <svg className="w-3.5 h-3.5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Play X (First Move)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSymbolSelect('O')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer ${settings.humanSymbol === 'O'
                  ? 'bg-slate-800 border-rose-500 text-rose-300'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
            >
              <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <circle cx="12" cy="12" r="8" />
              </svg>
              <span>Play O (Second Move)</span>
            </button>
          </div>
        </div>

        {/* Start Game Action */}
        <button
          type="button"
          onClick={handleStartGame}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Start Match</span>
        </button>
      </div>

      {/* Clean Utility Footer */}
      <div className="w-full max-w-md flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-900 relative z-10">
        <button
          type="button"
          onClick={() => setActiveModal('rules')}
          className="hover:text-slate-200 transition-colors cursor-pointer"
        >
          Rules
        </button>
        <button
          type="button"
          onClick={() => setActiveModal('stats')}
          className="hover:text-slate-200 transition-colors cursor-pointer"
        >
          Stats {stats.gamesPlayed > 0 && `(${stats.humanWins}W / ${stats.gamesPlayed}G)`}
        </button>
        <button
          type="button"
          onClick={() => setActiveModal('settings')}
          className="hover:text-slate-200 transition-colors cursor-pointer"
        >
          Settings
        </button>
      </div>

      {/* Modals */}
      <RulesModal isOpen={activeModal === 'rules'} onClose={() => setActiveModal(null)} />
      <StatsModal
        isOpen={activeModal === 'stats'}
        onClose={() => setActiveModal(null)}
        stats={stats}
        onResetStats={onResetStats}
      />
      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
      />
    </div>
  );
};
