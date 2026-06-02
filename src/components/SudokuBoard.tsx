import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BOX_BORDER } from '../constants/theme';
import SudokuCell from './SudokuCell';
import { useGameStore } from '../store/gameStore';

const SudokuBoard = memo(() => {
  const grid = useGameStore(s => s.grid);
  const puzzle = useGameStore(s => s.puzzle);
  const solution = useGameStore(s => s.solution);
  const notes = useGameStore(s => s.notes);
  const selected = useGameStore(s => s.selected);
  const selectCell = useGameStore(s => s.selectCell);

  const selectedValue = selected ? grid[selected[0]][selected[1]] : 0;

  const cells = useMemo(() => {
    const rows = [];
    for (let r = 0; r < 9; r++) {
      const cols = [];
      for (let c = 0; c < 9; c++) {
        const isSelected = !!selected && selected[0] === r && selected[1] === c;
        const isPeer = !isSelected && !!selected && (
          selected[0] === r ||
          selected[1] === c ||
          (Math.floor(selected[0] / 3) === Math.floor(r / 3) &&
           Math.floor(selected[1] / 3) === Math.floor(c / 3))
        );
        const val = grid[r][c];
        const isSameNum = !isSelected && selectedValue !== 0 && val === selectedValue;
        const isGiven = puzzle[r][c] !== 0;
        const isError = !isGiven && val !== 0 && val !== solution[r][c];

        cols.push(
          <SudokuCell
            key={c}
            value={val}
            notes={notes[r][c]}
            isGiven={isGiven}
            isSelected={isSelected}
            isPeer={isPeer}
            isSameNum={isSameNum}
            isError={isError}
            row={r}
            col={c}
            onPress={() => selectCell(r, c)}
          />
        );
      }
      rows.push(
        <View key={r} style={styles.row}>
          {cols}
        </View>
      );
    }
    return rows;
  }, [grid, puzzle, solution, notes, selected, selectedValue, selectCell]);

  return (
    <View style={styles.board}>
      {cells}
    </View>
  );
});

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: BOX_BORDER,
    alignSelf: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
});

export default SudokuBoard;
