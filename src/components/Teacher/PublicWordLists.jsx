import React, { useState, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import { wordListService } from '../../services/wordListService';

const PublicWordLists = ({ onSelectWordList }) => {
  const [publicLists, setPublicLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    language: ''
  });

  useEffect(() => {
    fetchPublicLists();
  }, []);

  const fetchPublicLists = async () => {
    try {
      setLoading(true);
      const lists = await wordListService.getPublicWordLists();
      setPublicLists(lists);
    } catch (error) {
      console.error('Error fetching public word lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleUseWordList = async (wordList) => {
    try {
  
      await wordListService.incrementUsage(wordList.id);
      
      // Pass the word list to the parent component
      onSelectWordList(wordList);
    } catch (error) {
      console.error('Error using word list:', error);
    }
  };

  //got it done, waiting on pr confirmation

  const filteredLists = publicLists.filter(list => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        list.title.toLowerCase().includes(searchLower) ||
        list.description?.toLowerCase().includes(searchLower) ||
        list.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    if (filters.category && list.category !== filters.category) return false;

    if (filters.difficulty && list.difficulty !== filters.difficulty) return false;
 
    if (filters.language && list.language !== filters.language) return false;
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading public word lists...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Public Word Lists</h1>
        <p className="text-gray-600">Discover and use word lists created by other teachers</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search word lists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
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

          <div>
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="ko">Korean</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>

        {(searchTerm || filters.category || filters.difficulty || filters.language) && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredLists.length} of {publicLists.length} lists
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ category: '', difficulty: '', language: '' });
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {publicLists.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            No public word lists yet
          </h3>
          <p className="text-gray-600">
            Be the first to create and share a word list with the community!
          </p>
        </div>
      ) : filteredLists.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            No word lists found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.map((wordList) => (
            <div key={wordList.id} className="bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-shadow">
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
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500">{wordList.usageCount || 0}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {wordList.description || 'No description available'}
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

              <button
                onClick={() => handleUseWordList(wordList)}
                className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Use This List
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicWordLists;