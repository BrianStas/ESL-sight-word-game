import React, { useState, useEffect } from 'react';
import { Search, Star, Download, Filter } from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { wordListService } from '../../services/wordListService';
import { useAuth } from '../../contexts/AuthContext';

const PublicWordLists = ({ onSelectWordList }) => {
  const { currentUser } = useAuth();
  const [publicLists, setPublicLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
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

  useEffect(() => {
    filterLists();
  }, [publicLists, searchTerm, filters]);

  const fetchPublicLists = async () => {
    try {
      const lists = await wordListService.getPublicWordLists();
      setPublicLists(lists);
    } catch (error) {
      console.error('Error fetching public word lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLists = () => {
    let filtered = publicLists;

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(list =>
        list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(list => list.category === filters.category);
    }
    if (filters.difficulty) {
      filtered = filtered.filter(list => list.difficulty === filters.difficulty);
    }
    if (filters.language) {
      filtered = filtered.filter(list => list.language === filters.language);
    }

    setFilteredLists(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleUseWordList = async (wordList) => {
    try {
      // Increment usage count
      await wordListService.incrementUsage(wordList.id);
      
      // Pass the word list to the parent component
      onSelectWordList(wordList);
    } catch (error) {
      console.error('Error using word list:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
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
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search word lists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      </Card>

      {/* Results */}
      {filteredLists.length === 0 ? (
        <Card className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            No word lists found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.map((wordList) => (
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
                  <Download className="w-4 h-4 text-gray-500" />
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
                  by {wordList.createdBy === currentUser?.uid ? 'You' : 'Teacher'}
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

              <Button
                onClick={() => handleUseWordList(wordList)}
                variant="success"
                size="medium"
                className="w-full"
              >
                Use This List
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicWordLists;