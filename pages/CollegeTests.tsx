
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { COLLEGES } from '../constants';
import { pageTransition, containerVariants, itemVariants } from '../utils/animations';

const CollegeTests: React.FC = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const { state } = useApp();
  
  const college = COLLEGES.find(c => c.id === collegeId);
  if (!college) return null;

  const unlockedIndex = state.user.unlockedLevels[collegeId || ''] ?? 0;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial" animate="animate" exit="exit"
      className="max-w-4xl mx-auto px-6 md:px-12 pb-32 relative z-10"
      dir="rtl"
    >
      <header className="text-center mb-12 flex flex-col items-center">
        {/* College Icon Header */}
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-[#00c37a]/5 blur-2xl rounded-full"></div>
          <div className="relative bg-white w-28 h-28 flex items-center justify-center rounded-[2.5rem] shadow-xl border border-white/50 z-10 text-6xl">
            {college.icon}
          </div>
        </motion.div>
        
        <h1 className="text-3xl md:text-5xl font-black text-[#1A2B34] mb-3">
          {college.name}
        </h1>
        <p className="text-sm md:text-lg text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
          أكمل المستويات الأربعة بالتتابع لتثبت جدارتك في {college.name}. 
        </p>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden" animate="show"
        className="flex flex-col items-center gap-10"
      >
        {college.tests.map((test, index) => {
          const isUnlocked = index <= unlockedIndex;
          const isCurrent = index === unlockedIndex;
          const isCompleted = index < unlockedIndex;
          
          return (
            <motion.div 
              key={test.id}
              variants={itemVariants}
              className="w-full max-w-md relative px-4"
            >
              <div 
                onClick={() => isUnlocked && navigate(`/quiz/${collegeId}/${index}`)}
                className={`relative p-6 rounded-[2.5rem] border-[3px] transition-all flex items-center gap-5 shadow-lg overflow-hidden min-h-[140px] ${
                  isUnlocked 
                    ? 'bg-white border-[#00c37a] cursor-pointer hover:scale-[1.02] active:scale-95' 
                    : 'bg-[#F1F5F9]/80 border-transparent opacity-80'
                }`}
              >
                {/* Visual Indicator (Number or Lock) */}
                <div className={`w-14 h-18 md:w-16 md:h-20 rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl font-black shadow-md shrink-0 border-b-4 ${
                  isCurrent ? 'bg-[#FBBF24] text-white border-[#D97706]' : 
                  isCompleted ? 'bg-[#00c37a] text-white border-[#008f5d]' : 
                  'bg-[#CBD5E1] text-white border-[#94A3B8]'
                }`}>
                  {isUnlocked ? (isCompleted ? '✓' : (index + 1)) : (
                    <svg className="w-6 h-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 5a3 3 0 016 0v3H9V7zm3 10a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                    </svg>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 text-right flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className={`text-xl md:text-2xl font-black leading-tight ${isUnlocked ? 'text-[#1A2B34]' : 'text-[#94A3B8]'}`}>
                      {test.title}
                    </h3>
                    {isCurrent && (
                      <div className="bg-[#FFF9E5] text-[#D97706] text-[10px] font-black px-3 py-1 rounded-full border border-[#FEF3C7] shrink-0">
                        المستوى الحالي
                      </div>
                    )}
                  </div>
                  
                  <div className={`text-xs md:text-sm font-bold flex items-center gap-1.5 ${isUnlocked ? 'text-[#00c37a]' : 'text-[#94A3B8]'}`}>
                    {isCompleted ? (
                      <span>مكتمل </span>
                    ) : isUnlocked ? (
                      <span className="flex items-center gap-1">
                         اضغط للبدء 
                      </span>
                    ) : (
                      <span>مغلق</span>
                    )}
                  </div>
                </div>

                {/* Decorative background circle */}
                <div className={`absolute top-0 left-0 w-20 h-20 opacity-[0.03] rounded-full -translate-x-8 -translate-y-8 ${isUnlocked ? 'bg-[#00c37a]' : 'bg-slate-400'}`}></div>
              </div>

              {/* Connector Line */}
              {index < college.tests.length - 1 && (
                <div className="absolute left-1/2 -bottom-10 w-1.5 h-10 -translate-x-1/2 flex flex-col items-center z-0">
                   <div className={`w-full h-full rounded-full ${
                    index < unlockedIndex ? 'bg-[#00c37a]' : 'bg-[#E2E8F0]'
                  }`}></div>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-16 text-center">
        <button 
          onClick={() => navigate('/colleges')} 
          className="bg-white text-[#1A2B34] hover:text-[#00c37a] px-8 py-3.5 rounded-2xl font-black flex items-center gap-2 mx-auto border-2 border-slate-100 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
        >
           <span>🏛️</span> 
           العودة لقائمة الكليات
        </button>
      </div>
    </motion.div>
  );
};

export default CollegeTests;
