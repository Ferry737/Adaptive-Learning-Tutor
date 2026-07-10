import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Brain, BookOpen, Target, TrendingUp, Lightbulb, HelpCircle, CheckCircle, Clock, Star, ArrowRight } from 'lucide-react'

interface Concept {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  mastery: number // 0-100
  prerequisites: string[]
}

interface LearningPath {
  id: string
  title: string
  description: string
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  concepts: string[]
  progress: number
}

interface AITutorProps {
  currentConcept?: Concept
  userProgress?: {
    completedConcepts: string[]
    currentLevel: number
    totalXP: number
    streakDays: number
  }
  onConceptSelect?: (concept: Concept) => void
  onPathSelect?: (path: LearningPath) => void
}

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isThinking?: boolean
}

export default function AITutor({
  currentConcept,
  userProgress = {
    completedConcepts: [],
    currentLevel: 2,
    totalXP: 350,
    streakDays: 3
  },
  onConceptSelect,
  onPathSelect
}: AITutorProps) {
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI tutor. I'm here to help you understand concepts better and guide you through your learning journey. What would you like to learn about today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample concepts data
  const concepts: Concept[] = [
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
  ]

  // Sample learning paths
  const learningPaths: LearningPath[] = [
    {
      id: 'web-dev',
      title: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, and JavaScript to build modern web applications',
      estimatedTime: '6 hours',
      difficulty: 'beginner',
      concepts: ['html', 'css', 'javascript'],
      progress: 45
    },
    {
      id: 'data-structures',
      title: 'Data Structures & Algorithms',
      description: 'Master fundamental data structures and algorithmic thinking',
      estimatedTime: '8 hours',
      difficulty: 'intermediate',
      concepts: ['arrays', 'linked-lists', 'trees', 'sorting'],
      progress: 65
    }
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('fibonacci') || lowerInput.includes('sequence')) {
      return "Great question about Fibonacci! The Fibonacci sequence is a series where each number is the sum of the two preceding ones. In programming, it's often used to demonstrate recursion. Would you like me to show you how to implement it in different programming languages?"
    }
    
    if (lowerInput.includes('recursion') || lowerInput.includes('recursive')) {
      return "Recursion is a powerful programming concept where a function calls itself. It's perfect for problems that can be broken down into smaller, similar subproblems. Let me explain the key concepts: base case, recursive case, and call stack management."
    }
    
    if (lowerInput.includes('algorithm') || lowerInput.includes('sorting')) {
      return "Algorithms are step-by-step procedures for calculations. For sorting, we have several approaches: Bubble Sort (simple but slow), Quick Sort (efficient), and Merge Sort (stable and efficient). Which one would you like to explore first?"
    }
    
    return "I'd be happy to help you understand this concept better! Could you tell me more specifically what you'd like to learn about? I can provide explanations, examples, and practice exercises."
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          AI Learning Tutor
        </CardTitle>
        <CardDescription>
          Interactive AI-powered learning assistant with personalized guidance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === 'chat' ? 'default' : 'outline'}
            onClick={() => setActiveTab('chat')}
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </Button>
          <Button
            variant={activeTab === 'concepts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('concepts')}
            className="flex-1"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Concepts
          </Button>
          <Button
            variant={activeTab === 'paths' ? 'default' : 'outline'}
            onClick={() => setActiveTab('paths')}
            className="flex-1"
          >
            <Target className="w-4 h-4 mr-2" />
            Paths
          </Button>
        </div>

        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.isThinking && (
                      <div className="flex gap-1 mt-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="bg-muted px-4 py-2 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about programming..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                Send
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'concepts' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Learning Concepts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {concepts.map((concept) => (
                <Card key={concept.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{concept.name}</CardTitle>
                      <Badge variant={
                        concept.difficulty === 'beginner' ? 'default' :
                        concept.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                      }>
                        {concept.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {concept.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Mastery</span>
                        <span>{concept.mastery}%</span>
                      </div>
                      <Progress value={concept.mastery} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'paths' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Learning Paths</h3>
            <div className="space-y-4">
              {learningPaths.map((path) => (
                <Card key={path.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{path.title}</CardTitle>
                      <Badge variant={
                        path.difficulty === 'beginner' ? 'default' :
                        path.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                      }>
                        {path.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">
                        {path.estimatedTime}
                      </span>
                      <span className="text-sm font-medium">
                        {path.progress}% Complete
                      </span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
