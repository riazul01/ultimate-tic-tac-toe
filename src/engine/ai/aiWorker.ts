import type { AIDifficulty, GameState } from '../game/types';
import { AIAgent } from './aiAgent';

const agent = new AIAgent();

self.onmessage = (
  e: MessageEvent<{
    id: number;
    state: GameState;
    difficulty: AIDifficulty;
  }>
) => {
  const { id, state, difficulty } = e.data;
  try {
    const result = agent.computeMove(state, difficulty);
    self.postMessage({ id, success: true, result });
  } catch (error: any) {
    self.postMessage({ id, success: false, error: error?.message || 'AI Error' });
  }
};
