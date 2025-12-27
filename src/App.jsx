import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Mic, Send, Play, Pause, Settings, Home, Sparkles, 
  Coffee, User, Sun, Moon, Palette, CheckCircle, Calendar, 
  Cloud, Volume2, Award, Heart, Layout, Search, Plus, ArrowLeft, Star,
  Mic2, ChevronDown, Globe, AlertTriangle
} from 'lucide-react';

// --- Configuration & Constants ---

const THEMES = {
  default: { id: 'default', name: 'راوي', bg: 'bg-gray-50', primary: 'bg-indigo-600', primaryLight: 'bg-indigo-50', text: 'text-gray-900', accent: 'text-indigo-600', card: 'bg-white', font: 'font-sans' },
  dark: { id: 'dark', name: 'ليلي', bg: 'bg-slate-900', primary: 'bg-blue-600', primaryLight: 'bg-slate-800', text: 'text-white', accent: 'text-blue-400', card: 'bg-slate-800', font: 'font-sans' },
  coffee: { id: 'coffee', name: 'قهوة', bg: 'bg-[#F5E6D3]', primary: 'bg-[#6F4E37]', primaryLight: 'bg-[#E6CCB2]', text: 'text-[#3E2723]', accent: 'text-[#6F4E37]', card: 'bg-[#FFF8F0]', font: 'font-serif' },
  kids: { id: 'kids', name: 'أطفال', bg: 'bg-yellow-50', primary: 'bg-pink-500', primaryLight: 'bg-yellow-200', text: 'text-purple-900', accent: 'text-pink-500', card: 'bg-white border-2 border-dashed border-pink-300', font: 'font-sans rounded-3xl' },
  nature: { id: 'nature', name: 'طبيعة', bg: 'bg-emerald-50', primary: 'bg-emerald-600', primaryLight: 'bg-emerald-100', text: 'text-emerald-950', accent: 'text-emerald-600', card: 'bg-white border border-emerald-100 shadow-emerald-100', font: 'font-sans' },
  galaxy: { id: 'galaxy', name: 'مجرة', bg: 'bg-[#0B0F19]', primary: 'bg-purple-600', primaryLight: 'bg-[#1E1B4B]', text: 'text-purple-50', accent: 'text-purple-400', card: 'bg-[#151932] border border-purple-500/20 backdrop-blur-md', font: 'font-sans tracking-wide' },
  sunset: { id: 'sunset', name: 'غروب', bg: 'bg-orange-50', primary: 'bg-orange-500', primaryLight: 'bg-orange-100', text: 'text-orange-950', accent: 'text-orange-600', card: 'bg-white border-b-4 border-orange-200', font: 'font-serif' }
};

// --- Story Engine Logic (New & Advanced) ---

