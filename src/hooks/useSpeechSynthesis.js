import { useCallback } from 'react';
import { GAME_CONFIG } from '../utils/constants';

export const useSpeechSynthesis = () => {
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = GAME_CONFIG.SPEECH_RATE;
      utterance.volume = GAME_CONFIG.SPEECH_VOLUME;
      speechSynthesis.speak(utterance);
    }
  }, []);

  return { speak };
};