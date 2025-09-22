export const GAME_CONFIG = {
  OPTIONS_COUNT: 4,
  SPEECH_RATE: 0.8,
  SPEECH_VOLUME: 0.8,
  CELEBRATION_DURATION: 2000,
  FEEDBACK_DURATION: 3000
};

export const FEEDBACK_MESSAGES = {
  CORRECT: 'Great job! 🎉',
  INCORRECT: (word) => `Try again! The word was "${word}"`,
  LISTEN: 'Listen carefully and click the word you hear!'
};