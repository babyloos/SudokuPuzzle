import { getLocales } from 'expo-localization';

const locale = getLocales()[0]?.languageCode ?? 'en';
const lang = locale === 'ja' ? 'ja' : locale === 'zh' ? 'zh' : 'en';

const strings = {
  en: {
    appName: 'Sudoku Puzzle',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    newGame: 'New Game',
    time: 'Time',
    mistakes: 'Mistakes',
    hint: 'Hint',
    erase: 'Erase',
    notes: 'Notes',
    undo: 'Undo',
    youWin: 'Puzzle Complete!',
    tooManyMistakes: 'Too many mistakes!',
    playAgain: 'Play Again',
    selectDifficulty: 'Select Difficulty',
    best: 'Best',
  },
  ja: {
    appName: '数独パズル',
    easy: '易しい',
    medium: '普通',
    hard: '難しい',
    newGame: '新しいゲーム',
    time: '時間',
    mistakes: 'ミス',
    hint: 'ヒント',
    erase: '消去',
    notes: 'メモ',
    undo: '元に戻す',
    youWin: 'クリア！',
    tooManyMistakes: 'ミスが多すぎます！',
    playAgain: 'もう一度',
    selectDifficulty: '難易度を選択',
    best: 'ベスト',
  },
  zh: {
    appName: '数独拼图',
    easy: '简单',
    medium: '中等',
    hard: '困难',
    newGame: '新游戏',
    time: '时间',
    mistakes: '错误',
    hint: '提示',
    erase: '清除',
    notes: '笔记',
    undo: '撤销',
    youWin: '完成！',
    tooManyMistakes: '错误太多！',
    playAgain: '再玩一次',
    selectDifficulty: '选择难度',
    best: '最佳',
  },
};

export const t = strings[lang];
