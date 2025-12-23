import React, { useState } from 'react';
import { 
  Trophy, Users, BookOpen, TrendingUp, 
  Check, Star, Sparkles, Target, Zap,
  PlayCircle, MessageCircle
} from 'lucide-react';

const LandingPage = ({ onLogin, onRegister }) => {
  const [activeTab, setActiveTab] = useState('features');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Navigation */}
        <nav className="relative z-10 px-4 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">ESL WordPath</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onLogin}
                className="px-6 py-2 text-white border-2 border-white rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200"
              >
                Log In
              </button>
              <button
                onClick={onRegister}
                className="px-6 py-2 bg-white text-purple-600 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-block mb-4">
            <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
              🎓 Trusted by ESL Teachers Worldwide
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master English Sight Words
            <br />
            <span className="text-yellow-300">Through Play</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Interactive games, personalized learning paths, and real-time progress tracking 
            for ESL kindergarten students in Korea.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={onRegister}
              className="group px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <span>Start Learning Now</span>
              <PlayCircle className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              Sign In
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">3</div>
              <div className="text-white/80 text-sm">Difficulty Levels</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-white/80 text-sm">Custom Word Lists</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-white/80 text-sm">Free to Use</div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="white"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Designed specifically for ESL kindergarten students with features that make learning fun and effective
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">3 Difficulty Modes</h3>
            <p className="text-gray-600 mb-4">
              Easy, Normal, and Hard modes adapt to each student's skill level. From yes/no questions to full spelling challenges.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Easy: Yes/No recognition
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Normal: Multiple choice
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Hard: Spelling input
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Classroom Games</h3>
            <p className="text-gray-600 mb-4">
              Team-based Tic-Tac-Toe spelling game perfect for whole class participation and competitive learning.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Team vs Team competition
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Interactive game board
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Teacher-led gameplay
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Monthly Leaderboard</h3>
            <p className="text-gray-600 mb-4">
              Motivate students with friendly competition. Track progress and celebrate achievements with monthly rankings.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Real-time rankings
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Personal statistics
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Monthly resets
              </li>
            </ul>
          </div>
        </div>

        {/* More Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Custom Word Lists</h4>
                <p className="text-gray-700">
                  Teachers can create unlimited custom word lists tailored to their curriculum. Share lists with the community or keep them private.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Audio Pronunciation</h4>
                <p className="text-gray-700">
                  Every word is spoken clearly with text-to-speech technology. Students can replay words as many times as needed for comprehension.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Progress Tracking</h4>
                <p className="text-gray-700">
                  Automatic tracking of scores, games played, and improvement over time. Teachers can monitor student progress effortlessly.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Instant Feedback</h4>
                <p className="text-gray-700">
                  Students receive immediate visual and audio feedback on their answers, reinforcing learning through positive encouragement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Get started in minutes and see results immediately
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-600">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Create Account</h3>
              <p className="text-white/80">
                Sign up as a teacher or student in seconds
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-600">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Choose Words</h3>
              <p className="text-white/80">
                Select from library or create custom lists
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-600">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Play & Learn</h3>
              <p className="text-white/80">
                Engage with interactive games and challenges
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-600">
                4
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Track Progress</h3>
              <p className="text-white/80">
                Monitor improvement and celebrate achievements
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl p-12 text-center shadow-2xl">
          <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Transform Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of ESL teachers and students already using ESL WordPath to master English sight words.
          </p>
          <button
            onClick={onRegister}
            className="px-10 py-4 bg-white text-purple-600 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            Get Started Free →
          </button>
          <p className="text-white/70 text-sm mt-4">
            No credit card required • 100% free forever
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <span className="text-xl font-bold">ESL WordPath</span>
              </div>
              <p className="text-gray-400">
                Making English learning fun and effective for ESL kindergarten students.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Individual Practice</li>
                <li>Classroom Games</li>
                <li>Custom Word Lists</li>
                <li>Monthly Leaderboard</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Get Started</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={onRegister} className="hover:text-white transition-colors">
                    Create Account
                  </button>
                </li>
                <li>
                  <button onClick={onLogin} className="hover:text-white transition-colors">
                    Sign In
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 ESL WordPath. Made with ❤️ for ESL educators and students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;