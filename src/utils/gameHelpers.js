import { sightWords } from '../data/sightWords';

export const generateGameQuestion = () => {
  const correctWord = sightWords[Math.floor(Math.random() * sightWords.length)];
  const wrongWords = sightWords
    .filter(w => w.word !== correctWord.word)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  
  const allOptions = [correctWord, ...wrongWords]
    .sort(() => 0.5 - Math.random());
  
  return {
    correctWord: correctWord.word,
    options: allOptions
  };
};

export const calculatePercentage = (score, total) => {
  return total > 0 ? Math.round((score / total) * 100) : 0;
};