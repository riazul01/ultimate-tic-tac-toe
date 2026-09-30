# Ultimate Tic-Tac-Toe

An strategic 81-cell **Ultimate Tic-Tac-Toe** game built with **React 19**, **TypeScript**, and **Tailwind CSS**, featuring an intelligent search-driven AI opponent.

[Live Preview](https://ultimate-tic-tac-toe-ai.vercel.app/)

---

## Features

- **Nested Strategic Board (81 Cells)**: 3×3 macro grid composed of 3×3 micro boards. Every move dictates where your opponent must play next.
- **Smart AI Opponent**:
 - **Easy (1-Ply)**: Relaxed tactical play with occasional openings.
 - **Medium (3-Ply)**: Solid defense that blocks immediate winning threats.
 - **Hard (5-Ply)**: Deep Alpha-Beta minimax search and board routing strategy.
 - **Expert (7-Ply)**: Iterative deepening with transposition caching for grandmaster-level play.
- **Non-Blocking Web Worker**: AI calculations run in a dedicated background worker to ensure 60fps UI responsiveness.
- **Side Selection**: Play as **X** (1st move) or **O** (2nd move with AI playing the opening move).
- **Move History Modal**: Clean modal with custom `SimpleBar` auto-hiding scrollbar displaying every turn, destination board coordinates, and timestamps.
- **Undo / Redo**: Step back or replay tactical moves anytime during play.
- **Theme Support**: Seamless **Dark Mode** and **Light Mode** palettes with clean, shadow-free minimalist styling.
- **Interactive Audio**: Custom Web Audio synthesizer sound effects for moves, captures, wins, and draws with one-click mute.
- **Career Statistics**: Tracks games played, human wins, AI wins, draws, and win streaks in `localStorage`.

---

## Game Rules

1. **The Grid**: The board contains 9 micro-boards arranged in a 3×3 macro grid.
2. **Destination Routing**: Whichever cell you pick within a micro-board determines which micro-board your opponent must play in next.
  - *Example*: Placing your mark in the top-right cell forces the next player into the top-right micro-board.
3. **Winning a Micro-Board**: Align 3 marks in a row (horizontal, vertical, or diagonal) inside a micro-board to claim that sector.
4. **Free Choice (Forced-Board Exception)**: If sent to a board that is already won or full, you may play in **any** available open board.
5. **Winning the Game**: Claim **3 micro-boards in a row** on the macro grid to achieve victory!

---

## Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Custom dark/light theme tokens)
- **State & Game Engine**: Custom deterministic minimax engine with Alpha-Beta pruning & Web Worker support
- **UI Components**: SimpleBar for custom overlay scrollbars, SVG vector graphics
- **Audio**: Web Audio API Sound Synthesizer
- **Testing**: Vitest test suite

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm`

### Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/riazul01/ultimate-tic-tac-toe.git
  cd ultimate-tic-tac-toe
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Start the local development server:
  ```bash
  npm run dev
  ```

4. Open your browser and navigate to:
  ```
  http://localhost:5173
  ```

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Vite development server with Hot Module Replacement |
| `npm run build` | Type-check with TypeScript and build the production bundle |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the Vitest engine and AI simulation test suite |
| `npm run lint` | Run Oxlint linter for code health |

---

## Project Structure

```
ultimate-tic-tac-toe/
├── src/
│   ├── components/
│   │   ├── game/          # GameBoard, MicroBoard, Cell, Controls, Status
│   │   ├── modals/        # MoveHistoryModal, RulesModal, StatsModal, ResultModal
│   │   └── ui/            # Reusable Modal base component
│   ├── engine/
│   │   ├── ai/            # Minimax engine, Alpha-Beta pruning, Web Worker, Difficulty
│   │   ├── game/          # Board state, rules verification, move generator
│   │   └── __tests__/     # Engine and AI simulation test suites
│   ├── hooks/
│   │   └── useGame.ts     # Core game state management hook
│   ├── pages/
│   │   ├── HomePage.tsx   # Match setup, side selector, difficulty, career stats
│   │   └── GamePage.tsx   # Main match arena and controls
│   ├── utils/
│   │   ├── sound.ts       # Web Audio synthesizer manager
│   │   └── storage.ts     # LocalStorage persistence helpers
│   ├── App.tsx            # Route configuration
│   ├── main.tsx           # Application entry point
│   └── index.css          # Design system, theme variables & Tailwind setup
├── public/                # Static assets
├── package.json
└── tsconfig.json
```

---

## License

This project is open-source and available under the [MIT License](LICENSE).

