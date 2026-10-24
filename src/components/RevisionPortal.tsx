import React, { useState } from 'react';
import { ExamAttemptResult, Question } from '../types/exam';
import { stripOptionPrefix } from '../utils/questionParser';
import { ArrowLeft, CheckCircle2, XCircle, BookOpen, RotateCcw, Lock } from 'lucide-react';

interface Props {
  result: ExamAttemptResult;
  onBackToScoreboard: () => void;
  onRetakeMistakesOnly: (mistakeQuestions: Question[]) => void;
}

export const RevisionPortal: React.FC<Props> = ({
  result,
  onBackToScoreboard,
  onRetakeMistakesOnly,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong'>('all');

  const mistakes = result.userAnswers
    .filter(ua => !ua.isCorrect && ua.selectedOption !== null)
    .map(ua => result.questions[ua.questionIndex]);

  const filteredAnswers = result.userAnswers.filter(ua => {
    if (filter === 'correct') return ua.isCorrect;
    if (filter === 'wrong') return !ua.isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      <div className="flex items-center justify-between pb-4 border-b border-violet-500/30">
        <button
          onClick={onBackToScoreboard}
          className="px-4 py-2 rounded-xl glass-panel text-cyan-300 hover:text-white text-xs font-bold border border-cyan-500/40 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>স্কোরবোর্ডে ফিরে যান</span>
        </button>

        <h3 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-300 to-emerald-300">
          প্রশ্নোত্তর ও বিস্তারিত ব্যাখ্যা রিভিশন
        </h3>

        {mistakes.length > 0 && (
          <button
            onClick={() => onRetakeMistakesOnly(mistakes)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ভুলগুলো নিয়ে বিশেষ টেস্ট ({mistakes.length})</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {(['all', 'correct', 'wrong'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === f
                ? 'bg-violet-600 text-white shadow-md'
                : 'glass-panel text-slate-300 hover:text-white border border-violet-500/30'
            }`}
          >
            {f === 'all' ? 'সকল প্রশ্ন' : f === 'correct' ? 'সঠিক উত্তরগুলো' : 'ভুল উত্তরগুলো'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAnswers.map((ua, idx) => {
          const q = result.questions[ua.questionIndex];
          const selected = ua.selectedOption;
          const correct = q.correctAnswer;

          return (
            <div
              key={idx}
              className={`p-5 rounded-3xl glass-panel-elevated border transition-all ${
                ua.isCorrect ? 'border-emerald-500/40' : 'border-rose-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-300">
                  প্রশ্ন নং {ua.questionIndex + 1}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  ua.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {ua.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{ua.isCorrect ? 'সঠিক উত্তর' : selected === null ? 'উত্তর দেননি' : 'ভুল উত্তর'}</span>
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-black text-white mb-3">
                {q.stem}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-4">
                {q.options.map((opt, oIdx) => {
                  let badgeStyle = 'bg-slate-900 border-slate-800 text-slate-400';
                  if (oIdx === correct) {
                    badgeStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                  } else if (oIdx === selected && !ua.isCorrect) {
                    badgeStyle = 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold';
                  }

                  return (
                    <div key={oIdx} className={`p-2.5 rounded-xl border flex items-center gap-2 ${badgeStyle}`}>
                      <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center font-bold text-[11px]">
                        {['ক', 'খ', 'গ', 'ঘ'][oIdx]}
                      </span>
                      <span>{stripOptionPrefix(opt)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-violet-500/30 text-xs space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>বিশদ ব্যাখ্যা ও সমাধান:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {q.explanation || 'এই প্রশ্নের জন্য সরাসরি পাঠ্যপুস্তকের সূত্রাবলি প্রযোজ্য।'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
    
