import assert from "node:assert/strict";
import test from "node:test";
import {
  QUESTION_BANK,
  authenticateDemoUser,
  createEmptyProgress,
  evaluateAnswer,
  getProgressStats,
  parseDemoUser,
  parseLearningMode,
  parseProgress,
  recordAttempt,
} from "./demo-learning";

test("accepts only the documented demo credentials", () => {
  assert.deepEqual(authenticateDemoUser(" TEST@EXAMPLE.COM ", "password123"), {
    id: "demo-learner",
    email: "test@example.com",
    name: "Test Learner",
  });
  assert.equal(
    authenticateDemoUser("test@example.com", "wrong-password"),
    null,
  );
  assert.equal(authenticateDemoUser("other@example.com", "password123"), null);
});

test("grades the corrected subtraction question from the submitted answer", () => {
  const question = QUESTION_BANK.find((item) => item.id === "MATH-SUB-01");
  assert.ok(question);

  assert.equal(evaluateAnswer(question, "2").correct, true);
  assert.equal(evaluateAnswer(question, "3").correct, false);
});

test("normalizes numeric and multiple-choice answers without changing their meaning", () => {
  const calculation = QUESTION_BANK.find(
    (item) => item.id === "MATH-PERCENT-01",
  );
  const translation = QUESTION_BANK.find((item) => item.id === "GER-VOCAB-01");
  assert.ok(calculation);
  assert.ok(translation);

  assert.equal(evaluateAnswer(calculation, "10.0").correct, true);
  assert.equal(evaluateAnswer(calculation, "10,0").correct, true);
  assert.equal(
    evaluateAnswer(translation, "  THE HOUSE IS SMALL.  ").correct,
    true,
  );
});

test("falls back safely for malformed local storage data", () => {
  assert.deepEqual(parseProgress("{not-json"), createEmptyProgress());
  assert.deepEqual(
    parseProgress(JSON.stringify({ version: 2, attempts: [], mistakes: [] })),
    createEmptyProgress(),
  );
  assert.equal(parseDemoUser("{broken"), null);
  assert.equal(
    parseDemoUser(JSON.stringify({ id: "1", email: "learner@example.com" })),
    null,
  );
});

test("records mistakes, updates their attempt count, and resolves them after a correct answer", () => {
  const question = QUESTION_BANK[0];
  const first = recordAttempt(
    createEmptyProgress(),
    { question, mode: "practice", answer: "6", correct: false, hintsUsed: 0 },
    "2026-07-22T10:00:00.000Z",
  );
  const second = recordAttempt(
    first,
    { question, mode: "practice", answer: "8", correct: false, hintsUsed: 0 },
    "2026-07-22T10:01:00.000Z",
  );

  assert.equal(second.mistakes.length, 1);
  assert.equal(second.mistakes[0].attempts, 2);
  assert.deepEqual(getProgressStats(second), {
    attempts: 2,
    correct: 0,
    accuracy: 0,
    openMistakes: 1,
  });

  const resolved = recordAttempt(
    second,
    { question, mode: "practice", answer: "7", correct: true, hintsUsed: 0 },
    "2026-07-22T10:02:00.000Z",
  );

  assert.equal(resolved.mistakes.length, 0);
  assert.deepEqual(getProgressStats(resolved), {
    attempts: 3,
    correct: 1,
    accuracy: 33,
    openMistakes: 0,
  });
});

test("accepts supported modes and rejects arbitrary query values", () => {
  assert.equal(parseLearningMode("study"), "study");
  assert.equal(parseLearningMode("practice"), "practice");
  assert.equal(parseLearningMode("mock-exam"), "mock-exam");
  assert.equal(parseLearningMode("coming-soon"), "diagnostic");
  assert.equal(parseLearningMode(undefined), "diagnostic");
});
