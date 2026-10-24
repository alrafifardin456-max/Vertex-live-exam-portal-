import { Question, University, Subject, ExamAttemptResult } from '../types/exam';
import { ALL_QUESTIONS_DATA } from '../data/allQuestions';

const STORAGE_KEY_HISTORY = 'vertex_exam_history_v1';
const STORAGE_KEY_SEEN = 'vertex_seen_questions_v1';
const STORAGE_KEY_CUSTOM = 'vertex_custom_questions_v1';

export const getAllQuestions = (): Question[] => {
  try {
    const custom = localStorage.getItem(STORAGE_KEY_CUSTOM);
    const customQuestions: Question[] = custom ? JSON.parse(custom) : [];
    return [...ALL_QUESTIONS_DATA, ...customQuestions];
  } catch {
    return ALL_QUESTIONS_DATA;
  }
};

export const getSeenQuestionIds = (): Set<string> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_SEEN);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch {
    return new Set();
  }
};

export const markQuestionsAsSeen = (ids: string[]) => {
  try {
    const seen = getSeenQuestionIds();
    ids.forEach(id => seen.add(id));
    localStorage.setItem(STORAGE_KEY_SEEN, JSON.stringify(Array.from(seen)));
  } catch (e) {
    console.error(e);
  }
};

export const createDynamicExam = (options: {
  university?: University;
  subject?: Subject;
  chapter?: string;
  category: 'university_live' | 'subject_wise' | 'chapter_wise' | 'mistake_review';
  customPool?: Question[];
  count?: number;
}): Question[] => {
  const all = options.customPool || getAllQuestions();
  let pool = [...all];

  if (options.university) {
    pool = pool.filter(q => q.university === options.university);
  }
  if (options.subject) {
    pool = pool.filter(q => q.subject === options.subject);
  }
  if (options.chapter) {
    pool = pool.filter(q => q.chapter === options.chapter);
  }

  const targetCount = options.count || 35;

  // Shuffle pool using sort
  const shuffled = pool.sort(() => 0.5 - Math.random());
  
  if (shuffled.length <= targetCount) {
    return shuffled;
  }
  return shuffled.slice(0, targetCount);
};

export const saveExamResult = (result: ExamAttemptResult) => {
  try {
    const history = getExamHistory();
    history.unshift(result);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 50)));
  } catch (e) {
    console.error(e);
  }
};

export const getExamHistory = (): ExamAttemptResult[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return history;
  }
};

export const saveCustomQuestion = (q: Question) => {
  try {
    const custom = localStorage.getItem(STORAGE_KEY_CUSTOM);
    const list: Question[] = custom ? JSON.parse(custom) : [];
    list.unshift(q);
    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
};
      
