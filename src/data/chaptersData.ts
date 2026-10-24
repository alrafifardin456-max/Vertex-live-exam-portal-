import { Subject } from '../types/exam';

export interface ChapterDef {
  id: string;
  subjectId: Subject;
  name: string;
  paper: '1st' | '2nd';
}

export const CHAPTERS_DATA: ChapterDef[] = [
  // Physics 1st & 2nd
  { id: 'p1_1', subjectId: 'physics', name: 'ভৌত জগৎ ও পরিমাপ', paper: '1st' },
  { id: 'p1_2', subjectId: 'physics', name: 'ভেক্টর', paper: '1st' },
  { id: 'p1_3', subjectId: 'physics', name: 'গতিবিদ্যা', paper: '1st' },
  { id: 'p1_4', subjectId: 'physics', name: 'নিউটনীয় বলবিদ্যা', paper: '1st' },
  { id: 'p1_5', subjectId: 'physics', name: 'কাজ, শক্তি ও ক্ষমতা', paper: '1st' },
  { id: 'p1_6', subjectId: 'physics', name: 'মহাকর্ষ ও অভিকর্ষ', paper: '1st' },
  { id: 'p1_7', subjectId: 'physics', name: 'পদার্থের গঠনিক ধর্ম', paper: '1st' },
  { id: 'p1_8', subjectId: 'physics', name: 'পর্যায়বৃত্ত গতি', paper: '1st' },
  { id: 'p1_9', subjectId: 'physics', name: 'তরঙ্গ', paper: '1st' },
  { id: 'p1_10', subjectId: 'physics', name: 'আদর্শ গ্যাস ও গ্যাসের গতি তত্ত্ব', paper: '1st' },
  
  { id: 'p2_1', subjectId: 'physics', name: 'তড়িৎ ক্ষেত্র', paper: '2nd' },
  { id: 'p2_2', subjectId: 'physics', name: 'চল তড়িৎ', paper: '2nd' },
  { id: 'p2_3', subjectId: 'physics', name: 'তড়িৎ প্রবাহের চৌম্বক ক্রিয়া ও চুম্বকত্ব', paper: '2nd' },
  { id: 'p2_4', subjectId: 'physics', name: 'তড়িৎ চৌম্বকীয় আবেশ ও পরিবর্তী প্রবাহ', paper: '2nd' },

  // Chemistry 1st & 2nd
  { id: 'c1_1', subjectId: 'chemistry', name: 'ল্যাবরেটরির নিরাপদ ব্যবহার', paper: '1st' },
  { id: 'c1_2', subjectId: 'chemistry', name: 'গুণগত রসায়ন', paper: '1st' },
  { id: 'c1_3', subjectId: 'chemistry', name: 'মৌলের পর্যাবৃত্ত ধর্ম ও রাসায়নিক বন্ধন', paper: '1st' },
  { id: 'c1_4', subjectId: 'chemistry', name: 'রাসায়নিক পরিবর্তন', paper: '1st' },
  { id: 'c2_1', subjectId: 'chemistry', name: 'পরিবেশ রসায়ন', paper: '2nd' },
  { id: 'c2_2', subjectId: 'chemistry', name: 'জৈব রসায়ন', paper: '2nd' },
  { id: 'c2_3', subjectId: 'chemistry', name: 'পরিমাণগত রসায়ন', paper: '2nd' },
  { id: 'c2_4', subjectId: 'chemistry', name: 'তড়িৎ রসায়ন', paper: '2nd' },

  // Math
  { id: 'm1_1', subjectId: 'math', name: 'ম্যাট্রিক্স ও নির্ণায়ক', paper: '1st' },
  { id: 'm1_2', subjectId: 'math', name: 'ভেক্টর', paper: '1st' },
  { id: 'm1_3', subjectId: 'math', name: 'সরলরেখা', paper: '1st' },
  { id: 'm1_4', subjectId: 'math', name: 'বৃত্ত', paper: '1st' },
  { id: 'm2_1', subjectId: 'math', name: 'বাস্তব সংখ্যা ও অসমতা', paper: '2nd' },
  { id: 'm2_2', subjectId: 'math', name: 'জটিল সংখ্যা', paper: '2nd' },
  { id: 'm2_3', subjectId: 'math', name: 'বহুপদী ও বহুপদী সমীকরণ', paper: '2nd' },
  { id: 'm2_4', subjectId: 'math', name: 'কনিক্স', paper: '2nd' },

  // Biology
  { id: 'b1_1', subjectId: 'biology', name: 'কোষ ও এর গঠন', paper: '1st' },
  { id: 'b1_2', subjectId: 'biology', name: 'কোষ বিভাজন', paper: '1st' },
  { id: 'b1_3', subjectId: 'biology', name: 'উদ্ভিদ টিস্যু ও টিস্যুতন্ত্র', paper: '1st' },
  { id: 'b1_4', subjectId: 'biology', name: 'উদ্ভিদ শারীরতত্ত্ব', paper: '1st' },
  { id: 'b2_1', subjectId: 'biology', name: 'প্রাণীর বিভিন্নতা ও শ্রেণ বিন্যাস', paper: '2nd' },
  { id: 'b2_2', subjectId: 'biology', name: 'প্রাণীর পরিচিতি (ঘাসফড়িং, রুই মাছ)', paper: '2nd' },
  { id: 'b2_3', subjectId: 'biology', name: 'পরিপাক ও শোষণ', paper: '2nd' },
  { id: 'b2_4', subjectId: 'biology', name: 'রক্ত ও রক্তসংবহন', paper: '2nd' },

  // Bangla, English, ICT
  { id: 'bn_1', subjectId: 'bangla', name: 'সোনার বাংলা ও পদ্য সাহিত্য', paper: '1st' },
  { id: 'bn_2', subjectId: 'bangla', name: 'বাংলা ব্যাকরণ ও শুদ্ধ উচ্চারণ', paper: '2nd' },
  { id: 'en_1', subjectId: 'english', name: 'Right forms of verbs & Subject-Verb Agreement', paper: '1st' },
  { id: 'en_2', subjectId: 'english', name: 'Preposition, Vocabulary & Idioms', paper: '2nd' },
  { id: 'ict_1', subjectId: 'ict_gk', name: 'তথ্য ও যোগাযোগ প্রযুক্তি বিশ্ব ও বাংলাদেশ প্রেক্ষিত', paper: '1st' },
  { id: 'ict_2', subjectId: 'ict_gk', name: 'কম্পিউটার নেটওয়ার্কিং ও এইচটিএমএল', paper: '2nd' },
];
    
