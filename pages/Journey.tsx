
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { JOURNEYS } from '../constants';
import { pageTransition, containerVariants, itemVariants } from '../utils/animations';

const JourneyDetail: React.FC = () => {
  const { journeyId } = useParams();
  const [expanded, setExpanded] = useState<string | null>(null);
  
  const journeyKey = Object.keys(JOURNEYS).find(k => (JOURNEYS as any)[k].id === journeyId);
  const journey = journeyKey ? (JOURNEYS as any)[journeyKey] : null;

  if (!journey) return <div className="text-slate-800 text-center py-20 font-black">عذراً، لم نجد هذه الرحلة.</div>;

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial" animate="animate" exit="exit"
      className="max-w-4xl mx-auto px-4 md:px-6 pb-24 relative z-10 overflow-x-hidden"
      dir="rtl"
    >
      <header className="text-center mb-10 md:mb-16 pt-4">
        <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl font-black text-slate-800 mb-4 md:mb-6 drop-shadow-sm leading-tight">
          {journey.title}
        </motion.h1>
        <div className="bg-white/40 backdrop-blur-md p-5 md:p-6 rounded-[2rem] md:rounded-3xl border border-white/50 shadow-sm inline-block w-full">
           <motion.p variants={itemVariants} className="text-base md:text-xl text-slate-600 leading-relaxed font-bold">
            {journey.description}
          </motion.p>
        </div>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden" animate="show"
        className="flex flex-col gap-4 md:gap-6"
      >
        {journey.cards.map((card: any) => {
          const isExpanded = expanded === card.id;
          return (
            <motion.div 
              key={card.id}
              variants={itemVariants}
              className="bg-white/70 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] border-2 border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all group active:scale-[0.98]"
            >
              <div 
                className="p-6 md:p-10 flex flex-col md:flex-row items-center gap-4 md:gap-8 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : card.id)}
              >
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#00e28f]/20 to-[#00c37a]/20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-3xl md:text-5xl group-hover:rotate-6 transition-transform shrink-0">
                  {card.icon}
                </div>
                
                <div className="flex-1 text-center md:text-right">
                  <h3 className="text-xl md:text-3xl font-black text-[#1A2B34] mb-1 md:mb-2 leading-tight">{card.title}</h3>
                  <p className="text-slate-500 font-bold text-xs md:text-base">
                    استكشف المزيد من التفاصيل والخدمات..
                  </p>
                </div>

                <div className={`hidden md:block transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                   <svg className="w-8 h-8 text-[#00c37a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-6 pb-6 md:px-10 md:pb-10 border-t border-white/40 pt-4 md:pt-6"
                >
                  <p className="text-slate-600 text-sm md:text-base font-bold mb-4 md:mb-6 leading-relaxed">
                    هذا القسم يوفر لك أدوات ذكية ومسارات واضحة لتحقيق هدفك الأكاديمي بأفضل طريقة ممكنة.
                  </p>
                  <Link 
                    to={card.path}
                    className="w-full bg-[#00c37a] text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-center block shadow-lg shadow-green-200 hover:brightness-110 active:scale-95 transition-all text-base md:text-lg"
                  >
                    ابدأ الآن 
                  </Link>
                </motion.div>
              )}
              
              <div className="md:hidden w-full px-6 pb-6">
                  <Link 
                    to={card.path}
                    className="w-full bg-white/80 py-3 rounded-xl font-black text-center block border border-slate-100 text-[#00c37a] active:bg-[#00c37a] active:text-white transition-all shadow-sm text-sm"
                  >
                    دخول القسم 
                  </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-12 md:mt-16 text-center">
        <Link to="/" className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md text-slate-600 border border-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black transition-all shadow-sm hover:bg-white active:scale-95 text-sm md:text-base">
          <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg>
          العودة للرئيسية
        </Link>
      </div>
    </motion.div>
  );
};

export default JourneyDetail;
