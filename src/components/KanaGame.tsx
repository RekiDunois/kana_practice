import { useState, useEffect, useCallback } from 'react';
import { hiraganaMap, katakanaMap, type KanaMapping } from '../data/kanaMap';

const KanaGame = () => {
  const [currentKana, setCurrentKana] = useState<KanaMapping | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const generateRandomKana = useCallback(() => {
    const allKana = [...hiraganaMap, ...katakanaMap];
    const randomIndex = Math.floor(Math.random() * allKana.length);
    setCurrentKana(allKana[randomIndex]);
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    generateRandomKana();
  }, [generateRandomKana]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!currentKana) return;

      const pressedKey = event.key.toLowerCase();
      const isKeyCorrect = pressedKey === currentKana.key;

      setIsCorrect(isKeyCorrect);
      if (isKeyCorrect) {
        setScore((prev) => prev + 1);
        setTimeout(generateRandomKana, 1000);
      }
    },
    [currentKana, generateRandomKana]
  );

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="kana-game">
      <div className="score">得分: {score}</div>
      <div className="kana-display">
        {currentKana && (
          <>
            <div className="kana">{currentKana.kana}</div>
            <div className="romaji">{currentKana.romaji}</div>
          </>
        )}
      </div>
      <div className={`feedback ${isCorrect === null ? '' : isCorrect ? 'correct' : 'incorrect'}`}>
        {isCorrect === null ? '请输入对应的键盘按键' : isCorrect ? '正确！' : '错误，请重试'}
      </div>
      <div className="instruction">
        提示：输入假名对应的罗马字首字母
      </div>
    </div>
  );
};

export default KanaGame;