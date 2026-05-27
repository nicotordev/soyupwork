export type QuizPlayOption = {
  id: string;
  text: string;
};

export type QuizPlayQuestion = {
  id: string;
  question: string;
  position: number;
  options: QuizPlayOption[];
};

export type QuizPlayData = {
  quizId: string;
  title: string;
  description: string;
  passingScore: number;
  questions: QuizPlayQuestion[];
};

export type QuizAnswerInput = {
  questionId: string;
  optionIds: string[];
};

export type QuizPlayAttemptSummary = {
  score: number;
  passed: boolean;
  createdAt: string;
};

export type GradeQuizAnswerResult =
  | {
      ok: true;
      correct: boolean;
      correctOptionIds: string[];
    }
  | { ok: false; error: string };

export type SubmitQuizAttemptResult =
  | {
      ok: true;
      score: number;
      passed: boolean;
      correctCount: number;
      totalQuestions: number;
    }
  | { ok: false; error: string };

export type GetQuizPlayDataResult =
  | {
      ok: true;
      quiz: QuizPlayData;
      previousAttempt: QuizPlayAttemptSummary | null;
      saveAttempts: boolean;
    }
  | { ok: false; error: string };
