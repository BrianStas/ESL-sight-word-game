# ESL Sight Words Game - Firebase Edition

An interactive educational platform designed for ESL kindergarten students to practice sight word recognition. Teachers can create, share, and manage custom word lists, while students' progress is automatically tracked.

## 🎯 Features

### For Students
- 🎵 **Audio Pronunciation**: Clear text-to-speech for each word
- 🎮 **Interactive Gameplay**: Click-to-select word recognition
- 📊 **Progress Tracking**: Real-time scoring and history
- 🎨 **Kid-Friendly Design**: Colorful, engaging interface
- 📱 **Mobile Responsive**: Works on tablets, phones, and computers

### For Teachers
- ✏️ **Custom Word Lists**: Create personalized curriculum-aligned lists
- 🌍 **Public Sharing**: Share lists with the teaching community
- 📈 **Student Analytics**: Track individual student progress
- 🏷️ **Categorization**: Organize lists by difficulty, category, and tags
- 🔍 **Search & Filter**: Find perfect word lists for your needs

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Firebase account

### Firebase Setup

1. **Create Firebase Project**
   ```bash
   # Go to https://console.firebase.google.com/
   # Create a new project
   # Enable Authentication (Email/Password)
   # Enable Firestore Database
   ```

2. **Get Firebase Configuration**
   - Go to Project Settings > General > Your apps
   - Copy your Firebase config object

3. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase config
   ```

### Installation

1. **Clone and Install**
   ```bash
   git clone https://github.com/brianstas/esl-sight-words.git
   cd esl-sight-words
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Edit .env file with your Firebase credentials
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Auth/           # Authentication forms
│   ├── Game/           # Game-specific components
│   ├── Teacher/        # Teacher dashboard & tools
│   ├── UI/             # Reusable UI components
│   └── Layout/         # Navigation & layout
├── contexts/           # React contexts (Auth)
├── services/           # Firebase service functions
├── hooks/              # Custom React hooks
├── data/               # Static data and default word lists
├── utils/              # Utility functions and constants
└── config/             # Firebase configuration
```

## 🎓 How It Works

### For Teachers
1. **Sign Up** with teacher account
2. **Create Word Lists** with custom words, categories, and difficulty levels
3. **Make Lists Public** to share with other teachers
4. **Track Student Progress** through the analytics dashboard

### For Students
1. **Choose a Game Mode**:
   - Quick Start with default words
   - Browse public word lists
   - Use teacher-assigned lists
2. **Play the Game**:
   - Listen to word pronunciation
   - Select correct word from options
   - Get immediate feedback
3. **Track Progress** automatically saved

## 🛠️ Customization

### Adding Default Words
Edit `src/data/sightWords.js`:
```javascript
export const sightWords = [
  { word: 'cat', audio: 'cat', category: 'animals' },
  { word: 'your-new-word', audio: 'your-new-word', category: 'your-category' },
  // ... more words
];
```

### Adjusting Game Settings
Modify `src/utils/constants.js`:
```javascript
export const GAME_CONFIG = {
  OPTIONS_COUNT: 4,           // Number of word choices
  SPEECH_RATE: 0.8,          // Speech speed (0.1-2.0)
  SPEECH_VOLUME: 0.8,        // Volume (0.0-1.0)
  CELEBRATION_DURATION: 2000, // Celebration time (ms)
  FEEDBACK_DURATION: 3000    // Feedback display time (ms)
};
```

## 📊 Database Structure

### Firestore Collections

```
/users/{userId}
  - email, displayName, role, createdAt

/wordLists/{listId}
  - title, description, category, difficulty
  - words: [{ word, pronunciation, category }]
  - createdBy, isPublic, tags
  - usageCount, rating, createdAt

/userProgress/{userId}/games/{gameId}
  - wordListId, score, totalQuestions
  - completedAt, timeSpent
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Roadmap

- [ ] **Advanced Analytics**: Detailed progress reports for teachers
- [ ] **Multiplayer Games**: Classroom competitions
- [ ] **Voice Recording**: Students record their own pronunciations
- [ ] **Image Integration**: Add pictures to word lists
- [ ] **Offline Support**: Progressive Web App capabilities
- [ ] **Multi-language**: Support for multiple languages
- [ ] **API Integration**: Connect with school management systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Designed specifically for Korean ESL kindergarten students
- Built with modern web technologies for maximum compatibility
- Speech synthesis provided by Web Speech API
- Icons by Lucide React

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Email: [brianstas@example.com]

---

**Made with ❤️ for ESL educators and students**