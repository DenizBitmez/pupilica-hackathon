import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { HistoricalFigure, ChatMessage } from '../types/historical';
import { PaperAirplaneIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import AchievementSystem from './AchievementSystem';

interface ChatInterfaceProps {
  figure: HistoricalFigure;
  socket: Socket | null;
  isConnected: boolean;
  onListeningChange?: (v: boolean) => void;
  onMouthOpenChange?: (v: number | undefined) => void;
  onSpeakingChange?: (v: boolean) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  figure,
  socket,
  isConnected,
  onListeningChange,
  onMouthOpenChange,
  onSpeakingChange
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showExamplePrompts, setShowExamplePrompts] = useState(true);
  const [isAchievementCollapsed, setIsAchievementCollapsed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Karaktere göre örnek promptlar
  const getExamplePrompts = () => {
    const promptsMap: Record<string, string[]> = {
      'fatih_sultan_mehmet': [
        "İstanbul'un fethi hakkında detaylı bilgi ver. Kuşatma stratejilerimi, kullandığım teknolojileri ve bu fethin tarihsel önemini anlat.",
        "Şahi toplarının yapım sürecini, teknik özelliklerini ve kuşatmada nasıl kullandığımı detaylı anlat.",
        "Gemileri karadan yürütme operasyonunu nasıl planladım ve gerçekleştirdim? Bu stratejinin kuşatmaya etkisini anlat.",
        "İstanbul'u nasıl bir bilim ve sanat merkezi haline getirdim? Hangi bilim insanlarını korudum ve nasıl destekledim?",
        "Kanunname-i Âl-i Osman'ın içeriğini ve Osmanlı hukuk sistemine katkılarını detaylı anlat."
      ],
      'ataturk': [
        "Kurtuluş Savaşı'nı nasıl başlattım? Samsun'a çıkışımın önemi ve sonrasında yaptığım çalışmaları detaylı anlat.",
        "Sakarya Meydan Muharebesi'nin stratejisini, önemini ve sonuçlarını detaylı anlat.",
        "Cumhuriyet'in ilan sürecini, nedenlerini ve Türkiye'ye getirdiği değişiklikleri anlat.",
        "Harf devriminin nedenlerini, sürecini ve Türk eğitimine etkilerini detaylı anlat.",
        "Kadın hakları konusundaki reformlarımı ve bu hakların Türk toplumuna etkilerini anlat."
      ],
      'napoleon': [
        "Austerlitz Savaşı'nın stratejisini, taktiklerimi ve bu zaferin askeri tarihteki önemini detaylı anlat.",
        "Napoleon Kanunları'nın içeriğini, özelliklerini ve dünya hukuk sistemine etkilerini anlat.",
        "İtalya Seferi'ndeki stratejilerimi, zaferlerimi ve bu seferin kariyerime etkilerini anlat.",
        "Mısır Seferi'nin amaçlarını, bilimsel keşiflerini ve tarihsel önemini anlat.",
        "Waterloo Savaşı'nın nedenlerini, sürecini ve bu yenilginin sonuçlarını anlat."
      ]
    };
    
    return promptsMap[figure.id] || [
      "Bana hayatınız hakkında bilgi verir misiniz?",
      "En önemli başarınız nedir?",
      "Zamanınızda yaşam nasıldı?",
      "Bana bir hikaye anlatır mısınız?"
    ];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // localStorage'dan prompt'u al ve textbox'a yerleştir
  useEffect(() => {
    const chatPrompt = localStorage.getItem('chat_prompt');
    const chatTopic = localStorage.getItem('chat_topic');
    
    console.log('ChatInterface useEffect - chatPrompt:', chatPrompt);
    console.log('ChatInterface useEffect - chatTopic:', chatTopic);
    
    if (chatPrompt && chatTopic && messages.length === 0) {
      console.log('Prompt textbox\'a yerleştiriliyor:', chatTopic);
      console.log('Prompt içeriği:', chatPrompt);
      
      // Prompt'u textbox'a yerleştir
      setInputMessage(chatPrompt);
      
      // Prompt'u temizle
      localStorage.removeItem('chat_prompt');
      localStorage.removeItem('chat_topic');
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('ai_response', (data) => {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
          figureName: data.figure_name,
          audioUrl: data.audio
        };
        setMessages(prev => [...prev, newMessage]);
        setIsLoading(false);

        // Auto-play TTS if available and drive speaking state by playback
        if (data.audio) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
          audioRef.current = audio;
          setIsAvatarSpeaking(true);
          onSpeakingChange?.(true);
          audio.onended = () => setIsAvatarSpeaking(false);
          audio.onended = () => {
            setIsAvatarSpeaking(false);
            onSpeakingChange?.(false);
            onMouthOpenChange?.(undefined);
          };
          // Improved lip-sync with threshold-based mouth shapes
          try {
            const AudioContextCtor = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (AudioContextCtor) {
              const ctx = new AudioContextCtor();
              const source = ctx.createMediaElementSource(audio);
              const analyser = ctx.createAnalyser();
              analyser.fftSize = 512;
              analyser.smoothingTimeConstant = 0.8;
              const dataArray = new Uint8Array(analyser.frequencyBinCount);
              source.connect(analyser);
              analyser.connect(ctx.destination);
              
              // Threshold-based mouth shapes: 0=closed, 1=slightly open, 2=open, 3=wide open
              const getMouthShape = (amplitude: number) => {
                if (amplitude < 5) return 0;      // closed
                if (amplitude < 15) return 1;     // slightly open
                if (amplitude < 30) return 2;     // open
                return 3;                         // wide open
              };
              
              const tick = () => {
                if (!audio.paused) {
                  analyser.getByteTimeDomainData(dataArray);
                  // Calculate RMS amplitude
                  let sum = 0;
                  for (let i = 0; i < dataArray.length; i++) {
                    const sample = (dataArray[i] - 128) / 128;
                    sum += sample * sample;
                  }
                  const rms = Math.sqrt(sum / dataArray.length);
                  const amplitude = rms * 100; // Scale to 0-100
                  const mouthShape = getMouthShape(amplitude);
                  onMouthOpenChange?.(mouthShape);
                  requestAnimationFrame(tick);
                }
              };
              requestAnimationFrame(tick);
            }
          } catch {}
          audio.play().catch(() => {
            // Autoplay engellendiyse butonla çalma seçeneği kalır
            setIsAvatarSpeaking(false);
            onSpeakingChange?.(false);
            // Web Speech Synthesis fallback
            try {
              if ('speechSynthesis' in window) {
                const utter = new SpeechSynthesisUtterance(data.response);
                utter.lang = 'tr-TR';
                try {
                  const stored = localStorage.getItem('tts_settings');
                  if (stored) {
                    const s = JSON.parse(stored);
                    utter.rate = s.rate ?? 1;
                    utter.pitch = s.pitch ?? 1;
                    utter.volume = s.volume ?? 1;
                    if (s.voice) {
                      const vs = window.speechSynthesis.getVoices();
                      const found = vs.find(v => v.name === s.voice);
                      if (found) utter.voice = found;
                    }
                  }
                } catch {}
                utter.onstart = () => { setIsAvatarSpeaking(true); onSpeakingChange?.(true); };
                utter.onend = () => { setIsAvatarSpeaking(false); onSpeakingChange?.(false); onMouthOpenChange?.(undefined); };
                window.speechSynthesis.speak(utter);
              }
            } catch {}
          });
        } else {
          // Backend sesi yoksa Web Speech Synthesis ile oku
          try {
            if ('speechSynthesis' in window) {
              const utter = new SpeechSynthesisUtterance(data.response);
              utter.lang = 'tr-TR';
              try {
                const stored = localStorage.getItem('tts_settings');
                if (stored) {
                  const s = JSON.parse(stored);
                  utter.rate = s.rate ?? 1;
                  utter.pitch = s.pitch ?? 1;
                  utter.volume = s.volume ?? 1;
                  if (s.voice) {
                    const vs = window.speechSynthesis.getVoices();
                    const found = vs.find(v => v.name === s.voice);
                    if (found) utter.voice = found;
                  }
                }
              } catch {}
              utter.onstart = () => { setIsAvatarSpeaking(true); onSpeakingChange?.(true); };
              utter.onend = () => { setIsAvatarSpeaking(false); onSpeakingChange?.(false); onMouthOpenChange?.(undefined); };
              window.speechSynthesis.speak(utter);
            } else {
              // Ses yoksa kısa bir konuşma animasyonu gösterebiliriz
              setIsAvatarSpeaking(true);
              setTimeout(() => setIsAvatarSpeaking(false), 1200);
            }
          } catch {
            setIsAvatarSpeaking(true);
            setTimeout(() => setIsAvatarSpeaking(false), 1200);
          }
        }
      });

      socket.on('error', (data) => {
        console.error('Socket error:', data.message);
        setIsLoading(false);
      });
    }

    return () => {
      if (socket) {
        socket.off('ai_response');
        socket.off('error');
      }
    };
  }, [socket]);

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputMessage;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessageCount(prev => prev + 1);
    if (!messageText) setInputMessage(''); // Sadece manuel gönderimde input'u temizle
    setIsLoading(true);

    if (socket && isConnected) {
      socket.emit('chat_message', {
        figure_id: figure.id,
        message: messageToSend
      });
    } else {
      // Fallback: HTTP API kullan
      try {
        const response = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            figure_id: figure.id,
            message: messageToSend
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: data.response,
            isUser: false,
            timestamp: new Date(),
            figureName: data.figure_name,
            audioUrl: data.audio
          };
          setMessages(prev => [...prev, aiMessage]);
          
          // Avatar konuşma animasyonu
          setIsAvatarSpeaking(true);
          setTimeout(() => setIsAvatarSpeaking(false), 3000);
        }
      } catch (error) {
        console.error('Mesaj gönderilirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const useExamplePrompt = (prompt: string) => {
    setInputMessage(prompt);
    setShowExamplePrompts(false);
    // Input alanına odaklan
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 100);
  };

  const startListening = () => {
    try {
      // webkitSpeechRecognition (Chrome)
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setInputMessage('Tarayıcı mikrofonu desteklemiyor');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      onListeningChange?.(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript as string;
        setInputMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        onListeningChange?.(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        onListeningChange?.(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      onListeningChange?.(false);
      setInputMessage('Mikrofon başlatılamadı');
    }
  };

  const playAudio = (audioBase64: string) => {
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
    audioRef.current = audio;
    setIsAvatarSpeaking(true);
    onSpeakingChange?.(true);
    audio.onended = () => { setIsAvatarSpeaking(false); onSpeakingChange?.(false); onMouthOpenChange?.(undefined); };
    audio.play().catch(() => setIsAvatarSpeaking(false));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-historical font-semibold text-gray-800">
              {figure.name} ile Sohbet
            </h3>
            <div className="flex items-center mt-1">
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Bağlı' : 'Bağlantı yok'}
              </span>
            </div>
          </div>
          
          {/* Mini Avatar */}
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
              figure.id === 'fatih_sultan_mehmet' ? 'from-amber-400 to-orange-500' :
              figure.id === 'ataturk' ? 'from-red-400 to-red-600' :
              figure.id === 'napoleon' ? 'from-blue-400 to-blue-600' :
              'from-gray-400 to-gray-600'
            } flex items-center justify-center text-2xl shadow-md transition-all duration-300 ${
              isAvatarSpeaking ? 'animate-pulse scale-110' : ''
            }`}>
              {figure.id === 'fatih_sultan_mehmet' ? '👑' :
               figure.id === 'ataturk' ? '🎖️' :
               figure.id === 'napoleon' ? '⚔️' : '👤'}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-2">💬</div>
            <p>Merhaba! Ben {figure.name}. Sorularınızı sorabilirsiniz.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-end space-x-2`}
          >
            {!message.isUser && (
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                  figure.id === 'fatih_sultan_mehmet' ? 'from-amber-400 to-orange-500' :
                  figure.id === 'ataturk' ? 'from-red-400 to-red-600' :
                  figure.id === 'napoleon' ? 'from-blue-400 to-blue-600' :
                  'from-gray-400 to-gray-600'
                } flex items-center justify-center text-sm shadow-sm`}>
                  {figure.id === 'fatih_sultan_mehmet' ? '👑' :
                   figure.id === 'ataturk' ? '🎖️' :
                   figure.id === 'napoleon' ? '⚔️' : '👤'}
                </div>
              </div>
            )}
            
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {!message.isUser && message.audioUrl && (
                  <button
                    onClick={() => playAudio(message.audioUrl!)}
                    className="ml-2 p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    title="Sesi çal"
                  >
                    🔊
                  </button>
                )}
              </div>
              {!message.isUser && message.figureName && (
                <p className="text-xs mt-1 font-medium opacity-80">
                  - {message.figureName}
                </p>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start items-end space-x-2">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                figure.id === 'fatih_sultan_mehmet' ? 'from-amber-400 to-orange-500' :
                figure.id === 'ataturk' ? 'from-red-400 to-red-600' :
                figure.id === 'napoleon' ? 'from-blue-400 to-blue-600' :
                'from-gray-400 to-gray-600'
              } flex items-center justify-center text-sm shadow-sm animate-pulse`}>
                {figure.id === 'fatih_sultan_mehmet' ? '👑' :
                 figure.id === 'ataturk' ? '🎖️' :
                 figure.id === 'napoleon' ? '⚔️' : '👤'}
              </div>
            </div>
            
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-sm">Düşünüyor...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Örnek Promptlar */}
      {showExamplePrompts && messages.length === 0 && (
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              💡 Örnek Sorular
              <button
                onClick={() => setShowExamplePrompts(false)}
                className="ml-2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {getExamplePrompts().slice(0, 4).map((prompt, index) => (
              <button
                key={index}
                onClick={() => useExamplePrompt(prompt)}
                className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-sm text-gray-700 hover:text-gray-900"
              >
                <span className="block overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.4',
                  maxHeight: '2.8em'
                }}>{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`${figure.name} ile sohbet edin...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={startListening}
            disabled={isListening}
            className={`p-2 rounded-lg transition-colors ${
              isListening
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Sesli giriş"
          >
            <MicrophoneIcon className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Gönder"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>


      {/* Achievement System */}
      {!isAchievementCollapsed && (
        <div className="relative">
          <button
            onClick={() => setIsAchievementCollapsed(true)}
            className="absolute top-2 right-2 z-10 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Başarıları küçült"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <AchievementSystem 
            character={figure} 
            messageCount={messageCount} 
            isVisible={true} 
          />
        </div>
      )}
      
      {isAchievementCollapsed && (
        <div className="bg-white rounded-xl shadow-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-sm">🏆</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Başarılar ({messageCount} mesaj)</span>
            </div>
            <button
              onClick={() => setIsAchievementCollapsed(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              Genişlet
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChatInterface;
