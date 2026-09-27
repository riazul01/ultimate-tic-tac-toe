import React from 'react';
import type { GameSettings } from '../../engine/game/types';
import { Modal } from '../ui/Modal';
import { soundManager } from '../../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (partial: Partial<GameSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const handleSoundToggle = (enabled: boolean) => {
    onUpdateSettings({ soundEnabled: enabled });
    if (enabled) {
      soundManager.playPlayerMove();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Game Settings">
      <div className="space-y-4 text-sm text-slate-300">
        {/* Color Theme Preference */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div>
            <div className="font-semibold text-slate-100">Color Theme</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Visual mode for interface and game boards
            </div>
          </div>
          <div className="theme-selector-group flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                settings.theme === 'dark'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400'
              }`}
            >
              Dark
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ theme: 'light' })}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                settings.theme === 'light'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400'
              }`}
            >
              Light
            </button>
          </div>
        </div>

        {/* Sound Effects */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div>
            <div className="font-semibold text-slate-100 flex items-center space-x-2">
              <span>Sound Effects</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Audio cues for moves, sector wins, and victory fanfare
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => handleSoundToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Animations */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div>
            <div className="font-semibold text-slate-100">Board Animations</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Smooth victory strike lines and piece placement pops
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.animationsEnabled}
              onChange={(e) =>
                onUpdateSettings({ animationsEnabled: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Developer / Telemetry Debug Mode */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div>
            <div className="font-semibold text-slate-100 flex items-center space-x-1.5">
              <span>Developer / AI Telemetry</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Show live search depth, evaluated nodes, and position score
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.debugMode}
              onChange={(e) =>
                onUpdateSettings({ debugMode: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>
    </Modal>
  );
};
