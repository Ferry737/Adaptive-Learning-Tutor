export const USER_STORAGE_KEY = "user";
export const PROGRESS_STORAGE_KEY = "adaptive-tutor:progress:v1";

export const DEMO_CREDENTIALS = {
  email: "test@example.com",
  password: "password123",
} as const;

export interface DemoUser {
  id: string;
  email: string;
  name: string;
}

export function authenticateDemoUser(
  email: string,
  password: string,
): DemoUser | null {
  if (
    email.trim().toLocaleLowerCase("en") !== DEMO_CREDENTIALS.email ||
    password !== DEMO_CREDENTIALS.password
  ) {
    return null;
  }

  return {
    id: "demo-learner",
    email: DEMO_CREDENTIALS.email,
    name: "Test Learner",
  };
}

export type LearningMode = "diagnostic" | "study" | "practice" | "mock-exam";

export interface LearningModeConfig {
  label: string;
  title: string;
  description: string;
  questionCount: number;
  allowHints: boolean;
  allowRetry: boolean;
  revealFeedback: boolean;
}

export type QuestionType = "multiple-choice" | "calculation";

export interface LearningQuestion {
  id: string;
  subject: "Mathematics" | "German" | "Logic";
  prompt: string;
  type: QuestionType;
  options?: string[];
  acceptedAnswers: string[];
  answerLabel: string;
  explanation: string;
  hints: string[];
}

export interface AnswerEvaluation {
  correct: boolean;
  title: string;
  message: string;
  explanation: string;
}

export interface AttemptRecord {
  id: string;
  questionId: string;
  question: string;
  subject: LearningQuestion["subject"];
  mode: LearningMode;
  answer: string;
  correct: boolean;
  hintsUsed: number;
  attemptedAt: string;
}

export interface MistakeRecord {
  questionId: string;
  question: string;
  subject: LearningQuestion["subject"];
  lastAnswer: string;
  answerLabel: string;
  explanation: string;
  attempts: number;
  updatedAt: string;
}

export interface LearningProgress {
  version: 1;
  attempts: AttemptRecord[];
  mistakes: MistakeRecord[];
}

export interface ProgressStats {
  attempts: number;
  correct: number;
  accuracy: number;
  openMistakes: number;
}

export const MODE_CONFIG: Record<LearningMode, LearningModeConfig> = {
  diagnostic: {
    label: "Diagnostic",
    title: "Skills diagnostic",
    description:
      "Answer six mixed questions without hints or retries to get an honest baseline.",
    questionCount: 6,
    allowHints: false,
    allowRetry: false,
    revealFeedback: true,
  },
  study: {
    label: "Study",
    title: "Guided study session",
    description:
      "Use progressive hints, read the explanation, and retry difficult questions.",
    questionCount: 6,
    allowHints: true,
    allowRetry: true,
    revealFeedback: true,
  },
  practice: {
    label: "Practice",
    title: "Practice session",
    description:
      "Work through a mixed set with immediate feedback and optional retries.",
    questionCount: 8,
    allowHints: false,
    allowRetry: true,
    revealFeedback: true,
  },
  "mock-exam": {
    label: "Mock exam",
    title: "Short mock exam",
    description:
      "Complete eight original practice questions. Answers are reviewed only at the end.",
    questionCount: 8,
    allowHints: false,
    allowRetry: false,
    revealFeedback: false,
  },
};

export const QUESTION_BANK: LearningQuestion[] = [
  {
    id: "MATH-ADD-01",
    subject: "Mathematics",
    prompt: "What is 4 + 3?",
    type: "calculation",
    acceptedAnswers: ["7"],
    answerLabel: "7",
    explanation: "Adding three to four gives seven.",
    hints: ["Start at 4.", "Count forward three steps: 5, 6, 7."],
  },
  {
    id: "MATH-SUB-01",
    subject: "Mathematics",
    prompt: "What is 6 - 4?",
    type: "calculation",
    acceptedAnswers: ["2"],
    answerLabel: "2",
    explanation: "Taking four away from six leaves two.",
    hints: ["Start at 6.", "Count back four steps: 5, 4, 3, 2."],
  },
  {
    id: "MATH-PERCENT-01",
    subject: "Mathematics",
    prompt: "What is 20% of 50?",
    type: "calculation",
    acceptedAnswers: ["10"],
    answerLabel: "10",
    explanation: "20% is one fifth, and one fifth of 50 is 10.",
    hints: ["Convert 20% to a fraction.", "20% equals 1/5, so divide 50 by 5."],
  },
  {
    id: "MATH-FRACTION-01",
    subject: "Mathematics",
    prompt: "What is one half of 18?",
    type: "calculation",
    acceptedAnswers: ["9"],
    answerLabel: "9",
    explanation: "One half means divide by two: 18 / 2 = 9.",
    hints: ["One half means two equal groups.", "Divide 18 by 2."],
  },
  {
    id: "GER-VOCAB-01",
    subject: "German",
    prompt: "Choose the best translation: “Das Haus ist klein.”",
    type: "multiple-choice",
    options: ["The house is small.", "The house is new.", "The room is small."],
    acceptedAnswers: ["The house is small."],
    answerLabel: "The house is small.",
    explanation: "“Haus” means house, “ist” means is, and “klein” means small.",
    hints: ["Focus on the noun “Haus”.", "“Klein” describes something small."],
  },
  {
    id: "GER-GRAMMAR-01",
    subject: "German",
    prompt: "Choose the correct article: “___ Frau arbeitet heute.”",
    type: "multiple-choice",
    options: ["Die", "Der", "Das"],
    acceptedAnswers: ["Die"],
    answerLabel: "Die",
    explanation:
      "“Frau” is feminine, so its nominative definite article is “die”.",
    hints: [
      "Think about the grammatical gender of “Frau”.",
      "Feminine nouns use “die” in the nominative case.",
    ],
  },
  {
    id: "GER-READING-01",
    subject: "German",
    prompt:
      "Read: “Lena beginnt um acht Uhr mit der Arbeit.” When does Lena start work?",
    type: "multiple-choice",
    options: ["At seven o’clock", "At eight o’clock", "At nine o’clock"],
    acceptedAnswers: ["At eight o’clock"],
    answerLabel: "At eight o’clock",
    explanation: "“Um acht Uhr” means “at eight o’clock”.",
    hints: [
      "Look for the time phrase after “beginnt”.",
      "“Acht” is the German word for eight.",
    ],
  },
  {
    id: "LOGIC-SEQUENCE-01",
    subject: "Logic",
    prompt: "Which number comes next: 2, 4, 6, 8, ...?",
    type: "multiple-choice",
    options: ["9", "10", "12"],
    acceptedAnswers: ["10"],
    answerLabel: "10",
    explanation:
      "The sequence increases by two each time, so the next number is 10.",
    hints: [
      "Compare the difference between neighbouring numbers.",
      "Each number is two more than the previous one.",
    ],
  },
];

export function parseLearningMode(
  value: string | null | undefined,
): LearningMode {
  if (value === "study" || value === "practice" || value === "mock-exam") {
    return value;
  }

  return "diagnostic";
}

export function parseDemoUser(raw: string | null): DemoUser | null {
  if (!raw) return null;

  try {
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === "object" &&
      value !== null &&
      typeof (value as DemoUser).id === "string" &&
      typeof (value as DemoUser).email === "string" &&
      typeof (value as DemoUser).name === "string"
    ) {
      return value as DemoUser;
    }
  } catch {
    return null;
  }

  return null;
}

export function normalizeAnswer(answer: string): string {
  return answer
    .trim()
    .toLocaleLowerCase("en")
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ");
}

function numericValue(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function evaluateAnswer(
  question: LearningQuestion,
  answer: string,
): AnswerEvaluation {
  const submitted = normalizeAnswer(answer);
  const submittedNumber =
    question.type === "calculation" ? numericValue(answer) : null;

  const correct = question.acceptedAnswers.some((acceptedAnswer) => {
    if (question.type === "calculation") {
      const acceptedNumber = numericValue(acceptedAnswer);
      return (
        acceptedNumber !== null &&
        submittedNumber !== null &&
        acceptedNumber === submittedNumber
      );
    }

    return normalizeAnswer(acceptedAnswer) === submitted;
  });

  return correct
    ? {
        correct: true,
        title: "Correct",
        message: "Your answer matches the expected result.",
        explanation: question.explanation,
      }
    : {
        correct: false,
        title: "Not quite",
        message: `The expected answer is ${question.answerLabel}.`,
        explanation: question.explanation,
      };
}

export function createEmptyProgress(): LearningProgress {
  return { version: 1, attempts: [], mistakes: [] };
}

function isAttemptRecord(value: unknown): value is AttemptRecord {
  if (typeof value !== "object" || value === null) return false;
  const attempt = value as AttemptRecord;
  return (
    typeof attempt.id === "string" &&
    typeof attempt.questionId === "string" &&
    typeof attempt.question === "string" &&
    typeof attempt.subject === "string" &&
    typeof attempt.mode === "string" &&
    typeof attempt.answer === "string" &&
    typeof attempt.correct === "boolean" &&
    typeof attempt.hintsUsed === "number" &&
    typeof attempt.attemptedAt === "string"
  );
}

function isMistakeRecord(value: unknown): value is MistakeRecord {
  if (typeof value !== "object" || value === null) return false;
  const mistake = value as MistakeRecord;
  return (
    typeof mistake.questionId === "string" &&
    typeof mistake.question === "string" &&
    typeof mistake.subject === "string" &&
    typeof mistake.lastAnswer === "string" &&
    typeof mistake.answerLabel === "string" &&
    typeof mistake.explanation === "string" &&
    typeof mistake.attempts === "number" &&
    typeof mistake.updatedAt === "string"
  );
}

export function parseProgress(raw: string | null): LearningProgress {
  if (!raw) return createEmptyProgress();

  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null)
      return createEmptyProgress();

    const progress = value as Partial<LearningProgress>;
    if (
      progress.version !== 1 ||
      !Array.isArray(progress.attempts) ||
      !Array.isArray(progress.mistakes)
    ) {
      return createEmptyProgress();
    }

    return {
      version: 1,
      attempts: progress.attempts.filter(isAttemptRecord).slice(-250),
      mistakes: progress.mistakes.filter(isMistakeRecord),
    };
  } catch {
    return createEmptyProgress();
  }
}

export function recordAttempt(
  progress: LearningProgress,
  input: {
    question: LearningQuestion;
    mode: LearningMode;
    answer: string;
    correct: boolean;
    hintsUsed: number;
  },
  attemptedAt = new Date().toISOString(),
): LearningProgress {
  const attempt: AttemptRecord = {
    id: `${attemptedAt}-${progress.attempts.length + 1}`,
    questionId: input.question.id,
    question: input.question.prompt,
    subject: input.question.subject,
    mode: input.mode,
    answer: input.answer.trim(),
    correct: input.correct,
    hintsUsed: input.hintsUsed,
    attemptedAt,
  };

  let mistakes = progress.mistakes.filter(
    (mistake) => mistake.questionId !== input.question.id,
  );

  if (!input.correct) {
    const previous = progress.mistakes.find(
      (mistake) => mistake.questionId === input.question.id,
    );
    mistakes = [
      ...mistakes,
      {
        questionId: input.question.id,
        question: input.question.prompt,
        subject: input.question.subject,
        lastAnswer: input.answer.trim() || "No answer",
        answerLabel: input.question.answerLabel,
        explanation: input.question.explanation,
        attempts: (previous?.attempts ?? 0) + 1,
        updatedAt: attemptedAt,
      },
    ];
  }

  return {
    version: 1,
    attempts: [...progress.attempts, attempt].slice(-250),
    mistakes,
  };
}

export function getProgressStats(progress: LearningProgress): ProgressStats {
  const correct = progress.attempts.filter((attempt) => attempt.correct).length;
  return {
    attempts: progress.attempts.length,
    correct,
    accuracy:
      progress.attempts.length === 0
        ? 0
        : Math.round((correct / progress.attempts.length) * 100),
    openMistakes: progress.mistakes.length,
  };
}

export function questionsForSession(
  mode: LearningMode,
  mistakeQuestionIds: string[] = [],
): LearningQuestion[] {
  const config = MODE_CONFIG[mode];
  if (mode === "study" && mistakeQuestionIds.length > 0) {
    const requested = new Set(mistakeQuestionIds);
    const reviewQuestions = QUESTION_BANK.filter((question) =>
      requested.has(question.id),
    );
    const remainingQuestions = QUESTION_BANK.filter(
      (question) => !requested.has(question.id),
    );
    return [...reviewQuestions, ...remainingQuestions].slice(
      0,
      config.questionCount,
    );
  }

  return QUESTION_BANK.slice(0, config.questionCount);
}
