
import React, { useState, useCallback, useMemo } from 'react';
import { Question, AppView, AnswerStatus } from './types';
import { DEFAULT_QUESTIONS } from './questions/default';
import QuizCard from './components/QuizCard';
import ResultView from './components/ResultView';
import { BrainIcon } from './components/Icons';
import { generateQuizQuestions } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');

  const startQuiz = useCallback((customQuestions?: Question[]) => {
    const activeQuestions = customQuestions || DEFAULT_QUESTIONS;
    setQuestions(activeQuestions);
    setUserAnswers(new Array(activeQuestions.length).fill(null));
    setCurrentIndex(0);
    setView('quiz');
  }, []);

  const handleGenerateAIQuiz = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const newQuestions = await generateQuizQuestions(topic);
      startQuiz(newQuestions);
    } catch (error) {
      alert("Failed to generate AI quiz. Using default questions instead.");
      startQuiz();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (selectedIndex: number) => {
    const updated = [...userAnswers];
    updated[currentIndex] = selectedIndex;
    setUserAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setView('result');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const score = useMemo(() => {
    return userAnswers.reduce((acc, ans, idx) => {
      return (ans === questions[idx].Answer) ? acc + 1 : acc;
    }, 0);
  }, [userAnswers, questions]);

  const answerStatuses = useMemo((): AnswerStatus[] => {
    return userAnswers.map((ans, idx) => {
      if (ans === null) return 'pending';
      return ans === questions[idx].Answer ? 'correct' : 'wrong';
    });
  }, [userAnswers, questions]);

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in duration-700">
      <div className="bg-white p-6 rounded-3xl shadow-xl mb-8">
        <BrainIcon className="w-16 h-16 text-indigo-600" />
      </div>
      <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
        Quizzly <span className="text-indigo-600">AI</span>
      </h1>
      <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
        Challenge yourself with curated questions or generate a custom AI quiz on any topic you want.
      </p>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => startQuiz()}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
        >
          Start Starter Quiz
        </button>
        
        <div className="relative pt-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm font-medium">
            <span className="bg-slate-50 px-4 text-slate-400 uppercase tracking-widest">Or create custom</span>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <input 
            type="text" 
            placeholder="Enter a topic (e.g. World History)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-400 focus:outline-none transition-all shadow-sm"
          />
          <button
            onClick={handleGenerateAIQuiz}
            disabled={isLoading || !topic}
            className={`w-full py-4 flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span>Generate AI Quiz</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {view === 'home' && renderHome()}
        
        {view === 'quiz' && (
          <QuizCard 
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onBack={handleBack}
            answerStatuses={answerStatuses}
            userAnswerIdx={userAnswers[currentIndex]}
          />
        )}

        {view === 'result' && (
          <ResultView 
            score={score}
            total={questions.length}
            onRestart={() => setView('home')}
          />
        )}
      </div>
      
      <footer className="mt-auto py-8 text-slate-400 text-sm font-medium">
        Powered by Gemini Pro • Interactive MCQ Platform
      </footer>
    </div>
  );
};

export default App;
