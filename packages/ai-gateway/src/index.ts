import {
  TutorDecision,
  TutorDecisionSchema,
  AttemptInput,
  Attempt,
  ActivityType,
  Activity,
  ErrorCategory,
  ProviderType,
  ProviderError,
} from '@adaptive/shared-schemas'

// ============================================================================
// Mock Provider Configuration
// ============================================================================

export interface MockProviderConfig {
  timeout: number
  maxRetries: number
  retryDelay: number
  enableStructuredOutput: boolean
  enableStreaming: boolean
}

export const defaultMockConfig: MockProviderConfig = {
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
  enableStructuredOutput: true,
  enableStreaming: true,
}

// ============================================================================
// Mock Model Information
// ============================================================================

export interface MockModelInfo {
  id: string
  name: string
  capabilities: {
    streaming: boolean
    structuredOutput: boolean
    tools: boolean
    vision: boolean
    embeddings: boolean
  }
  contextLimit?: number
  estimatedCost?: {
    input: number
    output: number
  }
}

export const mockModels: MockModelInfo[] = [
  {
    id: 'mock-tutor-v1',
    name: 'Mock Tutor v1',
    capabilities: {
      streaming: true,
      structuredOutput: true,
      tools: false,
      vision: false,
      embeddings: false,
    },
    estimatedCost: {
      input: 0,
      output: 0,
    },
  },
]

// ============================================================================
// Deterministic Fixtures for Tutor Decisions
// ============================================================================

