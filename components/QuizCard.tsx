
import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { CheckIcon, XIcon } from './Icons';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean, selectedIndex: number) => void;
  onNext: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer,
  onNext 
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedIdx(null);
    setIsAnswered(false);
  }, [question]);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    
    setSelectedIdx(idx);
    setIsAnswered(true);
    const correct = idx === question.Answer;
    onAnswer(correct, idx);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-6">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold tracking-wide">
          QUESTION {questionNumber} / {totalQuestions}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-tight">
        {question.Question}
      </h2>

      <div className="space-y-4">
        {question.Options.map((option, idx) => {
          const isCorrect = idx === question.Answer;
          const isSelected = idx === selectedIdx;
          
          let borderClass = "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
          let icon = null;

          if (isAnswered) {
            if (isCorrect) {
              borderClass = "border-green-500 bg-green-50 ring-1 ring-green-500";
              icon = <CheckIcon className="w-5 h-5 text-green-600" />;
            } else if (isSelected) {
              borderClass = "border-red-500 bg-red-50 ring-1 ring-red-500";
              icon = <XIcon className="w-5 h-5 text-red-600" />;
            } else {
              borderClass = "border-slate-100 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={isAnswered}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${borderClass}`}
            >
              <span className={`font-medium ${isAnswered && isCorrect ? 'text-green-800' : isAnswered && isSelected && !isCorrect ? 'text-red-800' : 'text-slate-700'}`}>
                {option}
              </span>
              {icon}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={onNext}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
          >
            {questionNumber === totalQuestions ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
