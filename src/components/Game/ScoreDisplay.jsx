import React from 'react';
import { Star, RotateCcw } from 'lucide-react';
import Button from '../UI/Button';

const ScoreDisplay = ({ score, total, percentage, onReset }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Star className="w-6 h-6 text-yellow-500" />
          <span className="text-xl font-bold text-gray-800">{score} points</span>
        </div>
        {total > 0 && (
          <div className="text-sm text-gray-600">
            {percentage}% correct ({score}/{total})
          </div>
        )}
      </div>
      
      <Button
        onClick={onReset}
        variant="secondary"
        size="small"
        className="flex items-center space-x-2 rounded-lg"
      >
        <RotateCcw className="w-4 h-4" />
        <span>New Game</span>
      </Button>
    </div>
  );
};

export default ScoreDisplay;