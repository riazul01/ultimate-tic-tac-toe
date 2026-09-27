import type { GameSettings, GameState, GameStats } from '../engine/game/types';

const STORAGE_KEYS = {
  GAME_STATE: 'uttt_game_state_v1',
  GAME_STATS: 'uttt_game_stats_v1',
  GAME_SETTINGS: 'uttt_game_settings_v1',
};

export const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'medium',
  humanSymbol: 'X',
  soundEnabled: true,
  animationsEnabled: true,
  debugMode: false,
  theme: 'dark',
};

export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  humanWins: 0,
  aiWins: 0,
  draws: 0,
  currentStreak: 0,
  bestStreak: 0,
};

/**
 * Validate a restored game state object before accepting it.
 */
export function validateGameState(data: any): data is GameState {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.boards) || data.boards.length !== 9) return false;
  for (let b = 0; b < 9; b++) {
    if (!Array.isArray(data.boards[b]) || data.boards[b].length !== 9) return false;
  }
  if (!Array.isArray(data.boardStatuses) || data.boardStatuses.length !== 9) return false;
  if (data.currentPlayer !== 'X' && data.currentPlayer !== 'O') return false;
  if (data.gameStatus !== 'playing' && data.gameStatus !== 'finished') return false;
  return true;
}

export function loadSavedGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (validateGameState(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse saved game state:', err);
  }
  return null;
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save game state to localStorage:', err);
  }
}

export function clearSavedGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  } catch (err) {
    console.warn('Failed to remove saved game state:', err);
  }
}

export function loadGameStats(): GameStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAME_STATS);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw);
    return {
      gamesPlayed: typeof parsed.gamesPlayed === 'number' ? parsed.gamesPlayed : 0,
      humanWins: typeof parsed.humanWins === 'number' ? parsed.humanWins : 0,
      aiWins: typeof parsed.aiWins === 'number' ? parsed.aiWins : 0,
      draws: typeof parsed.draws === 'number' ? parsed.draws : 0,
      currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
      bestStreak: typeof parsed.bestStreak === 'number' ? parsed.bestStreak : 0,
    };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveGameStats(stats: GameStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
  } catch (err) {
    console.warn('Failed to save stats to localStorage:', err);
  }
}

export function loadGameSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      difficulty: ['easy', 'medium', 'hard', 'expert'].includes(parsed.difficulty)
        ? parsed.difficulty
        : DEFAULT_SETTINGS.difficulty,
      humanSymbol: parsed.humanSymbol === 'O' ? 'O' : 'X',
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      animationsEnabled: typeof parsed.animationsEnabled === 'boolean' ? parsed.animationsEnabled : true,
      debugMode: typeof parsed.debugMode === 'boolean' ? parsed.debugMode : false,
      theme: ['dark', 'light', 'system'].includes(parsed.theme) ? parsed.theme : 'dark',
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveGameSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings:', err);
  }
}
