import React, { useEffect, useState } from 'react';
import { ArrowLeft, Volume2, Star, RotateCcw, Check, X as XIcon } from 'lucide-react';

const GameBoard = ({ selectedWordList, onBackToMenu, gameState, onWordSelection, onSpeak, onReset, stats, difficulty = 'normal' }) => {
  console.log('GameBoard received difficulty prop:', difficulty); 
 
  const [spellingInput, setSpellingInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  // Auto-play word when question changes
  useEffect(() => {
    if (gameState.currentWord) {
      setTimeout(() => onSpeak(gameState.currentWord), 500);
    }
  }, [gameState.currentWord, onSpeak]);

  // Reset spelling input when word changes
  useEffect(() => {
    setSpellingInput('');
    setShowFeedback(false);
  }, [gameState.currentWord]);

  // Debug logging
  console.log('GameBoard render:', {
    currentWord: gameState.currentWord,
    options: gameState.options,
    optionsLength: gameState.options?.length,
    difficulty
  });

  // Handle spelling submission (Hard mode)
  const handleSpellingSubmit = (e) => {
    e.preventDefault();
    const isCorrect = spellingInput.trim().toLowerCase() === gameState.currentWord.toLowerCase();
    setShowFeedback(true);
    
    setTimeout(() => {
      onWordSelection(isCorrect ? gameState.currentWord : 'wrong-answer');
      setSpellingInput('');
      setShowFeedback(false);
    }, 1500);
  };

  // Handle Yes/No answer (Easy mode)
  const handleYesNo = (answer) => {
    const isMatchingWord = gameState.options[0].word === gameState.currentWord;
    const isCorrect = (answer === 'yes' && isMatchingWord) || (answer === 'no' && !isMatchingWord);
    onWordSelection(isCorrect ? gameState.currentWord : 'wrong-answer');
  };

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
          
          <div className="flex items-center space-x-4">
            {selectedWordList && (
              <div className="bg-white/90 rounded-lg px-4 py-2">
                <div className="text-sm text-gray-600">Playing:</div>
                <div className="font-semibold text-gray-800">{selectedWordList.title}</div>
              </div>
            )}
            
            <div className="bg-white/90 rounded-lg px-4 py-2">
              <div className="text-sm text-gray-600">Difficulty:</div>
              <div className="font-semibold text-gray-800 capitalize">{difficulty}</div>
            </div>
          </div>
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
          {/* Difficulty-specific instructions */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {difficulty === 'easy' && 'Is this the word you hear?'}
            {difficulty === 'normal' && 'Listen carefully and click the word you hear!'}
            {difficulty === 'hard' && 'Listen and spell the word!'}
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

          {/* EASY MODE: Yes/No */}
          {difficulty === 'easy' && gameState.options && gameState.options.length > 0 && (
            <>
              <div className="mb-8 bg-blue-50 p-6 rounded-2xl">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {gameState.options[0].word}
                </div>
                <p className="text-gray-600">Is this the word you heard?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleYesNo('yes')}
                  className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-2xl font-bold py-8 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Check className="w-12 h-12 mx-auto mb-2" />
                  Yes
                </button>
                <button
                  onClick={() => handleYesNo('no')}
                  className="bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white text-2xl font-bold py-8 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <XIcon className="w-12 h-12 mx-auto mb-2" />
                  No
                </button>
              </div>
            </>
          )}

          {/* NORMAL MODE: Multiple Choice */}
          {difficulty === 'normal' && gameState.options && gameState.options.length > 0 && (
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
          )}

          {/* HARD MODE: Spelling Input */}
          {difficulty === 'hard' && (
            <form onSubmit={handleSpellingSubmit} className="mb-8">
              <div className="mb-6">
                <div className="text-gray-600 mb-2">Type the word you heard:</div>
                <input
                  type="text"
                  value={spellingInput}
                  onChange={(e) => setSpellingInput(e.target.value)}
                  className="w-full max-w-md mx-auto text-3xl font-bold text-center p-4 border-4 border-blue-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type here..."
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              
              <button
                type="submit"
                disabled={!spellingInput.trim()}
                className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Submit Answer
              </button>
              
              {showFeedback && (
                <div className={`mt-4 text-lg font-semibold ${
                  spellingInput.trim().toLowerCase() === gameState.currentWord.toLowerCase()
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {spellingInput.trim().toLowerCase() === gameState.currentWord.toLowerCase()
                    ? '✓ Correct!'
                    : `✗ The word was "${gameState.currentWord}"`
                  }
                </div>
              )}
            </form>
          )}

          {/* Error state */}
          {!gameState.options || gameState.options.length === 0 ? (
            <div className="mb-8 p-4 bg-red-100 text-red-800 rounded">
              No word options available. Check console for errors.
            </div>
          ) : null}

          {/* Feedback */}
          {gameState.feedback && !showFeedback && (
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
            {difficulty === 'easy' && <><strong>Easy Mode:</strong> Listen to the word and decide if the shown word matches what you heard.</>}
            {difficulty === 'normal' && <><strong>Normal Mode:</strong> Listen to the word and select the correct spelling from the options.</>}
            {difficulty === 'hard' && <><strong>Hard Mode:</strong> Listen to the word and type the correct spelling. No hints!</>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;