export const FIXTURES: Record<string, TutorDecision> = {
  // Arithmetic - simple addition
  arithmetic_addition: {
    activityId: 'arithmetic-1',
    evaluation: 'correct',
    rubricResults: [
      {
        criterionId: 'accuracy',
        passed: true,
        evidence: 'Result matches expected value of 7',
      },
    ],
    errorCategory: undefined,
    hintLevel: 0,
    feedback: {
      whatWasCorrect: 'Correctly calculated 4 + 3',
      whatWasWrongOrMissing: '',
      why: 'The arithmetic operation is performed correctly.',
      nextAction: 'retry_same',
      correctedExample: undefined,
    },
    nextAction: 'retry_same',
    confidence: 0.95,
  },

  // Arithmetic - incorrect
  arithmetic_subtraction: {
    activityId: 'arithmetic-2',
    evaluation: 'incorrect',
    rubricResults: [
      {
        criterionId: 'accuracy',
        passed: false,
        evidence: 'Result 2 differs from expected 3',
      },
    ],
    errorCategory: 'calculation_error',
    hintLevel: 0,
    feedback: {
      whatWasCorrect: '',
      whatWasWrongOrMissing: 'Subtracted incorrectly: 6 - 4 = 2 (expected 3)',
      why: 'Check the subtraction order and borrowing if needed.',
      nextAction: 'retry_same',
      correctedExample: 'Let me show you how to solve this correctly...',
    },
    nextAction: 'retry_same',
    confidence: 0.85,
  },

  // Percentages - correct
  percentages_correct: {
    activityId: 'percentages-1',
    evaluation: 'correct',
    rubricResults: [
      {
        criterionId: 'accuracy',
        passed: true,
        evidence: '20% of 50 = 10',
      },
    ],
    errorCategory: undefined,
    hintLevel: 0,
    feedback: {
      whatWasCorrect: 'Correctly calculated percentage',
      whatWasWrongOrMissing: '',
      why: 'Percentage calculation is accurate.',
      nextAction: 'continue',
      correctedExample: undefined,
    },
    nextAction: 'continue',
    confidence: 0.98,
  },

  // Percentages - incorrect (misreading)
  percentages_misreading: {
    activityId: 'percentages-2',
    evaluation: 'incorrect',
    rubricResults: [
      {
        criterionId: 'accuracy',
        passed: false,
        evidence: 'Got 25 instead of 15',
      },
    ],
    errorCategory: 'misreading',
    hintLevel: 0,
    feedback: {
      whatWasCorrect: '',
      whatWasWrongOrMissing: 'Misread the question: found 25% of 100 instead of 15% of 100',
      why: 'Carefully read the percentage and base value in the question.',
      nextAction: 'retry_same',
      correctedExample: '15% of 100 = 15',
    },
    nextAction: 'retry_same',
    confidence: 0.75,
  },

  // German - correct
  german_reading_correct: {
    activityId: 'german-1',
    evaluation: 'correct',
    rubricResults: [
      {
        criterionId: 'comprehension',
        passed: true,
        evidence: 'Correctly identified the main idea',
      },
    ],
    errorCategory: undefined,
    hintLevel: 0,
    feedback: {
      whatWasCorrect: 'Excellent reading comprehension',
      whatWasWrongOrMissing: '',
      why: 'Your understanding of the text is accurate.',
      nextAction: 'continue',
      correctedExample: undefined,
    },
    nextAction: 'continue',
    confidence: 0.9,
  },

  // German - incorrect (vocabulary)
  german_vocabulary: {
    activityId: 'german-2',
    evaluation: 'incorrect',
    rubricResults: [
      {
        criterionId: 'vocabulary',
        passed: false,
        evidence: 'Word not in vocabulary list',
      },
    ],
    errorCategory: 'vocabulary_error',
    hintLevel: 1,
    feedback: {
      whatWasCorrect: '',
      whatWasWrongOrMissing: 'Did not recognize the word "Das" (the/this)',
      why: 'Practice this word and its various forms.',
      nextAction: 'retry_same',
      correctedExample: 'Das ist das Haus. (That is the house.)',
    },
    nextAction: 'retry_same',
    confidence: 0.7,
  },

  // German - incorrect (grammar)
  german_grammar: {
    activityId: 'german-3',
    evaluation: 'incorrect',
    rubricResults: [
      {
        criterionId: 'grammar',
        passed: false,
        evidence: 'Article case is incorrect',
      },
    ],
    errorCategory: 'grammar_error',
    hintLevel: 1,
    feedback: {
      whatWasCorrect: '',
      whatWasWrongOrMissing: 'Used "der" instead of "die" for feminine noun',
      why: 'German nouns have gender: der (masculine), die (feminine), das (neuter).',
      nextAction: 'retry_same',
      correctedExample: 'Die Frau arbeitet. (The woman works.)',
    },
    nextAction: 'retry_same',
    confidence: 0.8,
  },

  // Logic - correct
  logic_correct: {
    activityId: 'logic-1',
    evaluation: 'correct',
    rubricResults: [
      {
        criterionId: 'reasoning',
        passed: true,
        evidence: 'Valid logical conclusion',
      },
    ],
    errorCategory: undefined,
    hintLevel: 0,
    feedback: {
      whatWasCorrect: 'Strong logical reasoning',
      whatWasWrongOrMissing: '',
      why: 'Your deduction is sound and follows valid logic.',
      nextAction: 'continue',
      correctedExample: undefined,
    },
    nextAction: 'continue',
    confidence: 0.92,
  },

  // Logic - incorrect
  logic_incorrect: {
    activityId: 'logic-2',
    evaluation: 'incorrect',
    rubricResults: [
      {
        criterionId: 'reasoning',
        passed: false,
        evidence: 'Logical fallacy in conclusion',
      },
    ],
    errorCategory: 'logic_error',
    hintLevel: 1,
    feedback: {
      whatWasCorrect: '',
      whatWasWrongOrMissing: 'Confused correlation with causation',
      why: 'Just because two events happen together doesn\'t mean one causes the other.',
      nextAction: 'retry_same',
      correctedExample: 'Consider alternative explanations...',
    },
    nextAction: 'retry_same',
    confidence: 0.78,
  },
}

// ============================================================================
// Mock Provider Class
// ============================================================================

export class MockProvider {
  private config: MockProviderConfig

  constructor(config: Partial<MockProviderConfig> = {}) {
    this.config = { ...defaultMockConfig, ...config }
  }

  async listModels(): Promise<MockModelInfo[]> {
    // Deterministic - always return the same models
    return mockModels.map(model => ({ ...model }))
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    // Mock successful connection
    return {
      success: true,
      message: 'Mock provider connected successfully',
    }
  }

