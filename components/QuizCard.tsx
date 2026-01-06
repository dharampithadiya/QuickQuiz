
import React, { useState, useEffect, useCallback } from 'react';
import { Question, AnswerStatus } from '../types';
import { CheckIcon, XIcon, ArrowLeftIcon, ArrowRightIcon, InfoIcon } from './Icons';
import ProgressBar from './ProgressBar';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIndex: number) => void;
  onNext: () => void;
  onBack: () => void;
  answerStatuses: AnswerStatus[];
  userAnswerIdx: number | null;
}

const QuizCard: React.FC<QuizCardProps> = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer,
  onNext,
  onBack,
  answerStatuses,
  userAnswerIdx
}) => {
  const isAnswered = userAnswerIdx !== null;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && questionNumber > 1) {
      onBack();
    } else if (e.key === 'ArrowRight' && isAnswered) {
      onNext();
    }
  }, [onBack, onNext, isAnswered, questionNumber]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-10 transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-8">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center gap-2">
          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold tracking-widest uppercase">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="flex-grow">
            <ProgressBar statuses={answerStatuses} />
          </div>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-snug">
        {question.Question}
      </h2>

      <div className="space-y-4">
        {question.Options.map((option, idx) => {
          const isCorrect = idx === question.Answer;
          const isSelected = idx === userAnswerIdx;
          
          let borderClass = "border-slate-100 bg-slate-50/50 hover:border-indigo-200 hover:bg-white hover:shadow-md";
          let icon = null;

          if (isAnswered) {
            if (isCorrect) {
              borderClass = "border-green-500 bg-green-50 ring-1 ring-green-500 shadow-sm";
              icon = <CheckIcon className="w-5 h-5 text-green-600" />;
            } else if (isSelected) {
              borderClass = "border-red-500 bg-red-50 ring-1 ring-red-500 shadow-sm";
              icon = <XIcon className="w-5 h-5 text-red-600" />;
            } else {
              borderClass = "border-slate-100 opacity-50 bg-slate-50/20";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => onAnswer(idx)}
              disabled={isAnswered}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 text-left ${borderClass}`}
            >
              <span className={`text-lg font-semibold ${isAnswered && isCorrect ? 'text-green-800' : isAnswered && isSelected && !isCorrect ? 'text-red-800' : 'text-slate-700'}`}>
                {option}
              </span>
              {icon}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-8 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex gap-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex-shrink-0">
            <InfoIcon className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900 mb-1 uppercase tracking-wider">Explanation</p>
            <p className="text-indigo-800/80 leading-relaxed font-medium">
              {question.Explanation}
            </p>
          </div>
        </div>
      )}

      <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
        <button
          onClick={onBack}
          disabled={questionNumber === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            questionNumber === 1 
            ? 'text-slate-300 cursor-not-allowed' 
            : 'text-slate-600 hover:bg-slate-100 active:scale-95'
          }`}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          disabled={!isAnswered}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${
            !isAnswered
            ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-indigo-200'
          }`}
        >
          <span>{questionNumber === totalQuestions ? 'Finish Quiz' : 'Next'}</span>
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
