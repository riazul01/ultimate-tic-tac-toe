import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  AISearchStats,
  GameSettings,
  GameState,
  GameStats,
  Move,
  Player,
} from '../engine/game/types';
import {
  applyMove,
  createInitialGameState,
  isValidMove,
  undoMove,
  redoMove,
} from '../engine/game/gameRules';
import { AIAgent } from '../engine/ai/aiAgent';
import { DIFFICULTY_CONFIGS } from '../engine/ai/difficulty';
import { soundManager } from '../utils/sound';
import {
  clearSavedGameState,
  loadGameSettings,
  loadGameStats,
  loadSavedGameState,
  saveGameSettings,
  saveGameState,
  saveGameStats,
} from '../utils/storage';

const localAgent = new AIAgent();

const disableTransitionsTemporarily = () => {
  const css = document.createElement('style');
  css.appendChild(
    document.createTextNode(
      `*, *::before, *::after {
        -webkit-transition: none !important;
        -moz-transition: none !important;
        -o-transition: none !important;
        -ms-transition: none !important;
        transition: none !important;
      }`
    )
  );
  document.head.appendChild(css);

  return () => {
    // Force a reflow to ensure instant theme application without transition
    (() => window.getComputedStyle(document.body).opacity)();

    // Re-enable transitions on the next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (document.head.contains(css)) {
          document.head.removeChild(css);
        }
      });
    });
  };
};

