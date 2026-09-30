import React from "react";
import type { AISearchStats, GameState } from "engine/game/types";
import { getLegalMoves } from "engine/game/gameRules";

interface DebugPanelProps {
  gameState: GameState;
  aiStats: AISearchStats | null;
  isAiThinking: boolean;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  gameState,
  aiStats,
}) => {
  const legalMoves = getLegalMoves(gameState);

  return (
    <div className="w-full max-w-155 mx-auto mt-4 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-2">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-bold text-amber-400 flex items-center space-x-1.5">
          <span>🛠 Developer / AI Debug Mode</span>
        </span>
        <span className="text-[10px] text-slate-500">
          Live Engine Telemetry
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <div className="bg-slate-900 p-2 rounded border border-slate-800">
          <div className="text-slate-500 text-[10px]">Legal Moves</div>
          <div className="font-bold text-slate-200">{legalMoves.length}</div>
        </div>

        <div className="bg-slate-900 p-2 rounded border border-slate-800">
          <div className="text-slate-500 text-[10px]">AI Search Depth</div>
          <div className="font-bold text-slate-200">
            {aiStats ? `${aiStats.depthReached} ply` : "-"}
          </div>
        </div>

        <div className="bg-slate-900 p-2 rounded border border-slate-800">
          <div className="text-slate-500 text-[10px]">Nodes Evaluated</div>
          <div className="font-bold text-slate-200">
            {aiStats ? aiStats.nodesEvaluated.toLocaleString() : "-"}
          </div>
        </div>

        <div className="bg-slate-900 p-2 rounded border border-slate-800">
          <div className="text-slate-500 text-[10px]">Eval Score</div>
          <div className="font-bold text-slate-200">
            {aiStats
              ? aiStats.score > 0
                ? `+${aiStats.score}`
                : aiStats.score
              : "-"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <span>
          Active Board: {gameState.activeBoard ?? "Unrestricted (null)"}
        </span>
        <span>Turn: {gameState.currentPlayer}</span>
        <span>Last Time: {aiStats ? `${aiStats.timeMs}ms` : "-"}</span>
      </div>
    </div>
  );
};
