
export interface Question {
  Question: string;
  Options: string[];
  Answer: number; // 0-indexed
  Explanation: string;
}

export type AnswerStatus = 'correct' | 'wrong' | 'pending';

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  userAnswers: (number | null)[];
  isFinished: boolean;
}

export type AppView = 'home' | 'quiz' | 'result' | 'loading';
