import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Mic, Send, Play, Pause, Settings, Home, Sparkles, 
  Coffee, User, Sun, Moon, Palette, CheckCircle, Calendar, 
  Cloud, Volume2, Award, Heart, Layout
} from 'lucide-react';

// --- Configuration & Constants ---

const THEMES = {
  default: {
    id: 'default',
    name: 'راوي (الافتراضي)',
    bg: 'bg-gray-50',
    primary: 'bg-indigo-600',
    primaryLight: 'bg-indigo-50',
    text: 'text-gray-900',
    accent: 'text-indigo-600',
    card: 'bg-white',
    font: 'font-sans'
  },
  dark: {
    id: 'dark',
    name: 'الوضع الليلي',
    bg: 'bg-slate-900',
    primary: 'bg-blue-600',
    primaryLight: 'bg-slate-800',
    text: 'text-white',
    accent: 'text-blue-400',
    card: 'bg-slate-800',
    font: 'font-sans'
  },
  coffee: {
    id: 'coffee',
    name: 'مزاج القهوة',
    bg: 'bg-[#F5E6D3]', // Warm beige
    primary: 'bg-[#6F4E37]', // Coffee bean
    primaryLight: 'bg-[#E6CCB2]',
    text: 'text-[#3E2723]',
    accent: 'text-[#6F4E37]',
    card: 'bg-[#FFF8F0]',
    font: 'font-serif' // Elegant feel
  },
  kids: {
    id: 'kids',
    name: 'عالم الأطفال',
    bg: 'bg-yellow-50',
    primary: 'bg-pink-500',
    primaryLight: 'bg-yellow-200',
    text: 'text-purple-900',
    accent: 'text-pink-500',
    card: 'bg-white border-2 border-dashed border-pink-300',
    font: 'font-sans rounded-3xl' // Playful
  }
};

const MOCK_STORY = {
  title: "عمر وبوابة المدرسة",
  scenes: [
    { speaker: "الراوي", text: "في صباح يوم مشمس، وقف عمر أمام بوابة المدرسة الكبيرة." },
    { speaker: "عمر", text: "يا إلهي! إنها تبدو ضخمة جداً، هل سأضيع في الداخل؟", emotion: "nervous" },
    { speaker: "المعلمة", text: "أهلاً بك يا عمر! لا تقلق، فالمدرسة مكان للأصدقاء والمرح.", emotion: "warm" },
    { speaker: "الراوي", text: "ابتسم عمر وشعر بالاطمئنان، وأمسك بيد المعلمة ودخل." }
  ]
};

const MOCK_TASKS = [
  { id: 1, text: "اجتماع فريق التصميم", time: "10:00 ص", done: false },
  { id: 2, text: "شراء قهوة", time: "02:00 م", done: true },
  { id: 3, text: "قراءة قصة قبل النوم", time: "09:00 م", done: false },
];

// --- Custom Hooks ---

// Hook to handle Text-to-Speech
const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  const speak = (text, onEnd) => {
    if (synth.speaking) {
      synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA'; // Set to Arabic
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onstart = () => setIsSpeaking(true);
    synth.speak(utterance);
  };

  const stop = () => {
    synth.cancel();
    setIsSpeaking(false);
  };

  return { speak, stop, isSpeaking };
};

// --- Components ---

