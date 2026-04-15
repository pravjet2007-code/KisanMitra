import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, X, Send, Volume2, VolumeX, Loader2, Bot, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { askKisanBot, Message } from '../utils/gemini';

// Language options with BCP-47 codes for Web Speech API
const LANGUAGES = [
  { code: 'hi-IN', label: 'हिंदी', name: 'Hindi' },
  { code: 'en-IN', label: 'English', name: 'English' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
  { code: 'mr-IN', label: 'मराठी', name: 'Marathi' },
  { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
  { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
  { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' },
  { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati' },
];

const WELCOME_MESSAGES: Record<string, string> = {
  'hi-IN': 'Namaste Kisan Bhai! 🙏 Main KisanBot hoon, aapka krishi sahayak. Aap mujhse fasal, keede, mitti, mandi bhav ya sarkari yojanaon ke baare mein pooch sakte hain.',
  'en-IN': 'Namaste Farmer! 🙏 I am KisanBot, your agriculture assistant. You can ask me about crops, pests, soil health, market prices, or government schemes.',
  'pa-IN': 'Sat Sri Akal Kisan Bhai! 🙏 Main KisanBot haan, teri kheti vich madad karn lai haazir haan.',
  'mr-IN': 'Namaskar Shetkari Bhai! 🙏 Mi KisanBot aahe, tumcha krishi sahayak. Pik, kide, mati, bajar bhav yavishayi vicharaa.',
  'ta-IN': 'Vanakkam Vivasayi! 🙏 Naan KisanBot, ungal vivasaya unavalar. Payir, pootchi, mann, selaviruvila pattri kelunga.',
  'te-IN': 'Namaskaramandi Rythu! 🙏 Nenu KisanBot, meeru pantalu, pandlu, nela, maarkettu garinchi naannu adugavachu.',
  'bn-IN': 'Namaskar Krishak Bhai! 🙏 Ami KisanBot, apnar krishi sahayak. Ful, keedapoka, mati, bajar dam bishaye jigyesh korun.',
  'gu-IN': 'Jai Jai Garavi Gujarat! 🙏 Hu KisanBot chhu, tamaro krishi sahayak. Piko, jivat, jamin, bajar bhav vise poochho.',
};

// Type shims for Web Speech API (not fully typed in TypeScript dom lib)
type SpeechRecognitionType = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
};
type SpeechRecognitionResultEvent = {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionType;
    webkitSpeechRecognition: new () => SpeechRecognitionType;
  }
}

export default function KisanBot() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [pulseAnim, setPulseAnim] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const langMap: Record<string, string> = {
    en: 'en-IN', hi: 'hi-IN', pa: 'pa-IN', mr: 'mr-IN',
    ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', gu: 'gu-IN'
  };
  const selectedLang = langMap[i18n.language?.split('-')[0]] || 'en-IN';

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationRef = useRef<Message[]>([]);

  // Sync messages ref with state for use in callbacks
  useEffect(() => {
    conversationRef.current = messages;
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, transcript]);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = WELCOME_MESSAGES[selectedLang] || WELCOME_MESSAGES['hi-IN'];
      setMessages([{ role: 'model', text: welcome }]);
      if (ttsEnabled) speak(welcome, selectedLang);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cancel speech when chat closes
  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  // Listen for external open trigger (e.g. FarmerDashboard mic button)
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('kisanbot:open', handler);
    return () => window.removeEventListener('kisanbot:open', handler);
  }, []);

  // TTS function
  const speak = useCallback((text: string, lang: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    // Clean text of emojis and special characters for better TTS
    const cleanText = text.replace(/[^\u0000-\u007F\u0900-\u097F\u0A00-\u0A7F\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\s]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText || text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a specific voice for the language
    const match = voices.find((v) => 
      v.lang === lang || 
      v.lang.replace('_', '-') === lang ||
      v.lang.startsWith(lang.split('-')[0])
    );
    
    if (match) {
      utterance.voice = match;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      setIsSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  }, [voices, ttsEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // Send a message to Gemini
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const trimmed = text.trim();

    const newUserMsg: Message = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setTranscript('');
    setIsLoading(true);
    setPulseAnim(false);

    try {
      const botReply = await askKisanBot(conversationRef.current, trimmed, selectedLang);
      const botMsg: Message = { role: 'model', text: botReply };
      setMessages((prev) => [...prev, botMsg]);
      if (ttsEnabled) speak(botReply, selectedLang);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.message === 'GEMINI_API_KEY_MISSING') {
        setApiKeyMissing(true);
      }
      const errMsg: Message = {
        role: 'model',
        text: error.message === 'GEMINI_API_KEY_MISSING'
          ? '⚠️ API key nahi mila. frontend/.env file mein VITE_GEMINI_API_KEY=your_actual_key likhein aur server restart karein.'
          : `❌ Error: ${error.message}\n\nAgr API key galat lag raha hai, to aistudio.google.com se naya key lein aur .env file mein paste karein.`,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, selectedLang, ttsEnabled, speak]);

  // Start / Stop STT
  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setPulseAnim(false);
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = selectedLang;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setPulseAnim(true);
      setTranscript('');
      window.speechSynthesis?.cancel(); // Stop TTS while user is speaking
    };

    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);
      if (final) {
        recognition.stop();
        sendMessage(final);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setPulseAnim(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setPulseAnim(false);
    };

    recognition.start();
  }, [isListening, selectedLang, sendMessage]);

  // When language changes via app settings, reset chat if open
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      window.speechSynthesis?.cancel();
      setTimeout(() => {
        const welcome = WELCOME_MESSAGES[selectedLang] || WELCOME_MESSAGES['en-IN'];
        setMessages([{ role: 'model', text: welcome }]);
        if (ttsEnabled) speak(welcome, selectedLang);
      }, 100);
    }
  }, [selectedLang]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentLang = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[1];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {!isOpen && (
          <div className="flex items-center gap-2 bg-white rounded-full shadow-lg px-3 py-2 border border-green-100 animate-bounce-slow">
            <span className="text-xs font-semibold text-green-700">KisanBot</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? 'bg-red-500 hover:bg-red-600 rotate-0'
              : 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500'
          }`}
          style={{ boxShadow: isOpen ? '' : '0 0 0 4px rgba(34,197,94,0.2), 0 8px 32px rgba(34,197,94,0.35)' }}
          title={isOpen ? 'Close KisanBot' : 'Open KisanBot — your farming assistant'}
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <>
              <Bot className="w-8 h-8 text-white" />
              {isSpeaking && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-blue-400 rounded-full border-2 border-white animate-ping" />
              )}
            </>
          )}
        </button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-[370px] max-w-[calc(100vw-24px)] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: '520px', animation: 'slideUp 0.25s ease-out' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">🌾 KisanBot</p>
              <p className="text-green-100 text-xs truncate">Aapka krishi sahayak — always here</p>
            </div>

            {/* Selected Language indicator */}
            <div className="bg-white/20 text-white text-[10px] font-medium px-2 py-1 rounded-md">
              {currentLang.label} / {currentLang.name}
            </div>

            {/* TTS Toggle */}
            <button
              onClick={() => {
                setTtsEnabled(!ttsEnabled);
                if (ttsEnabled) window.speechSynthesis?.cancel();
              }}
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title={ttsEnabled ? 'Mute voice' : 'Enable voice'}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-white" />}
            </button>
          </div>

          {/* API Key Warning */}
          {apiKeyMissing && (
            <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 text-xs text-amber-700">
              ⚠️ Create <code className="bg-amber-100 px-1 rounded">frontend/.env</code> with your{' '}
              <code className="bg-amber-100 px-1 rounded">VITE_GEMINI_API_KEY</code>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-7 h-7 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                    <Bot className="w-4 h-4 text-green-600" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed relative group ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                  {msg.role === 'model' && (
                    <button 
                      onClick={() => speak(msg.text, selectedLang)}
                      className="absolute -right-9 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white border border-gray-200 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-green-50"
                      title="Sunein"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 bg-green-600 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Live transcript while speaking */}
            {transcript && (
              <div className="flex justify-end gap-2">
                <div className="max-w-[78%] px-3 py-2.5 rounded-2xl rounded-tr-sm text-sm bg-green-100 text-green-800 border-2 border-dashed border-green-300 italic">
                  🎙️ {transcript}
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-green-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                  <span className="text-xs text-gray-500">Soch raha hoon...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Recording Bar */}
          {isListening && (
            <div className="mx-4 mb-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="flex gap-0.5 items-center h-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-red-500"
                    style={{
                      height: `${Math.random() * 16 + 8}px`,
                      animation: `waveBar 0.6s ease-in-out ${i * 0.1}s infinite alternate`,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-red-600 font-medium flex-1">Sun raha hoon...</span>
              <button onClick={toggleListening} className="text-xs text-red-500 font-medium hover:text-red-700">
                Rok dein
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div className="px-3 pb-3 pt-1">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(inputText)}
                placeholder={isListening ? 'Bol rahe hain... 🎙️' : 'Message likhein ya mic dabayein...'}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                disabled={isListening || isLoading}
              />

              {/* Send / Mic */}
              {inputText.trim() ? (
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={isLoading}
                  className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              ) : (
                <button
                  onClick={toggleListening}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600'
                      : pulseAnim
                      ? 'bg-green-600 animate-pulse'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 text-white" />
                  ) : (
                    <Mic className="w-4 h-4 text-white" />
                  )}
                </button>
              )}
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-1.5">
              Powered by Gemini AI • Chrome recommended for voice
            </p>
          </div>
        </div>
      )}

      {/* Inline styles for animations */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes waveBar {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
