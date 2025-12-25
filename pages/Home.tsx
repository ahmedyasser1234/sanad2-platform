
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition, containerVariants, itemVariants } from '../utils/animations';
import { JOURNEYS } from '../constants';

const Home: React.FC = () => {
  const journeyCards = [
    { ...JOURNEYS.ACADEMIC_JOURNEY },
    { ...JOURNEYS.VALUES_JOURNEY },
    { ...JOURNEYS.CAMPUS_LIFE },
    { ...JOURNEYS.FINANCIAL_JOURNEY },
    { ...JOURNEYS.SANAD_WITH_YOU }
  ];

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial" animate="animate" exit="exit"
      className="min-h-screen pb-32 px-4 md:px-6 overflow-x-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        
        {/* Welcome Header */}
        <header className="text-center mb-16 md:mb-28 pt-8 md:pt-12">
          <motion.h1 
            variants={itemVariants} 
            className="text-5xl sm:text-6xl md:text-8xl font-black text-[#1A2B34] mb-6 tracking-tight leading-tight"
          >
             منصة <span className="text-[#00c37a]">سند</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants} 
            className="text-lg md:text-2xl text-slate-500 font-bold max-w-3xl mx-auto leading-relaxed px-2"
          >
             رفيقك الذكي في رحلتك التعليمية.. استكشف الكليات، طور مهاراتك، وانطلق نحو مستقبلك بثقة.
          </motion.p>
        </header>

        {/* Journey Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 items-start"
        >
          {journeyCards.map((journey, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="card-sanad"
            >
              {/* Card Title Header */}
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="accent-bar shrink-0"></div>
                <h2 className="text-xl md:text-2xl font-black text-[#1A2B34]">{journey.title}</h2>
              </div>

              {/* Description Section */}
              <p className="text-slate-500 text-sm md:text-base font-bold mb-8 md:mb-10 leading-relaxed text-right">
                {journey.description}
              </p>

              {/* Action Buttons - Aligned to the top of their container */}
              <div className="flex flex-col gap-3 md:gap-4">
                {journey.cards.map((card: any, i: number) => (
                  <Link 
                    key={i} 
                    to={card.path}
                    className="btn-green-gradient w-full py-4 shadow-lg shadow-green-100/50 active:scale-95 transition-all text-sm md:text-base"
                  >
                    {card.title}
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Home;
