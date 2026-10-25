import React, { useState, useEffect } from 'react';
import { Question, Subject } from '../types/exam';
import { saveCustomQuestion } from '../services/questionService';
import { parsePastedQuestionText, parseBulkQuestionsText, stripOptionPrefix } from '../utils/questionParser';
import { CHAPTERS_DATA } from '../data/chaptersData';
import {
  X,
  Sparkles,
  CheckCircle2,
  FileText,
  ClipboardPaste,
  Copy,
  Send,
  Wand2,
  CheckCheck
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdded?: () => void;
  onQuestionAdded?: () => void;
  prefill?: { subject: Subject; chapter?: string };
  initialSubject?: Subject;
  initialChapter?: string;
}

export const AddQuestionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAdded,
  onQuestionAdded,
  prefill,
  initialSubject,
  initialChapter,
}) => {
  const [activeTab, setActiveTab] = useState<'gemini_direct' | 'smart_paste' | 'manual'>('gemini_direct');

  const effectiveSubject = prefill?.subject || initialSubject || 'physics';
  const effectiveChapter = prefill?.chapter || initialChapter || '';

  const [subject, setSubject] = useState<Subject>(effectiveSubject);
  const [chapter, setChapter] = useState(effectiveChapter);
  const [stem, setStem] = useState('');
  const [options, setOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [universityTag] = useState("ভর্তি পরীক্ষা স্পেশাল");
  const [explanation, setExplanation] = useState('');
  const [shortcutTip, setShortcutTip] = useState('');
  const [difficulty] = useState<'সহজ' | 'মাঝারি' | 'মানসম্মত ভর্তি পরীক্ষা'>('মানসম্মত ভর্তি পরীক্ষা');

  const [pastedRawText, setPastedRawText] = useState('');
  const [pasteFeedback, setPasteFeedback] = useState<string | null>(null);
  const [parsedBulkQuestions, setParsedBulkQuestions] = useState<Question[]>([]);

  const [userGeminiPrompt, setUserGeminiPrompt] = useState(
    effectiveChapter
      ? `বিষয় ও '${effectiveChapter}' অধ্যায় থেকে ২০২৬-২৭ সেশনের ভর্তি পরীক্ষার অনুরূপ ৩৫টি প্রশ্ন, অপশন ও ব্যাখ্যা তৈরি করো`
      : 'পদার্থবিজ্ঞান ও রসায়ন থেকে ভর্তি পরীক্ষার অনুরূপ পূর্ণাঙ্গ ৩৫টি প্রশ্ন, অপশন ও ব্যাখ্যা তৈরি করো'
  );
  const [geminiCount, setGeminiCount] = useState<number>(35);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  const [notification, setNotification] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const subjectNames: Record<Subject, string> = {
    physics: 'পদার্থবিজ্ঞান',
    chemistry: 'রসায়ন',
    math: 'উচ্চতর গণিত',
    biology: 'জীববিজ্ঞান',
    bangla: 'বাংলা',
    english: 'ইংরেজি',
    ict_gk: 'আইসিটি ও সাধারণ জ্ঞান',
  };

  useEffect(() => {
    if (isOpen) {
      const sub = prefill?.subject || initialSubject;
      const chap = prefill?.chapter || initialChapter;
      if (sub) {
        setSubject(sub);
      }
      if (chap) {
        setChapter(chap);
        const subName = subjectNames[sub || subject] || 'বিজ্ঞান';
        setUserGeminiPrompt(`${subName} বিষয়ের '${chap}' অধ্যায় থেকে ২০২৬-২৭ সেশনের ভর্তি পরীক্ষার অনুরূপ ৩৫টি প্রশ্ন, অপশন ও ব্যাখ্যা তৈরি করো`);
      } else {
        setChapter('');
        setUserGeminiPrompt('পদার্থবিজ্ঞান ও রসায়ন থেকে ভর্তি পরীক্ষার অনুরূপ পূর্ণাঙ্গ ৩৫টি প্রশ্ন, অপশন ও ব্যাখ্যা তৈরি করো');
      }
      setParsedBulkQuestions([]);
      setGeneratedQuestions([]);
      setPastedRawText('');
      setPasteFeedback(null);
    }
  }, [isOpen, prefill, initialSubject, initialChapter]);

  if (!isOpen) return null;

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options] as [string, string, string, string];
    updated[index] = val;
    setOptions(updated);
  };

  const handleSuccessAction = () => {
    if (onQuestionAdded) onQuestionAdded();
    if (onAdded) onAdded();
    onClose();
  };

  const handleParsePastedText = () => {
    if (!pastedRawText.trim()) {
      setPasteFeedback('অনুগ্রহ করে জিমিনির টেক্সট বা অপশনগুলো পেস্ট করুন।');
      return;
    }

    const bulkResults = parseBulkQuestionsText(pastedRawText, subject, chapter || 'সাধারণ এডমিশন টপিক', universityTag);
    if (bulkResults.length > 1) {
      setParsedBulkQuestions(bulkResults);
      setPasteFeedback(`সফলভাবে একসাথে ${bulkResults.length}টি প্রশ্ন চিহ্নিত করা হয়েছে! নিচে দেখে সেভ করুন।`);
      return;
    }

    const parsed = parsePastedQuestionText(pastedRawText);
    if (!parsed) {
      setPasteFeedback('টেক্সট পার্স করতে সমস্যা হয়েছে। অনুগ্রহ করে প্রশ্ন ও অপশনগুলো স্পষ্ট করে দিন।');
      return;
    }

    setStem(parsed.stem);
    setOptions(parsed.options);
    setCorrectAnswer(parsed.correctAnswer);
    setExplanation(parsed.explanation);
    if (parsed.shortcutTip) setShortcutTip(parsed.shortcutTip);
    if (parsed.chapter) setChapter(parsed.chapter);
    if (parsed.subject) setSubject(parsed.subject);

    setPasteFeedback('সফলভাবে পার্স করা হয়েছে! নিচে ফর্মটি স্বয়ংক্রিয়ভাবে পূরণ হয়ে গেছে।');
    setActiveTab('manual');
  };

  const handleSaveAllBulkQuestions = () => {
    if (parsedBulkQuestions.length === 0) return;
    parsedBulkQuestions.forEach(q => {
      saveCustomQuestion({
        ...q,
        subject: subject || q.subject,
        subjectBangla: subjectNames[subject] || q.subjectBangla || 'পদার্থবিজ্ঞান',
        chapter: chapter || q.chapter || 'সাধারণ এডমিশন টপিক',
      });
    });
    setNotification(`অভিনন্দন! একসাথে ${parsedBulkQuestions.length}টি প্রশ্নই সরাসরি প্রশ্ন ব্যাংকে যুক্ত হয়েছে!`);
    setTimeout(() => {
      setNotification(null);
      handleSuccessAction();
    }, 1500);
  };

  const handleSaveAllGenerated = () => {
    generatedQuestions.forEach(q => {
      saveCustomQuestion({
        ...q,
        subject: subject || q.subject,
        subjectBangla: subjectNames[subject] || q.subjectBangla || 'পদার্থবিজ্ঞান',
        chapter: chapter || q.chapter || 'সাধারণ এডমিশন টপিক',
      });
    });
    setNotification(`অভিনন্দন! একসাথে ${generatedQuestions.length}টি প্রশ্নই সরাসরি প্রশ্ন ব্যাংকে যুক্ত হয়েছে!`);
    setTimeout(() => {
      setNotification(null);
      handleSuccessAction();
    }, 1500);
  };

  const handleAskGemini = async () => {
    if (!userGeminiPrompt.trim()) return;
    setIsGeminiLoading(true);
    setNotification(`জিমিনি আপনার জন্য সম্পূর্ণ ইউনিক ${geminiCount}টি প্রশ্ন তৈরি করছে... এতে ২০-৩০ সেকেন্ড সময় লাগতে পারে, প্রতিটি প্রশ্ন স্বতন্ত্র হবে।`);

    try {
      const resp = await fetch('/api/generate-from-user-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: userGeminiPrompt.trim(),
          count: geminiCount,
          subject,
          chapter,
        }),
      });

      const data = await resp.json().catch(() => null);

      if (resp.ok && data && data.questions && data.questions.length > 0) {
        const seenStems = new Set<string>();
        const uniqueQs: Question[] = [];
        for (const q of data.questions) {
          const stemKey = (q.stem || '').trim().toLowerCase();
          if (!stemKey || seenStems.has(stemKey)) continue;
          seenStems.add(stemKey);
          uniqueQs.push({
            ...q,
            subject: subject || q.subject,
            subjectBangla: subjectNames[subject] || q.subjectBangla || 'পদার্থবিজ্ঞান',
            chapter: chapter || q.chapter
          });
        }

        setGeneratedQuestions(uniqueQs);
        if (data.message) {
          setNotification(data.message);
        } else {
          setNotification(`জিমিনি সফলভাবে ${uniqueQs.length}টি স্বতন্ত্র ও ইউনিক প্রশ্ন তৈরি করেছে! নিচে দেখে ব্যাংকে সেভ করুন।`);
        }
      } else {
        setNotification(data?.error || 'এআই সার্ভার সাময়িক ব্যস্ত রয়েছে। কয়েক মুহূর্ত পর আবার চেষ্টা করুন।');
      }
    } catch (e) {
      setNotification('কানেকশন সমস্যা হয়েছে। ইন্টারনেট বা সার্ভার চেক করে আবার চেষ্টা করুন।');
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const handleCopyGeminiPrompt = () => {
    const promptTemplate = `তুমি শীর্ষ ভর্তি পরীক্ষার সিনিয়র প্রশ্ন প্রণেতা।
আমার জন্য ২০২৬-২৭ সেশনের ভর্তি পরীক্ষার অনুরূপ পূর্ণাঙ্গ ৩৫টি প্রশ্ন (MCQ) তৈরি করো।

বিষয় ও অধ্যায়: [এখানে লিখুন, যেমন: পদার্থবিজ্ঞান গতিবিদ্যা বা রসায়ন গুণগত রসায়ন]

হুবহু প্রতিটি প্রশ্নের ফরম্যাট এমন দাও:
১. প্রশ্ন...
ক) ...
খ) ...
গ) ...
ঘ) ...
সঠিক উত্তর: [ক/খ/গ/ঘ]
ব্যাখ্যা: [ধাপে ধাপে সমাধান ও সূত্র]
শর্টকাট: [এডমিশন টেকনিক]

(এভাবে ১ থেকে ৩৫ পর্যন্ত মোট ৩৫টি প্রশ্ন তৈরি করো)`;

    navigator.clipboard.writeText(promptTemplate);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stem.trim()) {
      alert('অনুগ্রহ করে প্রশ্ন লিখুন।');
      return;
    }
    if (options.some(opt => !opt.trim())) {
      alert('অনুগ্রহ করে ৪টি অপশনই পূরণ করুন।');
      return;
    }

    const newQuestion: Question = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      stem: stem.trim(),
      options: [
        stripOptionPrefix(options[0]).trim(),
        stripOptionPrefix(options[1]).trim(),
        stripOptionPrefix(options[2]).trim(),
        stripOptionPrefix(options[3]).trim(),
      ],
      correctAnswer,
      explanation: explanation.trim() || 'এই প্রশ্নের জন্য সরাসরি পাঠ্যপুস্তকের সূত্রাবলি প্রযোজ্য।',
      shortcutTip: shortcutTip.trim() || undefined,
      subject,
      subjectBangla: subjectNames[subject],
      chapter: chapter.trim() || 'সাধারণ এডমিশন টপিক',
      universityTag: universityTag.trim() || 'ভর্তি পরীক্ষা স্পেশাল',
      difficulty,
    };

    saveCustomQuestion(newQuestion);
    setNotification('প্রশ্ন সফলভাবে এডমিশন প্রশ্ন ব্যাংকে যুক্ত হয়েছে!');
    setTimeout(() => {
      setNotification(null);
      handleSuccessAction();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-violet-500/30 shadow-2xl p-5 sm:p-7 text-white my-8 max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-emerald-400" />

        <div className="flex items-center justify-between pb-4 border-b border-violet-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-pink-200">
                  {chapter ? `'${chapter}' অধ্যায়ে প্রশ্ন যোগ করুন (AQ)` : 'একসাথে ৩৫টি প্রশ্ন এড ও জিমিনি এআই জেনারেটর'}
                </h3>
                {chapter ? (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-cyan-300 border border-cyan-500/40">
                    <span>📌 অধ্যায়: {chapter} ({subjectNames[subject] || 'বিজ্ঞান'})</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ৩৫ প্রশ্ন বাল্ক মোড
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {notification && (
          <div className="my-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
            {notification}
          </div>
        )}

        <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-950 border border-violet-500/30 my-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('gemini_direct')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'gemini_direct'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>জিমিনি ৩৫ প্রশ্ন জেনারেটর</span>
          </button>

          <button
            onClick={() => setActiveTab('smart_paste')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'smart_paste'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ClipboardPaste className="w-4 h-4" />
            <span>একসাথে ৩৫ প্রশ্ন পেস্ট</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>একক প্রশ্ন ফর্ম</span>
          </button>
        </div>

        {activeTab === 'gemini_direct' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30">
              <label className="block text-indigo-200 font-bold mb-1.5 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>জিমিনিকে আপনার নির্দেশ দিন:</span>
              </label>
              <textarea
                rows={3}
                value={userGeminiPrompt}
                onChange={e => setUserGeminiPrompt(e.target.value)}
                placeholder="যেমন: গতিবিদ্যা ও গুণগত রসায়ন থেকে ৩৫টি প্রশ্ন অপশন ও ব্যাখ্যাসহ বানাও..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-indigo-500/40 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 text-xs sm:text-sm leading-relaxed"
              />

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">প্রশ্নের সংখ্যা:</span>
                  {[35, 15, 5, 3].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setGeminiCount(cnt)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        geminiCount === cnt
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cnt === 35 ? '🔥 ৩৫টি' : `${cnt}টি`}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyGeminiPrompt}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedPrompt ? 'কপি হয়েছে!' : 'প্রম্পট কপি'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAskGemini}
                    disabled={isGeminiLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isGeminiLoading ? 'তৈরি হচ্ছে...' : `প্রশ্ন তৈরি করুন`}</span>
                  </button>
                </div>
              </div>
            </div>

            {generatedQuestions.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-lg">
                  <div>
                    <h4 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{generatedQuestions.length}টি প্রশ্ন তৈরি হয়েছে!</span>
                    </h4>
                  </div>
                  <button
                    onClick={handleSaveAllGenerated}
                    className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>ব্যাংকে সেভ করুন</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'smart_paste' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <textarea
                rows={8}
                value={pastedRawText}
                onChange={e => setPastedRawText(e.target.value)}
                placeholder="এখানে প্রশ্ন পেস্ট করুন..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 text-xs sm:text-sm leading-relaxed"
              />
              {pasteFeedback && (
                <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  {pasteFeedback}
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleParsePastedText}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
                >
                  পার্স ও আলাদা করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manual' && (
          <form onSubmit={handleSubmitManual} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">বিষয়</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value as Subject)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                >
                  <option value="physics">পদার্থবিজ্ঞান</option>
