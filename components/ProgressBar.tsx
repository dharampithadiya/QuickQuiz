
import React from 'react';
import { AnswerStatus } from '../types';

interface ProgressBarProps {
  statuses: AnswerStatus[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ statuses }) => {
  return (
    <div className="flex gap-1.5 w-full h-2.5">
      {statuses.map((status, idx) => {
        let bgColor = "bg-slate-200";
        if (status === 'correct') bgColor = "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]";
        if (status === 'wrong') bgColor = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]";
        
        return (
          <div 
            key={idx} 
            className={`flex-1 rounded-full transition-all duration-500 ${bgColor}`}
          />
        );
      })}
    </div>
  );
};

export default ProgressBar;
