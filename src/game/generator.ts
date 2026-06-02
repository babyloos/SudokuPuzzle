// Sudoku generator using backtracking

export type Grid = number[][]; // 9x9, 0=empty
export type Difficulty = 'easy' | 'medium' | 'hard';

const CLUE_COUNT: Record<Difficulty, number> = {
  easy: 38,
  medium: 30,
  hard: 24,
};

function isValid(grid: Grid, row: number, col: number, num: number): boolean {
  // Check row
  if (grid[row].includes(num)) return false;
  // Check column
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false;
  }
  // Check 3x3 box
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }
  return true;
}

function fillGrid(grid: Grid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        for (const num of nums) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function countSolutions(grid: Grid, limit = 2): number {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        let count = 0;
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            count += countSolutions(grid, limit - count);
            grid[row][col] = 0;
            if (count >= limit) return count;
          }
        }
        return count;
      }
    }
  }
  return 1;
}

function cloneGrid(grid: Grid): Grid {
  return grid.map(row => [...row]);
}

export function generatePuzzle(difficulty: Difficulty): { puzzle: Grid; solution: Grid } {
  // Generate full solution
  const solution: Grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillGrid(solution);

  const puzzle = cloneGrid(solution);
  const clues = CLUE_COUNT[difficulty];
  const toRemove = 81 - clues;

  // Get all positions and shuffle
  const positions = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  positions.sort(() => Math.random() - 0.5);

  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= toRemove) break;
    const val = puzzle[r][c];
    puzzle[r][c] = 0;
    const test = cloneGrid(puzzle);
    if (countSolutions(test) !== 1) {
      puzzle[r][c] = val; // restore if not unique solution
    } else {
      removed++;
    }
  }

  return { puzzle, solution };
}

export function solveSudoku(grid: Grid): Grid | null {
  const g = cloneGrid(grid);
  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (g[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(g, row, col, num)) {
              g[row][col] = num;
              if (solve()) return true;
              g[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  return solve() ? g : null;
}
