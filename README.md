# ESL Sight Words Game

An interactive educational game designed for ESL kindergarten students to practice sight word recognition. Built with React, Tailwind CSS, and Web Speech API.

## Features

- 🎵 **Audio Pronunciation**: Clear text-to-speech for each word
- 🎮 **Interactive Gameplay**: Click-to-select word recognition
- 📊 **Progress Tracking**: Real-time scoring and percentage tracking
- 🎨 **Kid-Friendly Design**: Colorful, engaging interface
- 📱 **Mobile Responsive**: Works on tablets, phones, and computers
- 🌍 **ESL Focused**: Designed specifically for English language learners

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/esl-sight-words.git
cd esl-sight-words
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Game/           # Game-specific components
│   ├── UI/             # Generic UI components
│   └── Layout/         # Layout components
├── hooks/              # Custom React hooks
├── data/               # Static data and word lists
├── utils/              # Utility functions and constants
└── styles/             # Global styles
```

## Customization

### Adding New Words

Edit `src/data/sightWords.js` to add your curriculum words:

```javascript
export const sightWords = [
  { word: 'cat', audio: 'cat', category: 'animals' },
  { word: 'your-new-word', audio: 'your-new-word', category: 'your-category' },
  // ... more words
];
```

### Adjusting Game Settings

Modify `src/utils/constants.js` to change game behavior:

```javascript
export const GAME_CONFIG = {
  OPTIONS_COUNT: 4,        // Number of word choices
  SPEECH_RATE: 0.8,        // Speed of speech (0.1-2.0)
  SPEECH_VOLUME: 0.8,      // Volume (0.0-1.0)
  CELEBRATION_DURATION: 2000, // Celebration time (ms)
  FEEDBACK_DURATION: 3000     // Feedback display time (ms)
};
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Future Features

- [ ] Firebase integration for user accounts
- [ ] Multiple game modes (spelling, picture matching)
- [ ] Teacher dashboard for managing word lists
- [ ] Student progress analytics
- [ ] Multiplayer functionality
- [ ] Korean-English mixed mode

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Designed for Korean ESL kindergarten students
- Built with modern web technologies for maximum compatibility
- Speech synthesis provided by Web Speech API

## Support

For questions or support, please open an issue on GitHub or contact [your-email@example.com].
