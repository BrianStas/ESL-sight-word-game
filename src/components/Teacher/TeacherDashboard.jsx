import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Share, Eye, Users } from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';
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
      const lists = await wordListService.getUserWordLists(currentUser.uid);
      setWordLists(lists);
    } catch (error) {
      console.error('Error fetching word lists:', error);
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
        await wordListService.updateWordList(editingList.id, {
          ...wordListData,
          createdBy: currentUser.uid
        });
      } else {
        await wordListService.createWordList({
          ...wordListData,
          createdBy: currentUser.uid
        });
      }
      
      setShowEditor(false);
      setEditingList(null);
      fetchWordLists();
    } catch (error) {
      console.error('Error saving word list:', error);
      alert('Error saving word list. Please try again.');
    }
  };

  const handleDelete = async (listId) => {
    if (window.confirm('Are you sure you want to delete this word list?')) {
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
      <div className="flex justify-center items-center min-h-64">
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
        <Button onClick={handleCreateNew} variant="success" size="large">
          <Plus className="w-5 h-5 mr-2" />
          Create New List
        </Button>
      </div>

      {wordLists.length === 0 ? (
        <Card className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            No word lists yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first word list to get started with custom games
          </p>
          <Button onClick={handleCreateNew} variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            Create Your First List
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wordLists.map((wordList) => (
            <Card key={wordList.id} className="hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {wordList.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
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
                <Button
                  onClick={() => handleEdit(wordList)}
                  variant="primary"
                  size="small"
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(wordList.id)}
                  variant="secondary"
                  size="small"
                  className="px-3"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;