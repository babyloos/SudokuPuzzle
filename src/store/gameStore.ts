import { create } from 'zustand';
import { generatePuzzle, solveSudoku, Grid, Difficulty } from '../game/generator';

export interface HistoryEntry {
  grid: Grid;
  notes: string[][][];
}

interface GameState {
  puzzle: Grid;
  solution: Grid;
  grid: Grid;
  notes: string[][][]; // [row][col] = array of note digits
  selected: [number, number] | null;
  difficulty: Difficulty;
  mistakes: number;
  maxMistakes: number;
  seconds: number;
  running: boolean;
  won: boolean;
  lost: boolean;
  notesMode: boolean;
  history: HistoryEntry[];
  bestTimes: Record<Difficulty, number | null>;
  hintsLeft: number;

  startGame: (difficulty: Difficulty) => void;
  selectCell: (row: number, col: number) => void;
  inputNumber: (num: number) => void;
  erase: () => void;
  toggleNotesMode: () => void;
  undo: () => void;
  useHint: () => void;
  tick: () => void;
}

function emptyNotes(): string[][][] {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []));
}

function cloneGrid(g: Grid): Grid {
  return g.map(r => [...r]);
}

function cloneNotes(n: string[][][]): string[][][] {
  return n.map(row => row.map(cell => [...cell]));
}

function checkWin(grid: Grid, solution: Grid): boolean {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (grid[r][c] !== solution[r][c]) return false;
  return true;
}

export const useGameStore = create<GameState>((set, get) => ({
  puzzle: Array.from({ length: 9 }, () => Array(9).fill(0)),
  solution: Array.from({ length: 9 }, () => Array(9).fill(0)),
  grid: Array.from({ length: 9 }, () => Array(9).fill(0)),
  notes: emptyNotes(),
  selected: null,
  difficulty: 'medium',
  mistakes: 0,
  maxMistakes: 3,
  seconds: 0,
  running: false,
  won: false,
  lost: false,
  notesMode: false,
  history: [],
  bestTimes: { easy: null, medium: null, hard: null },
  hintsLeft: 3,

  startGame: (difficulty) => {
    const { puzzle, solution } = generatePuzzle(difficulty);
    set({
      puzzle,
      solution,
      grid: cloneGrid(puzzle),
      notes: emptyNotes(),
      selected: null,
      difficulty,
      mistakes: 0,
      seconds: 0,
      running: true,
      won: false,
      lost: false,
      notesMode: false,
      history: [],
      hintsLeft: 3,
    });
  },

  selectCell: (row, col) => {
    const { selected } = get();
    if (selected && selected[0] === row && selected[1] === col) {
      set({ selected: null });
    } else {
      set({ selected: [row, col] });
    }
  },

  inputNumber: (num) => {
    const { selected, puzzle, grid, solution, notes, notesMode, won, lost, history } = get();
    if (!selected || won || lost) return;
    const [r, c] = selected;
    if (puzzle[r][c] !== 0) return; // given cell

    if (notesMode) {
      const newNotes = cloneNotes(notes);
      const cell = newNotes[r][c];
      const s = String(num);
      const idx = cell.indexOf(s);
      if (idx >= 0) cell.splice(idx, 1);
      else cell.push(s);
      set({ notes: newNotes });
      return;
    }

    // Save history
    const snap: HistoryEntry = { grid: cloneGrid(grid), notes: cloneNotes(notes) };
    const newHistory = [...history, snap].slice(-20);

    const newGrid = cloneGrid(grid);
    const newNotes = cloneNotes(notes);

    // Clear notes for same number in row/col/box when placing
    if (newGrid[r][c] !== num) {
      newGrid[r][c] = num;
      // Clear this cell's notes
      newNotes[r][c] = [];

      let newMistakes = get().mistakes;
      let won = false;
      let lost = false;

      if (num !== solution[r][c]) {
        newMistakes += 1;
        lost = newMistakes >= get().maxMistakes;
      } else {
        won = checkWin(newGrid, solution);
      }

      const updates: Partial<GameState> = {
        grid: newGrid,
        notes: newNotes,
        history: newHistory,
        mistakes: newMistakes,
      };

      if (won) {
        const { seconds, difficulty, bestTimes } = get();
        const prev = bestTimes[difficulty];
        updates.won = true;
        updates.running = false;
        updates.bestTimes = {
          ...bestTimes,
          [difficulty]: prev === null || seconds < prev ? seconds : prev,
        };
      } else if (lost) {
        updates.lost = true;
        updates.running = false;
      }

      set(updates);
    }
  },

  erase: () => {
    const { selected, puzzle, grid, notes, won, lost, history } = get();
    if (!selected || won || lost) return;
    const [r, c] = selected;
    if (puzzle[r][c] !== 0) return;

    const snap: HistoryEntry = { grid: cloneGrid(grid), notes: cloneNotes(notes) };
    const newGrid = cloneGrid(grid);
    const newNotes = cloneNotes(notes);
    newGrid[r][c] = 0;
    newNotes[r][c] = [];
    set({ grid: newGrid, notes: newNotes, history: [...history, snap].slice(-20) });
  },

  toggleNotesMode: () => set(s => ({ notesMode: !s.notesMode })),

  undo: () => {
    const { history } = get();
    if (history.length === 0) return;
    const last = history[history.length - 1];
    set({
      grid: cloneGrid(last.grid),
      notes: cloneNotes(last.notes),
      history: history.slice(0, -1),
    });
  },

  useHint: () => {
    const { selected, puzzle, grid, solution, hintsLeft, won, lost, history, notes } = get();
    if (!selected || won || lost || hintsLeft <= 0) return;
    const [r, c] = selected;
    if (puzzle[r][c] !== 0 || grid[r][c] === solution[r][c]) return;

    const snap: HistoryEntry = { grid: cloneGrid(grid), notes: cloneNotes(notes) };
    const newGrid = cloneGrid(grid);
    const newNotes = cloneNotes(notes);
    newGrid[r][c] = solution[r][c];
    newNotes[r][c] = [];

    const isWon = checkWin(newGrid, solution);
    const updates: Partial<GameState> = {
      grid: newGrid,
      notes: newNotes,
      hintsLeft: hintsLeft - 1,
      history: [...history, snap].slice(-20),
    };

    if (isWon) {
      const { seconds, difficulty, bestTimes } = get();
      const prev = bestTimes[difficulty];
      updates.won = true;
      updates.running = false;
      updates.bestTimes = {
        ...bestTimes,
        [difficulty]: prev === null || seconds < prev ? seconds : prev,
      };
    }

    set(updates);
  },

  tick: () => {
    const { running } = get();
    if (running) set(s => ({ seconds: s.seconds + 1 }));
  },
}));
