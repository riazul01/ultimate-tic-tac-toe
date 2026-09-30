import React, { useEffect, useRef } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import type { GameHistoryItem, Player } from "engine/game/types";
import { Modal } from "components/ui/Modal";

interface MoveHistoryModalProps {
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

/** Player Badge Icon matching game board styling */
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

export const MoveHistoryModal: React.FC<MoveHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  const endOfListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, history.length]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Move History"
      maxWidth="max-w-md"
    >
      <div className="space-y-3">
        {/* Header Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-0.5">
          <span>
            {history.length}{" "}
            {history.length === 1 ? "move recorded" : "total moves"}
          </span>
          {history.length > 0 && <span>Latest: Move {history.length}</span>}
        </div>

        {/* Moves List or Empty State with SimpleBar */}
        {history.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 space-y-2">
            <svg
              className="w-10 h-10 mx-auto stroke-1 opacity-50"
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
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No moves played yet
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Moves will appear here as the match progresses.
            </p>
          </div>
        ) : (
          <SimpleBar style={{ maxHeight: "280px" }} autoHide={true}>
            <div className="space-y-1.5 py-0.5">
              {history.map((item, idx) => {
                const boardName =
                  BOARD_NAMES[item.move.boardIndex] ||
                  `Board ${item.move.boardIndex + 1}`;
                const cellName =
                  BOARD_NAMES[item.move.cellIndex] ||
                  `Cell ${item.move.cellIndex + 1}`;
                const time = new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500 w-5 text-right">
                        {idx + 1}.
                      </span>
                      <PlayerBadge player={item.move.player} />
                      <div>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {boardName}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 mx-1">
                          →
                        </span>
                        <span className="text-slate-600 dark:text-slate-300">
                          {cellName}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      {time}
                    </span>
                  </div>
                );
              })}
              <div ref={endOfListRef} />
            </div>
          </SimpleBar>
        )}

        {/* Footer Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl text-xs cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
