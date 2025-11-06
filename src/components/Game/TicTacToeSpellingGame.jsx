import React, { useState, useEffect } from 'react';
import { Volume2, X, Circle, RotateCcw, Trophy, Users } from 'lucide-react';

const TicTacToeSpellingGame = ({ wordList, onBackToMenu }) => {
  const [grid, setGrid] = useState([]);
  const [currentTeam, setCurrentTeam] = useState('X');
  const [selectedCell, setSelectedCell] = useState(null);
  const [teamXScore, setTeamXScore] = useState(0);
  const [teamOScore, setTeamOScore] = useState(0);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Initialize grid with random words
  useEffect(() => {
    initializeGrid();
  }, [wordList]);

  const initializeGrid = () => {
    const words = wordList?.words || getDefaultWords();
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 9);
    
    const newGrid = Array(9).fill(null).map((_, index) => ({
      id: index,
      word: selectedWords[index]?.word || 'cat',
      state: null, // null, 'X', or 'O'
      attempted: false
    }));
    
    setGrid(newGrid);
    setCurrentTeam('X');
    setSelectedCell(null);
    setWinner(null);
    setGameOver(false);
  };

  const getDefaultWords = () => [
    { word: 'cat' }, { word: 'dog' }, { word: 'run' },
    { word: 'jump' }, { word: 'play' }, { word: 'book' },
    { word: 'tree' }, { word: 'ball' }, { word: 'sun' }
  ];

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.7;
      utterance.volume = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const handleCellClick = (cellId) => {
    const cell = grid[cellId];
    if (cell.state !== null || gameOver) return;
    
    setSelectedCell(cellId);
    setTimeout(() => speakWord(cell.word), 300);
  };

  const handleCorrect = () => {
    if (selectedCell === null) return;
    
    const newGrid = [...grid];
    newGrid[selectedCell].state = currentTeam;
    newGrid[selectedCell].attempted = true;
    setGrid(newGrid);
    
    // Update score
    if (currentTeam === 'X') {
      setTeamXScore(prev => prev + 1);
    } else {
      setTeamOScore(prev => prev + 1);
    }
    
    setSelectedCell(null);
    
    // Check for winner
    setTimeout(() => {
      const winResult = checkWinner(newGrid);
      if (winResult) {
        setWinner(winResult);
        setGameOver(true);
        if (winResult === 'X') {
          setTeamXScore(prev => prev + 10);
        } else if (winResult === 'O') {
          setTeamOScore(prev => prev + 10);
        }
      } else if (newGrid.every(cell => cell.state !== null)) {
        setWinner('Draw');
        setGameOver(true);
      } else {
        setCurrentTeam(currentTeam === 'X' ? 'O' : 'X');
      }
    }, 500);
  };

  const handleWrong = () => {
    if (selectedCell === null) return;
    
    const newGrid = [...grid];
    newGrid[selectedCell].attempted = true;
    setGrid(newGrid);
    
    setSelectedCell(null);
    setCurrentTeam(currentTeam === 'X' ? 'O' : 'X');
  };

  const checkWinner = (currentGrid) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (
        currentGrid[a].state &&
        currentGrid[a].state === currentGrid[b].state &&
        currentGrid[a].state === currentGrid[c].state
      ) {
        return currentGrid[a].state;
      }
    }
    return null;
  };

  const resetGame = () => {
    initializeGrid();
  };

  const newRound = () => {
    setTeamXScore(0);
    setTeamOScore(0);
    initializeGrid();
  };

  // Render cell content
  const renderCell = (cell) => {
    if (cell.state === 'X') {
      return <X className="w-16 h-16 text-blue-600" strokeWidth={4} />;
    } else if (cell.state === 'O') {
      return <Circle className="w-16 h-16 text-red-600" strokeWidth={4} />;
    } else {
      const blanks = '_ '.repeat(cell.word.length).trim();
      return (
        <div className="text-2xl font-mono text-gray-600 tracking-wider">
          {blanks}
        </div>
      );
    }
  };

  // Zoomed in view
  if (selectedCell !== null) {
    const cell = grid[selectedCell];
    const blanks = '_ '.repeat(cell.word.length).trim();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <div className="mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
              currentTeam === 'X' ? 'bg-blue-100' : 'bg-red-100'
            }`}>
              {currentTeam === 'X' ? (
                <X className="w-16 h-16 text-blue-600" strokeWidth={4} />
              ) : (
                <Circle className="w-16 h-16 text-red-600" strokeWidth={4} />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Team {currentTeam}'s Turn
            </h2>
            <p className="text-gray-600">Listen and spell the word</p>
          </div>

          <button
            onClick={() => speakWord(cell.word)}
            className="mb-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
          >
            <Volume2 className="w-12 h-12" />
          </button>

          <div className="mb-8 text-5xl font-mono text-gray-800 tracking-widest">
            {blanks}
          </div>

          <p className="text-gray-600 mb-8">
            {cell.word.length} letters
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCorrect}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xl font-bold py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              ✓ Correct
            </button>
            <button
              onClick={handleWrong}
              className="bg-gradient-to-r from-red-400 to-red-600 text-white text-xl font-bold py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              ✗ Wrong
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Winner screen
  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
          
          {winner === 'Draw' ? (
            <>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">It's a Draw!</h2>
              <p className="text-xl text-gray-600 mb-8">Both teams played great!</p>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Team {winner} Wins! 🎉
              </h2>
              <p className="text-xl text-gray-600 mb-8">Congratulations!</p>
            </>
          )}

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-2xl">
              <X className="w-12 h-12 text-blue-600 mx-auto mb-2" strokeWidth={3} />
              <div className="text-3xl font-bold text-blue-600">{teamXScore}</div>
              <div className="text-sm text-gray-600">Team X</div>
            </div>
            <div className="bg-red-50 p-6 rounded-2xl">
              <Circle className="w-12 h-12 text-red-600 mx-auto mb-2" strokeWidth={3} />
              <div className="text-3xl font-bold text-red-600">{teamOScore}</div>
              <div className="text-sm text-gray-600">Team O</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetGame}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Play Again
            </button>
            <button
              onClick={newRound}
              className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              New Round
            </button>
          </div>

          <button
            onClick={onBackToMenu}
            className="mt-4 text-gray-600 hover:text-gray-800"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // Main game grid
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBackToMenu}
            className="bg-white/90 hover:bg-white px-4 py-2 rounded-lg font-medium text-gray-700 transition-colors"
          >
            ← Back to Menu
          </button>
          
          {wordList && (
            <div className="bg-white/90 rounded-lg px-4 py-2">
              <div className="text-sm text-gray-600">Playing:</div>
              <div className="font-semibold text-gray-800">{wordList.title}</div>
            </div>
          )}
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`bg-white rounded-2xl shadow-lg p-6 ${currentTeam === 'X' ? 'ring-4 ring-blue-400' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <X className="w-8 h-8 text-blue-600" strokeWidth={3} />
                  <span className="text-2xl font-bold text-gray-800">Team X</span>
                </div>
                <div className="text-4xl font-bold text-blue-600">{teamXScore}</div>
              </div>
              {currentTeam === 'X' && (
                <div className="text-green-600 font-semibold">YOUR TURN</div>
              )}
            </div>
          </div>

          <div className={`bg-white rounded-2xl shadow-lg p-6 ${currentTeam === 'O' ? 'ring-4 ring-red-400' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Circle className="w-8 h-8 text-red-600" strokeWidth={3} />
                  <span className="text-2xl font-bold text-gray-800">Team O</span>
                </div>
                <div className="text-4xl font-bold text-red-600">{teamOScore}</div>
              </div>
              {currentTeam === 'O' && (
                <div className="text-green-600 font-semibold">YOUR TURN</div>
              )}
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {grid.map((cell) => (
              <button
                key={cell.id}
                onClick={() => handleCellClick(cell.id)}
                disabled={cell.state !== null}
                className={`aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-200 ${
                  cell.state === null
                    ? 'hover:shadow-xl hover:scale-105 cursor-pointer'
                    : 'cursor-not-allowed'
                } ${cell.attempted && cell.state === null ? 'opacity-50' : ''}`}
              >
                {renderCell(cell)}
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={resetGame}
              className="inline-flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-full transition-colors font-medium"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset Game</span>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/90 rounded-xl p-4 text-center">
          <p className="text-gray-700">
            <strong>How to Play:</strong> Click a square to hear the word. Students spell it on paper/whiteboard. 
            Teacher clicks ✓ for correct or ✗ for wrong. First team to get 3 in a row wins!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicTacToeSpellingGame;