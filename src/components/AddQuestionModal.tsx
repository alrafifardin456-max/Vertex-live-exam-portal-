import React, { useState } from 'react';
import { Subject, University, Question } from '../types/exam';
import { saveCustomQuestion } from '../services/questionService';
import { X, PlusCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  prefill?: { subject: Subject; chapter?: string };
  onClose: () => void;
  onAdded: () => void;
}

export const AddQuestionModal: React.FC<Props> = ({ prefill, onClose, onAdded }) => {
  const [subject, setSubject] = useState<Subject>(prefill?.subject || 'physics');
  const [chapter, setChapter] = useState(prefill?.chapter || '');
  const [stem, setStem] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const [university, setUniversity] = useState<University>('DU');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stem || !optA || !optB || !optC || !optD) return;

    const newQ: Question = {
      id: `custom_${Date.now()}`,
      subject,
      chapter: chapter || 'সাধারণ অধ্যায়',
      stem,
      options: [optA, optB, optC, optD],
      correctAnswer,
      explanation,
      university,
    };

    saveCustomQuestion(newQ);
    setSuccessMsg(true);
    setTimeout(() => {
      onAdded();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel-elevated neon-border-violet rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-violet-500/30">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            <span>নতুন প্রশ্ন যুক্ত করুন</span>
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl glass-panel text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">প্রশ্ন সফলভাবে যুক্ত হয়েছে!</h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">বিষয়</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value as Subject)}
                  className="w-full p-3 rounded-xl glass-panel border border-violet-500/40 text-white bg-slate-900 cursor-pointer"
                >
                  <option value="physics">পদার্থবিজ্ঞান</option>
                  <option value="chemistry">রসায়ন</option>
                  <option value="math">উচ্চতর গণিত</option>
                  <option value="biology">জীববিজ্ঞান</option>
                  <option value="bangla">বাংলা</option>
                  <option value="english">ইংরেজি</option>
                  <option value="ict_gk">আইসিটি ও সাধারণ জ্ঞান</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">বিশ্ববিদ্যালয় স্ট্যান্ডার্ড</label>
                <select
                  value={university}
                  onChange={e => setUniversity(e.target.value as University)}
                  className="w-full p-3 rounded-xl glass-panel border border-violet-500/40 text-white bg-slate-900 cursor-pointer"
                >
                  <option value="DU">ঢাকা বিশ্ববিদ্যালয় (DU)</option>
                  <option value="GST">গুচ্ছ (GST)</option>
                  <option value="BUET">বুয়েট ও ইঞ্জিনিয়ারিং</option>
                  <option value="MEDICAL">মেডিকেল</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">অধ্যায়ের নাম</label>
              <input
                type="text"
                placeholder="যেমন: ভেক্টর বা নিউটনীয় বলবিদ্যা"
                value={chapter}
                onChange={e => setChapter(e.target.value)}
                className="w-full p-3 rounded-xl glass-panel border border-violet-500/40 text-white bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">প্রশ্নের বিবরণ (Stem)</label>
              <textarea
                rows={3}
                required
                placeholder="প্রশ্ন এখানে লিখুন..."
                value={stem}
                onChange={e => setStem(e.target.value)}
                className="w-full p-3 rounded-xl glass-panel border border-violet-500/40 text-white bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">অপশন ক (A)</label>
                <input type="text" required value={optA} onChange={e => setOptA(e.target.value)} className="w-full p-2.5 rounded-xl glass-panel border border-violet-500/40 text-white bg-slate-900" />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">অপশন খ (B)</label>
                <input type="text" required value={optB} onChange={e => setOptB(e.target.value)} className="w-full p-2.5 rounded-xl glass-panel border border-violet-500/40 text-white bg-slate-900" />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">অপশন গ (C)</label>
                <input type="text" required value={optC} onChange={e => setOptC(e.target.value)} className="w-full p-2.5 rounded-xl glass-panel border border-violet-500/40 text-white bg-slate-900" />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">অপশন ঘ (D)</label>
                <input type="text" required value={optD} onChange={e => setOptD(e.target.value)} className="w-full p-2.5 rounded-xl glass-panel border border-violet-500/40 text-white bg-slate-900" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">সঠিক উত্তর নির্বাচন করুন</label>
                <select
                  value={correctAnswer}
                  onChange={e => setCorrectAnswer(Number(e.target.value))}
                  className="w-full p-3 rounded-xl glass-panel border border-violet-500/40 text-white bg-slate-900 cursor-pointer font-bold text-emerald-400"
                >
                  <option value={0}>অপশন ক (A)</option>
                  <option value={1}>অপশন খ (B)</option>
                  <option value={2}>অপশন গ (C)</option>
                  <option value={3}>অপশন ঘ (D)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">বিস্তারিত ব্যাখ্যা (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="সঠিক উত্তরের ব্যাখ্যা..."
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  className="w-full p-3 rounded-xl glass-panel border border-violet-500/40 text-white bg-slate-900"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 cursor-pointer"
              >
                প্রশ্ন সংরক্ষণ করুন
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
                                                                                   
