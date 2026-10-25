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
      universityTag: universityTag.trim() || '
যে
