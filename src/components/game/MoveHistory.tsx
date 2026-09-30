import React, { useState } from 'react';
import type { GameHistoryItem } from '../../engine/game/types';

interface MoveHistoryProps {
  history: GameHistoryItem[];
}

const BOARD_NAMES = [
  'Top-Left', 'Top-Center', 'Top-Right',
  'Mid-Left', 'Center', 'Mid-Right',
  'Bot-Left', 'Bot-Center', 'Bot-Right'
];

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-[620px] mx-auto mt-3 bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors cursor-pointer"
      >
        <span className="flex items-center space-x-2">
          <span>Move History</span>
          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">
            {history.length} moves
          </span>
        </span>
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="max-h-44 overflow-y-auto px-4 py-2 border-t border-slate-800/80 divide-y divide-slate-800/40 text-xs">
          {history.map((item, idx) => {
            const isX = item.move.player === 'X';
            return (
              <div
                key={idx}
                className="py-1.5 flex items-center justify-between text-slate-300"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-mono w-6">
                    {idx + 1}.
                  </span>
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center ${
                      isX ? 'text-sky-400 bg-sky-950/60' : 'text-rose-400 bg-rose-950/60'
                    }`}
                  >
                    {isX ? (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="8" />
                      </svg>
                    )}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span>
                    {BOARD_NAMES[item.move.boardIndex]} (Cell {item.move.cellIndex + 1})
                  </span>
                </div>
                {item.previousBoardStatus === 'playing' && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
