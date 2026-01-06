
import React from 'react';
import { AnswerStatus } from '../types';

interface ProgressBarProps {
  statuses: AnswerStatus[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ statuses }) => {
  // console.log(statuses);
  const EachQPer = 100 / statuses.length;
  const Result = statuses.reduce((res, c) => {
    res[c] += EachQPer;
    return res;
  }, { "pending": 0, "correct": 0, "wrong": 0 });
  return (
    <>
      <div className="w-full flex rounded-full overflow-hidden text-xs font-medium uppercase text-center">
        <div className={`w-[${Result.correct}%] bg-green-500`}>{Result.correct}%</div>
        <div className={`w-[${Result.wrong}%] bg-red-500`}>{Result.wrong}%</div>
        <div className={`w-[${Result.pending}%] bg-gray-200`}>{Result.pending}%</div>
      </div>
    </>
  );
};

export default ProgressBar;