const STORY_TEMPLATES = {
  space: {
    keywords: ['فضاء', 'قمر', 'كوكب', 'صاروخ', 'نجم', 'شمس', 'مريخ', 'فضائي'],
    genre: 'sci_fi',
    intros: [
      "في محطة الفضاء الدولية، كان الجميع يستعدون لمهمة خاصة.",
      "نظر البطل إلى السماء المليئة بالنجوم وتساءل عما يوجد هناك."
    ],
    plots: [
      { speaker: "الراوي", text: "انطلق الصاروخ بسرعة هائلة مخترقاً الغلاف الجوي." },
      { speaker: "البطل", text: "انظروا! الأرض تبدو صغيرة جداً من هنا." },
      { speaker: "الراوي", text: "فجأة، ظهر ضوء غريب يلمع من بعيد." },
      { speaker: "مساعد", text: "أيها القائد، أجهزة الاستشعار تلتقط إشارة مجهولة!" },
      { speaker: "البطل", text: "لا تخافوا، دعونا نقترب بحذر لنكتشف ما هذا." },
      { speaker: "الراوي", text: "اقتربت المركبة من كويكب يلمع بألوان قوس قزح." },
      { speaker: "البطل", text: "إنه ليس مجرد كويكب، إنه مصنوع من الكريستال النادر!" },
      { speaker: "الراوي", text: "قام الفريق بجمع عينة صغيرة ليعودوا بها إلى الأرض." },
      { speaker: "البطل", text: "هذا الاكتشاف سيغير تاريخ العلم للأبد." },
      { speaker: "الراوي", text: "عادت المركبة بسلام، واحتفل العالم بالأبطال الشجعان." }
    ]
  },
  nature: {
    keywords: ['غابة', 'أسد', 'فيل', 'نمر', 'شجرة', 'نهر', 'عصفور', 'حيوان', 'قطة', 'كلب', 'بحر', 'سمكة'],
    genre: 'adventure',
    intros: [
      "في قلب الغابة الخضراء، حيث الأشجار تعانق السماء.",
      "كان يوماً مشمساً في الحديقة الواسعة المليئة بالزهور."
    ],
    plots: [
      { speaker: "الراوي", text: "كان الهدوء يعم المكان، حتى سُمع صوت غريب بين الشجيرات." },
      { speaker: "البطل", text: "هل تسمعون هذا؟ يبدو وكأنه شخص يطلب المساعدة." },
      { speaker: "الراوي", text: "بحث البطل خلف الأشجار فوجد صغيراً قد تاه عن منزله." },
      { speaker: "البطل", text: "يا مسكين، لا تقلق، سأساعدك في العثور على عائلتك." },
      { speaker: "الراوي", text: "سار الاثنان معاً متجاوزين النهر المتدفق." },
      { speaker: "صديق", text: "احذر! الصخور هنا زلقة جداً." },
      { speaker: "البطل", text: "أمسك يدي جيداً، لن ندع أي شيء يوقفنا." },
      { speaker: "الراوي", text: "بعد مسيرة طويلة، ظهرت علامات الفرح على وجه الصغير." },
      { speaker: "البطل", text: "ها هي عائلتك هناك! لقد نجحنا." },
      { speaker: "الراوي", text: "شكرت العائلة البطل، وعاد إلى بيته وهو يشعر بالفخر." }
    ]
  },
  fantasy: {
    keywords: ['سحر', 'مارد', 'كنز', 'أميرة', 'تنين', 'قلعة', 'جني', 'خاتم'],
    genre: 'fantasy',
    intros: [
      "في مملكة بعيدة تحكمها الأساطير والسحر.",
      "عثر البطل على كتاب قديم في مكتبة جده المغبرة."
    ],
    plots: [
      { speaker: "الراوي", text: "عندما فتح الكتاب، خرج منه دخان ملون وشكل غريب." },
      { speaker: "البطل", text: "من أنت؟ وكيف خرجت من هذا الكتاب؟" },
      { speaker: "الجني", text: "أنا حارس الحكايات، وقد تم حبسي هنا منذ زمن طويل." },
      { speaker: "الراوي", text: "أخبر الجني البطل عن كنز مخفي يحميه تنين نائم." },
      { speaker: "البطل", text: "يجب أن نجد هذا الكنز لنساعد أهل القرية." },
      { speaker: "الراوي", text: "انطلقا في رحلة عبر الجبال الضبابية." },
      { speaker: "الجني", text: "استخدم هذا المفتاح السحري لفتح بوابة القلعة." },
      { speaker: "الراوي", text: "دخل البطل القلعة بهدوء لكي لا يوقظ التنين." },
      { speaker: "البطل", text: "وجدته! إنه صندوق الذهب والجواهر." },
      { speaker: "الراوي", text: "تسللوا للخارج بنجاح، وعم الرخاء القرية بفضل شجاعة البطل." }
    ]
  },
  general: {
    keywords: [], // Fallback
    genre: 'values',
    intros: [
      "في مدينة هادئة، كان هناك طفل يحب الاستكشاف والمغامرة.",
      "بدأت القصة عندما قرر الأصدقاء الذهاب في رحلة تخييم."
    ],
    plots: [
      { speaker: "الراوي", text: "بينما هم يسيرون، وجدوا شيئاً غريباً ملقى على الأرض." },
      { speaker: "البطل", text: "ما هذا الشيء؟ يبدو قديماً وقيماً." },
      { speaker: "الراوي", text: "قرر الأصدقاء البحث عن صاحب هذا الغرض المفقود." },
      { speaker: "صديق", text: "ربما يجب أن نسأل الشرطي في وسط المدينة." },
      { speaker: "البطل", text: "فكرة جيدة، الأمانة هي أهم شيء." },
      { speaker: "الراوي", text: "بحثوا طويلاً وسألوا الكثير من الناس." },
      { speaker: "عجوز", text: "يا إلهي! هذا قلادتي التي أبحث عنها منذ سنين." },
      { speaker: "البطل", text: "تفضلي يا سيدتي، نحن سعداء لأننا وجدناها." },
      { speaker: "الراوي", text: "شكرتهم السيدة وقدمت لهم كعكاً لذيذاً مكافأة لهم." },
      { speaker: "البطل", text: "السعادة الحقيقية هي في مساعدة الآخرين." }
    ]
  }
};

