import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  Trophy
} from 'lucide-react';
import Button from '../UI/Button';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = ({ currentView, onNavigate }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { id: 'game', label: 'Play Game', icon: Trophy },
    { id: 'public', label: 'Browse Lists', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  // Add teacher-only items
  if (userProfile?.role === 'teacher') {
    navItems.splice(1, 0, { id: 'dashboard', label: 'My Lists', icon: BookOpen });
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-600">ESL Words</h1>
              </div>
              
              <div className="flex space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentView === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Hello, {userProfile?.displayName || currentUser?.displayName || 'User'}
                {userProfile?.role === 'teacher' && (
                  <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    Teacher
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white shadow-lg border-b">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-blue-600">ESL Words</h1>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="pb-4 border-t">
              <div className="pt-4 pb-2">
                <div className="text-sm text-gray-600 px-3">
                  Hello, {userProfile?.displayName || currentUser?.displayName || 'User'}
                  {userProfile?.role === 'teacher' && (
                    <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      Teacher
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentView === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;