// 1. Theme Switcher Component
const ThemeSelector = ({ currentTheme, setTheme }) => (
  <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
    {Object.values(THEMES).map((t) => (
      <button
        key={t.id}
        onClick={() => setTheme(t.id)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
          currentTheme === t.id 
            ? 'border-transparent shadow-md transform scale-105 ring-2 ring-offset-2 ring-indigo-300' 
            : 'border-gray-200 opacity-70'
        }`}
        style={{ 
          backgroundColor: t.id === 'default' ? '#fff' : t.id === 'dark' ? '#1e293b' : t.id === 'coffee' ? '#6F4E37' : '#FF69B4',
          color: t.id === 'default' ? '#000' : '#fff'
        }}
      >
        {t.name}
      </button>
    ))}
  </div>
);

// 2. Navigation
const BottomNav = ({ activeTab, setActiveTab, theme }) => (
  <div className={`fixed bottom-0 left-0 right-0 ${THEMES[theme].card} border-t border-gray-100 p-3 flex justify-around items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50 rounded-t-2xl`}>
    <NavButton icon={Home} label="الرئيسية" active={activeTab === 'home'} onClick={() => setActiveTab('home')} theme={theme} />
    <NavButton icon={BookOpen} label="القصص" active={activeTab === 'stories'} onClick={() => setActiveTab('stories')} theme={theme} />
    <NavButton icon={Sparkles} label="المساعد" active={activeTab === 'assistant'} onClick={() => setActiveTab('assistant')} theme={theme} />
    <NavButton icon={Coffee} label="إحاطة" active={activeTab === 'briefing'} onClick={() => setActiveTab('briefing')} theme={theme} />
  </div>
);

const NavButton = ({ icon: Icon, label, active, onClick, theme }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${active ? `${THEMES[theme].primaryLight} ${THEMES[theme].accent} -translate-y-2` : 'text-gray-400 hover:text-gray-500'}`}
  >
    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

// 3. Home Dashboard (New)
const HomeDashboard = ({ theme, setActiveTab }) => {
  const t = THEMES[theme];
  return (
    <div className="p-6 space-y-6 pb-24 overflow-y-auto h-full">
      {/* Greeting */}
      <header className="flex justify-between items-center">
        <div>
          <p className={`text-sm opacity-70 ${t.text}`}>مساء الخير،</p>
          <h1 className={`text-2xl font-bold ${t.text}`}>صديق راوي 👋</h1>
        </div>
        <div className={`w-12 h-12 ${t.primaryLight} rounded-full flex items-center justify-center`}>
          <User className={t.accent} size={24} />
        </div>
      </header>

      {/* Stats Card */}
      <div className={`${t.primary} text-white p-5 rounded-3xl shadow-lg flex justify-between items-center`}>
        <div>
          <p className="opacity-80 text-sm mb-1">نقاطك اليوم</p>
          <h2 className="text-3xl font-bold">1,250</h2>
        </div>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Award size={32} className="text-white" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setActiveTab('stories')} className={`${t.card} p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition-all`}>
          <div className={`p-3 rounded-full ${t.primaryLight} ${t.accent}`}><BookOpen size={20} /></div>
          <span className={`font-bold text-sm ${t.text}`}>أكمل القصة</span>
        </button>
        <button onClick={() => setActiveTab('briefing')} className={`${t.card} p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition-all`}>
          <div className={`p-3 rounded-full ${t.primaryLight} ${t.accent}`}><Calendar size={20} /></div>
          <span className={`font-bold text-sm ${t.text}`}>جدولي اليوم</span>
        </button>
      </div>

      {/* Daily Wisdom */}
      <div className={`${t.card} p-5 rounded-3xl shadow-sm border border-gray-100`}>
        <div className="flex items-center gap-2 mb-3">
          <Heart className={`w-5 h-5 ${t.accent}`} fill="currentColor" />
          <h3 className={`font-bold ${t.text}`}>كلمة اليوم</h3>
        </div>
        <p className={`text-lg leading-relaxed ${t.text} opacity-90`}>
          "القراءة هي تذكرة سفرك إلى عوالم لم تزرها من قبل."
        </p>
        <div className={`mt-4 h-1 w-20 ${t.primary} rounded-full opacity-20`}></div>
      </div>
    </div>
  );
};

// 4. Briefing Module (Fully Functional)
const BriefingModule = ({ theme }) => {
  const t = THEMES[theme];
  const { speak, stop, isSpeaking } = useTTS();
  const [completedTasks, setCompletedTasks] = useState([2]);

  const toggleTask = (id) => {
    if (completedTasks.includes(id)) setCompletedTasks(prev => prev.filter(tid => tid !== id));
    else setCompletedTasks(prev => [...prev, id]);
  };

  const startBriefing = () => {
    const text = `
      أهلاً بك. 
      درجة الحرارة اليوم خمسة وعشرون درجة، والجو غائم جزئياً.
      لديك ثلاثة مهام اليوم. أهمها اجتماع فريق التصميم في العاشرة صباحاً.
      لا تنسى شرب قهوتك. أتمنى لك يوماً سعيداً.
    `;
    speak(text);
  };

  useEffect(() => {
    return () => stop(); // Cleanup on unmount
  }, []);

  return (
    <div className={`p-6 space-y-6 pb-24 h-full overflow-y-auto ${t.font}`}>
      <header>
        <h2 className={`text-3xl font-bold mb-1 ${t.text}`}>إحاطتك اليومية</h2>
        <p className={`opacity-60 ${t.text}`}>الثلاثاء، 27 ديسمبر</p>
      </header>

      {/* Weather Widget */}
      <div className={`${t.card} p-6 rounded-3xl shadow-sm flex items-center justify-between border border-gray-100`}>
        <div>
          <span className={`text-5xl font-bold ${t.text}`}>25°</span>
          <p className={`mt-1 opacity-70 ${t.text}`}>غائم جزئياً</p>
        </div>
        <Cloud size={64} className={`${t.accent} opacity-80`} />
      </div>

      {/* Audio Briefing Button */}
      <button 
        onClick={isSpeaking ? stop : startBriefing}
        className={`w-full py-6 rounded-2xl ${isSpeaking ? 'bg-red-500' : t.primary} text-white shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95`}
      >
        {isSpeaking ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
        <span className="font-bold text-lg">{isSpeaking ? "إيقاف الإحاطة" : "استمع لملخص يومك"}</span>
      </button>

      {/* Tasks List */}
      <div>
        <h3 className={`font-bold mb-4 ${t.text} flex items-center gap-2`}>
          <Calendar size={18} />
          <span>مهامك:</span>
        </h3>
        <div className="space-y-3">
          {MOCK_TASKS.map(task => {
            const isDone = completedTasks.includes(task.id);
            return (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`${t.card} p-4 rounded-xl flex items-center gap-4 transition-all cursor-pointer border ${isDone ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isDone ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                  {isDone && <CheckCircle size={14} className="text-white" />}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isDone ? 'line-through opacity-50' : ''} ${t.text}`}>{task.text}</p>
                  <p className="text-xs opacity-50">{task.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 5. Stories Module (With Real Audio)
const StoriesModule = ({ theme }) => {
  const t = THEMES[theme];
  const [step, setStep] = useState('config');
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const { speak, stop, isSpeaking } = useTTS();

  const handlePlayScene = (index) => {
    if (index >= MOCK_STORY.scenes.length) {
      setStep('config'); // End of story
      return;
    }
    setCurrentSceneIndex(index);
    const scene = MOCK_STORY.scenes[index];
    // Speak the text
    speak(scene.text, () => {
      // Auto advance after short delay
      setTimeout(() => {
        handlePlayScene(index + 1);
      }, 1000);
    });
  };

  const togglePlay = () => {
    if (isSpeaking) {
      stop();
    } else {
      handlePlayScene(currentSceneIndex);
    }
  };

  // Cleanup audio when leaving component
  useEffect(() => {
    return () => stop();
  }, []);

  if (step === 'config') {
    return (
      <div className="p-6 h-full flex flex-col justify-center items-center text-center pb-24">
        <div className={`w-32 h-32 ${t.primaryLight} rounded-full flex items-center justify-center mb-6 animate-bounce-slow`}>
          <BookOpen size={64} className={t.accent} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${t.text}`}>حان وقت القصة!</h2>
        <p className={`mb-8 opacity-60 ${t.text}`}>اختر قصة للاستماع إليها بصوت الراوي</p>
        
        <button 
          onClick={() => { setStep('playing'); handlePlayScene(0); }}
          className={`w-full max-w-xs ${t.primary} text-white py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2`}
        >
          <Play fill="currentColor" size={20} />
          <span>ابدأ قصة "عمر والمدرسة"</span>
        </button>
      </div>
    );
  }

  const currentScene = MOCK_STORY.scenes[currentSceneIndex];

  return (
    <div className={`h-full flex flex-col ${t.bg} pb-24`}>
      {/* Visual Header */}
      <div className={`h-1/2 rounded-b-[40px] relative overflow-hidden flex items-end justify-center shadow-xl p-8 transition-colors duration-500 ${t.primary}`}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="relative z-10 text-center text-white mb-4">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-2 inline-block">
             {currentScene.speaker} {currentScene.emotion === 'nervous' ? '😰' : currentScene.emotion === 'warm' ? '😊' : '🎙️'}
          </span>
          <h2 className="text-2xl font-bold leading-tight drop-shadow-md">
            {MOCK_STORY.title}
          </h2>
        </div>
      </div>

      {/* Text Area */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <p className={`text-2xl md:text-3xl font-bold text-center leading-relaxed transition-all duration-300 ${t.text} ${isSpeaking ? 'scale-105' : 'scale-100 opacity-80'}`}>
           "{currentScene.text}"
        </p>
      </div>

      {/* Controls */}
      <div className="px-8 mb-6 flex justify-center gap-6">
         <button onClick={togglePlay} className={`w-16 h-16 ${t.primary} rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform active:scale-95`}>
           {isSpeaking ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
         </button>
      </div>
    </div>
  );
};

// 6. Assistant Module (Interactive)
const AssistantModule = ({ theme }) => {
  const t = THEMES[theme];
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'أهلاً بك! أنا مساعدك الذكي. يمكنك سؤالي عن أي شيء أو طلب كتابة قصة.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('قصة') || lower.includes('حكاية')) return "فكرة رائعة! ما رأيك في قصة عن الفضاء أم الغابة؟";
    if (lower.includes('حزين') || lower.includes('متضايق')) return "أنا هنا لأجلك. هل تود سماع موسيقى هادئة أو قصة لطيفة لتغيير مزاجك؟";
    if (lower.includes('مرحبا') || lower.includes('هلا')) return "أهلاً بك يا صديقي! كيف يمكنني مساعدتك اليوم؟";
    if (lower.includes('شكرا')) return "على الرحب والسعة! أنا دائماً في الخدمة.";
    return "سؤال مثير للاهتمام! سأبحث لك عن معلومات حول هذا الموضوع...";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateResponse(userMsg.text);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: responseText }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className={`h-full flex flex-col ${t.bg} pb-20`}>
      {/* Header */}
      <div className={`${t.card} p-4 shadow-sm flex items-center gap-3 z-10 border-b border-gray-100`}>
        <div className={`w-10 h-10 ${t.primaryLight} rounded-full flex items-center justify-center`}>
          <Sparkles size={20} className={t.accent} />
        </div>
        <div>
          <h3 className={`font-bold ${t.text}`}>مساعد راوي</h3>
          <span className="text-xs text-green-500 flex items-center gap-1">● متصل الآن</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user' 
                  ? `${t.primary} text-white rounded-br-none` 
                  : `${t.card} ${t.text} rounded-bl-none border border-gray-100`
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className={`${t.card} p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1`}>
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-4 ${t.card} border-t border-gray-100`}>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب شيئاً..."
            className={`flex-1 ${t.bg} border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${t.text}`}
          />
          <button onClick={handleSend} disabled={!input.trim()} className={`p-3 ${t.primary} text-white rounded-full hover:opacity-90 disabled:opacity-50 transition-all`}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 7. Main App Wrapper
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [themeId, setThemeId] = useState('default');
  const t = THEMES[themeId];

  return (
    <div dir="rtl" className={`w-full h-screen ${t.bg} font-sans flex items-center justify-center transition-colors duration-500`}>
      <div className={`w-full max-w-md h-full md:h-[95vh] md:rounded-[3rem] ${t.card} shadow-2xl overflow-hidden relative border-8 border-gray-900 md:border-gray-200`}>
        
        {/* Top Status Bar & Theme Switcher */}
        <div className={`${t.card} p-4 pb-2 border-b border-gray-100 flex flex-col z-20 relative`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs font-bold ${t.text}`}>9:41</span>
            <div className="flex gap-2">
               <Settings size={16} className={`opacity-50 ${t.text}`} />
            </div>
          </div>
          <ThemeSelector currentTheme={themeId} setTheme={setThemeId} />
        </div>

        {/* Dynamic Content */}
        <div className="h-[calc(100%-8rem)] overflow-hidden bg-transparent">
          {activeTab === 'home' && <HomeDashboard theme={themeId} setActiveTab={setActiveTab} />}
          {activeTab === 'stories' && <StoriesModule theme={themeId} />}
          {activeTab === 'assistant' && <AssistantModule theme={themeId} />}
          {activeTab === 'briefing' && <BriefingModule theme={themeId} />}
        </div>

        {/* Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} theme={themeId} />
      </div>
    </div>
  );
}
