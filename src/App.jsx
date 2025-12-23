import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useGameLogic } from './hooks/useGameLogic';
import GameBoard from './components/Game/GameBoard';
import TicTacToeSpellingGame from './components/Game/TicTacToeSpellingGame';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Navigation from './components/Layout/Navigation';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import PublicWordLists from './components/Teacher/PublicWordLists';
import Leaderboard from './components/Leaderboard/Leaderboard';
import LandingPage from './components/Landing/LandingPage';
import './index.css';

// Simple speech synthesis hook
const useSpeechSynthesis = () => {
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };
  
  return { speak };
};

// Game Selection Component
const GameSelection = ({ onSelectWordList, onStartDefaultGame, onStartTicTacToe }) => {
  const { userProfile } = useAuth();
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);

  const handleSoloClick = () => {
    setShowDifficultySelect(true);
  };

  const handleDifficultySelect = (difficulty) => {
    console.log('Difficulty selected:', difficulty);
    onStartDefaultGame(difficulty);
    setShowDifficultySelect(false);
  };

  if (showDifficultySelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Difficulty</h2>
            <p className="text-gray-600">Select your challenge level</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Easy */}
            <button
              onClick={() => handleDifficultySelect('easy')}
              className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 hover:border-green-500 transition-all rounded-2xl p-6 text-left transform hover:scale-105"
            >
              <div className="text-4xl mb-3">😊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Easy</h3>
              <p className="text-gray-600 text-sm mb-3">
                Listen and answer Yes/No. Perfect for beginners!
              </p>
              <div className="text-green-600 font-semibold text-sm">
                ✓ Yes or No answers<br/>
                ✓ Word is shown<br/>
                ✓ Simple choice
              </div>
            </button>

            {/* Normal */}
            <button
              onClick={() => handleDifficultySelect('normal')}
              className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 hover:border-blue-500 transition-all rounded-2xl p-6 text-left transform hover:scale-105"
            >
              <div className="text-4xl mb-3">🙂</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Normal</h3>
              <p className="text-gray-600 text-sm mb-3">
                Listen and choose from 4 options. Standard practice!
              </p>
              <div className="text-blue-600 font-semibold text-sm">
                ✓ Multiple choice<br/>
                ✓ 4 word options<br/>
                ✓ Good challenge
              </div>
            </button>

            {/* Hard */}
            <button
              onClick={() => handleDifficultySelect('hard')}
              className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 hover:border-red-500 transition-all rounded-2xl p-6 text-left transform hover:scale-105"
            >
              <div className="text-4xl mb-3">😤</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Hard</h3>
              <p className="text-gray-600 text-sm mb-3">
                Listen and spell it yourself. Expert mode!
              </p>
              <div className="text-red-600 font-semibold text-sm">
                ✓ Type the spelling<br/>
                ✓ No hints given<br/>
                ✓ Maximum challenge
              </div>
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowDifficultySelect(false)}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to game modes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
        <div className="mb-8 text-center">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">ESL WordPath</h1>
          <p className="text-gray-600 text-lg">Choose your game mode!</p>
        </div>

        {/* Game Modes */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Game Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Individual Practice */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer rounded-2xl p-6">
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Individual Practice</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Listen to words and practice at your own pace. Choose your difficulty!
              </p>
              <button
                onClick={handleSoloClick}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Play Solo 🎮
              </button>
            </div>

            {/* Classroom Tic-Tac-Toe */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-400 transition-colors cursor-pointer rounded-2xl p-6">
              <div className="text-4xl mb-3">🏫</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Classroom Tic-Tac-Toe</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Team-based spelling game! Perfect for whole class participation.
              </p>
              <button
                onClick={onStartTicTacToe}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Play Teams 👥
              </button>
            </div>
          </div>
        </div>

        {/* Custom Lists */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Custom Word Lists</h2>
          <div className="bg-white border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Choose from Library</h3>
            <p className="text-gray-600 mb-4">
              Browse teacher-created word lists or use your own custom lists
            </p>
            <button
              onClick={() => onSelectWordList('browse')}
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Browse Lists 📚
            </button>
          </div>
        </div>

        {userProfile?.role === 'teacher' && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Teacher Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => onSelectWordList('dashboard')}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Manage My Lists ✏️
              </button>
              <button
                onClick={() => onSelectWordList('create')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Create New List ➕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// Profile Component
const Profile = () => {
  const { currentUser, userProfile } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {userProfile?.displayName || currentUser?.displayName}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {currentUser?.email}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                userProfile?.role === 'teacher' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {userProfile?.role === 'teacher' ? 'Teacher' : 'Student'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Since
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {userProfile?.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Content Component
const AppContent = () => {
  const { currentUser, userProfile } = useAuth();
  const { gameState, startGame, resetGame, generateNewQuestion, handleAnswer, getStats } = useGameLogic();
  const { speak } = useSpeechSynthesis();
  const [currentView, setCurrentView] = useState('game');
  const [selectedWordList, setSelectedWordList] = useState(null);
  const [gameMode, setGameMode] = useState(null); // 'solo' or 'tictactoe'
  const [difficulty, setDifficulty] = useState('normal'); // 'easy', 'normal', 'hard'

  const stats = getStats();

  const handleSelectWordList = (wordList) => {
    if (wordList === 'browse') {
      setCurrentView('public');
      return;
    }
    if (wordList === 'dashboard') {
      setCurrentView('dashboard');
      return;
    }
    if (wordList === 'create') {
      setCurrentView('dashboard');
      return;
    }
    
    // If it's an actual word list object
    setSelectedWordList(wordList);
    
    // Ask user to choose game mode
    setGameMode('solo');
    startGame(wordList);
  };

  const handleStartDefaultGame = (selectedDifficulty) => {
    
    setSelectedWordList(null);
    setDifficulty(selectedDifficulty);
    setGameMode('solo');
    
    startGame(null);
  };

  const handleStartTicTacToe = () => {
    console.log('Starting Tic-Tac-Toe game...');
    setSelectedWordList(null);
    setGameMode('tictactoe');
    setCurrentView('game');
  };

  const handleBackToMenu = () => {
    resetGame();
    setSelectedWordList(null);
    setGameMode(null);
    setCurrentView('game');
  };

  const handleWordSelection = async (selectedWord) => {
    console.log('Word selected:', selectedWord);
    
    const isCorrect = handleAnswer(selectedWord);
    
    if (isCorrect) {
      setTimeout(() => {
        const newWord = generateNewQuestion();
        setTimeout(() => speak(newWord), 500);
      }, 2000);
    } else {
      speak(gameState.currentWord);
      setTimeout(() => {
        const newWord = generateNewQuestion();
        setTimeout(() => speak(newWord), 500);
      }, 3000);
    }
  };

  const handleReset = () => {
    resetGame();
    setSelectedWordList(null);
    setGameMode(null);
    setCurrentView('game');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <TeacherDashboard />;
      
      case 'public':
        return (
          <PublicWordLists 
            onSelectWordList={(wordList, selectedDifficulty) => {
              setSelectedWordList(wordList);
              setCurrentView('game');
              setGameMode('solo');
              setDifficulty(selectedDifficulty || 'normal');
              startGame(wordList);
            }}
          />
        );
      
      case 'leaderboard':
        return <Leaderboard />;
      
      case 'profile':
        return <Profile />;
      
      case 'game':
      default:
        if (gameMode === 'tictactoe') {
          return (
            <TicTacToeSpellingGame
              wordList={selectedWordList}
              onBackToMenu={handleBackToMenu}
            />
          );
        }
        
        if (gameMode === 'solo' && gameState.gameStarted) {
          console.log('Rendering GameBoard with difficulty:', difficulty);
          return (
            <GameBoard 
              selectedWordList={selectedWordList}
              onBackToMenu={handleBackToMenu}
              gameState={gameState}
              onWordSelection={handleWordSelection}
              onSpeak={speak}
              onReset={handleReset}
              stats={stats}
              difficulty={difficulty}
            />
          );
        }
        
        return (
          <GameSelection 
            onSelectWordList={handleSelectWordList}
            onStartDefaultGame={handleStartDefaultGame}
            onStartTicTacToe={handleStartTicTacToe}
          />
        );
    }
  };

  if (!currentUser) {
    return <AuthFlow />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentView={currentView} 
        onNavigate={setCurrentView}
      />
      <main className="py-6">
        {renderCurrentView()}
      </main>
    </div>
  );
};

// Authentication Flow
const AuthFlow = () => {
  const [view, setView] = useState('landing'); // 'landing', 'login', or 'register'

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <LoginForm onSwitchToRegister={() => setView('register')} />
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <RegisterForm onSwitchToLogin={() => setView('login')} />
      </div>
    );
  }

  return (
    <LandingPage 
      onLogin={() => setView('login')}
      onRegister={() => setView('register')}
    />
  );
};

//test

// Root App Component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;