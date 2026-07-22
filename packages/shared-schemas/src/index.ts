// ============================================================================
// Core Types
// ============================================================================

export type AttemptState =
  | 'CREATED'
  | 'PRESENTED'
  | 'SUBMITTED'
  | 'EVALUATING'
  | 'CORRECT'
  | 'PARTIAL'
  | 'INCORRECT'
  | 'UNGRADABLE'

export type ActivityType = 'practice' | 'mock-exam' | 'diagnostic'

export type ActivityMode = 'study' | 'exam'

export type ErrorCategory =
  | 'concept_misunderstanding'
  | 'calculation_error'
  | 'misreading'
  | 'grammar_error'
  | 'vocabulary_error'
  | 'logic_error'
  | 'other'

export type ProviderType = 'hosted' | 'openai-compatible' | 'ollama' | 'lm-studio' | 'mock'

export type RequestId = string

export type ActivityId = string

// ============================================================================
// Tutor Decision Types (from blueprint section 9.2)
// ============================================================================

interface TutorDecisionContract {
  activityId: ActivityId
  evaluation: 'correct' | 'partially_correct' | 'incorrect' | 'ungradable'
  rubricResults: {
    criterionId: string
    passed: boolean
    evidence: string
  }[]
  errorCategory?: ErrorCategory
  hintLevel: 0 | 1 | 2 | 3 | 4
  feedback: {
    whatWasCorrect: string
    whatWasWrongOrMissing: string
    why: string
    nextAction: 'retry_same' | 'try_similar' | 'teach_prerequisite' | 'schedule_review' | 'continue'
    correctedExample?: string
  }
  nextAction: 'retry_same' | 'try_similar' | 'teach_prerequisite' | 'schedule_review' | 'continue'
  confidence: number
}

// ============================================================================
// Provider Interfaces (from blueprint section 9.1)
// ============================================================================

export interface ModelInfo {
  id: string
  name: string
  providerType: ProviderType
  capabilities: ProviderCapabilities
  contextLimit?: number
  estimatedCost?: number
}

export interface ProviderCapabilities {
  streaming: boolean
  structuredOutput: boolean
  tools: boolean
  vision: boolean
  embeddings: boolean
}

export interface GenerationRequest {
  modelId: string
  prompt: string
  responseFormat?: 'text' | 'json' | 'structured'
  maxTokens?: number
  temperature?: number
  topP?: number
}

export interface GenerationResult {
  success: boolean
  content?: string
  metadata?: {
    tokensUsed?: number
    finishReason?: string
  }
  error?: ProviderError
}

export interface StructuredGenerationRequest<T> extends GenerationRequest {
  schema: ZodType<T>
}

interface ProviderErrorContract {
  code: string
  message: string
  details?: Record<string, unknown>
}

// ============================================================================
// Attempt Types
// ============================================================================

interface AttemptInputContract {
  activityId: ActivityId
  answer?: string
  answerType?: 'text' | 'numeric' | 'multiple-choice'
  requestId?: RequestId
}

interface AttemptContract {
  id: string
  userId: string
  activityId: ActivityId
  state: AttemptState
  attemptVersion: number
  requestId?: RequestId
  answer?: string
  answerType?: 'text' | 'numeric' | 'multiple-choice'
  hintLevel: number
  presentedAt?: Date
  submittedAt?: Date
  responseTimeMs?: number
  evaluation?: 'correct' | 'partially_correct' | 'incorrect' | 'ungradable'
  confidence?: number
  errorCategory?: ErrorCategory
  evidenceCount: number
  masteryEstimate?: number
  uncertainty?: number
  lastEvidenceAt?: Date
  nextReviewAt?: Date
  reviewCount: number
  cancelled?: boolean
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// Mastery and Scheduler Types
// ============================================================================

interface MasteryStateContract {
  userId: string
  skillId: string
  masteryEstimate: number
  uncertainty: number
  evidenceCount: number
  lastEvidenceAt?: Date
  nextReviewAt?: Date
  reviewCount: number
}

interface ReviewScheduleContract {
  userId: string
  skillId: string
  nextReviewAt: Date
  reviewCount: number
  reviewDate: Date
}

// ============================================================================
// Curriculum Types
// ============================================================================

export type CurriculumStatus = 'draft' | 'released' | 'rejected' | 'superseded'

export type ClaimStatus = 'official-confirmed' | 'official-general' | 'inferred'

export type MappingStatus = 'official-confirmed' | 'official-general' | 'inferred'

export type QuestionType =
  | 'multiple-choice'
  | 'fill-in'
  | 'calculation'
  | 'reading'
  | 'grammar'
  | 'other'

interface GeneratedQuestionContract {
  id: string
  templateId: string
  generatorModel: string
  promptVersion: string
  generatedAt: Date
  targetSkillId?: string
  targetDifficulty?: number
  expectedAnswer?: string
  rubric?: Record<string, unknown>
  validationStatus: 'pending' | 'passed' | 'rejected'
  sourceId?: string
  isOfficial: boolean
  hasBeenShown: boolean
  attemptCount: number
  correctCount: number
  incorrectCount: number
}

// ============================================================================
// Error Types (from blueprint section 13)
// ============================================================================

export class ValidationError extends Error {
  constructor(message: string, public details?: Record<string, unknown>) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string, public resourceId?: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends Error {
  constructor(message: string, public retryAfter?: number) {
    super(message)
    this.name = 'RateLimitError'
  }
}

export class ProviderTimeoutError extends Error {
  constructor(message: string, public timeoutMs: number) {
    super(message)
    this.name = 'ProviderTimeoutError'
  }
}

export class ProviderUnavailableError extends Error {
  constructor(message: string) {
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

export class BudgetExceededError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BudgetExceededError'
  }
}

export class PersistenceError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'PersistenceError'
  }
}

