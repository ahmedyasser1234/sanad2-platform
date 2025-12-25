import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks: { to: string; label: string; icon?: string }[] = [
    { to: '/', label: 'الرئيسية' },
    { to: '/journey/academic', label: 'الرحلة الأكاديمية' },
    { to: '/journey/values', label: 'الرحلة القيمية' },
    { to: '/journey/financial', label: 'المنح والحلول المالية' },
    { to: '/journey/campus', label: 'الحياة الجامعية' },
  ];

  return (
      <nav dir="rtl" className="w-full fixed top-0 left-0 right-0 z-[150] py-4 border-b border-white/20 shadow-lg bg-white/20 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center relative">
        
        {/* Right Section: Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
             <div className="bg-gradient-to-l from-[#00e28f] to-[#00c37a] p-2 rounded-xl text-white shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
             </div>
             <div className="flex flex-col">
               <span className="text-gray-900 font-black text-xl leading-none">منصة سند</span>
               <span className="text-[#00c37a] text-[10px] font-bold tracking-widest mt-1 uppercase">التعليمية</span>
             </div>
          </Link>
        </div>

        {/* Center Section: Navigation Links */}
        <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-bold transition-all px-4 py-2 rounded-xl whitespace-nowrap ${
                  isActive 
                    ? 'text-[#00c37a] bg-[#d1fae5]' 
                    : 'text-gray-800 hover:text-black hover:bg-white/20'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Left Section: AI Button & Profile */}
        <div className="mr-auto flex items-center gap-4">
          <Link 
            to="/journey/ai"
            className="hidden md:flex items-center gap-2 bg-[#00c37a] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-900/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>🤖</span>
            تحدث مع سند AI
          </Link>

          <Link 
            to="/profile" 
            className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xl text-gray-900 overflow-hidden hover:scale-110 transition-all active:scale-95 group"
          >
            👤
          </Link>

          <div className="xl:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="text-gray-900 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 200 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 200 }}
            className="fixed inset-0 z-[9999] w-screen h-screen flex flex-col bg-white/40 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex justify-between items-center px-6 py-8">
               <h2 className="text-2xl font-black text-gray-900">منصة <span className="text-[#00c37a]">سند</span></h2>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 bg-white/20 p-3 rounded-full">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <div className="flex-1 flex flex-col p-6 gap-3">
              {[...navLinks, { to: '/journey/ai', label: 'تحدث مع سند AI', icon: '🤖' }].map((link) => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-4 px-6 rounded-2xl bg-white/20 text-gray-900 font-bold flex items-center gap-4 hover:bg-white/30 transition-all"
                >
                  {link.icon && <span>{link.icon}</span>}
                  <span className="text-lg">{link.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
