import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const progressService = {
  // Save game progress
  async saveGameProgress(userId, gameData) {
    const progressRef = doc(collection(db, 'userProgress', userId, 'games'));
    await setDoc(progressRef, {
      ...gameData,
      completedAt: new Date()
    });
    return progressRef.id;
  },

  // Get user's game history
  async getUserProgress(userId) {
    const q = query(
      collection(db, 'userProgress', userId, 'games'),
      orderBy('completedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Get progress for a specific word list
  async getProgressForWordList(userId, wordListId) {
    const q = query(
      collection(db, 'userProgress', userId, 'games'),
      where('wordListId', '==', wordListId),
      orderBy('completedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};