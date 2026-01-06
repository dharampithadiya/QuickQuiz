
import React from 'react';

interface ResultViewProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ score, total, onRestart }) => {
  const percentage = Math.round((score / total) * 100);
  
  let message = "Keep learning!";
  let emoji = "📚";
  if (percentage >= 80) { message = "Outstanding!"; emoji = "🏆"; }
  else if (percentage >= 60) { message = "Great job!"; emoji = "🌟"; }
  else if (percentage >= 40) { message = "Not bad!"; emoji = "👍"; }

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 text-center animate-in zoom-in duration-300">
      <div className="text-6xl mb-4">{emoji}</div>
      <h2 className="text-3xl font-black text-slate-800 mb-2">{message}</h2>
      <p className="text-slate-500 mb-8 font-medium">You completed the quiz!</p>
      
      <div className="bg-slate-50 rounded-2xl p-8 mb-8 border border-slate-100">
        <div className="text-5xl font-black text-indigo-600 mb-2">
          {score} <span className="text-2xl text-slate-300">/ {total}</span>
        </div>
        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">Your Score</p>
      </div>

      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-10">
        <div 
          className="bg-indigo-600 h-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <button
        onClick={onRestart}
        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl transition-transform hover:scale-105 active:scale-95"
      >
        Play Again
      </button>
    </div>
  );
};

export default ResultView;
