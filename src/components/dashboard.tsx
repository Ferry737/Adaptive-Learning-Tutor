import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Brain, Code, Network, Target, TrendingUp, BookOpen, Settings, User, Trophy, Clock, Star, Zap, Globe, Palette, Music } from 'lucide-react'

interface UserProgress {
  level: number
  xp: number
  streak: number
  completedConcepts: string[]
  currentPath: string | null
  performance: {
    accuracy: number
    speed: number
    retention: number
    consistency: number
  }
}

interface LearningData {
  concepts: Array<{
    id: string
    name: string
    description: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    mastery: number
    prerequisites: string[]
  }>
  paths: Array<{
    id: string
    title: string
    description: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedTime: string
    totalSteps: number
    completedSteps: number
    steps: Array<{
      id: string
      title: string
      description: string
      type: 'lesson' | 'practice' | 'project' | 'assessment'
      difficulty: 'beginner' | 'intermediate' | 'advanced'
      completed: boolean
    }>
  }>
  resources: Array<{
    id: string
    title: string
    type: 'video' | 'audio' | 'text' | 'interactive' | 'visual' | 'code'
    content: string
    duration?: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    engagement: {
      visual: number
      auditory: number
      kinesthetic: number
      reading: number
    }
  }>
}

export default function Dashboard() {
  const [userProgress] = useState<UserProgress>({
    level: 3,
    xp: 850,
    streak: 7,
    completedConcepts: ['fibonacci', 'variables', 'functions'],
    currentPath: 'web-dev',
    performance: {
      accuracy: 0.85,
      speed: 0.75,
      retention: 0.90,
      consistency: 0.80
    }
  })

  const [learningData] = useState<LearningData>({
    concepts: [
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
    ],
    paths: [
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
    ],
    resources: [
      {
        id: 'video-js',
        title: 'JavaScript Fundamentals Video',
        type: 'video',
        content: 'Comprehensive JavaScript tutorial for beginners',
        duration: '45 minutes',
        difficulty: 'beginner',
        engagement: { visual: 8, auditory: 7, kinesthetic: 5, reading: 6 }
      },
      {
        id: 'interactive-css',
        title: 'CSS Interactive Tutorial',
        type: 'interactive',
        content: 'Hands-on CSS learning with live examples',
        duration: '30 minutes',
        difficulty: 'beginner',
        engagement: { visual: 9, auditory: 4, kinesthetic: 8, reading: 5 }
      }
    ]
  })

  return (
    <div className="space-y-6">
      {/* User Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {userProgress.level}</div>
            <div className="text-xs text-muted-foreground">
              {userProgress.xp} XP to next level
            </div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress.streak} days</div>
            <div className="text-xs text-muted-foreground">
              Keep it up! 🔥
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concepts Mastered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress.completedConcepts.length}</div>
            <div className="text-xs text-muted-foreground">
              Total: {learningData.concepts.length} concepts
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <div className="text-xs text-muted-foreground">
              Overall Accuracy
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Tutor Chat
            </CardTitle>
            <CardDescription>
              Interactive Learning Assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">🤖 AI: Hello! I'm here to help you understand concepts better.</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-sm">👤 User: Can you explain recursion?</p>
              </div>
            </div>
            <button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md">
              Start Chat
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5 text-primary" />
              Concept Map
            </CardTitle>
            <CardDescription>
              Visual Learning Path
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
                <span className="text-sm">Variables → Functions</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                <span className="text-sm">Recursion → Algorithms</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md">
              View Map
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Code Editor
            </CardTitle>
            <CardDescription>
              Practice Programming
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-3 rounded-lg font-mono text-sm mb-4">
              <div className="text-blue-400">function</div> <div className="text-yellow-400">fibonacci</div><div className="text-gray-400">(</div><div className="text-orange-400">n</div><div className="text-gray-400">) {</div>
              <div className="text-green-400 ml-4">return</div> <div className="text-orange-400">n</div><div className="text-gray-400">;</div>
              <div className="text-gray-400">}</div>
            </div>
            <button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md">
              Start Coding
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Learning Path */}
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Path</CardTitle>
          <CardDescription>
            Track your progress through structured learning modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningData.paths.map((path) => (
              <div key={path.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{path.title}</h3>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                  </div>
                  <Badge variant={
                    path.difficulty === 'beginner' ? 'default' :
                    path.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                  }>
                    {path.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {path.estimatedTime} • {path.completedSteps}/{path.totalSteps} steps
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round((path.completedSteps / path.totalSteps) * 100)}% Complete
                  </span>
                </div>
                <Progress value={(path.completedSteps / path.totalSteps) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>
            Track your learning metrics and improvement over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">85%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">75%</div>
              <div className="text-sm text-muted-foreground">Speed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">90%</div>
              <div className="text-sm text-muted-foreground">Retention</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">80%</div>
              <div className="text-sm text-muted-foreground">Consistency</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
