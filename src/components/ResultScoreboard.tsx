import React from 'react';
import { ExamAttemptResult } from '../types/exam';
import { Trophy, Target, Award, RotateCcw, Home, BookOpen, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface Props {
  result: ExamAttemptResult;
  onOpenRevision: () => void;
  onRetakeWithNewQuestions: () => void;
  onGoHome: () => void;
}

export const ResultScoreboard: React.FC<Props> = ({
  result,
  onOpenRevision,
  onRetakeWithNewQuestions,
  onGoHome,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4">
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated neon-border-violet text-center relative overflow-hidden space-y-4">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-cyan-400 via-fuchsia-500 to-emerald-400" />

        <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/30">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-violet-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
            পরীক্ষা সম্পন্ন হয়েছে
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            {result.examTitle}
          </h2>
        </div>

        <div className="py-4 px-6 rounded-2xl bg-slate-950/60 border border-violet-500/30 max-w-md mx-auto flex items-center justify-around">
          <div>
            <div className="text-xs text-slate-400">প্রাপ্ত নম্বর</div>
            <div className="text-3xl font-black font-mono-digits text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-300">
              {result.score.toFixed(2)}
              <span className="text-sm text-slate-500 font-normal"> / {result.maxScore}</span>
            </div>
          </div>
          <div className="w-px h-10 bg-slate-800" />
          <div>
            <div className="text-xs text-slate-400">আনুমানিক মেধাস্থান</div>
            <div className="text-3xl font-black font-mono-digits text-fuchsia-400">
              {result.estimatedMeritRank}তম
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl glass-panel border border-emerald-500/30">
            <div className="text-emerald-400 font-bold text-lg font-mono-digits">{result.correctCount}</div>
            <div className="text-slate-300">সঠিক উত্তর</div>
          </div>
          <div className="p-3 rounded-2xl glass-panel border border-rose-500/30">
            <div className="text-rose-400 font-bold text-lg font-mono-digits">{result.wrongCount}</div>
            <div className="text-slate-300">ভুল উত্তর</div>
          </div>
          <div className="p-3 rounded-2xl glass-panel border border-cyan-500/30">
            <div className="text-cyan-300 font-bold text-lg font-mono-digits">{result.accuracy}%</div>
            <div className="text-slate-300">নির্ভুলতার হার</div>
          </div>
          <div className="p-3 rounded-2xl glass-panel border border-amber-500/30">
            <div className="text-amber-300 font-bold text-lg font-mono-digits">
              {Math.floor(result.timeTakenSeconds / 60)} মি: {result.timeTakenSeconds % 60} সে:
            </div>
            <div className="text-slate-300">সময় লেগেছে</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={onOpenRevision}
            className="px-5 py-3 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>বিস্তারিত ব্যাখ্যা ও রিভিশন দেখুন</span>
          </button>

          <button
            onClick={onRetakeWithNewQuestions}
            className="px-5 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>নতুন প্রশ্নে পুনরায় পরীক্ষা দিন</span>
          </button>

          <button
            onClick={onGoHome}
            className="px-5 py-3 rounded-xl glass-panel hover:bg-white/10 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </button>
        </div>
      </div>
    </div>
  );
};
          
