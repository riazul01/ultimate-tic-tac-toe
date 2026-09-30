import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import type { AIDifficulty, GameSettings, GameStats, Player } from '../engine/game/types';
import { RulesModal } from '../components/modals/RulesModal';
import { StatsModal } from '../components/modals/StatsModal';
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
  const [activeModal, setActiveModal] = useState<'rules' | 'stats' | null>(null);

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

  const handleSoundToggle = () => {
    const nextSound = !settings.soundEnabled;
    soundManager.setEnabled(nextSound);
    if (nextSound) soundManager.playPlayerMove();
    onUpdateSettings({ soundEnabled: nextSound });
  };

  const handleThemeToggle = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    if (settings.soundEnabled) soundManager.playAiMove();
    onUpdateSettings({ theme: nextTheme });
  };

  const handleAnimationsToggle = () => {
    const nextAnim = !settings.animationsEnabled;
    if (settings.soundEnabled) soundManager.playAiMove();
    onUpdateSettings({ animationsEnabled: nextAnim });
  };

  const handleDebugToggle = () => {
    const nextDebug = !settings.debugMode;
    if (settings.soundEnabled) soundManager.playAiMove();
    onUpdateSettings({ debugMode: nextDebug });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center px-4 py-6 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Grid Pattern & Ambient Lighting (Preserved) */}
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

      {/* Original Brand Header */}
      <div className="w-full max-w-md text-center space-y-2 mb-4 relative z-10">
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

      {/* Main Compact Configuration Card */}
      <div className="w-full max-w-[390px] bg-slate-900/85 border border-slate-800/90 rounded-2xl p-5 space-y-4 backdrop-blur-xl shadow-2xl shadow-black/40 relative z-10">
        {/* Compact Segmented Difficulty Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 px-0.5">
            <span>AI Difficulty</span>
            <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
              {difficulties.find((d) => d.id === settings.difficulty)?.depth}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            {difficulties.map((d) => {
              const isSelected = settings.difficulty === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleDifficultySelect(d.id)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400'
                  }`}
                >
                  {d.name}
                </button>
              );
            })}
          </div>

          <div className="text-[10.5px] text-slate-400 text-center truncate px-1">
            {difficulties.find((d) => d.id === settings.difficulty)?.description}
          </div>
        </div>

        {/* Side / Symbol Selector */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-slate-300 px-0.5">
            Play Side
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSymbolSelect('X')}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95 ${
                settings.humanSymbol === 'X'
                  ? 'bg-sky-500/15 border-sky-500 text-sky-300'
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-400'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Play X (1st Move)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSymbolSelect('O')}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95 ${
                settings.humanSymbol === 'O'
                  ? 'bg-rose-500/15 border-rose-500 text-rose-300'
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-400'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <circle cx="12" cy="12" r="8" />
              </svg>
              <span>Play O (2nd Move)</span>
            </button>
          </div>
        </div>

        {/* Start Game Action Button */}
        <button
          type="button"
          onClick={handleStartGame}
          className="w-full py-2.5 bg-indigo-600 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Start Match</span>
        </button>

        {/* Compact Integrated Bottom Dock */}
        <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between">
          {/* Left Actions: Rules & Stats */}
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => {
                if (settings.soundEnabled) soundManager.playAiMove();
                setActiveModal('rules');
              }}
              title="Game Rules & Guide"
              aria-label="Game Rules & Guide"
              className="dock-action-rules px-2.5 py-1.5 rounded-lg bg-slate-950/60 text-slate-700 dark:text-slate-300 border border-slate-800 transition-all cursor-pointer flex items-center space-x-1.5 text-xs active:scale-95"
            >
              <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Rules</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (settings.soundEnabled) soundManager.playAiMove();
                setActiveModal('stats');
              }}
              title={
                stats.gamesPlayed > 0
                  ? `Career Stats: ${stats.humanWins}W / ${stats.gamesPlayed}G (${Math.round((stats.humanWins / stats.gamesPlayed) * 100)}% Win Rate)`
                  : 'Career Stats'
              }
              aria-label="Career Stats"
              className="dock-action-stats px-2.5 py-1.5 rounded-lg bg-slate-950/60 text-slate-700 dark:text-slate-300 border border-slate-800 transition-all cursor-pointer flex items-center space-x-1.5 text-xs active:scale-95"
            >
              <svg className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
                <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
              <span>Stats</span>
              {stats.gamesPlayed > 0 && (
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                  {stats.humanWins}W
                </span>
              )}
            </button>
          </div>

          {/* Right Controls: Sound & Theme */}
          <div className="flex items-center space-x-1.5">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={handleSoundToggle}
              title={settings.soundEnabled ? 'Audio: Enabled (Click to Mute)' : 'Audio: Muted (Click to Enable)'}
              aria-label={settings.soundEnabled ? 'Audio Enabled' : 'Audio Muted'}
              className={`dock-action-sound p-2 rounded-lg border transition-all cursor-pointer active:scale-95 ${
                settings.soundEnabled
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              {settings.soundEnabled ? (
                <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={handleThemeToggle}
              title={settings.theme === 'light' ? 'Theme: Light Mode' : 'Theme: Dark Mode'}
              aria-label={settings.theme === 'light' ? 'Light Theme' : 'Dark Theme'}
              className={`dock-action-theme p-2 rounded-lg border transition-all cursor-pointer active:scale-95 ${
                settings.theme === 'light'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              }`}
            >
              {settings.theme === 'light' ? (
                <svg className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RulesModal isOpen={activeModal === 'rules'} onClose={() => setActiveModal(null)} />
      <StatsModal
        isOpen={activeModal === 'stats'}
        onClose={() => setActiveModal(null)}
        stats={stats}
        onResetStats={onResetStats}
      />
    </div>
  );
};

