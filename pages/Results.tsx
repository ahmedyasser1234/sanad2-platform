
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { pageTransition, popIn } from '../utils/animations';
import CharacterMascot from '../components/CharacterMascot';
import { speakText } from '../utils/audio';
import { MascotState } from '../types';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onTestComplete } = useApp();
  
  const quizData = location.state as { collegeId: string; testIndex: number; score: number; total: number } | null;
  
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [displayedText, setDisplayedText] = useState("");
  const [isTalking, setIsTalking] = useState(false);
  const [didPass, setDidPass] = useState(false);
  const speechIntervalRef = useRef<number | null>(null);

  const score = quizData?.score ?? 0;
  const total = quizData?.total ?? 5;
  const percentage = Math.round((score / total) * 100);
  const isPerfect = score === total;

  useEffect(() => {
    if (quizData) {
      const passed = onTestComplete(quizData.collegeId, quizData.testIndex, quizData.score, quizData.total);
      setDidPass(passed);
    }
  }, []);

  const syncSpeech = async (text: string) => {
    if (isTalking) return;
    setIsTalking(true);
    setMascotState(didPass ? 'celebrate' : 'sad');
    
    try {
      const { duration } = await speakText(text);
      const words = text.trim().split(/\s+/);
      const delayPerWord = (Math.max(duration, 1.5) * 1000) / words.length;
      
      let currentWordIndex = 0;
      let accumulatedText = "";
      
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      
      speechIntervalRef.current = window.setInterval(() => {
        if (currentWordIndex < words.length) {
          accumulatedText += (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex];
          setDisplayedText(accumulatedText);
          currentWordIndex++;
        } else {
          if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
          setMascotState(didPass ? 'happy' : 'sad');
          setIsTalking(false);
        }
      }, delayPerWord);
    } catch (e) {
      setDisplayedText(text);
      setMascotState(didPass ? 'happy' : 'sad');
      setIsTalking(false);
    }
  };

  useEffect(() => {
    const feedbackText = isPerfect
      ? `ما شاء الله تبارك الله! جبت الدرجة الكاملة يا بطل.. أنت فخر لسند! `
      : didPass 
        ? `كفو يا بطل! تجاوزت الاختبار وفتحت المستوى اللي بعده.. استمر!`
        : `بداية طيبة، بس يبيلك تركيز أكثر.. حاول مرة ثانية ومنصور واثق فيك! `;
    
    const timer = setTimeout(() => syncSpeech(feedbackText), 800);
    return () => {
      clearTimeout(timer);
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    };
  }, [didPass, isPerfect]);

  return (
    <motion.div
      variants={pageTransition}
      initial="initial" animate="animate" exit="exit"
      className="min-h-screen pb-12 flex flex-col font-['Tajawal'] relative overflow-hidden"
      dir="rtl"
    >
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-32 px-4">
          
          {/* Mascot Section - Hidden on Mobile, Visible on Desktop */}
          <div className="hidden lg:flex order-2 flex-col items-center relative">
             <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="drop-shadow-2xl scale-[1.1] relative z-10">
                <CharacterMascot state={mascotState} size="md" flipped={true} />
              </motion.div>
              
              {/* Speech Bubble - NOW ABOVE CHARACTER */}
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute bottom-full mb-4 bg-white p-6 rounded-[2.5rem] shadow-2xl border-4 border-[#00c37a]/10 max-w-[320px] text-center z-20"
              >
                <p className="text-lg md:text-xl font-black text-[#1A2B34] leading-relaxed">
                  {displayedText || "أهلاً بك!"}
                </p>
                {/* Tail pointing down to mascot */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-4 border-r-4 border-[#00c37a]/10 rotate-45"></div>
              </motion.div>
          </div>

          {/* Results Card */}
          <motion.div 
            variants={popIn} 
            className="order-1 w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[3rem] md:rounded-[4rem] p-8 md:p-14 shadow-2xl border-4 border-white flex flex-col items-center text-center relative z-10"
          >
            <h1 className="text-xl md:text-3xl font-black text-slate-400 mb-6 md:mb-8 tracking-tight">درجتك في الاختبار</h1>
            <div className="relative mb-6 md:mb-8 group">
               <svg viewBox="0 0 300 300" className="w-48 h-48 md:w-64 md:h-64 -rotate-90 transition-transform group-hover:scale-105 duration-500">
                  <circle cx="150" cy="150" r="125" fill="transparent" stroke="#f1f5f9" strokeWidth="20" />
                  <motion.circle 
                    cx="150" cy="150" r="125" fill="transparent" stroke={didPass ? "#00c37a" : "#ef4444"} strokeWidth="20" 
                    strokeDasharray={785} initial={{ strokeDashoffset: 785 }}
                    animate={{ strokeDashoffset: 785 - (785 * percentage) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-7xl md:text-9xl font-black leading-none ${didPass ? 'text-[#00c37a]' : 'text-red-500'}`}>{score}</span>
                  <span className="text-lg md:text-xl font-bold text-slate-400 mt-2">من {total}</span>
               </div>
            </div>

            <div className={`px-8 md:px-10 py-3 md:py-4 rounded-full flex items-center gap-3 border shadow-sm ${didPass ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
               <span className="text-base md:text-xl font-black">{didPass ? 'تم الاجتياز بنجاح! ' : 'حاول مرة أخرى '}</span>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 md:mt-16 flex flex-col sm:flex-row gap-4 md:gap-5 w-full max-w-2xl px-6 relative z-10">
          <button 
            onClick={() => navigate(`/quiz/${quizData?.collegeId}/${quizData?.testIndex}`)} 
            className="flex-1 bg-amber-500 text-white px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-black rounded-[2rem] md:rounded-[2.5rem] shadow-[0_6px_0_0_#d97706] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
          >
            <span></span> إعادة الاختبار
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            className="flex-1 bg-white text-slate-600 px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-black rounded-[2rem] md:rounded-[2.5rem] border-2 border-slate-100 shadow-lg hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span></span> العودة للرئيسية
          </button>

          {didPass && (
             <button 
              onClick={() => navigate(`/college/${quizData?.collegeId}/tests`)} 
              className="flex-1 bg-[#00c37a] text-white px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-black rounded-[2rem] md:rounded-[2.5rem] shadow-[0_6px_0_0_#008f5d] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
            >
              <span></span> المستوى التالي
            </button>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default Results;