  async generateStructured<T>(
    request: any,
    signal?: AbortSignal
  ): Promise<T> {
    // Simulate network delay
    if (signal && signal.aborted) {
      throw new Error('Request aborted')
    }

    await new Promise(resolve => setTimeout(resolve, 100))

    // Look up fixture based on activityId
    const fixtureKey = request.activityId || 'default'
    const fixture = FIXTURES[fixtureKey] || FIXTURES.default

    // Validate against schema
    const result = TutorDecisionSchema.parse(fixture)

    return result as T
  }

  async generate(
    request: any,
    signal?: AbortSignal
  ): Promise<{ success: boolean; content?: string; metadata?: any; error?: ProviderError }> {
    // Simulate network delay
    if (signal && signal.aborted) {
      throw new Error('Request aborted')
    }

    await new Promise(resolve => setTimeout(resolve, 50))

    // Look up fixture
    const fixtureKey = request.activityId || 'default'
    const fixture = FIXTURES[fixtureKey] || FIXTURES.default

    return {
      success: true,
      content: JSON.stringify(fixture),
      metadata: {
        tokensUsed: fixture.feedback.whatWasCorrect.length,
        finishReason: 'stop',
      },
    }
  }

  async *stream(request: any, signal?: AbortSignal): AsyncIterable<Uint8Array> {
    if (signal?.aborted) {
      throw new Error('Request aborted')
    }

    const fixtureKey = request.activityId || 'default'
    const fixture = FIXTURES[fixtureKey] || FIXTURES.default

    yield new TextEncoder().encode(JSON.stringify(fixture))
  }

  async getCapabilities(): Promise<{
    streaming: boolean
    structuredOutput: boolean
    tools: boolean
    vision: boolean
    embeddings: boolean
  }> {
    return {
      streaming: this.config.enableStreaming,
      structuredOutput: this.config.enableStructuredOutput,
      tools: false,
      vision: false,
      embeddings: false,
    }
  }

  // Helper methods for testing
  setFixture(key: string, fixture: TutorDecision) {
    FIXTURES[key] = fixture
  }

  resetFixtures() {
    Object.keys(FIXTURES).forEach(key => {
      if (key !== 'default') {
        delete FIXTURES[key]
      }
    })
  }
}

// ============================================================================
// Provider Factory
// ============================================================================

export function createMockProvider(config?: Partial<MockProviderConfig>): MockProvider {
  return new MockProvider(config)
}

// ============================================================================
// Deterministic Response Generator
// ============================================================================

export interface GenerateRequest {
  activityId: string
  answer?: string
  activityType?: ActivityType
  activity?: Activity
  difficulty?: number
  language?: string
}

export function generateDeterministicResponse(request: GenerateRequest): TutorDecision {
  // Hash the request to produce deterministic output
  const hash = cryptoHash(request)

  // Use hash to select from predefined fixtures
  const fixtureKeys = Object.keys(FIXTURES).filter(key => key !== 'default')
  const fixtureKey = fixtureKeys[hash % fixtureKeys.length] || 'default'

  return FIXTURES[fixtureKey]
}

// Helper: Simple deterministic hash
function cryptoHash(request: GenerateRequest): number {
  const str = `${request.activityId}-${request.answer || ''}-${request.activityType || ''}-${request.difficulty || 0}-${request.language || 'en'}`
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash)
}

// Export default mock provider instance
export const mockProvider = new MockProvider()

// ============================================================================
// Provider Errors (from blueprint section 9.3)
// ============================================================================

export class ProviderTimeoutError extends Error {
  constructor(message: string = 'Provider request timed out', public timeoutMs: number = 30000) {
    super(message)
    this.name = 'ProviderTimeoutError'
  }
}

export class ProviderUnavailableError extends Error {
  constructor(
    message: string = 'Provider is temporarily unavailable',
    public code: string = 'provider_unavailable'
  ) {
    super(message)
    this.name = 'ProviderUnavailableError'
  }
}

export class MalformedProviderOutputError extends Error {
  constructor(message: string, public rawOutput?: unknown) {
    super(message)
    this.name = 'MalformedProviderOutputError'
  }
}

export class RateLimitError extends Error {
  constructor(message: string, public retryAfter?: number) {
    super(message)
    this.name = 'RateLimitError'
  }
}

export class BudgetExceededError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BudgetExceededError'
  }
}
