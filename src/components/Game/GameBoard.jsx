import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useAuth } from '../../contexts/AuthContext';
import { progressService } from '../../services/progressService';
import { GAME_CONFIG } from '../../utils/constants';
import Button from '../UI/Button';
import Card from '../UI/Card';
import AudioButton from './AudioButton';
import WordOptions from './WordOptions';
import ScoreDisplay from './ScoreDisplay';

const GameBoard = ({ selectedWordList, onBackToMenu }) => {
  const { currentUser } = useAuth();
  const { gameState, generateNewQuestion, handleAnswer, getStats, resetGame, getGameData } = useGameLogic();
  const { speak } = useSpeechSynthesis();
  const stats = getStats();

  const handleWordSelection = async (selectedWord) => {
    const isCorrect = handleAnswer(selectedWord);
    
    // Save progress after each answer
    if (currentUser) {
      try {
        const gameData = getGameData();
        await progressService.saveGameProgress(currentUser.uid, gameData);
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
    
    if (isCorrect) {
      setTimeout(() => {
        const newWord = generateNewQuestion();
        setTimeout(() => speak(newWord), 500);
      }, GAME_CONFIG.CELEBRATION_DURATION);
    } else {
      speak(gameState.currentWord);
      setTimeout(() => {
        const newWord = generateNewQuestion();
        setTimeout(() => speak(newWord), 500);
      }, GAME_CONFIG.FEEDBACK_DURATION);
    }
  };

  const handleReset = () => {
    resetGame();
    onBackToMenu();
  };

  // Auto-play word when question changes
  useEffect(() => {
    if (gameState.currentWord) {
      setTimeout(() => speak(gameState.currentWord), 500);
    }
  }, [gameState.currentWord, speak]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button and word list info */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={handleReset}
            variant="secondary"
            size="medium"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Button>
          
          {selectedWordList && (
            <div className="bg-white/90 rounded-lg px-4 py-2">
              <div className="text-sm text-gray-600">Playing:</div>
              <div className="font-semibold text-gray-800">{selectedWordList.title}</div>
            </div>
          )}
        </div>

        <ScoreDisplay 
          score={stats.score}
          total={stats.total}
          percentage={stats.percentage}
          onReset={handleReset}
        />

        <Card className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Listen carefully and click the word you hear!
          </h2>
          
          <AudioButton 
            word={gameState.currentWord}
            onSpeak={speak}
          />
          
          <WordOptions 
            options={gameState.options}
            onSelectWord={handleWordSelection}
          />

          {/* Feedback */}
          {gameState.feedback && (
            <div className={`text-xl font-bold p-4 rounded-2xl ${
              gameState.feedback.includes('Great') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {gameState.feedback}
            </div>
          )}

          {/* Celebration animation */}
          {gameState.showCelebration && (
            <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
              <div className="text-6xl animate-bounce">
                🎉 ⭐ 🎉
              </div>
            </div>
          )}
        </Card>

        {/* Word list info footer */}
        {selectedWordList && (
          <div className="mt-6 bg-white/90 rounded-xl p-4 text-center">
            <p className="text-gray-700">
              <strong>Playing with:</strong> {selectedWordList.title} 
              ({selectedWordList.words?.length} words, {selectedWordList.difficulty} level)
            </p>
            {selectedWordList.description && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedWordList.description}
              </p>
            )}
          </div>
        )}

        {/* Default instructions */}
        {!selectedWordList && (
          <div className="mt-6 bg-white/90 rounded-xl p-4 text-center">
            <p className="text-gray-700">
              <strong>For Teachers:</strong> This game uses text-to-speech for pronunciation. 
              You can create custom word lists and share them with other teachers.
              Student progress is automatically tracked.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;