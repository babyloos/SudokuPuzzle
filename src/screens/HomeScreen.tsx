import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { BANNER_AD_UNIT_ID } from '../utils/ads';
import { initSounds } from '../utils/sounds';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BG, SURFACE, ACCENT, TEXT, TEXT_DIM, BOX_BORDER } from '../constants/theme';
import { t } from '../i18n';
import { Difficulty } from '../game/generator';
import { useGameStore } from '../store/gameStore';

type Props = { navigation: NativeStackNavigationProp<any> };

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const DIFF_LABELS: Record<Difficulty, string> = { easy: t.easy, medium: t.medium, hard: t.hard };

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function MiniBoard() {
  const demo = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];
  return (
    <View style={mini.board}>
      {demo.map((row, r) => (
        <View key={r} style={mini.row}>
          {row.map((v, c) => (
            <View
              key={c}
              style={[
                mini.cell,
                (c + 1) % 3 === 0 && c !== 8 && mini.rightBox,
                (r + 1) % 3 === 0 && r !== 8 && mini.bottomBox,
              ]}
            >
              {v !== 0 && <Text style={mini.text}>{v}</Text>}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const mini = StyleSheet.create({
  board: { borderWidth: 1.5, borderColor: BOX_BORDER, alignSelf: 'center', marginBottom: 24 },
  row: { flexDirection: 'row' },
  cell: { width: 28, height: 28, borderWidth: 0.5, borderColor: '#2a4a6a', alignItems: 'center', justifyContent: 'center' },
  rightBox: { borderRightWidth: 1.5, borderRightColor: BOX_BORDER },
  bottomBox: { borderBottomWidth: 1.5, borderBottomColor: BOX_BORDER },
  text: { fontSize: 11, color: TEXT, fontWeight: '600' },
});

export default function HomeScreen({ navigation }: Props) {
  const startGame = useGameStore(s => s.startGame);
  const bestTimes = useGameStore(s => s.bestTimes);

  useEffect(() => { initSounds(); }, []);

  const handleStart = (difficulty: Difficulty) => {
    startGame(difficulty);
    navigation.navigate('Game');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.appName}</Text>
      <MiniBoard />
      <Text style={styles.selectLabel}>{t.selectDifficulty}</Text>
      {DIFFICULTIES.map(d => (
        <TouchableOpacity key={d} style={styles.diffBtn} onPress={() => handleStart(d)}>
          <Text style={styles.diffLabel}>{DIFF_LABELS[d]}</Text>
          {bestTimes[d] !== null && (
            <Text style={styles.best}>{t.best}: {formatTime(bestTimes[d]!)}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: TEXT,
    marginBottom: 28,
    letterSpacing: 1,
  },
  selectLabel: {
    fontSize: 14,
    color: TEXT_DIM,
    marginBottom: 12,
  },
  diffBtn: {
    width: '100%',
    backgroundColor: SURFACE,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BOX_BORDER,
  },
  diffLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: ACCENT,
  },
  best: {
    fontSize: 12,
    color: TEXT_DIM,
    marginTop: 4,
  },
});

