import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useGameLogic } from './hooks/useGameLogic';
import GameBoard from './components/Game/GameBoard';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Navigation from './components/Layout/Navigation';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import PublicWordLists from './components/Teacher/PublicWordLists';
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
const GameSelection = ({ onSelectWordList, onStartDefaultGame }) => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center">
        <div className="mb-8">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">ESL Sight Words Game</h1>
          <p className="text-gray-600 text-lg">Choose how you want to play!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Quick Start</h3>
            <p className="text-gray-600 mb-4">
              Play with our default sight words collection
            </p>
            <button
              onClick={onStartDefaultGame}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Play Now! 🎮
            </button>
          </div>

          <div className="bg-white border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Custom Lists</h3>
            <p className="text-gray-600 mb-4">
              Choose from teacher-created word lists
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
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Teacher Tools</h3>
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
    startGame(wordList);
  };

  const handleStartDefaultGame = () => {
    console.log('Starting default game...');
    setSelectedWordList(null);
    startGame(null); // Use default sight words
  };

  const handleBackToMenu = () => {
    resetGame();
    setSelectedWordList(null);
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
    setCurrentView('game');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <TeacherDashboard />;
      
      case 'public':
        return (
          <PublicWordLists 
            onSelectWordList={(wordList) => {
              setSelectedWordList(wordList);
              setCurrentView('game');
              startGame(wordList);
            }}
          />
        );
      
      case 'profile':
        return <Profile />;
      
      case 'game':
      default:
        if (gameState.gameStarted) {
          return (
            <GameBoard 
              selectedWordList={selectedWordList}
              onBackToMenu={handleBackToMenu}
              gameState={gameState}
              onWordSelection={handleWordSelection}
              onSpeak={speak}
              onReset={handleReset}
              stats={stats}
            />
          );
        }
        
        return (
          <GameSelection 
            onSelectWordList={handleSelectWordList}
            onStartDefaultGame={handleStartDefaultGame}
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
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

// Root App Component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;