export function useGame() {
  const [settings, setSettings] = useState<GameSettings>(() => loadGameSettings());
  const [stats, setStats] = useState<GameStats>(() => loadGameStats());
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadSavedGameState();
    if (saved && saved.gameStatus === 'playing') {
      return saved;
    }
    return createInitialGameState('X');
  });

  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [aiSearchStats, setAiSearchStats] = useState<AISearchStats | null>(null);

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const requestIdRef = useRef<number>(0);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  useEffect(() => {
    const restoreTransitions = disableTransitionsTemporarily();
    const root = document.documentElement;
    const body = document.body;

    const isLight =
      settings.theme === 'light' ||
      (settings.theme === 'system' &&
        !window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isLight) {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
    }

    restoreTransitions();
  }, [settings.theme]);

  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.history.length > 0) {
      saveGameState(gameState);
    } else if (gameState.gameStatus === 'finished') {
      clearSavedGameState();
    }
  }, [gameState]);

  useEffect(() => {
    saveGameSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveGameStats(stats);
  }, [stats]);

  const updateGameEndStats = useCallback((winner: Player | 'draw' | null) => {
    if (!winner) return;

    const human = settingsRef.current.humanSymbol;
    setStats((prev) => {
      const isHumanWin = winner === human;
      const isAiWin = winner !== 'draw' && winner !== human;
      const isDraw = winner === 'draw';

      const newStreak = isHumanWin ? prev.currentStreak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, newStreak);

      return {
        gamesPlayed: prev.gamesPlayed + 1,
        humanWins: prev.humanWins + (isHumanWin ? 1 : 0),
        aiWins: prev.aiWins + (isAiWin ? 1 : 0),
        draws: prev.draws + (isDraw ? 1 : 0),
        currentStreak: newStreak,
        bestStreak,
      };
    });
  }, []);

  const applyAiMove = useCallback(
    (move: Move, aiStats: AISearchStats) => {
      const current = gameStateRef.current;
      const aiSymbol: Player = settingsRef.current.humanSymbol === 'X' ? 'O' : 'X';

      if (
        current.gameStatus !== 'playing' ||
        current.currentPlayer !== aiSymbol ||
        !isValidMove(current, move.boardIndex, move.cellIndex, aiSymbol)
      ) {
        setIsAiThinking(false);
        return;
      }

      const prevMicroStatus = current.boardStatuses[move.boardIndex];
      const nextState = applyMove(current, move.boardIndex, move.cellIndex);

      setGameState(nextState);
      setAiSearchStats(aiStats);
      setIsAiThinking(false);

      soundManager.playAiMove();
      if (nextState.boardStatuses[move.boardIndex] !== prevMicroStatus) {
        setTimeout(() => soundManager.playMicroWin(), 120);
      }
      if (nextState.winner) {
        setTimeout(() => {
          if (nextState.winner === 'draw') {
            soundManager.playDraw();
          } else {
            soundManager.playMacroWin();
          }
        }, 300);
        updateGameEndStats(nextState.winner);
      }
    },
    [updateGameEndStats]
  );

  const triggerAiTurn = useCallback(
    (stateToSearch: GameState) => {
      const aiSymbol: Player = settingsRef.current.humanSymbol === 'X' ? 'O' : 'X';
      if (
        stateToSearch.gameStatus !== 'playing' ||
        stateToSearch.currentPlayer !== aiSymbol
      ) {
        return;
      }

      setIsAiThinking(true);
      const currentReqId = ++requestIdRef.current;
      const diffConfig = DIFFICULTY_CONFIGS[settingsRef.current.difficulty];
      const thinkingDelay =
        diffConfig.minThinkingTimeMs +
        Math.random() * (diffConfig.maxThinkingTimeMs - diffConfig.minThinkingTimeMs);

      if (workerRef.current) {
        setTimeout(() => {
          if (currentReqId === requestIdRef.current) {
            workerRef.current?.postMessage({
              id: currentReqId,
              state: stateToSearch,
              difficulty: settingsRef.current.difficulty,
            });
          }
        }, thinkingDelay);
      } else {
        setTimeout(() => {
          if (currentReqId === requestIdRef.current) {
            const { move, stats: aiStats } = localAgent.computeMove(
              stateToSearch,
              settingsRef.current.difficulty
            );
            if (move) {
              applyAiMove(move, aiStats);
            }
          }
        }, thinkingDelay);
      }
    },
    [applyAiMove]
  );

  useEffect(() => {
    try {
      workerRef.current = new Worker(
        new URL('../engine/ai/aiWorker.ts', import.meta.url),
        { type: 'module' }
      );

      workerRef.current.onmessage = (e) => {
        const { id, success, result } = e.data;
        if (id !== requestIdRef.current) {
          return;
        }

        if (success && result?.move) {
          applyAiMove(result.move, result.stats);
        }
      };
    } catch (err) {
      console.warn('Web worker initialization skipped, using main thread AI', err);
      workerRef.current = null;
    }

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [applyAiMove]);

  const makeHumanMove = useCallback(
    (boardIndex: number, cellIndex: number) => {
      const current = gameStateRef.current;
      const human = settingsRef.current.humanSymbol;

      if (
        isAiThinking ||
        current.gameStatus !== 'playing' ||
        current.currentPlayer !== human ||
        !isValidMove(current, boardIndex, cellIndex, human)
      ) {
        soundManager.playInvalid();
        return;
      }

      const prevMicroStatus = current.boardStatuses[boardIndex];
      const nextState = applyMove(current, boardIndex, cellIndex);

      setGameState(nextState);
      soundManager.playPlayerMove();

      if (nextState.boardStatuses[boardIndex] !== prevMicroStatus) {
        setTimeout(() => soundManager.playMicroWin(), 120);
      }

      if (nextState.winner) {
        setTimeout(() => {
          if (nextState.winner === 'draw') {
            soundManager.playDraw();
          } else {
            soundManager.playMacroWin();
          }
        }, 300);
        updateGameEndStats(nextState.winner);
        return;
      }

      triggerAiTurn(nextState);
    },
    [isAiThinking, triggerAiTurn, updateGameEndStats]
  );

  const startNewGame = useCallback(
    (customHumanSymbol?: Player) => {
      requestIdRef.current++;
      setIsAiThinking(false);
      setAiSearchStats(null);
      localAgent.reset();

      const activeHumanSymbol = customHumanSymbol ?? settingsRef.current.humanSymbol;
      if (customHumanSymbol && customHumanSymbol !== settingsRef.current.humanSymbol) {
        settingsRef.current = { ...settingsRef.current, humanSymbol: customHumanSymbol };
        setSettings((prev) => ({ ...prev, humanSymbol: customHumanSymbol }));
      }

      // In Tic-Tac-Toe, player 'X' always makes the first move
      const firstPlayer: Player = 'X';
      const newState = createInitialGameState(firstPlayer);
      setGameState(newState);
      clearSavedGameState();

      const aiSymbol: Player = activeHumanSymbol === 'X' ? 'O' : 'X';
      // If AI is 'X', AI must play first!
      if (aiSymbol === 'X') {
        triggerAiTurn(newState);
      }
    },
    [triggerAiTurn]
  );

  const handleUndo = useCallback(() => {
    if (isAiThinking || gameState.history.length === 0) return;

    requestIdRef.current++;
    setIsAiThinking(false);

    const human = settingsRef.current.humanSymbol;
    let steps = 2;
    if (gameState.history.length === 1) {
      steps = 1;
    } else if (gameState.currentPlayer !== human && gameState.gameStatus === 'playing') {
      steps = 1;
    }

    const nextState = undoMove(gameState, steps);
    setGameState(nextState);
  }, [gameState, isAiThinking]);

  const handleRedo = useCallback(() => {
    if (isAiThinking || gameState.redoStack.length === 0) return;

    requestIdRef.current++;
    setIsAiThinking(false);

    let steps = 2;
    if (gameState.redoStack.length === 1) {
      steps = 1;
    }

    const nextState = redoMove(gameState, steps);
    setGameState(nextState);
  }, [gameState, isAiThinking]);

  const resetStats = useCallback(() => {
    const fresh = {
      gamesPlayed: 0,
      humanWins: 0,
      aiWins: 0,
      draws: 0,
      currentStreak: 0,
      bestStreak: 0,
    };
    setStats(fresh);
    saveGameStats(fresh);
  }, []);

  const updateSettings = useCallback(
    (partial: Partial<GameSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...partial };
        return next;
      });
    },
    []
  );

  useEffect(() => {
    const aiSymbol = settings.humanSymbol === 'X' ? 'O' : 'X';
    if (
      gameState.gameStatus === 'playing' &&
      gameState.currentPlayer === aiSymbol &&
      !isAiThinking
    ) {
      triggerAiTurn(gameState);
    }
  }, []);

  const lastMove =
    gameState.history.length > 0
      ? gameState.history[gameState.history.length - 1].move
      : null;

  return {
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
  };
}
