import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Dashboard from './components/dashboard'
import AITutor from './components/ai-tutor'
import { BookOpen, Brain, Code, Target, TrendingUp, Settings, User } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Adaptive Learning Platform</h1>
              <Badge variant="secondary">Beta</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('dashboard')}
              className="flex-1"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'tutor' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('tutor')}
              className="flex-1"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Tutor
            </Button>
            <Button
              variant={activeTab === 'concepts' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('concepts')}
              className="flex-1"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Concepts
            </Button>
            <Button
              variant={activeTab === 'practice' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('practice')}
              className="flex-1"
            >
              <Code className="w-4 h-4 mr-2" />
              Practice
            </Button>
            <Button
              variant={activeTab === 'paths' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('paths')}
              className="flex-1"
            >
              <Target className="w-4 h-4 mr-2" />
              Learning Paths
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'tutor' && <AITutor />}
        {activeTab === 'concepts' && <div className="text-center py-8"><h2 className="text-2xl font-bold">Learning Concepts</h2><p>Coming soon...</p></div>}
        {activeTab === 'practice' && <div className="text-center py-8"><h2 className="text-2xl font-bold">Practice Zone</h2><p>Coming soon...</p></div>}
        {activeTab === 'paths' && <div className="text-center py-8"><h2 className="text-2xl font-bold">Learning Paths</h2><p>Coming soon...</p></div>}
      </main>
    </div>
  )
}

export default App
