import React from 'react';
import Button from '../UI/Button';

const WordOptions = ({ options, onSelectWord }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {options.map((option, index) => (
        <Button
          key={index}
          onClick={() => onSelectWord(option.word)}
          variant="warning"
          size="large"
          className="min-h-20 text-2xl rounded-2xl"
        >
          {option.word}
        </Button>
      ))}
    </div>
  );
};

export default WordOptions;