// Function to construct a story
const generateStoryLogic = (prompt) => {
  const p = prompt.toLowerCase();
  
  // 1. Determine Category
  let category = 'general';
  for (const [key, data] of Object.entries(STORY_TEMPLATES)) {
    if (data.keywords.some(k => p.includes(k))) {
      category = key;
      break;
    }
  }
  
  const template = STORY_TEMPLATES[category];
  
  // 2. Select Random Intro
  const intro = template.intros[Math.floor(Math.random() * template.intros.length)];
  
  // 3. Construct Scenes (Injecting the prompt topic)
  const scenes = [
    { speaker: "الراوي", text: intro },
    { speaker: "الراوي", text: `كان موضوع اليوم يدور حول ${prompt}، وهو أمر مثير جداً.` },
    ...template.plots
  ];

  return {
    id: Date.now(),
    title: `مغامرة: ${prompt}`,
    genre: template.genre,
    brief: `قصة تفاعلية ممتعة تم تأليفها خصيصاً عن "${prompt}".`,
    scenes: scenes
  };
};

const GENRES = {
  adventure: { label: 'مغامرة', color: 'bg-orange-100 text-orange-600' },
  values: { label: 'قيم تربوية', color: 'bg-green-100 text-green-600' },
  fantasy: { label: 'خيال', color: 'bg-purple-100 text-purple-600' },
  sci_fi: { label: 'فضاء', color: 'bg-blue-100 text-blue-600' },
};

const BASE_STORIES = [
  { id: 1, title: "عمر وبوابة المدرسة", genre: 'values', brief: "قصة عن الشجاعة في اليوم الأول.", scenes: [{ speaker: "الراوي", text: "وقف عمر أمام المدرسة." }, { speaker: "عمر", text: "هل سأجد أصدقاء؟", emotion: "nervous" }, { speaker: "المعلمة", text: "أهلاً بك يا بطل!", emotion: "warm" }] },
  { id: 2, title: "السلحفاة الطائرة", genre: 'fantasy', brief: "حلم سلحفاة صغيرة بالطيران.", scenes: [{ speaker: "الراوي", text: "كانت سوسو تحلم بلمس الغيوم." }, { speaker: "سوسو", text: "لو كان لي جناحان!" }] },
  { id: 3, title: "لغز الكهف العجيب", genre: 'adventure', brief: "ثلاثة أصدقاء يكتشفون كنزاً.", scenes: [{ speaker: "الراوي", text: "وجد الأصدقاء خريطة قديمة." }] },
  { id: 4, title: "رائد الفضاء الصغير", genre: 'sci_fi', brief: "رحلة إلى المريخ في الفناء الخلفي.", scenes: [{ speaker: "الراوي", text: "ارتدى أحمد خوذته الورقية." }] },
  { id: 5, title: "القطة التي أضاعت مواءها", genre: 'fantasy', brief: "بحث مضحك عن الصوت المفقود.", scenes: [{ speaker: "القطة", text: "هوو هوو.. مهلاً، هذا صوت بومة!" }] },
];

