import React from "react";
import type { GameStats } from "engine/game/types";
import { Modal } from "components/ui/Modal";

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
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {stats.gamesPlayed}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Games Played
            </div>
          </div>

          <div className="bg-sky-50 dark:bg-sky-950/40 p-3 rounded-xl border border-sky-200 dark:border-sky-800/40 text-center">
            <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
              {stats.humanWins}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Player Wins
            </div>
          </div>

          <div className="bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-800/40 text-center">
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {stats.aiWins}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              AI Wins
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800/40 text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.draws}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Draws
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.currentStreak}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Current Streak
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/40 text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.bestStreak}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Best Streak
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700/40 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Win Rate
          </span>
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {winRate}%
          </span>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onResetStats}
            className="px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 rounded-lg transition-colors cursor-pointer"
          >
            Reset Statistics
          </button>
        </div>
      </div>
    </Modal>
  );
};
