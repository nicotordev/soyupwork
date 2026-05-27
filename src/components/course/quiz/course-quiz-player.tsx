"use client";

import {
  getQuizPlayData,
  gradeQuizAnswer,
  submitQuizAttempt,
} from "@/app/actions/quiz-play.actions";
import { QuizFeedbackScreen } from "@/components/course/quiz/quiz-feedback-screen";
import { QuizIntroScreen } from "@/components/course/quiz/quiz-intro-screen";
import { QuizQuestionScreen } from "@/components/course/quiz/quiz-question-screen";
import { QuizResultsScreen } from "@/components/course/quiz/quiz-results-screen";
import { QUIZ_PLAY } from "@/constants/quiz-play.constants";
import type { CoursePageMode } from "@/types/course-page.types";
import type { QuizAnswerInput, QuizPlayData } from "@/types/quiz-play.types";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type GamePhase = "loading" | "intro" | "question" | "feedback" | "results";

type CourseQuizPlayerProps = {
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  mode: CoursePageMode;
};

export function CourseQuizPlayer({
  lessonId,
  courseId,
  lessonTitle,
  mode,
}: CourseQuizPlayerProps) {
  const adminPreview = mode === "adminPreview";

  const [phase, setPhase] = useState<GamePhase>("loading");
  const [quiz, setQuiz] = useState<QuizPlayData | null>(null);
  const [previousAttempt, setPreviousAttempt] = useState<{
    score: number;
    passed: boolean;
    createdAt: string;
  } | null>(null);
  const [saveAttempts, setSaveAttempts] = useState(true);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<QuizAnswerInput[]>([]);
  const [secondsLeft, setSecondsLeft] = useState<number>(
    QUIZ_PLAY.timerSeconds,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [feedbackCorrectIds, setFeedbackCorrectIds] = useState<string[]>([]);

  const [results, setResults] = useState({
    score: 0,
    passed: false,
    correctCount: 0,
    totalQuestions: 0,
  });

  const confirmRef = useRef<(timedOut?: boolean) => void>(() => undefined);
  const timedOutHandledRef = useRef(false);

  const loadQuiz = useCallback(async () => {
    setPhase("loading");
    const result = await getQuizPlayData(lessonId, courseId, adminPreview);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    if (result.quiz.questions.length === 0) {
      toast.error("Este quiz no tiene preguntas todavía.");
      return;
    }

    setQuiz(result.quiz);
    setPreviousAttempt(result.previousAttempt);
    setSaveAttempts(result.saveAttempts);
    setPhase("intro");
  }, [lessonId, courseId, adminPreview]);

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  const resetRound = useCallback(() => {
    setQuestionIndex(0);
    setSelectedOptionIds([]);
    setAnswers([]);
    setSecondsLeft(QUIZ_PLAY.timerSeconds);
    setFeedbackCorrectIds([]);
  }, []);

  const startGame = () => {
    resetRound();
    timedOutHandledRef.current = false;
    setPhase("question");
  };

  const currentQuestion = quiz?.questions[questionIndex] ?? null;

  const goToNextAfterFeedback = useCallback(() => {
    if (!quiz) return;

    const nextIndex = questionIndex + 1;

    if (nextIndex >= quiz.questions.length) {
      void (async () => {
        setIsSubmitting(true);
        const submit = await submitQuizAttempt({
          lessonId,
          courseId,
          answers,
          adminPreview,
        });
        setIsSubmitting(false);

        if (!submit.ok) {
          toast.error(submit.error);
          return;
        }

        setResults({
          score: submit.score,
          passed: submit.passed,
          correctCount: submit.correctCount,
          totalQuestions: submit.totalQuestions,
        });
        setPhase("results");
      })();
      return;
    }

    setQuestionIndex(nextIndex);
    setSelectedOptionIds([]);
    setSecondsLeft(QUIZ_PLAY.timerSeconds);
    timedOutHandledRef.current = false;
    setPhase("question");
  }, [quiz, questionIndex, answers, lessonId, courseId, adminPreview]);

  const confirmAnswer = useCallback(
    async (timedOut = false) => {
      if (!quiz || !currentQuestion) return;

      if (selectedOptionIds.length === 0 && !timedOut) {
        toast.error(QUIZ_PLAY.selectAtLeastOne);
        return;
      }

      setIsSubmitting(true);

      const graded = await gradeQuizAnswer({
        lessonId,
        courseId,
        questionId: currentQuestion.id,
        optionIds: selectedOptionIds,
        timedOut,
        adminPreview,
      });

      setIsSubmitting(false);

      if (!graded.ok) {
        toast.error(graded.error);
        return;
      }

      const submittedOptionIds = timedOut ? [] : selectedOptionIds;

      const nextAnswers = [
        ...answers.filter((a) => a.questionId !== currentQuestion.id),
        {
          questionId: currentQuestion.id,
          optionIds: submittedOptionIds,
        },
      ];
      setAnswers(nextAnswers);
      setFeedbackCorrect(graded.correct);
      setFeedbackCorrectIds(graded.correctOptionIds);
      setPhase("feedback");
    },
    [
      quiz,
      currentQuestion,
      selectedOptionIds,
      answers,
      lessonId,
      courseId,
      adminPreview,
    ],
  );

  confirmRef.current = confirmAnswer;

  useEffect(() => {
    if (phase !== "question" || isSubmitting) return;

    if (secondsLeft <= 0) {
      if (timedOutHandledRef.current) return;
      timedOutHandledRef.current = true;
      void confirmRef.current(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [phase, secondsLeft, isSubmitting]);

  useEffect(() => {
    if (phase !== "feedback") return;

    const timer = window.setTimeout(() => {
      goToNextAfterFeedback();
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [phase, goToNextAfterFeedback]);

  const toggleOption = (optionId: string) => {
    setSelectedOptionIds((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      }
      return [...prev, optionId];
    });
  };

  if (phase === "loading" || !quiz) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <p className="font-mono text-xs font-bold uppercase text-muted-foreground animate-pulse">
          Cargando quiz...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
          {lessonTitle}
        </h1>
        {adminPreview || !saveAttempts ? (
          <p className="mt-1 font-mono text-[10px] uppercase text-amber-600 dark:text-amber-400">
            Vista previa — los intentos no se guardan en la base de datos
          </p>
        ) : (
          <p className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">
            Modo trivia · estilo Preguntados
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <QuizIntroScreen
            key="intro"
            quiz={quiz}
            previousAttempt={previousAttempt}
            onStart={startGame}
          />
        ) : null}

        {phase === "question" && currentQuestion ? (
          <QuizQuestionScreen
            key={currentQuestion.id}
            question={currentQuestion}
            questionIndex={questionIndex}
            totalQuestions={quiz.questions.length}
            selectedOptionIds={selectedOptionIds}
            secondsLeft={secondsLeft}
            isSubmitting={isSubmitting}
            onToggleOption={toggleOption}
            onConfirm={() => void confirmAnswer()}
          />
        ) : null}

        {phase === "feedback" ? (
          <QuizFeedbackScreen
            key="feedback"
            correct={feedbackCorrect}
            correctOptionIds={feedbackCorrectIds}
            optionLabels={currentQuestion?.options ?? []}
          />
        ) : null}

        {phase === "results" ? (
          <QuizResultsScreen
            key="results"
            score={results.score}
            passed={results.passed}
            correctCount={results.correctCount}
            totalQuestions={results.totalQuestions}
            passingScore={quiz.passingScore}
            onRetry={() => {
              resetRound();
              setPhase("intro");
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