export class SyncConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SyncConflictError'
  }
}

export class CancellationError extends Error {
  constructor(message: string, public signal?: AbortSignal) {
    super(message)
    this.name = 'CancellationError'
  }
}

// ============================================================================
// Zod Schemas
// ============================================================================

import { z, type ZodType } from 'zod'

// Attempt Input
export const AttemptInputSchema = z.object({
  activityId: z.string().uuid(),
  answer: z.string().optional(),
  answerType: z.enum(['text', 'numeric', 'multiple-choice']).optional(),
  requestId: z.string().uuid().optional(),
})

export type AttemptInput = z.infer<typeof AttemptInputSchema>

// Attempt Response
export const AttemptSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  activityId: z.string().uuid(),
  state: z.enum(['CREATED', 'PRESENTED', 'SUBMITTED', 'EVALUATING', 'CORRECT', 'PARTIAL', 'INCORRECT', 'UNGRADABLE']),
  attemptVersion: z.number(),
  requestId: z.string().uuid().optional(),
  answer: z.string().optional(),
  answerType: z.enum(['text', 'numeric', 'multiple-choice']).optional(),
  hintLevel: z.number().int().min(0).max(4),
  presentedAt: z.date().optional(),
  submittedAt: z.date().optional(),
  responseTimeMs: z.number().int().optional(),
  evaluation: z.enum(['correct', 'partially_correct', 'incorrect', 'ungradable']).optional(),
  confidence: z.number().min(0).max(1).optional(),
  errorCategory: z.enum(['concept_misunderstanding', 'calculation_error', 'misreading', 'grammar_error', 'vocabulary_error', 'logic_error', 'other']).optional(),
  evidenceCount: z.number().int().nonnegative(),
  masteryEstimate: z.number().min(0).max(1).optional(),
  uncertainty: z.number().min(0).max(1).optional(),
  lastEvidenceAt: z.date().optional(),
  nextReviewAt: z.date().optional(),
  reviewCount: z.number().int().nonnegative(),
  cancelled: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Attempt = z.infer<typeof AttemptSchema>

// Tutor Decision
export const TutorDecisionSchema = z.object({
  activityId: z.string().uuid(),
  evaluation: z.enum(['correct', 'partially_correct', 'incorrect', 'ungradable']),
  rubricResults: z.array(z.object({
    criterionId: z.string(),
    passed: z.boolean(),
    evidence: z.string(),
  })),
  errorCategory: z.enum(['concept_misunderstanding', 'calculation_error', 'misreading', 'grammar_error', 'vocabulary_error', 'logic_error', 'other']).optional(),
  hintLevel: z.number().int().min(0).max(4),
  feedback: z.object({
    whatWasCorrect: z.string().min(1),
    whatWasWrongOrMissing: z.string().min(1),
    why: z.string().min(1),
    nextAction: z.enum(['retry_same', 'try_similar', 'teach_prerequisite', 'schedule_review', 'continue']),
    correctedExample: z.string().optional(),
  }),
  nextAction: z.enum(['retry_same', 'try_similar', 'teach_prerequisite', 'schedule_review', 'continue']),
  confidence: z.number().min(0).max(1),
})

export type TutorDecision = z.infer<typeof TutorDecisionSchema>

// Generated Question
export const GeneratedQuestionSchema = z.object({
  id: z.string().uuid(),
  templateId: z.string().uuid(),
  generatorModel: z.string(),
  promptVersion: z.string(),
  generatedAt: z.date(),
  targetSkillId: z.string().uuid().optional(),
  targetDifficulty: z.number().int().min(1).max(5).optional(),
  expectedAnswer: z.string().optional(),
  rubric: z.record(z.unknown()).optional(),
  validationStatus: z.enum(['pending', 'passed', 'rejected']),
  sourceId: z.string().uuid().optional(),
  isOfficial: z.boolean(),
  hasBeenShown: z.boolean(),
  attemptCount: z.number().int().nonnegative(),
  correctCount: z.number().int().nonnegative(),
  incorrectCount: z.number().int().nonnegative(),
})

export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>

// Activity
export const ActivitySchema = z.object({
  id: z.string().uuid(),
  questionId: z.string().uuid(),
  type: z.enum(['practice', 'mock-exam', 'diagnostic']),
  mode: z.enum(['study', 'exam']),
  isAssisted: z.boolean(),
  isTimed: z.boolean(),
  difficulty: z.number().int().min(1).max(5),
  releaseStatus: z.enum(['draft', 'released', 'rejected', 'superseded']),
})

