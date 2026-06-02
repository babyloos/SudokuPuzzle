import React, { memo } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import {
  CELL_BG, CELL_GIVEN_BG, CELL_SELECTED_BG, CELL_PEER_BG, CELL_SAME_NUM_BG,
  CELL_ERROR_BG, CELL_BORDER, BOX_BORDER, TEXT_GIVEN, TEXT_USER, TEXT_ERROR, TEXT_DIM,
} from '../constants/theme';

interface Props {
  value: number;
  notes: string[];
  isGiven: boolean;
  isSelected: boolean;
  isPeer: boolean;
  isSameNum: boolean;
  isError: boolean;
  row: number;
  col: number;
  onPress: () => void;
}

const SudokuCell = memo(({
  value, notes, isGiven, isSelected, isPeer, isSameNum, isError, row, col, onPress,
}: Props) => {
  const rightBorder = (col + 1) % 3 === 0 && col !== 8;
  const bottomBorder = (row + 1) % 3 === 0 && row !== 8;

  let bg = isGiven ? CELL_GIVEN_BG : CELL_BG;
  if (isSelected) bg = CELL_SELECTED_BG;
  else if (isError) bg = CELL_ERROR_BG;
  else if (isSameNum) bg = CELL_SAME_NUM_BG;
  else if (isPeer) bg = CELL_PEER_BG;

  let textColor = isGiven ? TEXT_GIVEN : isError ? TEXT_ERROR : TEXT_USER;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.cell,
        { backgroundColor: bg },
        rightBorder && styles.rightBox,
        bottomBorder && styles.bottomBox,
      ]}
      activeOpacity={0.7}
    >
      {value !== 0 ? (
        <Text style={[styles.valueText, { color: textColor }]}>{value}</Text>
      ) : notes.length > 0 ? (
        <View style={styles.notesGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <Text key={n} style={styles.noteText}>
              {notes.includes(String(n)) ? String(n) : ' '}
            </Text>
          ))}
        </View>
      ) : null}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 0.5,
    borderColor: CELL_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightBox: {
    borderRightWidth: 2,
    borderRightColor: BOX_BORDER,
  },
  bottomBox: {
    borderBottomWidth: 2,
    borderBottomColor: BOX_BORDER,
  },
  valueText: {
    fontSize: 20,
    fontWeight: '600',
  },
  notesGrid: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 1,
  },
  noteText: {
    width: '33%',
    fontSize: 8,
    textAlign: 'center',
    color: TEXT_DIM,
    lineHeight: 11,
  },
});

export default SudokuCell;
