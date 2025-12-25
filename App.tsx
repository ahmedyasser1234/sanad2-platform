
import React from 'react';
import { MemoryRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Colleges from './pages/Colleges';
import CollegeTests from './pages/CollegeTests';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Profile from './pages/Profile';
import JourneyDetail from './pages/Journey';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isQuizPage = location.pathname.startsWith('/quiz');

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {!isQuizPage && <Navbar />}
      
      <main className={`flex-1 relative z-10 ${!isQuizPage ? 'pt-32 md:pt-40' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/journey/:journeyId" element={<JourneyDetail />} />
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/college/:collegeId/tests" element={<CollegeTests />} />
            <Route path="/quiz/:collegeId/:testIndex" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      {!isQuizPage && (
        <footer 
          dir="rtl"
          className="mt-20 py-20 bg-white border-t border-slate-100"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-right">
              
              {/* Column 1: Branding */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#00c37a] p-2 rounded-xl text-white shadow-lg shadow-green-100">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                    </svg>
                  </div>
                  <span className="text-2xl font-black text-slate-800 tracking-tight">منصة سند</span>
                </div>
                <p className="text-slate-500 font-bold text-sm leading-relaxed">
                  نساندك في كل خطوة من رحلتك الجامعية. منصة سند هي رفيقك للنجاح المتميز.
                </p>
                <div className="flex gap-4 mt-2">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">🇸🇦</div>
                   <div className="text-slate-400 text-xs font-black">رؤية ٢٠٣٠</div>
                </div>
              </div>

              {/* Column 2: Journey */}
              <div className="flex flex-col gap-5">
                <h4 className="text-slate-800 font-black text-lg border-r-4 border-[#00c37a] pr-3">رحلاتي التعليمية</h4>
                <nav className="flex flex-col gap-3">
                  <Link to="/journey/academic" className="text-slate-500 font-bold hover:text-[#00c37a]">رحلتي الأكاديمية</Link>
                  <Link to="/journey/values" className="text-slate-500 font-bold hover:text-[#00c37a]">رحلتي القيمية</Link>
                  <Link to="/journey/financial" className="text-slate-500 font-bold hover:text-[#00c37a]">المنح والحلول المالية</Link>
                </nav>
              </div>

              {/* Column 3: Links */}
              <div className="flex flex-col gap-5">
                <h4 className="text-slate-800 font-black text-lg border-r-4 border-[#00c37a] pr-3">روابط سريعة</h4>
                <nav className="flex flex-col gap-3">
                  <Link to="/colleges" className="text-slate-500 font-bold hover:text-[#00c37a]">استكشاف الكليات</Link>
                  <Link to="/profile" className="text-slate-500 font-bold hover:text-[#00c37a]">ملفي الشخصي</Link>
                  <Link to="/journey/ai" className="text-slate-500 font-bold hover:text-[#00c37a]">سند AI</Link>
                </nav>
              </div>

              {/* Column 4: Support */}
              <div className="flex flex-col gap-5">
                <h4 className="text-slate-800 font-black text-lg border-r-4 border-[#00c37a] pr-3">الدعم والخصوصية</h4>
                <nav className="flex flex-col gap-3">
                  <a href="#" className="text-slate-500 font-bold hover:text-[#00c37a]">الدعم الفني </a>
                  <a href="#" className="text-slate-500 font-bold hover:text-[#00c37a]">تواصل معنا </a>
                  <a href="#" className="text-slate-500 font-bold hover:text-[#00c37a]">سياسة الخصوصية </a>
                </nav>
              </div>

            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