const STORY_LIBRARY = [...BASE_STORIES];
const ADDITIONAL_TITLES = [
  "النملة والمارد الأزرق", "سر الحديقة الخلفية", "الفتى الذي صادق الغيوم", "سباق السيارات العجيبة", 
  "جزيرة الحلوى المفقودة", "الدب الكسول والعسل", "مغامرات قطرة ماء", "القلم السحري", 
  "ليلى والذئب الطيب", "بطل كرة القدم", "رحلة داخل الكتاب", "مدينة الروبوتات", 
  "سر القلعة القديمة", "السمكة الذهبية المتكلمة", "عيد ميلاد القمر", "الديناصور اللطيف"
];

ADDITIONAL_TITLES.forEach((title, index) => {
  STORY_LIBRARY.push({
    id: index + 6,
    title: title,
    genre: Object.keys(GENRES)[index % 4],
    brief: "قصة ممتعة ومشوقة مليئة بالمغامرات والدروس المستفادة.",
    scenes: [
      { speaker: "الراوي", text: `في يوم من الأيام، بدأت أحداث قصة ${title}.` },
      { speaker: "البطل", text: "يا لها من مغامرة رائعة تنتظرنا اليوم!" },
      { speaker: "الراوي", text: "وهكذا انطلقوا في رحلة لا تُنسى." }
    ]
  });
});

const MOCK_TASKS = [
  { id: 1, text: "اجتماع فريق التصميم", time: "10:00 ص", done: false },
  { id: 2, text: "شراء قهوة", time: "02:00 م", done: true },
  { id: 3, text: "قراءة قصة قبل النوم", time: "09:00 م", done: false },
];

// --- Custom Hooks ---

const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const synth = window.speechSynthesis;

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = synth.getVoices();
      
      // Strict Filter: Only allow voices that explicitly support Arabic
      const validArabicVoices = allVoices.filter(v => 
        v.lang.toLowerCase().startsWith('ar') || 
        v.name.toLowerCase().includes('arabic') || 
        v.name.includes('العربية')
      );

      setVoices(validArabicVoices);
      
      // Smart Auto-select
      if (!selectedVoice && validArabicVoices.length > 0) {
        const preferred = validArabicVoices.find(v => 
          v.name.includes('Google') || 
          v.name.includes('Microsoft') || 
          v.name.includes('Maged') 
        ) || validArabicVoices[0];
        setSelectedVoice(preferred);
      }
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = (text, onEnd) => {
    if (synth.speaking) synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    utterance.rate = 0.9;
    utterance.onend = () => { setIsSpeaking(false); if (onEnd) onEnd(); };
    utterance.onstart = () => setIsSpeaking(true);
    
    synth.speak(utterance);
  };

  const stop = () => { synth.cancel(); setIsSpeaking(false); };
  
  return { speak, stop, isSpeaking, voices, selectedVoice, setSelectedVoice };
};

// --- Components ---

const ThemeSelector = ({ currentTheme, setTheme }) => (
  <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
    {Object.values(THEMES).map((t) => {
      const isDefault = t.id === 'default';
      const btnBg = isDefault ? 'bg-white' : t.primary;
      const btnText = isDefault ? 'text-gray-900' : 'text-white';
      const btnBorder = isDefault ? 'border-gray-200' : 'border-transparent';

      return (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`
            flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border
            ${btnBg} ${btnText} ${btnBorder}
            ${currentTheme === t.id 
              ? 'ring-2 ring-offset-2 ring-indigo-300 shadow-md transform scale-105' 
              : 'opacity-70 hover:opacity-100 shadow-sm'}
          `}
        >
          {t.name}
        </button>
      );
    })}
  </div>
);

const BottomNav = ({ activeTab, setActiveTab, theme }) => (
  <div className={`fixed bottom-0 left-0 right-0 ${THEMES[theme].card} border-t border-gray-100 p-3 flex justify-around items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50 rounded-t-2xl`}>
    <NavButton icon={Home} label="الرئيسية" active={activeTab === 'home'} onClick={() => setActiveTab('home')} theme={theme} />
    <NavButton icon={BookOpen} label="المكتبة" active={activeTab === 'stories'} onClick={() => setActiveTab('stories')} theme={theme} />
    <NavButton icon={Sparkles} label="المساعد" active={activeTab === 'assistant'} onClick={() => setActiveTab('assistant')} theme={theme} />
    <NavButton icon={Coffee} label="إحاطة" active={activeTab === 'briefing'} onClick={() => setActiveTab('briefing')} theme={theme} />
  </div>
);

