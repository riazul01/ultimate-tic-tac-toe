import React from 'react';
import type { GameStats } from '../../engine/game/types';
import { Modal } from '../ui/Modal';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
}) => {
  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.humanWins / stats.gamesPlayed) * 100)
      : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Player Statistics">
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
            <div className="text-2xl font-bold text-slate-100">{stats.gamesPlayed}</div>
            <div className="text-xs text-slate-400 mt-1">Games Played</div>
          </div>

          <div className="bg-sky-950/40 p-3 rounded-xl border border-sky-800/40 text-center">
            <div className="text-2xl font-bold text-sky-400">{stats.humanWins}</div>
            <div className="text-xs text-slate-400 mt-1">Player Wins</div>
          </div>

          <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-800/40 text-center">
            <div className="text-2xl font-bold text-rose-400">{stats.aiWins}</div>
            <div className="text-xs text-slate-400 mt-1">AI Wins</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
            <div className="text-2xl font-bold text-amber-400">{stats.draws}</div>
            <div className="text-xs text-slate-400 mt-1">Draws</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
            <div className="text-2xl font-bold text-emerald-400">{stats.currentStreak}</div>
            <div className="text-xs text-slate-400 mt-1">Current Streak</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
            <div className="text-2xl font-bold text-indigo-400">{stats.bestStreak}</div>
            <div className="text-xs text-slate-400 mt-1">Best Streak</div>
          </div>
        </div>

        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Win Rate</span>
          <span className="text-lg font-bold text-slate-100">{winRate}%</span>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onResetStats}
            className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-800/40 rounded-lg transition-colors cursor-pointer"
          >
            Reset Statistics
          </button>
        </div>
      </div>
    </Modal>
  );
};
