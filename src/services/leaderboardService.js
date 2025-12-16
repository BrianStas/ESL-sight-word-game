import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const leaderboardService = {
  // Get current month key (e.g., "2024-12")
  getCurrentMonthKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  },

  // Submit score after a game session
  async submitScore(userId, displayName, sessionScore, gamesPlayed = 1) {
    try {
      const monthKey = this.getCurrentMonthKey();
      const userLeaderboardRef = doc(db, 'leaderboards', monthKey, 'users', userId);
      
      // Get current data
      const userDoc = await getDoc(userLeaderboardRef);
      
      if (userDoc.exists()) {
        // Update existing entry
        const currentData = userDoc.data();
        await setDoc(userLeaderboardRef, {
          displayName,
          totalScore: currentData.totalScore + sessionScore,
          gamesPlayed: currentData.gamesPlayed + gamesPlayed,
          lastUpdated: serverTimestamp()
        });
      } else {
        // Create new entry
        await setDoc(userLeaderboardRef, {
          displayName,
          totalScore: sessionScore,
          gamesPlayed: gamesPlayed,
          lastUpdated: serverTimestamp()
        });
      }
      
      console.log('Score submitted to leaderboard:', { monthKey, userId, sessionScore });
    } catch (error) {
      console.error('Error submitting score to leaderboard:', error);
      throw error;
    }
  },

  // Get top players for current month
  async getTopPlayers(topN = 10) {
    try {
      const monthKey = this.getCurrentMonthKey();
      const leaderboardRef = collection(db, 'leaderboards', monthKey, 'users');
      
      const q = query(
        leaderboardRef,
        orderBy('totalScore', 'desc'),
        limit(topN)
      );
      
      const snapshot = await getDocs(q);
      const players = snapshot.docs.map((doc, index) => ({
        userId: doc.id,
        rank: index + 1,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate()
      }));
      
      return players;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  // Get user's rank and stats for current month
  async getUserStats(userId) {
    try {
      const monthKey = this.getCurrentMonthKey();
      const userLeaderboardRef = doc(db, 'leaderboards', monthKey, 'users', userId);
      
      const userDoc = await getDoc(userLeaderboardRef);
      
      if (!userDoc.exists()) {
        return {
          totalScore: 0,
          gamesPlayed: 0,
          rank: null,
          monthKey
        };
      }
      
      const userData = userDoc.data();
      
      // Get user's rank by counting users with higher scores
      const leaderboardRef = collection(db, 'leaderboards', monthKey, 'users');
      const allUsersSnapshot = await getDocs(leaderboardRef);
      
      const allPlayers = allUsersSnapshot.docs.map(doc => ({
        userId: doc.id,
        totalScore: doc.data().totalScore
      }));
      
      allPlayers.sort((a, b) => b.totalScore - a.totalScore);
      const userRank = allPlayers.findIndex(p => p.userId === userId) + 1;
      
      return {
        totalScore: userData.totalScore,
        gamesPlayed: userData.gamesPlayed,
        rank: userRank || null,
        monthKey,
        lastUpdated: userData.lastUpdated?.toDate()
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Get leaderboard for a specific month (for viewing history)
  async getMonthLeaderboard(year, month) {
    try {
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      const leaderboardRef = collection(db, 'leaderboards', monthKey, 'users');
      
      const q = query(
        leaderboardRef,
        orderBy('totalScore', 'desc'),
        limit(100)
      );
      
      const snapshot = await getDocs(q);
      const players = snapshot.docs.map((doc, index) => ({
        userId: doc.id,
        rank: index + 1,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate()
      }));
      
      return { monthKey, players };
    } catch (error) {
      console.error('Error fetching month leaderboard:', error);
      throw error;
    }
  }
};