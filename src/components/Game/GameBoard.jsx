import React, { useEffect } from 'react';
import { ArrowLeft, Volume2, Star, RotateCcw } from 'lucide-react';

const GameBoard = ({ selectedWordList, onBackToMenu, gameState, onWordSelection, onSpeak, onReset, stats }) => {
  
  // Auto-play word when question changes
  useEffect(() => {
    if (gameState.currentWord) {
      setTimeout(() => onSpeak(gameState.currentWord), 500);
    }
  }, [gameState.currentWord, onSpeak]);

  // Debug logging
  console.log('GameBoard render:', {
    currentWord: gameState.currentWord,
    options: gameState.options,
    optionsLength: gameState.options?.length
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button and word list info */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToMenu}
            className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </button>
          
          {selectedWordList && (
            <div className="bg-white/90 rounded-lg px-4 py-2">
              <div className="text-sm text-gray-600">Playing:</div>
              <div className="font-semibold text-gray-800">{selectedWordList.title}</div>
            </div>
          )}
        </div>

        {/* Score Display */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold text-gray-800">{stats.score} points</span>
            </div>
            {stats.total > 0 && (
              <div className="text-sm text-gray-600">
                {stats.percentage}% correct ({stats.score}/{stats.total})
              </div>
            )}
          </div>
          
          <button
            onClick={onReset}
            className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Game</span>
          </button>
        </div>

        {/* Main Game Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Listen carefully and click the word you hear!
          </h2>
          
          {/* Speaker button */}
          <div className="mb-6">
            <button
              onClick={() => onSpeak(gameState.currentWord)}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
            >
              <Volume2 className="w-8 h-8" />
            </button>
            <p className="text-gray-600 text-lg mt-4">
              Click the speaker to hear the word again
            </p>
          </div>

          {/* Debug info - remove this once working */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
              Debug: Word="{gameState.currentWord}", Options={gameState.options?.length || 0}
            </div>
          )}
          
          {/* Word Options */}
          {gameState.options && gameState.options.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {gameState.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onWordSelection(option.word)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-2xl font-bold py-6 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-h-20"
                >
                  {option.word}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-8 p-4 bg-red-100 text-red-800 rounded">
              No word options available. Check console for errors.
            </div>
          )}

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
        </div>

        {/* Instructions footer */}
        <div className="mt-6 bg-white/90 rounded-xl p-4 text-center">
          <p className="text-gray-700">
            <strong>For Teachers:</strong> This game uses text-to-speech for pronunciation. 
            You can create custom word lists and share them with other teachers.
            Student progress is automatically tracked.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;