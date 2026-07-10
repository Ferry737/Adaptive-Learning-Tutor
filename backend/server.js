const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// In-memory data store (for demo purposes)
let users = [];
let concepts = [
  {
    id: 'fibonacci',
    name: 'Fibonacci Sequence',
    description: 'Learn about the famous mathematical sequence and its applications in programming',
    difficulty: 'beginner',
    mastery: 65,
    prerequisites: ['basic-math', 'functions']
  },
  {
    id: 'recursion',
    name: 'Recursion',
    description: 'Understand recursive functions and how they solve complex problems',
    difficulty: 'intermediate',
    mastery: 40,
    prerequisites: ['functions', 'fibonacci']
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    description: 'Master fundamental algorithms and data structures',
    difficulty: 'advanced',
    mastery: 25,
    prerequisites: ['recursion', 'basic-math']
  }
];

let learningPaths = [
  {
    id: 'web-dev',
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript to build modern web applications',
    estimatedTime: '6 hours',
    totalSteps: 12,
    completedSteps: 5,
    difficulty: 'beginner',
    steps: [
      { id: 'html-basics', title: 'HTML Basics', description: 'Learn HTML structure and tags', type: 'lesson', difficulty: 'beginner', completed: true },
      { id: 'css-styling', title: 'CSS Styling', description: 'Master CSS for beautiful designs', type: 'lesson', difficulty: 'beginner', completed: true },
      { id: 'js-intro', title: 'JavaScript Introduction', description: 'Learn programming fundamentals with JavaScript', type: 'lesson', difficulty: 'beginner', completed: true },
      { id: 'project-portfolio', title: 'Portfolio Project', description: 'Build your first portfolio website', type: 'project', difficulty: 'beginner', completed: false }
    ]
  },
  {
    id: 'data-structures',
    title: 'Data Structures & Algorithms',
    description: 'Master fundamental data structures and algorithmic thinking',
    estimatedTime: '8 hours',
    totalSteps: 16,
    completedSteps: 10,
    difficulty: 'intermediate',
    steps: [
      { id: 'arrays', title: 'Arrays', description: 'Learn about array data structures', type: 'lesson', difficulty: 'intermediate', completed: true },
      { id: 'linked-lists', title: 'Linked Lists', description: 'Master linked list implementation', type: 'lesson', difficulty: 'intermediate', completed: true },
      { id: 'sorting', title: 'Sorting Algorithms', description: 'Implement various sorting algorithms', type: 'practice', difficulty: 'intermediate', completed: true },
      { id: 'searching', title: 'Searching Algorithms', description: 'Learn binary search and more', type: 'practice', difficulty: 'intermediate', completed: false }
    ]
  }
];

let chatMessages = [];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User Management
app.post('/api/users/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const user = {
      id: Date.now().toString(),
      username,
      email,
      password, // In production, hash this password
      level: 1,
      xp: 0,
      streak: 0,
      completedConcepts: [],
      currentPath: null,
      performance: {
        accuracy: 0,
        speed: 0,
        retention: 0,
        consistency: 0
      },
      createdAt: new Date()
    };
    
    users.push(user);
    res.status(201).json({ message: 'User created successfully', user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Progress
app.get('/api/users/:userId/progress', (req, res) => {
  try {
    const user = users.find(user => user.id === req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:userId/progress', (req, res) => {
  try {
    const { xp, completedConcepts, currentPath, performance } = req.body;
    const userIndex = users.findIndex(user => user.id === req.params.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    users[userIndex] = {
      ...users[userIndex],
      xp: xp || users[userIndex].xp,
      completedConcepts: completedConcepts || users[userIndex].completedConcepts,
      currentPath: currentPath || users[userIndex].currentPath,
      performance: { ...users[userIndex].performance, ...performance }
    };
    
    res.json(users[userIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Concepts
app.get('/api/concepts', (req, res) => {
  try {
    res.json(concepts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/concepts/:conceptId', (req, res) => {
  try {
    const concept = concepts.find(c => c.id === req.params.conceptId);
    if (!concept) {
      return res.status(404).json({ error: 'Concept not found' });
    }
    
    res.json(concept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Learning Paths
app.get('/api/learning-paths', (req, res) => {
  try {
    res.json(learningPaths);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/learning-paths/:pathId', (req, res) => {
  try {
    const path = learningPaths.find(p => p.id === req.params.pathId);
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    res.json(path);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat Messages
app.get('/api/chat/:userId/messages', (req, res) => {
  try {
    const userMessages = chatMessages.filter(msg => msg.userId === req.params.userId);
    res.json(userMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat/:userId/messages', (req, res) => {
  try {
    const { message, type, isThinking } = req.body;
    
    const chatMessage = {
      id: Date.now().toString(),
      userId: req.params.userId,
      message,
      type,
      isThinking: isThinking || false,
      timestamp: new Date()
    };
    
    chatMessages.push(chatMessage);
    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Tutor Response (Mock)
app.post('/api/ai-tutor/respond', (req, res) => {
  try {
    const { message } = req.body;
    const lowerMessage = message.toLowerCase();
    
    // Mock AI responses
    let response = "I'd be happy to help you learn! Could you tell me more about what you'd like to understand?";
    
    if (lowerMessage.includes('fibonacci') || lowerMessage.includes('sequence')) {
      response = "The Fibonacci sequence is a series where each number is the sum of the two preceding ones. In programming, it's often used to demonstrate recursion. Would you like me to show you how to implement it in different programming languages?";
    } else if (lowerMessage.includes('recursion') || lowerMessage.includes('recursive')) {
      response = "Recursion is a powerful programming concept where a function calls itself. It's perfect for problems that can be broken down into smaller, similar subproblems. Let me explain the key concepts: base case, recursive case, and call stack management.";
    } else if (lowerMessage.includes('algorithm') || lowerMessage.includes('sorting')) {
      response = "Algorithms are step-by-step procedures for calculations. For sorting, we have several approaches: Bubble Sort (simple but slow), Quick Sort (efficient), and Merge Sort (stable and efficient). Which one would you like to explore first?";
    }
    
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
