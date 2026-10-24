import React, { useState, useEffect, useRef } from 'react';
import { Question, ExamAttemptResult, UserAnswer } from '../types/exam';
import { OMRPalette } from './OMRPalette';
import { CalculatorModal } from './CalculatorModal';
import { stripOptionPrefix } from '../utils/questionParser';
import { Clock, AlertTriangle, Calculator, ShieldCheck, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';

interface Props {
  examTitle: string;
  questions: Question[];
  durationMinutes: number;
  onFinishExam: (result: ExamAttemptResult) => void;
  onCancel: () => void;
}

export const LiveExamScreen: React.FC<Props> = ({
  examTitle,
  questions,
  durationMinutes,
  onFinishExam,
  onCancel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const toggleMarkReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const handleSubmit = (isAutoSubmit = false) => {
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    let correctCount = 0;
    let wrongCount = 0;
    
    const userAnswersList: UserAnswer[] = questions.map((q, idx) => {
      const selected = answers[idx] !== undefined ? answers[idx] : null;
      const isCorrect = selected === q.correctAnswer;
      if (selected !== null) {
        if (isCorrect) correctCount++;
        else wrongCount++;
      }
      return {
        questionIndex: idx,
        selectedOption: selected,
        isCorrect,
      };
    });

    const maxScore = questions.length * 1.0;
    const negativeMark = 0.25;
    const score = (correctCount * 1.0) - (wrongCount * negativeMark);
    const accuracy = correctCount + wrongCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;
    const estimatedMeritRank = Math.max(1, Math.floor(150 - (score * 3) + Math.random() * 5));

    const result: ExamAttemptResult = {
      examTitle,
      totalQuestions: questions.length,
      correctCount,
      wrongCount,
      unansweredCount: questions.length - (correctCount + wrongCount),
      score: Math.max(0, score),
      maxScore,
      accuracy,
      timeTakenSeconds: timeTaken,
      estimatedMeritRank,
      userAnswers: userAnswersList,
      questions,
    };

    onFinishExam(result);
  };

  const currentQ = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4">
      {/* Top Bar */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel-elevated neon-border-violet flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/30">
            লাইভ পরীক্ষা চলমান
          </span>
          <h2 className="text-base sm:text-lg font-black text-white mt-1.5">
            {examTitle}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCalcOpen(true)}
            className="px-4 py-2 rounded-xl glass-panel hover:bg-white/10 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>ক্যালকুলেটর</span>
          </button>

          <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-violet-500/40 flex items-center gap-2">
            <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
            <span className="font-mono-digits font-black text-sm text-white">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated neon-border-violet space-y-6">
            <div className="flex items-center justify-between border-b border-violet-500/20 pb-4">
              <span className="text-xs font-extrabold text-cyan-300 font-mono-digits">
                প্রশ্ন {currentIndex + 1} / {questions.length}
              </span>
              <button
                onClick={toggleMarkReview}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  markedForReview[currentIndex]
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'glass-panel text-slate-300 hover:text-white border border-violet-500/40'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{markedForReview[currentIndex] ? 'রিভিউ মার্ক করা হয়েছে' : 'পরে রিভিউ করব'}</span>
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white leading-relaxed">
              {currentQ.stem}
            </h3>

            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/20 scale-[1.01]'
                        : 'glass-panel text-slate-300 hover:text-white border-violet-500/30 hover:border-cyan-400/50'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-slate-300'
                    }`}>
                      {['ক', 'খ', 'গ', 'ঘ'][idx]}
                    </span>
                    <span className="text-sm">{stripOptionPrefix(opt)}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-violet-500/20">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-violet-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>পূর্ববর্তী</span>
              </button>

              <button
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold shadow-md shadow-violet-600/30 flex items-center gap-1 cursor-pointer"
              >
                <span>পরবর্তী</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* OMR Palette Sidebar */}
        <div className="lg:col-span-1">
          <OMRPalette
            totalQuestions={questions.length}
            currentIndex={currentIndex}
            answers={answers}
            markedForReview={markedForReview}
            onSelectQuestion={idx => setCurrentIndex(idx)}
            onSubmitPrompt={() => setShowSubmitModal(true)}
          />
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated neon-border-violet rounded-3xl p-6 max-w-md w-full space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">পরীক্ষা কি জমা দিতে চান?</h3>
              <p className="text-xs text-slate-300 mt-1">
                আপনি {Object.keys(answers).length}টি প্রশ্নের উত্তর দিয়েছেন এবং {questions.length - Object.keys(answers).length}টি বাকি রয়েছে।
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-xl glass-panel text-slate-300 hover:text-white border border-slate-700 text-xs font-bold cursor-pointer"
              >
                ফিরে যান
              </button>
              <button
                onClick={() => handleSubmit(false)}
                className="flex-1 py-3 rounded-xl bg-linear-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 cursor-pointer"
              >
                হ্যাঁ, জমা দিন
              </button>
            </div>
          </div>
        </div>
      )}

      {isCalcOpen && <CalculatorModal onClose={() => setIsCalcOpen(false)} />}
    </div>
  );
};
      
