import React from 'react';
import { Volume2 } from 'lucide-react';
import Button from '../UI/Button';

const AudioButton = ({ word, onSpeak }) => {
  return (
    <div className="mb-6">
      <Button
        onClick={() => onSpeak(word)}
        variant="primary"
        className="p-4 rounded-full"
      >
        <Volume2 className="w-8 h-8" />
      </Button>
      <p className="text-gray-600 text-lg mt-4">
        Click the speaker to hear the word again
      </p>
    </div>
  );
};

export default AudioButton;