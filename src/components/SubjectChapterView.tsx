import React, { useState } from 'react';
import { Subject, University } from '../types/exam';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { BookOpen, Layers, PlusCircle, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  onStartExam: (options: { subject: Subject; chapter?: string; title: string; category: 'subject_wise' | 'chapter_wise' }) => void;
  onOpenAddModal: (prefill?: { subject: Subject; chapter?: string }) => void;
}

const SUBJECTS_DEF: { id: Subject; name: string; icon: string; count: number }[] = [
  { id: 'physics', name: 'পদার্থবিজ্ঞান', icon: '⚡', count: 14 },
  { id: 'chemistry', name: 'রসায়ন', icon: '🧪', count: 10 },
  { id: 'math', name: 'উচ্চতর গণিত', icon: '📐', count: 10 },
  { id: 'biology', name: 'জীববিজ্ঞান', icon: '🧬', count: 12 },
  { id: 'bangla', name: 'বাংলা', icon: '📚', count: 8 },
  { id: 'english', name: 'ইংরেজি', icon: '🔤', count: 8 },
  { id: 'ict_gk', name: 'আইসিটি ও সাধারণ জ্ঞান', icon: '💻', count: 6 },
];

export const SubjectChapterView: React.FC<Props> = ({ onStartExam, onOpenAddModal }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('physics');

  const chaptersForSub = CHAPTERS_DATA.filter(c => c.subjectId === selectedSubject);
  const currentSubObj = SUBJECTS_DEF.find(s => s.id === selectedSubject) || SUBJECTS_DEF[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-fuchsia-300 to-pink-300 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>বিষয় ও অধ্যায়ভিত্তিক প্রস্তুতি</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            আপনার পছন্দের বিষয় বা নির্দিষ্ট অধ্যায় বেছে নিয়ে আলাদাভাবে মডেল টেস্ট দিন।
          </p>
        </div>

        <button
          onClick={() => onOpenAddModal({ subject: selectedSubject })}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>এই বিষয়ে নতুন প্রশ্ন যোগ করুন</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SUBJECTS_DEF.map(sub => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubject(sub.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              selectedSubject === sub.id
                ? 'bg-linear-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black shadow-lg shadow-cyan-500/30 scale-105'
                : 'glass-panel text-slate-300 hover:text-white border border-violet-500/30'
            }`}
          >
            <span>{sub.icon}</span>
            <span>{sub.name}</span>
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-6 rounded-3xl glass-panel-elevated neon-border-violet flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-bold mb-2">
            <span>{currentSubObj.icon} সম্পূর্ণ বিষয়</span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white">
            {currentSubObj.name} পূর্ণাঙ্গ বিষয়ভিত্তিক মডেল টেস্ট (৩৫ প্রশ্ন)
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            এই বিষয়ের সমস্ত অধ্যায় থেকে প্রশ্ন রেন্ডমাইজ করে একটি ফুল মডেল টেস্ট দিন।
          </p>
        </div>

        <button
          onClick={() => onStartExam({
            subject: selectedSubject,
            title: `${currentSubObj.name} পূর্ণাঙ্গ মডেল টেস্ট`,
            category: 'subject_wise',
          })}
          className="px-6 py-3 rounded-xl bg-linear-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>টেস্ট শুরু করুন</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-fuchsia-400" />
          <span>{currentSubObj.name} - অধ্যায়ভিত্তিক তালিকা ({chaptersForSub.length}টি অধ্যায়)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {chaptersForSub.map(ch => (
            <div
              key={ch.id}
              className="p-4 rounded-2xl glass-panel border border-violet-500/30 hover:border-cyan-400/60 transition-all flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                    {ch.paper === '1st' ? '১ম পত্র' : '২য় পত্র'}
                  </span>
                  <button
                    onClick={() => onOpenAddModal({ subject: selectedSubject, chapter: ch.name })}
                    className="text-[11px] text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>এআই প্রশ্ন যোগ</span>
                  </button>
                </div>
                <h5 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {ch.name}
                </h5>
              </div>

              <button
                onClick={() => onStartExam({
                  subject: selectedSubject,
                  chapter: ch.name,
                  title: `${ch.name} স্পেশাল টেস্ট`,
                  category: 'chapter_wise',
                })}
                className="w-full py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-cyan-200 hover:text-white border border-violet-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>এই অধ্যায়ের পরীক্ষা দিন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
                      
