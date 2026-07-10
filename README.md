# 🎓 Adaptive Learning Tutor

An AI-powered adaptive learning platform with Socratic dialogue system, gamification, and professional UI/UX.

## 🌟 Features

### 🧠 AI-Powered Learning
- **Socratic Dialogue**: Interactive learning through questions and answers
- **Adaptive Learning**: Personalized learning paths based on performance
- **Real-time Feedback**: Instant feedback on responses and progress
- **Concept Extraction**: AI analyzes and extracts key learning concepts

### 🎮 Gamification System
- **XP & Levels**: Gain experience points and level up
- **Streaks**: Maintain learning streaks for motivation
- **Achievements**: Unlock achievements as you progress
- **Progress Tracking**: Visual progress bars and analytics

### 🎯 ADHD-Friendly Design
- **Low Friction**: Minimal interface distractions
- **Instant Feedback**: Immediate response to user actions
- **Engaging Interface**: Colorful, interactive design
- **Responsive**: Works perfectly on all devices

### 🛠️ Technical Stack
- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Express.js API server
- **State Management**: React hooks
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ferry737/Adaptive-Learning-Tutor.git
cd Adaptive-Learning-Tutor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### API Server Setup

1. Navigate to the backend directory:
```bash
cd backend
npm install
node server.js
```

2. The API will run on [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── dashboard.tsx   # Main dashboard
│   │   ├── ai-tutor.tsx    # AI tutor interface
│   │   └── ui/            # UI components
│   ├── lib/               # Utility functions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── backend/              # Express.js API server
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
├── public/               # Static assets
└── README.md            # This file
```

## 🎮 Usage

### Dashboard
- View learning progress and statistics
- Access different learning modules
- Track achievements and streaks

### AI Tutor
- Interactive learning through questions
- Get personalized feedback
- Explore concepts in depth

### Learning Paths
- Follow structured learning sequences
- Track completion progress
- Unlock new modules as you advance

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Customization
- Modify `tailwind.config.js` for styling
- Update `src/components/` for UI changes
- Adjust `backend/server.js` for API endpoints

## 🚀 Deployment

### GitHub Auto-Deploy
This project is configured with GitHub auto-deploy. When you push changes, they will be automatically deployed.

### Manual Deployment
```bash
# Build the project
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit and push
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [ ] Add more AI models
- [ ] Implement user authentication
- [ ] Add progress persistence
- [ ] Create mobile app
- [ ] Add multiplayer features
- [ ] Integrate with learning management systems

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join our community discussions

---

**Built with ❤️ using Next.js, React, and AI**