import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';

const WordListEditor = ({ wordList, onSave, onCancel }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty words
    const validWords = formData.words.filter(word => word.word.trim());
    
    if (validWords.length === 0) {
      alert('Please add at least one word');
      return;
    }

    onSave({
      ...formData,
      words: validWords
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {wordList ? 'Edit Word List' : 'Create New Word List'}
        </h2>
        <Button onClick={onCancel} variant="secondary" size="small">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

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
            placeholder="Describe what this word list is for..."
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

          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Make Public
              </span>
            </label>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
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
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a tag..."
            />
            <Button type="button" onClick={addTag} variant="secondary" size="small">
              Add
            </Button>
          </div>
        </div>

        {/* Words */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Words ({formData.words.length})
            </label>
            <Button type="button" onClick={addWord} variant="primary" size="small">
              <Plus className="w-4 h-4 mr-2" />
              Add Word
            </Button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {formData.words.map((word, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Word *"
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
                    placeholder="Category (optional)"
                    value={word.category}
                    onChange={(e) => handleWordChange(index, 'category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeWord(index)}
                  variant="secondary"
                  size="small"
                  className="p-2"
                  disabled={formData.words.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="success">
            <Save className="w-4 h-4 mr-2" />
            Save Word List
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default WordListEditor;