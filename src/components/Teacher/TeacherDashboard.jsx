// src/components/Teacher/TeacherDashboard.jsx - Full working version
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Share, Eye, Users, Book, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { wordListService } from '../../services/wordListService';
import WordListEditor from './WordListEditor';

const TeacherDashboard = () => {
  const { currentUser } = useAuth();
  const [wordLists, setWordLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingList, setEditingList] = useState(null);

  useEffect(() => {
    fetchWordLists();
  }, [currentUser]);

  const fetchWordLists = async () => {
    try {
      setLoading(true);
      const lists = await wordListService.getUserWordLists(currentUser.uid);
      setWordLists(lists);
    } catch (error) {
      console.error('Error fetching word lists:', error);
      alert('Error loading your word lists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingList(null);
    setShowEditor(true);
  };

  const handleEdit = (wordList) => {
    setEditingList(wordList);
    setShowEditor(true);
  };

  const handleSave = async (wordListData) => {
    try {
      if (editingList) {
        await wordListService.updateWordList(editingList.id, wordListData);
      } else {
        await wordListService.createWordList(wordListData);
      }
      
      setShowEditor(false);
      setEditingList(null);
      fetchWordLists();
    } catch (error) {
      console.error('Error saving word list:', error);
      throw error; // Let the editor component handle the error
    }
  };

  const handleDelete = async (listId, listTitle) => {
    if (window.confirm(`Are you sure you want to delete "${listTitle}"? This action cannot be undone.`)) {
      try {
        await wordListService.deleteWordList(listId);
        fetchWordLists();
      } catch (error) {
        console.error('Error deleting word list:', error);
        alert('Error deleting word list. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingList(null);
  };

  // Calculate stats
  const totalLists = wordLists.length;
  const publicLists = wordLists.filter(list => list.isPublic).length;
  const totalUsage = wordLists.reduce((sum, list) => sum + (list.usageCount || 0), 0);

  if (showEditor) {
    return (
      <WordListEditor
        wordList={editingList}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading your word lists...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Word Lists</h1>
          <p className="text-gray-600 mt-2">Create and manage your custom word lists</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Create New List</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Word Lists</p>
              <p className="text-3xl font-bold text-gray-800">{totalLists}</p>
              <p className="text-xs text-gray-500 mt-1">{publicLists} public</p>
            </div>
            <Book className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Usage</p>
              <p className="text-3xl font-bold text-gray-800">{totalUsage}</p>
              <p className="text-xs text-gray-500 mt-1">times played</p>
            </div>
            <Users className="w-10 h-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Words</p>
              <p className="text-3xl font-bold text-gray-800">
                {wordLists.reduce((sum, list) => sum + (list.words?.length || 0), 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">across all lists</p>
            </div>
            <TrendingUp className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
      </div>

      {wordLists.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            No word lists yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first word list to get started with custom games for your students
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First List</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wordLists.map((wordList) => (
            <div key={wordList.id} className="bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {wordList.title}
                  </h3>
                  <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {wordList.category}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {wordList.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {wordList.isPublic && (
                    <Share className="w-4 h-4 text-green-600" title="Public" />
                  )}
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500">{wordList.usageCount || 0}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {wordList.description || 'No description'}
              </p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">
                  {wordList.words?.length || 0} words
                </span>
                <span className="text-xs text-gray-500">
                  {wordList.language === 'mixed' ? 'Mixed' : 
                   wordList.language === 'ko' ? 'Korean' : 'English'}
                </span>
              </div>

              {wordList.tags && wordList.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {wordList.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {wordList.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{wordList.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(wordList)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(wordList.id, wordList.title)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;