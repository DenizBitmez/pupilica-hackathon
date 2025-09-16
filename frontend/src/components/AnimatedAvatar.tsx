import React, { useState, useEffect, useRef } from 'react';
import { HistoricalFigure } from '../types/historical';

interface AnimatedAvatarProps {
  character: HistoricalFigure;
  isSpeaking: boolean;
  isListening: boolean;
  mouthOpen?: number;
  onStartChat: () => void;
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({
  character,
  isSpeaking,
  isListening,
  onStartChat,
  mouthOpen
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<'entrance' | 'idle' | 'speaking' | 'listening'>('entrance');
  const [greetingMessage, setGreetingMessage] = useState('');
  const [introMouthOpen, setIntroMouthOpen] = useState<number | undefined>(undefined);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Giriş animasyonu
    setIsVisible(true);
    setCurrentAnimation('entrance');
    
    // Karaktere göre selamlama mesajı
    const greetings = {
      'fatih_sultan_mehmet': 'Selam! Ben Fatih Sultan Mehmet. Konstantinopolis\'i fetheden fatih. Sorularınızı bekliyorum!',
      'ataturk': 'Merhaba! Ben Mustafa Kemal Atatürk. Türkiye Cumhuriyeti\'nin kurucusu. Size nasıl yardımcı olabilirim?',
      'napoleon': 'Bonjour! Ben Napolyon Bonaparte. Fransız İmparatoru. Strateji ve savaş konularında uzmanım.'
    };
    
    // Mesajı hemen hazırla ve kısa süre sonra idle'a geç
    setGreetingMessage(greetings[character.id as keyof typeof greetings] || 'Merhaba! Benimle sohbet etmek ister misiniz?');
    setTimeout(() => setCurrentAnimation('idle'), 400);

    return () => {
      setIsVisible(false);
      // Her ihtimale karşı TTS iptal
      try { window.speechSynthesis.cancel(); } catch {}
    };
  }, [character]);

  // Greeting otomatik Web Speech TTS ve basit lip-sync
  useEffect(() => {
    if (!greetingMessage) return;
    try {
      if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(greetingMessage);
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
        utter.onstart = () => {
          setIntroMouthOpen(8);
          // Konuşma animasyonuna geç
          // Not: App üzerinden de gelebilir; burada local görsel geri bildirim sağlıyoruz
        };
        utter.onboundary = () => {
          // Kelime sınırlarında ağız açıklığını hafifçe değiştir
          const v = 6 + Math.floor(Math.random() * 10);
          setIntroMouthOpen(v);
        };
        utter.onend = () => {
          setIntroMouthOpen(undefined);
        };
        utterRef.current = utter;
        window.speechSynthesis.speak(utter);
      }
    } catch {}
  }, [greetingMessage]);

  useEffect(() => {
    if (isSpeaking) {
      setCurrentAnimation('speaking');
    } else if (isListening) {
      setCurrentAnimation('listening');
    } else {
      setCurrentAnimation('idle');
    }
  }, [isSpeaking, isListening]);

  const getAvatarSize = () => {
    switch (currentAnimation) {
      case 'entrance':
        return 'w-64 h-64';
      case 'speaking':
        return 'w-72 h-72';
      case 'listening':
        return 'w-68 h-68';
      default:
        return 'w-64 h-64';
    }
  };

  const getAvatarAnimation = () => {
    switch (currentAnimation) {
      case 'entrance':
        return 'animate-bounce';
      case 'speaking':
        return 'animate-pulse';
      case 'listening':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 transform transition-all duration-500 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      }`}>
        {/* Avatar Container */}
        <div className="text-center mb-8">
          <div className={`${getAvatarSize()} mx-auto rounded-full bg-gradient-to-br ${character.color || 'from-gray-400 to-gray-600'} flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-500 ${getAvatarAnimation()}`}>
            {character.image ? (
              <img src={character.image} alt={character.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-8xl">{character.avatar || '👤'}</span>
            )}
            {currentAnimation === 'speaking' && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
                <span className="w-2 bg-white/90 rounded-sm animate-[bounce_0.6s_infinite]" style={{ height: '12px' }}></span>
                <span className="w-2 bg-white/90 rounded-sm animate-[bounce_0.6s_infinite_0.2s]" style={{ height: '16px' }}></span>
                <span className="w-2 bg-white/90 rounded-sm animate-[bounce_0.6s_infinite_0.4s]" style={{ height: '20px' }}></span>
              </div>
            )}
          </div>
          
          {/* Sparkle Effects */}
          <div className="absolute top-8 left-8 text-yellow-300 text-3xl animate-spin">
            ✨
          </div>
          <div className="absolute top-8 right-8 text-blue-300 text-2xl animate-bounce">
            ⭐
          </div>
          <div className="absolute bottom-8 left-8 text-purple-300 text-2xl animate-pulse">
            💫
          </div>
          <div className="absolute bottom-8 right-8 text-green-300 text-3xl animate-spin">
            🌟
          </div>
        </div>

        {/* Simple SVG mouth overlay for lip-sync approximation */}
        {currentAnimation === 'speaking' && (
          <svg
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            width="140"
            height="140"
            viewBox="0 0 140 140"
          >
            {/* Improved mouth shapes based on audio amplitude */}
            {(() => {
              const currentMouth = mouthOpen !== undefined ? mouthOpen : (introMouthOpen !== undefined ? introMouthOpen : 1);
              const mouthShapes = [
                { ry: 2, rx: 12 },   // 0: closed
                { ry: 4, rx: 14 },   // 1: slightly open
                { ry: 8, rx: 16 },   // 2: open
                { ry: 12, rx: 18 }   // 3: wide open
              ];
              const shape = mouthShapes[Math.min(3, Math.max(0, currentMouth))] || mouthShapes[1];
              return (
                <ellipse 
                  cx="70" 
                  cy="92" 
                  rx={shape.rx} 
                  ry={shape.ry} 
                  fill="rgba(0,0,0,0.35)"
                  className="transition-all duration-100"
                />
              );
            })()}
          </svg>
        )}

        {/* Character Info */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-historical font-bold text-gray-800 mb-2">
            {character.name}
          </h2>
          <div className="space-y-1 mb-4">
            <p className="text-lg text-gray-600">{character.era}</p>
            <p className="text-sm text-gray-500">{character.location}</p>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${
              currentAnimation === 'speaking' ? 'bg-green-500 animate-pulse' :
              currentAnimation === 'listening' ? 'bg-blue-500 animate-bounce' :
              'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              {currentAnimation === 'speaking' ? 'Konuşuyor...' :
               currentAnimation === 'listening' ? 'Dinliyor...' :
               currentAnimation === 'entrance' ? 'Geliyor...' :
               'Hazır'}
            </span>
          </div>
        </div>

        {/* Greeting Message */}
        {greetingMessage && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-gray-700 text-center leading-relaxed">
              "{greetingMessage}"
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onStartChat}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            💬 Sohbet Etmeye Başla
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
          >
            🔄 Yeniden Seç
          </button>
        </div>

        {/* Personality Preview */}
        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Kişilik Özellikleri:</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {character.personality}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnimatedAvatar;
