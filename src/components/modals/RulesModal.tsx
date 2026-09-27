import React from 'react';
import { Modal } from '../ui/Modal';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play Ultimate Tic-Tac-Toe">
      <div className="space-y-4 text-sm text-slate-300">
        <div>
          <h4 className="font-semibold text-slate-100 mb-1">1. The Macro & Micro Boards</h4>
          <p className="leading-relaxed">
            The game consists of a <strong className="text-indigo-300">3×3 macro board</strong>, where each cell contains a complete <strong className="text-indigo-300">3×3 micro board</strong> (81 cells total).
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-100 mb-1">2. Destination Board Routing</h4>
          <p className="leading-relaxed">
            Every move you make dictates where your opponent must play next!
            If you place your piece in the <em>top-right cell</em> of any micro board, your opponent is forced to play inside the <em>top-right micro board</em>.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-amber-300 mb-1">3. Forced-Board Exception (Free Choice)</h4>
          <p className="leading-relaxed">
            If you are sent to a micro board that has <strong>already been won</strong> or is <strong>completely full</strong>, you are free to play in <em>any available open board</em> on the grid!
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-100 mb-1">4. Winning a Micro Board</h4>
          <p className="leading-relaxed">
            Get 3 in a row (horizontal, vertical, or diagonal) inside any micro board to win that entire sector. Once won, that sector is locked.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sky-300 mb-1">5. Winning the Overall Game</h4>
          <p className="leading-relaxed">
            Win <strong>3 micro boards in a row</strong> on the macro board to win the entire match!
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
          <p>💡 <em>Tip:</em> Always think one step ahead — avoid sending the AI to a board where it can easily win or get a free choice.</p>
        </div>
      </div>
    </Modal>
  );
};
