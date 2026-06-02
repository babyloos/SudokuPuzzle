import React, { memo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NUM_PAD_BG, NUM_PAD_TEXT, ACCENT, SURFACE, TEXT_DIM } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import { t } from '../i18n';

const NumberPad = memo(() => {
  const inputNumber = useGameStore(s => s.inputNumber);
  const erase = useGameStore(s => s.erase);
  const toggleNotesMode = useGameStore(s => s.toggleNotesMode);
  const undo = useGameStore(s => s.undo);
  const useHint = useGameStore(s => s.useHint);
  const notesMode = useGameStore(s => s.notesMode);
  const hintsLeft = useGameStore(s => s.hintsLeft);

  return (
    <View style={styles.container}>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={undo}>
          <Text style={styles.actionIcon}>↩</Text>
          <Text style={styles.actionLabel}>{t.undo}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, notesMode && styles.actionBtnActive]}
          onPress={toggleNotesMode}
        >
          <Text style={[styles.actionIcon, notesMode && styles.activeText]}>✏</Text>
          <Text style={[styles.actionLabel, notesMode && styles.activeText]}>{t.notes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={erase}>
          <Text style={styles.actionIcon}>⌫</Text>
          <Text style={styles.actionLabel}>{t.erase}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={useHint} disabled={hintsLeft === 0}>
          <Text style={[styles.actionIcon, hintsLeft === 0 && styles.dimText]}>💡</Text>
          <Text style={[styles.actionLabel, hintsLeft === 0 && styles.dimText]}>
            {t.hint} ({hintsLeft})
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.numRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <TouchableOpacity key={n} style={styles.numBtn} onPress={() => inputNumber(n)}>
            <Text style={styles.numText}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 8,
    paddingTop: 12,
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: SURFACE,
    minWidth: 60,
  },
  actionBtnActive: {
    backgroundColor: ACCENT + '33',
    borderWidth: 1,
    borderColor: ACCENT,
  },
  actionIcon: {
    fontSize: 20,
    color: NUM_PAD_TEXT,
  },
  actionLabel: {
    fontSize: 10,
    color: NUM_PAD_TEXT,
    marginTop: 2,
  },
  activeText: {
    color: ACCENT,
  },
  dimText: {
    color: TEXT_DIM,
  },
  numRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  numBtn: {
    flex: 1,
    aspectRatio: 0.9,
    backgroundColor: NUM_PAD_BG,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a4a6a',
  },
  numText: {
    fontSize: 22,
    fontWeight: '600',
    color: NUM_PAD_TEXT,
  },
});

export default NumberPad;
