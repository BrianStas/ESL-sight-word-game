import { useState, useCallback } from 'react';
import { calculatePercentage } from '../utils/gameHelpers';
import { GAME_CONFIG, FEEDBACK_MESSAGES } from '../utils/constants';
import { sightWords } from '../data/sightWords';

const generateGameQuestion = (wordList) => {
  const words = wordList || sightWords;
  const correctWord = words[Math.floor(Math.random() * words.length)];
  const wrongWords = words
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

export const useGameLogic = () => {
  const [gameState, setGameState] = useState({
    currentWord: '',
    options: [],
    score: 0,
    totalQuestions: 0,
    feedback: '',
    showCelebration: false,
    gameStarted: false,
    currentWordList: null
  });

  const startGame = useCallback((wordList = null) => {
    const wordsToUse = wordList?.words || sightWords;
    const question = generateGameQuestion(wordsToUse);
    
    setGameState({
      currentWord: question.correctWord,
      options: question.options,
      score: 0,
      totalQuestions: 0,
      feedback: '',
      showCelebration: false,
      gameStarted: true,
      currentWordList: wordList
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      currentWord: '',
      options: [],
      score: 0,
      totalQuestions: 0,
      feedback: '',
      showCelebration: false,
      gameStarted: false,
      currentWordList: null
    });
  }, []);

  const generateNewQuestion = useCallback(() => {
    const wordsToUse = gameState.currentWordList?.words || sightWords;
    const question = generateGameQuestion(wordsToUse);
    
    setGameState(prev => ({
      ...prev,
      currentWord: question.correctWord,
      options: question.options,
      feedback: '',
      showCelebration: false
    }));
    
    return question.correctWord;
  }, [gameState.currentWordList]);

  const handleAnswer = useCallback((selectedWord) => {
    setGameState(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      score: selectedWord === prev.currentWord ? prev.score + 1 : prev.score,
      feedback: selectedWord === prev.currentWord 
        ? FEEDBACK_MESSAGES.CORRECT 
        : FEEDBACK_MESSAGES.INCORRECT(prev.currentWord),
      showCelebration: selectedWord === prev.currentWord
    }));

    return selectedWord === gameState.currentWord;
  }, [gameState.currentWord]);

  const getStats = useCallback(() => ({
    score: gameState.score,
    total: gameState.totalQuestions,
    percentage: calculatePercentage(gameState.score, gameState.totalQuestions)
  }), [gameState.score, gameState.totalQuestions]);

  const getGameData = useCallback(() => ({
    wordListId: gameState.currentWordList?.id || 'default',
    wordListTitle: gameState.currentWordList?.title || 'Default Sight Words',
    score: gameState.score,
    totalQuestions: gameState.totalQuestions,
    percentage: calculatePercentage(gameState.score, gameState.totalQuestions),
    timeSpent: 0 // You can add time tracking later
  }), [gameState]);

  return {
    gameState,
    startGame,
    resetGame,
    generateNewQuestion,
    handleAnswer,
    getStats,
    getGameData
  };
};