const NavButton = ({ icon: Icon, label, active, onClick, theme }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${active ? `${THEMES[theme].primaryLight} ${THEMES[theme].accent} -translate-y-2` : 'text-gray-400 hover:text-gray-500'}`}>
    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

// --- Modules ---

// 1. Home Dashboard
const HomeDashboard = ({ theme, setActiveTab, onGenerateStory }) => {
  const t = THEMES[theme];
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateClick = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate thinking time
    setTimeout(() => {
      onGenerateStory(prompt); 
      setIsGenerating(false);
      setPrompt('');
    }, 2500);
  };

  return (
    <div className="p-6 space-y-6 pb-24 overflow-y-auto h-full">
      <header className="flex justify-between items-center">
        <div><p className={`text-sm opacity-70 ${t.text}`}>أهلاً بك،</p><h1 className={`text-2xl font-bold ${t.text}`}>المؤلف الصغير 👋</h1></div>
        <div className={`w-12 h-12 ${t.primaryLight} rounded-full flex items-center justify-center`}><User className={t.accent} size={24} /></div>
      </header>

      <div className={`${t.card} p-5 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${t.primary}`}></div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className={`w-5 h-5 ${t.accent}`} />
          <h3 className={`font-bold ${t.text}`}>مؤلف القصص السحري ✨</h3>
        </div>
        <p className={`text-xs mb-4 opacity-70 ${t.text}`}>
          اكتب أي كلمة (مثال: "صاروخ"، "أسد"، "كنز"، "مدرسة") وسأؤلف لك قصة كاملة عنها!
        </p>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="عن ماذا تريد القصة؟"
            className={`flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800`}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerateClick()}
          />
          <button 
            onClick={handleGenerateClick}
            disabled={!prompt || isGenerating}
            className={`${t.primary} text-white p-3 rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center justify-center min-w-[3rem] hover:scale-105 active:scale-95`}
          >
            {isGenerating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={20} className="rtl:rotate-180" />}
          </button>
        </div>
      </div>

      <div className={`${t.primary} text-white p-5 rounded-3xl shadow-lg flex justify-between items-center`}>
        <div><p className="opacity-80 text-sm mb-1">قصص قرأتها</p><h2 className="text-3xl font-bold">12</h2></div>
        <Award size={32} className="text-white opacity-80" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setActiveTab('stories')} className={`${t.card} p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition-all`}>
          <div className={`p-3 rounded-full ${t.primaryLight} ${t.accent}`}><BookOpen size={20} /></div>
          <span className={`font-bold text-sm ${t.text}`}>المكتبة (20+)</span>
        </button>
        <button onClick={() => setActiveTab('briefing')} className={`${t.card} p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition-all`}>
          <div className={`p-3 rounded-full ${t.primaryLight} ${t.accent}`}><Calendar size={20} /></div>
          <span className={`font-bold text-sm ${t.text}`}>جدولي</span>
        </button>
      </div>
    </div>
  );
};

// 2. Stories Module
const StoriesModule = ({ theme, initialStory }) => {
  const t = THEMES[theme];
  const [view, setView] = useState(initialStory ? 'player' : 'library');
  const [activeStory, setActiveStory] = useState(initialStory || null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const { speak, stop, isSpeaking, voices, selectedVoice, setSelectedVoice } = useTTS();

  useEffect(() => {
    if (initialStory) {
      setActiveStory(initialStory);
      setView('player');
      setCurrentSceneIndex(0); 
    }
  }, [initialStory]);

  useEffect(() => {
    return () => stop();
  }, []);

  const handlePlayStory = (story) => {
    setActiveStory(story);
    setCurrentSceneIndex(0);
    setView('player');
  };

  const handleScenePlay = (index) => {
    if (!activeStory || index >= activeStory.scenes.length) return;
    setCurrentSceneIndex(index);
    const scene = activeStory.scenes[index];
    speak(scene.text, () => {
      setTimeout(() => handleScenePlay(index + 1), 1000);
    });
  };

  const togglePlay = () => {
    if (isSpeaking) stop();
    else handleScenePlay(currentSceneIndex);
  };

  // Voice Selection Modal
  const VoiceSettingsModal = () => (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`${t.card} w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold text-lg ${t.text} flex items-center gap-2`}>
                <Mic2 size={20} className={t.accent} />
                اختر صوت الراوي
            </h3>
            <button onClick={() => setShowVoiceSettings(false)} className="text-gray-400 hover:text-red-500">✕</button>
        </div>
        
        <p className="text-xs text-gray-500 mb-2">الأصوات العربية المتوفرة:</p>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {voices.length === 0 && (
              <div className="text-center py-6 px-2 bg-red-50 rounded-xl border border-red-100">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-red-600 mb-1">لا توجد أصوات عربية!</p>
                <p className="text-xs text-red-500 leading-relaxed">
                  جهازك لا يحتوي على حزمة اللغة العربية. يرجى الذهاب لإعدادات جهازك وتثبيت "اللغة العربية" ليتمكن التطبيق من القراءة بشكل صحيح.
                </p>
              </div>
            )}
            
            {voices.map((voice, idx) => (
              <button
                  key={idx}
                  onClick={() => { setSelectedVoice(voice); setShowVoiceSettings(false); }}
                  className={`w-full text-right p-3 rounded-xl text-sm font-medium flex justify-between items-center transition-colors 
                    ${selectedVoice?.name === voice.name 
                      ? `${t.primaryLight} ${t.accent} border border-indigo-200 ring-1 ring-indigo-200` 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                  `}
              >
                  <div className="flex flex-col items-start">
                    <span className="truncate max-w-[200px] font-bold">
                      {voice.name.replace('Google', '').replace('Microsoft', '').replace('Arabic', '').replace('Direct', '')}
                    </span>
                    <span className="text-[10px] opacity-60 flex items-center gap-1">
                      {voice.name.includes('Google') ? 'Google' : voice.name.includes('Microsoft') ? 'Microsoft' : 'System'} 
                      • {voice.lang}
                    </span>
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full flex gap-1 items-center shadow-sm">
                    <Globe size={10}/> عربي
                  </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );

  if (view === 'library') {
    return (
      <div className="p-6 h-full flex flex-col pb-24 overflow-y-auto">
        <header className="mb-6">
          <h2 className={`text-2xl font-bold mb-1 ${t.text}`}>المكتبة 📚</h2>
          <p className={`opacity-60 text-sm ${t.text}`}>استمتع بأكثر من 20 قصة متنوعة</p>
        </header>

        <div className={`flex items-center gap-2 ${t.card} p-3 rounded-xl mb-6 shadow-sm border border-gray-100`}>
          <Search size={20} className="text-gray-400" />
          <input type="text" placeholder="ابحث عن قصة..." className="bg-transparent text-sm w-full outline-none text-gray-700" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {STORY_LIBRARY.map((story) => (
            <div 
              key={story.id}
              onClick={() => handlePlayStory(story)}
              className={`${t.card} p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-all cursor-pointer group`}
            >
              <div className={`aspect-square rounded-xl ${t.primaryLight} flex items-center justify-center relative overflow-hidden`}>
                <BookOpen size={32} className={`${t.accent} group-hover:scale-110 transition-transform`} />
                {story.id < 6 && <div className="absolute top-2 right-2"><Star size={12} className="fill-yellow-400 text-yellow-400"/></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
              <div>
                <span className={`text-[10px] px-2 py-1 rounded-full mb-1 inline-block ${GENRES[story.genre]?.color || 'bg-gray-100 text-gray-500'}`}>
                  {GENRES[story.genre]?.label || 'قصة'}
                </span>
                <h3 className={`font-bold text-sm leading-tight ${t.text}`}>{story.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentScene = activeStory?.scenes[currentSceneIndex];
  return (
    <div className={`h-full flex flex-col ${t.bg} pb-24 relative`}>
      {showVoiceSettings && <VoiceSettingsModal />}
      
      <div className={`h-1/2 rounded-b-[40px] relative overflow-hidden flex flex-col justify-between shadow-xl p-6 transition-colors duration-500 ${t.primary}`}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        
        <div className="relative z-10 flex justify-between items-center text-white">
          <button onClick={() => { stop(); setView('library'); }} className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"><ArrowLeft size={20} /></button>
          
          <button 
            onClick={() => setShowVoiceSettings(true)}
            className="flex items-center gap-2 bg-black/20 hover:bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium transition-colors border border-white/10"
          >
            <Mic2 size={12} />
            <span className="max-w-[80px] truncate">{selectedVoice ? selectedVoice.name.replace('Google', '').replace('Microsoft', '') : 'تحميل الأصوات...'}</span>
            <ChevronDown size={12} />
          </button>
        </div>

        <div className="relative z-10 text-center text-white mb-8">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-3 inline-block shadow-sm">
             {currentScene?.speaker}
          </span>
          <h2 className="text-2xl font-bold leading-tight drop-shadow-lg">{activeStory?.title}</h2>
        </div>
      </div>

      <div className="flex-1 p-8 flex items-center justify-center text-center">
        <p className={`text-xl md:text-2xl font-bold leading-relaxed transition-all duration-300 ${t.text} ${isSpeaking ? 'scale-105' : 'scale-100 opacity-80'}`}>
           "{currentScene?.text}"
        </p>
      </div>

      <div className="px-8 mb-6 flex justify-center gap-6 items-center">
         <button className={`p-4 rounded-full ${t.card} shadow-md text-gray-400 hover:text-indigo-500`} onClick={() => handleScenePlay(Math.max(0, currentSceneIndex - 1))}><Play size={20} className="rotate-180" fill="currentColor"/></button>
         <button onClick={togglePlay} className={`w-20 h-20 ${t.primary} rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 transition-transform active:scale-95 ring-4 ring-white/50`}>
           {isSpeaking ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
         </button>
         <button className={`p-4 rounded-full ${t.card} shadow-md text-gray-400 hover:text-indigo-500`} onClick={() => handleScenePlay(Math.min(activeStory.scenes.length - 1, currentSceneIndex + 1))}><Play size={20} fill="currentColor"/></button>
      </div>
    </div>
  );
};

// 3. Briefing Module
const BriefingModule = ({ theme }) => {
  const t = THEMES[theme];
  const { speak, stop, isSpeaking } = useTTS();
  const [completedTasks, setCompletedTasks] = useState([2]);

  useEffect(() => () => stop(), []);
  
  return (
    <div className={`p-6 space-y-6 pb-24 h-full overflow-y-auto ${t.font}`}>
      <header><h2 className={`text-3xl font-bold mb-1 ${t.text}`}>إحاطتك اليومية</h2><p className={`opacity-60 ${t.text}`}>الثلاثاء، 27 ديسمبر</p></header>
      <div className={`${t.card} p-6 rounded-3xl shadow-sm flex items-center justify-between border border-gray-100`}>
        <div><span className={`text-5xl font-bold ${t.text}`}>25°</span><p className={`mt-1 opacity-70 ${t.text}`}>غائم جزئياً</p></div>
        <Cloud size={64} className={`${t.accent} opacity-80`} />
      </div>
      <button onClick={isSpeaking ? stop : () => speak("صباح الخير. لديك 3 مهام والجو جميل.")} className={`w-full py-6 rounded-2xl ${isSpeaking ? 'bg-red-500' : t.primary} text-white shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95`}>
        {isSpeaking ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
        <span className="font-bold text-lg">{isSpeaking ? "إيقاف" : "ملخص يومك"}</span>
      </button>
      <div>
        <h3 className={`font-bold mb-4 ${t.text} flex items-center gap-2`}><Calendar size={18} /><span>مهامك:</span></h3>
        <div className="space-y-3">
          {MOCK_TASKS.map(task => (
            <div key={task.id} onClick={() => setCompletedTasks(p => p.includes(task.id) ? p.filter(id => id !== task.id) : [...p, task.id])} className={`${t.card} p-4 rounded-xl flex items-center gap-4 transition-all cursor-pointer border ${completedTasks.includes(task.id) ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${completedTasks.includes(task.id) ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>{completedTasks.includes(task.id) && <CheckCircle size={14} className="text-white" />}</div>
              <div className="flex-1"><p className={`font-medium ${completedTasks.includes(task.id) ? 'line-through opacity-50' : ''} ${t.text}`}>{task.text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. Assistant Module
const AssistantModule = ({ theme }) => {
  const t = THEMES[theme];
  const [messages, setMessages] = useState([{ id: 1, sender: 'bot', text: 'أهلاً بك! أنا مساعدك الذكي.' }]);
  const [input, setInput] = useState('');
  
  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { id: Date.now(), sender: 'user', text: input }]);
    setInput('');
    setTimeout(() => setMessages(p => [...p, { id: Date.now()+1, sender: 'bot', text: "هذا رائع! سأساعدك في ذلك." }]), 1000);
  };

  return (
    <div className={`h-full flex flex-col ${t.bg} pb-20`}>
      <div className={`${t.card} p-4 shadow-sm flex items-center gap-3 z-10 border-b border-gray-100`}>
        <div className={`w-10 h-10 ${t.primaryLight} rounded-full flex items-center justify-center`}><Sparkles size={20} className={t.accent} /></div>
        <h3 className={`font-bold ${t.text}`}>مساعد راوي</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? `${t.primary} text-white rounded-br-none` : `${t.card} ${t.text} rounded-bl-none border border-gray-100`}`}>{msg.text}</div>
          </div>
        ))}
      </div>
      <div className={`p-4 ${t.card} border-t border-gray-100 flex gap-2`}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="اكتب..." className={`flex-1 ${t.bg} border-none rounded-full px-4 py-3 outline-none text-sm ${t.text}`} onKeyPress={(e) => e.key === 'Enter' && handleSend()}/>
        <button onClick={handleSend} className={`p-3 ${t.primary} text-white rounded-full hover:opacity-90`}><Send size={20} /></button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [themeId, setThemeId] = useState('default');
  const [generatedStory, setGeneratedStory] = useState(null);
  const t = THEMES[themeId];

  // Callback to handle story generation using the New Engine
  const handleGenerateStory = (prompt) => {
    // Call the advanced logic engine
    const newStory = generateStoryLogic(prompt);
    
    // Add to library
    STORY_LIBRARY.unshift(newStory); 
    setGeneratedStory(newStory);
    setActiveTab('stories');
  };

  return (
    <div dir="rtl" className={`w-full h-screen ${t.bg} font-sans flex items-center justify-center`}>
      <div className={`w-full max-w-md h-full md:h-[95vh] md:rounded-[3rem] ${t.card} shadow-2xl overflow-hidden relative border-8 border-gray-900 md:border-gray-200`}>
        <div className={`${t.card} p-4 pb-2 border-b border-gray-100 flex flex-col z-20 relative`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs font-bold ${t.text}`}>9:41</span>
            <Settings size={16} className={`opacity-50 ${t.text}`} />
          </div>
          <ThemeSelector currentTheme={themeId} setTheme={setThemeId} />
        </div>

        <div className="h-[calc(100%-8rem)] overflow-hidden bg-transparent">
          {activeTab === 'home' && <HomeDashboard theme={themeId} setActiveTab={setActiveTab} onGenerateStory={handleGenerateStory} />}
          {activeTab === 'stories' && <StoriesModule theme={themeId} initialStory={generatedStory} />}
          {activeTab === 'assistant' && <AssistantModule theme={themeId} />}
          {activeTab === 'briefing' && <BriefingModule theme={themeId} />}
        </div>
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} theme={themeId} />
      </div>
    </div>
  );
}
