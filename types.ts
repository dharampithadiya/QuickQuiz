
export interface Question {
  Question: string;
  Options: string[];
  Answer: number; // 0-indexed
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  userAnswers: (number | null)[];
  isFinished: boolean;
}

export type AppView = 'home' | 'quiz' | 'result' | 'loading';
