import React, { useState, useEffect, useRef } from "react";
import type { GameHistoryItem, Player } from "engine/game/types";

interface MoveHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: GameHistoryItem[];
}

const BOARD_NAMES = [
  "Top-Left",
  "Top-Center",
  "Top-Right",
  "Mid-Left",
  "Center",
  "Mid-Right",
  "Bot-Left",
  "Bot-Center",
  "Bot-Right",
];

/** Player Badge Icon matching board icons */
const PlayerBadge: React.FC<{ player: Player }> = ({ player }) => {
  const isX = player === "X";
  return (
    <span
      className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
        isX
          ? "bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 border border-sky-300 dark:border-sky-800/60"
          : "bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800/60"
      }`}
    >
      {isX ? (
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ) : (
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="8" />
        </svg>
      )}
    </span>
  );
};

/** Single Move Row */
const MoveItemRow: React.FC<{ item: GameHistoryItem; index: number }> = ({
  item,
  index,
}) => {
  const boardName =
    BOARD_NAMES[item.move.boardIndex] || `Board ${item.move.boardIndex + 1}`;
  const cellName =
    BOARD_NAMES[item.move.cellIndex] || `Cell ${item.move.cellIndex + 1}`;
  const time = new Date(item.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
      <div className="flex items-center space-x-2.5">
        <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500 w-5 text-right">
          {index + 1}.
        </span>
        <PlayerBadge player={item.move.player} />
        <div className="text-xs">
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {boardName}
          </span>
          <span className="text-slate-400 dark:text-slate-500 mx-1">→</span>
          <span className="text-slate-600 dark:text-slate-300">{cellName}</span>
        </div>
      </div>
      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
        {time}
      </span>
    </div>
  );
};

/** Empty State when no moves have been made */
const EmptyHistory: React.FC = () => (
  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
    <svg
      className="w-12 h-12 mb-2 stroke-1 opacity-60"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
      No moves played yet
    </p>
    <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">
      Your move list will populate as the match progresses.
    </p>
  </div>
);

export const MoveHistoryDrawer: React.FC<MoveHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const endOfListRef = useRef<HTMLDivElement>(null);

  // Handle enter and exit transition lifecycle
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsVisible(true), 20);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-scroll to latest move on update
  useEffect(() => {
    if (isOpen) {
      endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, history.length]);

  if (!shouldRender) return null;

  return (
    <div
      aria-modal="true"
      aria-labelledby="move-history-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs cursor-pointer"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 300ms ease-out",
        }}
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div
          className="w-screen max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between text-slate-800 dark:text-slate-100 pointer-events-auto"
          style={{
            transform: isVisible ? "translateX(0%)" : "translateX(100%)",
            transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <h2
                id="move-history-title"
                className="text-base font-bold font-heading"
              >
                Move History
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                {history.length} {history.length === 1 ? "Move" : "Moves"}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close move history drawer"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Move List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {history.length === 0 ? (
              <EmptyHistory />
            ) : (
              history.map((item, idx) => (
                <MoveItemRow key={idx} item={item} index={idx} />
              ))
            )}
            <div ref={endOfListRef} />
          </div>

          {/* Footer Bar */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Latest: {history.length > 0 ? `Move ${history.length}` : "—"}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
