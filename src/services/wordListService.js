import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const wordListService = {
  // Create a new word list
  async createWordList(wordListData) {
    const docRef = await addDoc(collection(db, 'wordLists'), {
      ...wordListData,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      rating: 0
    });
    
    // If public, also add to shared lists for faster querying
    if (wordListData.isPublic) {
      await addDoc(collection(db, 'sharedLists'), {
        ...wordListData,
        listId: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        rating: 0
      });
    }
    
    return docRef.id;
  },

  // Get word lists for a specific user
  async getUserWordLists(userId) {
    const q = query(
      collection(db, 'wordLists'),
      where('createdBy', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Get public word lists
  async getPublicWordLists(filters = {}) {
    let q = query(
      collection(db, 'sharedLists'),
      where('isPublic', '==', true),
      orderBy('usageCount', 'desc')
    );

    // Apply filters
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.difficulty) {
      q = query(q, where('difficulty', '==', filters.difficulty));
    }
    if (filters.language) {
      q = query(q, where('language', '==', filters.language));
    }

    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Get a specific word list
  async getWordList(listId) {
    const docRef = doc(db, 'wordLists', listId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    throw new Error('Word list not found');
  },

  // Update a word list
  async updateWordList(listId, updates) {
    const docRef = doc(db, 'wordLists', listId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });

    // Update shared list if it's public
    if (updates.isPublic) {
      const sharedDocRef = doc(db, 'sharedLists', listId);
      await updateDoc(sharedDocRef, {
        ...updates,
        updatedAt: new Date()
      });
    }
  },

  // Delete a word list
  async deleteWordList(listId) {
    await deleteDoc(doc(db, 'wordLists', listId));
    
    // Also delete from shared lists if it exists
    try {
      await deleteDoc(doc(db, 'sharedLists', listId));
    } catch (error) {
      // Ignore error if document doesn't exist in shared lists
    }
  },

  // Increment usage count
  async incrementUsage(listId) {
    const docRef = doc(db, 'wordLists', listId);
    await updateDoc(docRef, {
      usageCount: increment(1)
    });

    // Also update shared list
    try {
      const sharedDocRef = doc(db, 'sharedLists', listId);
      await updateDoc(sharedDocRef, {
        usageCount: increment(1)
      });
    } catch (error) {
      // Ignore error if document doesn't exist in shared lists
    }
  },

  // Search word lists
  async searchWordLists(searchTerm) {
    // potentially use Algolia or another search service
    const q = query(
      collection(db, 'sharedLists'),
      where('isPublic', '==', true),
      orderBy('title')
    );

    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Client-side filtering (not ideal for large datasets)
    return results.filter(list => 
      list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
};