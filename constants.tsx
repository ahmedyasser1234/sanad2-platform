
import { College, Badge } from './types';

export const INITIAL_HEARTS = 5;
export const XP_PER_CORRECT = 10;
export const PASS_THRESHOLD = 0.8;

const generateTests = (collegeId: string, collegeName: string) => {
  return [
    {
      id: `${collegeId}-t1`,
      title: "المستوى الأول: أساسيات التخصص",
      description: "مدخل شامل للمفاهيم الأساسية والأخلاقيات المهنية.",
      questions: [
        { id: 'q1', text: `ما هي الركيزة الأساسية للعمل في ${collegeName}؟`, options: ['الأمانة والإتقان', 'السرعة فقط', 'الربح المادي'], correctAnswerIndex: 0, explanation: 'القيم الإسلامية والمهنية تحث على الأمانة والإتقان كركيزة أساسية.', category: collegeId },
        { id: 'q2', text: `تعتبر المهارات التحليلية في ${collegeName}...`, options: ['ثانوية', 'أساسية وجوهرية', 'غير مطلوبة'], correctAnswerIndex: 1, explanation: 'القدرة على التحليل هي مفتاح النجاح في التخصصات الجامعية.', category: collegeId },
      ]
    },
    {
      id: `${collegeId}-t2`,
      title: "المستوى الثاني: التطبيق العملي",
      description: "كيف يتم تطبيق النظريات في أرض الواقع.",
      questions: [
        { id: 'q3', text: `أهمية البحث العلمي في ${collegeName} تكمن في:`, options: ['تطوير المعرفة', 'الحصول على درجات', 'إنهاء الدراسة'], correctAnswerIndex: 0, explanation: 'البحث العلمي هو المحرك الأساسي لتطور التخصصات.', category: collegeId },
      ]
    },
    {
      id: `${collegeId}-t3`,
      title: "المستوى الثالث: التحديات المتقدمة",
      description: "اختبار مهاراتك في حل المشكلات المعقدة.",
      questions: [
        { id: 'q4', text: `عند مواجهة تحدي تقني في ${collegeName}، يفضل:`, options: ['العمل الجماعي والبحث', 'التوقف عن العمل', 'تجاهل المشكلة'], correctAnswerIndex: 0, explanation: 'العمل بروح الفريق والبحث المنهجي هما أقصر الطرق للحل.', category: collegeId },
      ]
    },
    {
      id: `${collegeId}-t4`,
      title: "المستوى الرابع: مشروع التخرج",
      description: "المرحلة النهائية لإثبات جدارتك في هذا التخصص.",
      questions: [
        { id: 'q5', text: `الهدف الأسمى من دراسة ${collegeName} هو:`, options: ['خدمة الوطن والمجتمع', 'الوجاهة الاجتماعية', 'السفر للخارج'], correctAnswerIndex: 0, explanation: 'المساهمة في نهضة الوطن وتحقيق رؤية 2030 هي الغاية الأسمى.', category: collegeId },
      ]
    }
  ];
};

export const COLLEGES: College[] = [
  { id: 'medicine', name: 'كلية الطب', icon: '🏥', bg: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d', tests: generateTests('medicine', 'الطب') },
  { id: 'applied-science', name: 'كلية العلوم التطبيقية', icon: '🔬', bg: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d', tests: generateTests('applied-science', 'العلوم التطبيقية') },
  { id: 'nursing', name: 'كلية التمريض', icon: '🩺', bg: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528', tests: generateTests('nursing', 'التمريض') },
  { id: 'business', name: 'كلية الأعمال', icon: '📊', bg: 'https://images.unsplash.com/photo-1497366216548-37526070297c', tests: generateTests('business', 'إدارة الأعمال') }
];

export const JOURNEYS = {
  ACADEMIC_JOURNEY: {
    id: 'academic',
    title: 'رحلتي الأكاديمية',
    description: 'حل التخصصات ومن خلال الاختبار تساعدك على معرفة الكلية والقدرات والمهارات وتوجهك بشكل سليم.',
    cards: [
      { id: 'registration', title: 'التسجيل والإرشاد ', path: '/journey/registration', icon: '📝' },
      { id: 'colleges', title: 'الكليات ', path: '/colleges', icon: '🏛️' },
      { id: 'skills', title: 'المهارات الأساسية ', path: '/journey/skills', icon: '⚡' }
    ]
  },
  VALUES_JOURNEY: {
    id: 'values',
    title: 'رحلتي القيمية',
    description: 'الأهداف والطموحات تواصلك تؤسس لشخصية قوية ملهمة ومنتجة.',
    cards: [
      { id: 'commitments', title: 'الالتزام القيمي ', path: '/journey/values-commit', icon: '🤝' },
      { id: 'programs', title: 'البرامج القيمية ', path: '/journey/values-programs', icon: '🌟' }
    ]
  },
  CAMPUS_LIFE: {
    id: 'campus',
    title: 'رحلتي في الحياة الجامعية',
    description: 'الحياة الجامعية مليئة بفرص للتطوع، القيادة، وتطوير المهارات الشخصية والاجتماعية.',
    cards: [
      { id: 'leadership', title: 'المهارات والقيادة ', path: '/journey/leadership', icon: '🧠' },
      { id: 'volunteer', title: 'العمل التطوعي ', path: '/journey/volunteer', icon: '🙌' },
      { id: 'services', title: 'الخدمات الطلابية ', path: '/journey/student-services', icon: '🏠' }
    ]
  },
  FINANCIAL_JOURNEY: {
    id: 'financial',
    title: 'رحلتي في المنح والحلول المالية',
    description: 'تقدر تعرف أنواع المنح المتاحة، وتفهم التزاماتك المالية، وتكتشف حلول تساعدك في رحلتك الجامعية.',
    cards: [
      { id: 'scholarships', title: 'المنح الدراسية ', path: '/journey/scholarships', icon: '🎓' },
      { id: 'commitments', title: 'التزاماتي المالية ', path: '/journey/financial-commit', icon: '💰' },
      { id: 'solutions', title: 'الحلول المالية ', path: '/journey/financial-solutions', icon: '🏦' }
    ]
  },
  SANAD_WITH_YOU: {
    id: 'sanad-with-you',
    title: 'سند معك',
    description: 'رفيقك الذكي في رحلتك التعليمية وسوف تقدر كل الخدمات الخاصة في مكان واحد التعليمي والشخصي.',
    cards: [
      { id: 'about', title: 'تعرف على سند ', path: '/journey/about', icon: '🔍' },
      { id: 'services', title: 'خدماتي مع سند ', path: '/journey/services', icon: '🛠️' },
      { id: 'ai', title: 'تحدث مع سند AI ', path: '/journey/ai', icon: '🤖' }
    ]
  }
};

export const BADGES: Badge[] = [
  { id: 'b1', title: 'بداية الطموح', description: 'أكملت أول سؤال بنجاح!', icon: '🌱' },
  { id: 'b2', title: 'خبير الكليات', description: 'أجبت على أسئلة التخصص بنجاح.', icon: '🎓' },
  { id: 'b3', title: 'مثقف سند', description: 'أنهيت رحلة أكاديمية كاملة.', icon: '✨' }
];
