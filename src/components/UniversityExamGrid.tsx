import React from 'react';
import { University } from '../types/exam';
import { Flame, Sparkles, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface Props {
  onStartExam: (options: { university: University; title: string; category: 'university_live' }) => void;
}

const UNIVERSITIES_LIST: { id: University; name: string; short: string; desc: string; color: string }[] = [
  { id: 'DU', name: 'ঢাকা বিশ্ববিদ্যালয় (DU)', short: 'ডিইউ', desc: 'ক ইউনিট ভর্তি পরীক্ষার স্ট্যান্ডার্ড প্রশ্ন ও লাইভ টেস্ট', color: 'from-cyan-500 to-blue-600' },
  { id: 'GST', name: 'গুচ্ছ বিশ্ববিদ্যালয় (GST)', short: 'জিএসটি', desc: '২২টি সাধারণ এবং বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় গুচ্ছ ভর্তি পরীক্ষা', color: 'from-violet-500 to-purple-600' },
  { id: 'BUET', name: 'বুয়েট ও প্রকৌশল গুচ্ছ', short: 'বুয়েট', desc: 'প্রকৌশল বিশ্ববিদ্যালয়গুলোর স্ট্যান্ডার্ড কঠিন ও মানসম্মত প্রশ্ন', color: 'from-emerald-500 to-teal-600' },
  { id: 'MEDICAL', name: 'মেডিকেল ও ডেন্টাল ভর্তি পরীক্ষা', short: 'মেডিকেল', desc: 'জীববিজ্ঞান, রসায়ন ও পদার্থবিজ্ঞান স্পেশাল মেডিকেল স্ট্যান্ডার্ড টেস্ট', color: 'from-pink-500 to-rose-600' },
];

export const UniversityExamGrid: React.FC<Props> = ({ onStartExam }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-fuchsia-300 to-pink-300 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
            <span>শীর্ষ বিশ্ববিদ্যালয় ও গুচ্ছ ভর্তি পরীক্ষা স্পেশাল</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            ২০২৬-২৭ সেশনের ভর্তি পরীক্ষার সিলেবাস ও মানবণ্টন অনুযায়ী ৩৫টি প্রশ্ন ও ১৮ মিনিটের লাইভ টেস্ট।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {UNIVERSITIES_LIST.map(uni => (
          <div
            key={uni.id}
            className="p-5 sm:p-6 rounded-3xl glass-panel-elevated neon-border-violet hover:border-cyan-400 transition-all duration-300 flex flex-col justify-between gap-4 group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-xl bg-linear-to-r ${uni.color} text-white font-extrabold text-xs shadow-md`}>
                  {uni.short} স্পেশাল
                </span>
                <span className="text-xs text-cyan-300 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>১৮ মিনিট • ৩৫ প্রশ্ন</span>
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                {uni.name}
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {uni.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-violet-500/20 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OMR লকড ও নেগেটিভ মার্কিংযুক্ত</span>
              </span>

              <button
                onClick={() => onStartExam({
                  university: uni.id,
                  title: `${uni.name} লাইভ মডেল টেস্ট`,
                  category: 'university_live',
                })}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>পরীক্ষা শুরু করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
      
