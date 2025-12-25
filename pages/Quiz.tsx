
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';
import CharacterMascot from '../components/CharacterMascot';
import { pageTransition } from '../utils/animations';
import { MascotState } from '../types';
import { speakText, isUsingFallbackAudio } from '../utils/audio';
import { COLLEGES } from '../constants';

const Quiz: React.FC = () => {
  const { collegeId, testIndex } = useParams();
  const navigate = useNavigate();
  const { state, submitAnswer } = useApp();
  
  const college = COLLEGES.find(c => c.id === collegeId);
  const testIdx = parseInt(testIndex || '0');
  const test = college?.tests[testIdx] || college?.tests[0];
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [localScore, setLocalScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [displayedText, setDisplayedText] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isTalking, setIsTalking] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [showFallbackNote, setShowFallbackNote] = useState(false);
  
  const currentQuestion = test?.questions[currentIdx];
  const speechIntervalRef = useRef<number | null>(null);

  const syncSpeech = async (text: string) => {
    if (isTalking || !text) return;
    setIsTalking(true);
    setDisplayedText("");
    setMascotState('talking');
    
    try {
      const { duration } = await speakText(text);
      
      if (isUsingFallbackAudio()) setShowFallbackNote(true);

      const words = text.trim().split(/\s+/);
      const delayPerWord = (Math.max(duration, 0.5) * 1000) / words.length;
      
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
          setMascotState('idle');
          setIsTalking(false);
        }
      }, delayPerWord);
    } catch (e) {
      setDisplayedText(text);
      setMascotState('idle');
      setIsTalking(false);
    }
  };

  useEffect(() => {
    if (audioReady && currentQuestion) {
      const timer = setTimeout(() => syncSpeech(currentQuestion.text), 500);
      return () => {
        clearTimeout(timer);
        if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      };
    } else if (currentQuestion) {
      setDisplayedText(currentQuestion.text);
    }
  }, [currentIdx, collegeId, testIndex, audioReady]);

  const handleSelect = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(idx);
    setMascotState('writing');
    setTimeout(() => {
      if (!isAnswerChecked) setMascotState('idle');
    }, 1200);
  };

  const handleCheck = async () => {
    if (selectedOption === null || !collegeId) return;
    setIsAnswerChecked(true);
    const correct = selectedOption === currentQuestion.correctAnswerIndex;
    setIsCorrect(correct);
    
    if (correct) {
      setLocalScore(prev => prev + 1);
      setMascotState('happy');
      if (audioReady) await syncSpeech("كفو يا بطل!");
    } else {
      setMascotState('sad');
      if (audioReady) await syncSpeech("لا تشيل هم.. ركز في الجاي! ");
    }
    
    submitAnswer(collegeId, testIdx, correct);
  };

  const handleNext = () => {
    if (currentIdx < (test?.questions.length || 0) - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setIsCorrect(null);
      setDisplayedText("");
    } else {
      navigate('/results', { 
        state: { 
          collegeId, 
          testIndex: testIdx,
          score: localScore,
          total: test?.questions.length 
        } 
      });
    }
  };

  if (!test || !currentQuestion) return null;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial" animate="animate" exit="exit"
      className="fixed inset-0 z-[100] flex flex-col font-['Tajawal'] overflow-hidden bg-white/40 backdrop-blur-xl"
      dir="rtl"
    >
      <header className="max-w-5xl mx-auto w-full px-4 md:px-6 pt-6 md:pt-10 flex items-center gap-4 md:gap-6 z-10 shrink-0">
        <button onClick={() => navigate(`/college/${collegeId}/tests`)} className="text-slate-500 hover:text-slate-800 transition-colors p-2 bg-white/50 rounded-full shrink-0">
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-1">
          <ProgressBar current={currentIdx + 1} total={test.questions.length} hearts={state.user.hearts} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 md:px-6 flex flex-col items-center pt-4 md:pt-8 pb-40">
        {!audioReady && (
          <motion.button 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={() => setAudioReady(true)} 
            className="mb-4 md:mb-6 bg-[#00c37a] text-white px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-xl shadow-[0_4px_0_0_#008f5d] active:translate-y-1 active:shadow-none transition-all z-20 flex items-center gap-3 shrink-0"
          >
            <span>🔈</span> تفعيل صوت منصور
          </motion.button>
        )}

        {showFallbackNote && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-amber-50 text-amber-800 px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold border border-amber-200 flex items-center gap-2"
          >
            <span></span> يعمل الصوت الآن بجودة اقتصادية لتوفير الموارد.
          </motion.div>
        )}

        <div className="max-w-4xl w-full flex flex-col gap-6 md:gap-10">
          <h1 className="text-xl md:text-3xl font-black text-slate-800 text-right">
            {test.title} - السؤال {currentIdx + 1}
          </h1>

          <div className="flex flex-col gap-8 md:gap-12 w-full relative">
            <div className="flex items-start gap-1 md:gap-8 justify-start">
              <div className="shrink-0 scale-75 sm:scale-90 md:scale-105 origin-top-right md:origin-top">
                <CharacterMascot state={mascotState} size="sm" flipped={true} />
              </div>
              
              <div className="mt-2 md:mt-4 relative bg-white border-2 border-slate-100 p-4 md:p-6 md:px-10 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center gap-3 md:gap-5 shadow-lg max-w-xl min-h-[80px] md:min-h-[100px] md:flex-1">
                <button 
                  onClick={() => audioReady && !isTalking && syncSpeech(currentQuestion.text)}
                  className={`shrink-0 p-2 md:p-3 rounded-lg md:rounded-xl transition-all ${audioReady ? 'bg-[#00c37a] text-white shadow-[0_3px_0_0_#008f5d]' : 'bg-slate-100 text-slate-400'}`}
                >
                  <svg className="w-5 h-5 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14 8.83v6.34L11.83 13H9v-2h2.83L14 8.83M16 4l-5 5H7v6h4l5 5V4z" /></svg>
                </button>
                <p className="text-base md:text-3xl font-bold text-slate-800 leading-snug md:leading-relaxed border-b border-dashed border-slate-100 pb-1">
                  {displayedText || (audioReady ? "" : currentQuestion.text)}
                </p>
                <div className="absolute top-1/2 -right-2 md:-right-3 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 bg-white border-t-2 border-r-2 border-slate-100 rotate-45"></div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-6 justify-end -mt-4 md:-mt-6">
              <div className="relative bg-white border-2 border-slate-100 p-4 px-6 md:p-6 md:px-12 rounded-[1.5rem] md:rounded-[2.5rem] min-w-[120px] md:min-w-[280px] flex items-center justify-center shadow-md h-14 md:h-24">
                <p className={`text-sm md:text-3xl font-bold transition-all truncate px-2 ${selectedOption !== null ? 'text-[#00c37a]' : 'text-slate-300 tracking-widest'}`}>
                  {selectedOption !== null ? currentQuestion.options[selectedOption] : "__________"}
                </p>
                <div className="absolute top-1/2 -left-2 md:-left-3 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 bg-white border-b-2 border-l-2 border-slate-100 rotate-45"></div>
              </div>
              <div className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-sky-100 border-2 md:border-4 border-white flex items-center justify-center text-2xl md:text-5xl shadow-lg shrink-0 overflow-hidden ring-4 ring-sky-500/5">
                <span className="scale-[1.2]">👩‍🎓</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 w-full mt-2 md:mt-6">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={isAnswerChecked}
                onClick={() => handleSelect(idx)}
                className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl border-2 border-b-4 text-center font-bold text-base md:text-2xl transition-all transform active:scale-[0.99] ${
                  selectedOption === idx 
                  ? 'border-[#00c37a] bg-[#00c37a]/10 text-[#00c37a]' 
                  : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center border-2 font-black shrink-0 text-sm md:text-base ${
                    selectedOption === idx ? 'bg-[#00c37a] text-white border-[#00c37a]' : 'border-slate-100 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="flex-1 text-right text-sm md:text-xl">{opt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className={`fixed bottom-0 left-0 right-0 p-4 md:p-10 z-[110] transition-all duration-500 border-t-2 backdrop-blur-2xl ${
        isAnswerChecked 
          ? (isCorrect ? 'bg-[#d7ffb8]/90 border-[#a5e575]/40' : 'bg-[#ffdfe0]/90 border-[#f4b4b4]/40') 
          : 'bg-white/60 border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]'
      }`}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
          <AnimatePresence>
            {isAnswerChecked ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                <div className={`w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl md:text-4xl shrink-0 shadow-lg ${
                  isCorrect ? 'bg-[#00c37a] text-white' : 'bg-[#ea2b2b] text-white'
                }`}>
                  {isCorrect ? '✓' : '✕'}
                </div>
                <div className="text-right">
                  <h2 className={`text-lg md:text-3xl font-black leading-tight ${isCorrect ? 'text-[#008f5d]' : 'text-[#ea2b2b]'}`}>
                    {isCorrect ? 'أحسنت يا بطل!' : 'معليش، منصور يعلمك'}
                  </h2>
                  {!isCorrect && <p className="text-[#ea2b2b] font-bold mt-0.5 text-xs md:text-lg">الجواب الصح: {currentQuestion.options[currentQuestion.correctAnswerIndex]}</p>}
                </div>
              </motion.div>
            ) : (
              <button onClick={() => handleNext()} className="px-8 md:px-12 py-3 md:py-4 rounded-xl font-black text-slate-400 hover:bg-white/40 transition-colors border-2 border-slate-300/20 text-sm md:text-lg w-full sm:w-auto">
                تخطي
              </button>
            )}
          </AnimatePresence>

          <button
            onClick={isAnswerChecked ? handleNext : handleCheck}
            disabled={selectedOption === null && !isAnswerChecked}
            className={`w-full sm:w-auto px-12 md:px-24 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-lg md:text-2xl min-w-[150px] md:min-w-[220px] shadow-lg active:scale-95 disabled:bg-slate-300/30 disabled:shadow-none disabled:text-slate-400 disabled:border-transparent transition-all ${
               isAnswerChecked 
               ? (isCorrect ? 'bg-[#58cc02] text-white shadow-[0_5px_0_0_#46a302]' : 'bg-[#ea2b2b] text-white shadow-[0_5px_0_0_#b51d1d]')
               : 'bg-[#58cc02] text-white shadow-[0_5px_0_0_#46a302]'
            }`}
          >
            {isAnswerChecked ? 'استمر' : 'تحقق'}
          </button>
        </div>
      </footer>
    </motion.div>
  );
};

export default Quiz;
