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
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const wordListService = {
  // Create a new word list
 async createWordList(wordListData) {
    try {
      const docRef = await addDoc(collection(db, 'wordLists'), {
        ...wordListData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        usageCount: 0,
        rating: 0
      });
      
      // If public, also add to shared lists for faster querying
      if (wordListData.isPublic) {
        await addDoc(collection(db, 'sharedLists'), {
          ...wordListData,
          listId: docRef.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          usageCount: 0,
          rating: 0
        });
      }
      
      console.log('Word list created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating word list:', error);
      throw error;
    }
  },

  // Get word lists for a specific user
  async getUserWordLists(userId) {
    try {
      const q = query(
        collection(db, 'wordLists'),
        where('createdBy', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const lists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to Date objects
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
      
      console.log('Fetched user word lists:', lists.length);
      return lists;
    } catch (error) {
      console.error('Error fetching user word lists:', error);
      throw error;
    }
  },

  // Get public word lists
    async getPublicWordLists(filters = {}) {
    try {
      let q = query(
        collection(db, 'sharedLists'),
        where('isPublic', '==', true),
        orderBy('usageCount', 'desc')
      );

      const snapshot = await getDocs(q);
      let results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));

      // Sort client-side by usage count (most used first)
      results.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));

      // Apply client-side filters
      if (filters.category) {
        results = results.filter(list => list.category === filters.category);
      }
      if (filters.difficulty) {
        results = results.filter(list => list.difficulty === filters.difficulty);
      }
      if (filters.language) {
        results = results.filter(list => list.language === filters.language);
      }

      console.log('Fetched public word lists:', results.length);
      return results;
    } catch (error) {
      console.error('Error fetching public word lists:', error);
      throw error;
    }
  },

  // Get a specific word list
  async getWordList(listId) {
    try {
      const docRef = doc(db, 'wordLists', listId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        };
      }
      throw new Error('Word list not found');
    } catch (error) {
      console.error('Error fetching word list:', error);
      throw error;
    }
  },

  // Update a word list
  async updateWordList(listId, updates) {
    try {
      const docRef = doc(db, 'wordLists', listId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Update shared list if it's public
      if (updates.isPublic !== undefined) {
        try {
          const sharedQ = query(
            collection(db, 'sharedLists'),
            where('listId', '==', listId)
          );
          const sharedSnapshot = await getDocs(sharedQ);
          
          if (updates.isPublic && sharedSnapshot.empty) {
            // Add to shared lists if making public
            const originalDoc = await getDoc(docRef);
            await addDoc(collection(db, 'sharedLists'), {
              ...originalDoc.data(),
              ...updates,
              listId: listId,
              updatedAt: serverTimestamp()
            });
          } else if (!updates.isPublic && !sharedSnapshot.empty) {
            // Remove from shared lists if making private
            const deletePromises = sharedSnapshot.docs.map(doc => 
              deleteDoc(doc.ref)
            );
            await Promise.all(deletePromises);
          } else if (!sharedSnapshot.empty) {
            // Update existing shared list
            const updatePromises = sharedSnapshot.docs.map(doc => 
              updateDoc(doc.ref, {
                ...updates,
                updatedAt: serverTimestamp()
              })
            );
            await Promise.all(updatePromises);
          }
        } catch (error) {
          console.error('Error updating shared list:', error);
        }
      }

      console.log('Word list updated:', listId);
    } catch (error) {
      console.error('Error updating word list:', error);
      throw error;
    }
  },
  
  // Delete a word list
  async deleteWordList(listId) {
    try {
      await deleteDoc(doc(db, 'wordLists', listId));
      
      // Also delete from shared lists if it exists
      const sharedQ = query(
        collection(db, 'sharedLists'),
        where('listId', '==', listId)
      );
      const sharedSnapshot = await getDocs(sharedQ);
      const deletePromises = sharedSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      console.log('Word list deleted:', listId);
    } catch (error) {
      console.error('Error deleting word list:', error);
      throw error;
    }
  },

  // Increment usage count
 async incrementUsage(listId) {
    try {
      const docRef = doc(db, 'wordLists', listId);
      await updateDoc(docRef, {
        usageCount: increment(1)
      });

      // Also update shared list
      const sharedQ = query(
        collection(db, 'sharedLists'),
        where('listId', '==', listId)
      );
      const sharedSnapshot = await getDocs(sharedQ);
      const updatePromises = sharedSnapshot.docs.map(doc => 
        updateDoc(doc.ref, {
          usageCount: increment(1)
        })
      );
      await Promise.all(updatePromises);

      console.log('Usage count incremented for:', listId);
    } catch (error) {
      console.error('Error incrementing usage:', error);
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