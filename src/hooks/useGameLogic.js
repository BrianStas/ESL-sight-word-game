import { useState, useCallback } from 'react';
import { calculatePercentage } from '../utils/gameHelpers';
import { sightWords } from '../data/sightWords';

// Game helper function
const generateGameQuestion = (wordList) => {
  const words = wordList && wordList.length > 0 ? wordList : sightWords;
  
  if (words.length === 0) {
    console.error('No words available for game');
    return null;
  }

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
    console.log('Starting game with word list:', wordList);
    
    // Determine which words to use
    const wordsToUse = wordList?.words || sightWords;
    console.log('Words to use:', wordsToUse);
    
    // Generate first question
    const question = generateGameQuestion(wordsToUse);
    
    if (!question) {
      console.error('Failed to generate question');
      return;
    }

    console.log('Generated question:', question);
    
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
    
    if (!question) {
      console.error('Failed to generate new question');
      return '';
    }
    
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
    const isCorrect = selectedWord === gameState.currentWord;
    
    setGameState(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      score: isCorrect ? prev.score + 1 : prev.score,
      feedback: isCorrect ? 'Great job! 🎉' : `Try again! The word was "${prev.currentWord}"`,
      showCelebration: isCorrect
    }));

    return isCorrect;
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
    timeSpent: 0 // for time tracking
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