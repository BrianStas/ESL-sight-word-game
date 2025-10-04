import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const WordListEditor = ({ wordList, onSave, onCancel }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    difficulty: 'beginner',
    language: 'en',
    isPublic: false,
    tags: [],
    words: [{ word: '', pronunciation: '', category: '' }]
  });

  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (wordList) {
      setFormData(wordList);
    }
  }, [wordList]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleWordChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      words: prev.words.map((word, i) => 
        i === index ? { ...word, [field]: value } : word
      )
    }));
  };

  const addWord = () => {
    setFormData(prev => ({
      ...prev,
      words: [...prev.words, { word: '', pronunciation: '', category: '' }]
    }));
  };

  const removeWord = (index) => {
    if (formData.words.length <= 1) {
      setError('You must have at least one word in your list');
      return;
    }
    setFormData(prev => ({
      ...prev,
      words: prev.words.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    
    // Validate
    if (!formData.title.trim()) {
      setError('Please enter a title for your word list');
      setSaving(false);
      return;
    }

    // Filter out empty words
    const validWords = formData.words.filter(word => word.word.trim());
    
    if (validWords.length === 0) {
      setError('Please add at least one word to your list');
      setSaving(false);
      return;
    }

    if (validWords.length < 4) {
      setError('Please add at least 4 words for the game to work properly');
      setSaving(false);
      return;
    }

    try {
      await onSave({
        ...formData,
        words: validWords,
        createdBy: currentUser.uid
      });
    } catch (err) {
      setError('Failed to save word list. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {wordList ? 'Edit Word List' : 'Create New Word List'}
          </h2>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Farm Animals"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="animals">Animals</option>
                <option value="actions">Actions</option>
                <option value="objects">Objects</option>
                <option value="colors">Colors</option>
                <option value="numbers">Numbers</option>
                <option value="family">Family</option>
                <option value="food">Food</option>
                <option value="nature">Nature</option>
                <option value="emotions">Emotions</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe what this word list is for and who it's best suited for..."
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="ko">Korean</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Make Public (share with community)
                </span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a tag (e.g., kindergarten, sight-words)..."
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Words */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Words ({formData.words.filter(w => w.word.trim()).length} added, minimum 4 required)
              </label>
              <button
                type="button"
                onClick={addWord}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Word</span>
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
              {formData.words.map((word, index) => (
                <div key={index} className="flex gap-2 items-start bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Word * (required)"
                      value={word.word}
                      onChange={(e) => handleWordChange(index, 'word', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Pronunciation (optional)"
                      value={word.pronunciation}
                      onChange={(e) => handleWordChange(index, 'pronunciation', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Sub-category (optional)"
                      value={word.category}
                      onChange={(e) => handleWordChange(index, 'category', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeWord(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={formData.words.length <= 1}
                    title="Remove word"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving...' : 'Save Word List'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WordListEditor;