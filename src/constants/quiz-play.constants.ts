export const QUIZ_PLAY = {
  introCta: "¡Jugar!",
  introRetry: "Intentar de nuevo",
  questionOf: (current: number, total: number) =>
    `Pregunta ${current} de ${total}`,
  confirmAnswer: "Confirmar respuesta",
  nextQuestion: "Siguiente",
  seeResults: "Ver resultados",
  timerSeconds: 20,
  passingLabel: (score: number) => `Necesitas ${score}% para aprobar`,
  previousScore: (score: number, passed: boolean) =>
    passed
      ? `Último intento: ${score}% — Aprobado`
      : `Último intento: ${score}% — No aprobado`,
  selectAtLeastOne: "Selecciona al menos una opción.",
  feedback: {
    correct: {
      title: "¡Correcto!",
      subtitle: "¡Sigue así, vas genial!",
    },
    incorrect: {
      title: "¡Ups!",
      subtitle: "No te rindas, la siguiente es tuya.",
    },
  },
  results: {
    success: {
      title: "¡Aprobaste!",
      subtitle: "Dominaste este quiz como un pro.",
    },
    warning: {
      title: "Aprobaste por los pelos",
      subtitle: "Pasaste, pero puedes repasar y mejorar.",
    },
    fail: {
      title: "Casi...",
      subtitle: "Repasa el material e inténtalo otra vez.",
    },
  },
  scoreLabel: (correct: number, total: number) =>
    `${correct} de ${total} correctas`,
  percentLabel: (percent: number) => `${percent}%`,
} as const;
