import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { leaderboardService } from '../services/leaderboardService';

const Leaderboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [topPlayers, setTopPlayers] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthKey, setMonthKey] = useState('');

  useEffect(() => {
    fetchLeaderboardData();
  }, [currentUser]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      
      // Get current month key for display
      const currentMonthKey = leaderboardService.getCurrentMonthKey();
      setMonthKey(currentMonthKey);
      
      // Fetch top 10 players
      const topPlayersData = await leaderboardService.getTopPlayers(10);
      setTopPlayers(topPlayersData);
      
      // Fetch current user's stats
      if (currentUser) {
        const userStatsData = await leaderboardService.getUserStats(currentUser.uid);
        setUserStats(userStatsData);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  const formatMonthYear = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Monthly Leaderboard</h1>
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatMonthYear(monthKey)}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">Resets on the 1st of each month</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Players</h2>
            
            {topPlayers.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No players yet this month!</p>
                <p className="text-sm text-gray-500 mt-2">Be the first to play and claim the top spot!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topPlayers.map((player) => (
                  <div
                    key={player.userId}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                      player.userId === currentUser?.uid
                        ? 'bg-blue-50 ring-2 ring-blue-400'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Rank */}
                      <div className="w-12 flex justify-center">
                        {getRankIcon(player.rank)}
                      </div>
                      
                      {/* Player info */}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          {player.displayName}
                          {player.userId === currentUser?.uid && (
                            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {player.gamesPlayed} games played
                        </div>
                      </div>
                      
                      {/* Score */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">
                          {player.totalScore.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Stats Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Your Stats</h2>
            
            {userStats && userStats.gamesPlayed > 0 ? (
              <>
                {/* Rank Badge */}
                {userStats.rank && (
                  <div className={`${getRankBadgeColor(userStats.rank)} text-white rounded-2xl p-6 mb-6 text-center`}>
                    <div className="text-6xl font-bold mb-2">
                      #{userStats.rank}
                    </div>
                    <div className="text-sm opacity-90">Current Rank</div>
                  </div>
                )}
                
                {/* Stats Grid */}
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Total Score</div>
                      <Trophy className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mt-1">
                      {userStats.totalScore.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Games Played</div>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mt-1">
                      {userStats.gamesPlayed}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Avg per Game</div>
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mt-1">
                      {Math.round(userStats.totalScore / userStats.gamesPlayed)}
                    </div>
                  </div>
                </div>
                
                {/* Progress message */}
                {userStats.rank && userStats.rank > 3 && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
                    <p className="text-sm text-gray-700 text-center">
                      {topPlayers[2] && (
                        <>
                          You need{' '}
                          <span className="font-bold text-yellow-700">
                            {(topPlayers[2].totalScore - userStats.totalScore + 1).toLocaleString()}
                          </span>{' '}
                          more points to reach top 3! 🏆
                        </>
                      )}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No games played yet this month!</p>
                <p className="text-sm text-gray-500">
                  Start playing to see your stats and climb the leaderboard!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-bold text-blue-800 mb-2">How It Works</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>• Earn points by playing games and getting correct answers</li>
          <li>• Your total score accumulates throughout the month</li>
          <li>• The leaderboard resets on the 1st of each month</li>
          <li>• Play more games to climb the rankings!</li>
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;