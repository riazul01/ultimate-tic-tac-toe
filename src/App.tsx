import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useGame } from "./hooks/useGame";
import { HomePage } from "./pages/HomePage";
import { GamePage } from "./pages/GamePage";

export const App: React.FC = () => {
  const {
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
  } = useGame();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              settings={settings}
              stats={stats}
              onUpdateSettings={updateSettings}
              onResetStats={resetStats}
              onStartNewGame={startNewGame}
            />
          }
        />
        <Route
          path="/play"
          element={
            <GamePage
              gameState={gameState}
              settings={settings}
              stats={stats}
              isAiThinking={isAiThinking}
              aiSearchStats={aiSearchStats}
              lastMove={lastMove}
              makeHumanMove={makeHumanMove}
              startNewGame={startNewGame}
              handleUndo={handleUndo}
              handleRedo={handleRedo}
              resetStats={resetStats}
              updateSettings={updateSettings}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