export type Activity = z.infer<typeof ActivitySchema>

// Mastery State
export const MasteryStateSchema = z.object({
  userId: z.string().uuid(),
  skillId: z.string().uuid(),
  masteryEstimate: z.number().min(0).max(1),
  uncertainty: z.number().min(0).max(1),
  evidenceCount: z.number().int().nonnegative(),
  lastEvidenceAt: z.date().optional(),
  nextReviewAt: z.date().optional(),
  reviewCount: z.number().int().nonnegative(),
})

export type MasteryState = z.infer<typeof MasteryStateSchema>

// Error Schemas
export const ProviderErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
})

export type ProviderError = z.infer<typeof ProviderErrorSchema>

// Provider Configuration
export const ProviderConfigurationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  providerType: z.enum(['hosted', 'openai-compatible', 'ollama', 'lm-studio', 'mock']),
  apiUrl: z.string().url().optional(),
  apiKey: z.string(),
  model: z.string().optional(),
  timeout: z.number().int().min(1000),
  isActive: z.boolean(),
})

export type ProviderConfiguration = z.infer<typeof ProviderConfigurationSchema>

// Learning Objective
export const LearningObjectiveSchema = z.object({
  id: z.string().uuid(),
  skillId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  masteryCriteria: z.record(z.unknown()).optional(),
})

export type LearningObjective = z.infer<typeof LearningObjectiveSchema>

// Review Schedule
export const ReviewScheduleSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  skillId: z.string().uuid(),
  nextReviewAt: z.date(),
  reviewCount: z.number().int().nonnegative(),
  reviewDate: z.date(),
})

export type ReviewSchedule = z.infer<typeof ReviewScheduleSchema>

// ============================================================================
// Constants
// ============================================================================

export const HINT_LEVELS = [0, 1, 2, 3, 4] as const
export type HintLevel = (typeof HINT_LEVELS)[number]

export const ERROR_CATEGORIES: ErrorCategory[] = [
  'concept_misunderstanding',
  'calculation_error',
  'misreading',
  'grammar_error',
  'vocabulary_error',
  'logic_error',
  'other',
]

export const ATTEMPT_STATES: AttemptState[] = [
  'CREATED',
  'PRESENTED',
  'SUBMITTED',
  'EVALUATING',
  'CORRECT',
  'PARTIAL',
  'INCORRECT',
  'UNGRADABLE',
]

export const ACTIVITY_TYPES: ActivityType[] = ['practice', 'mock-exam', 'diagnostic']

export const ACTIVITY_MODES: ActivityMode[] = ['study', 'exam']

export const CONFIDENCE_LEVELS = [0.1, 0.3, 0.5, 0.7, 0.9, 1.0]

// Scheduler policies (deterministic constants)
export const SCHEDULER_POLICIES = {
  // Interval in hours
  INCORRECT: 24, // Repeat in-session and within one day
  CORRECT_STRONG_HINT: [24, 48], // 1-2 days
  CORRECT_SMALL_HINT: 72, // About 3 days
  CORRECT_UNAIDED: [72, 168], // 3-7 days
} as const

export const REVIEW_ORDER = [
  'due reviews',
  'fragile prerequisites',
  'current objective',
  'mixed exam-style task',
  'reflection',
] as const

// ============================================================================
// Utility Functions
// ============================================================================

export function isCancellationError(error: unknown): error is CancellationError {
  return error instanceof CancellationError
}

export function isPersistenceError(error: unknown): error is PersistenceError {
  return error instanceof PersistenceError
}

export function isProviderError(error: unknown): error is ProviderError {
  return error instanceof Error && error.name === 'ProviderError'
}

type AppErrorConstructor = new (...args: any[]) => Error

export function getErrorClass(code: string): AppErrorConstructor {
  const errorClasses: Record<string, AppErrorConstructor> = {
    validation: ValidationError,
    authentication: AuthenticationError,
    authorization: AuthorizationError,
    not_found: NotFoundError,
    conflict: ConflictError,
    rate_limit: RateLimitError,
    provider_timeout: ProviderTimeoutError,
    provider_unavailable: ProviderUnavailableError,
    malformed: MalformedProviderOutputError,
    budget: BudgetExceededError,
    persistence: PersistenceError,
    sync_conflict: SyncConflictError,
    cancellation: CancellationError,
  }

  return errorClasses[code] || Error
}

export function isHintLevelValid(hintLevel: number): hintLevel is HintLevel {
  return HINT_LEVELS.includes(hintLevel as HintLevel)
}

export function isValidActivityType(type: string): type is ActivityType {
  return ACTIVITY_TYPES.includes(type as ActivityType)
}

export function isValidActivityMode(mode: string): mode is ActivityMode {
  return ACTIVITY_MODES.includes(mode as ActivityMode)
}

export function isValidErrorCategory(category: string): category is ErrorCategory {
  return ERROR_CATEGORIES.includes(category as ErrorCategory)
}

// Export for testing and custom usage
export { z }
