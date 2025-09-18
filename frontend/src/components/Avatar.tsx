import React, { useState, useEffect, useRef } from 'react';
import { HistoricalFigure } from '../types/historical';
import { SpeakerWaveIcon, EyeIcon, CubeIcon } from '@heroicons/react/24/outline';
import ThreeDAvatar from './ThreeDAvatar';

interface AvatarProps {
  figure: HistoricalFigure;
  isConnected: boolean;
  isSpeaking?: boolean;
  isListening?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ figure, isConnected, isSpeaking: externalIsSpeaking = false, isListening }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<'idle' | 'speaking' | 'listening'>('idle');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Avatar animasyonları için basit state yönetimi
  useEffect(() => {
    const interval = setInterval(() => {
      if (externalIsSpeaking || isSpeaking) {
        setCurrentAnimation('speaking');
      } else if (isConnected) {
        setCurrentAnimation('idle');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [externalIsSpeaking, isSpeaking, isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try { 
        window.speechSynthesis.cancel(); 
      } catch {}
    };
  }, []);

  const getAvatarEmoji = () => {
    switch (figure.id) {
      case 'fatih_sultan_mehmet':
        return '👑';
      case 'ataturk':
        return '🎖️';
      case 'napoleon':
        return '⚔️';
      default:
        return '👤';
    }
  };

  const speakGreeting = () => {
    const greetings = {
      'fatih_sultan_mehmet': 'Selam! Ben Fatih Sultan Mehmet. Konstantinopolis\'i fetheden büyük fatih. Hayatımın önemli olaylarını dinlemek ister misiniz?',
      'ataturk': 'Merhaba! Ben Mustafa Kemal Atatürk. Modern Türkiye\'nin kurucusu. Tarihi başarılarımı öğrenmek ister misiniz?',
      'napoleon': 'Bonjour! Ben Napolyon Bonaparte. Avrupa\'nın fatihi. Askeri zaferlerimi ve stratejilerimi dinlemek ister misiniz?'
    } as Record<string, string>;

    const message = greetings[figure.id] || 'Merhaba! Benimle sohbet etmek ister misiniz?';
    
    console.log('Avatar konuşma başlatılıyor:', message);
    
    try {
      if ('speechSynthesis' in window) {
        // Önceki konuşmaları iptal et
        window.speechSynthesis.cancel();
        
        const utter = new SpeechSynthesisUtterance(message);
        utter.lang = 'tr-TR';
        
        // Ses ayarlarını uygula
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
        } catch (e) {
          console.log('TTS ayarları yüklenemedi:', e);
        }
        
        // Event handlers
        utter.onstart = () => {
          console.log('Avatar konuşma başladı');
          setIsSpeaking(true);
          setCurrentAnimation('speaking');
        };
        
        utter.onend = () => {
          console.log('Avatar konuşma bitti');
          setIsSpeaking(false);
          setCurrentAnimation('idle');
        };
        
        utter.onerror = (event) => {
          console.error('Avatar TTS hatası:', event.error);
          setIsSpeaking(false);
          setCurrentAnimation('idle');
        };
        
        utterRef.current = utter;
        window.speechSynthesis.speak(utter);
        
      } else {
        console.log('Web Speech API desteklenmiyor');
      }
    } catch (error) {
      console.error('Avatar konuşma hatası:', error);
    }
  };

  const getAvatarColor = () => {
    switch (figure.id) {
      case 'fatih_sultan_mehmet':
        return 'from-amber-400 to-orange-500';
      case 'ataturk':
        return 'from-red-400 to-red-600';
      case 'napoleon':
        return 'from-blue-400 to-blue-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="text-center">
      {/* View Mode Toggle */}
      <div className="mb-2 flex justify-center space-x-1">
        <button
          onClick={() => setViewMode('2d')}
          className={`px-2 py-1 text-xs rounded ${
            viewMode === '2d' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          2D
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={`px-2 py-1 text-xs rounded ${
            viewMode === '3d' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          3D
        </button>
      </div>

      {/* Avatar Container */}
      <div className="relative mb-4">
        {viewMode === '2d' ? (
          <div
            className={`w-32 h-32 mx-auto shadow-lg transition-all duration-300 ${
              currentAnimation === 'speaking' ? 'scale-105' : ''
            }`}
          >
            {/* Historical Character Portrait */}
            <div className="relative w-full h-full">
              {/* Historical Background */}
              <div className="absolute inset-0 overflow-hidden" style={{
                background: `linear-gradient(135deg, ${
                  figure.id === 'fatih_sultan_mehmet' ? 
                    '#8B4513 0%, #D2691E 30%, #CD853F 70%, #F4A460 100%' :
                  figure.id === 'ataturk' ? 
                    '#2F4F4F 0%, #4682B4 30%, #87CEEB 70%, #F0F8FF 100%' :
                    '#191970 0%, #4169E1 30%, #87CEEB 70%, #F0F8FF 100%'
                })`,
                borderRadius: '15px'
              }}>
                {/* Historical Elements */}
                <div className="absolute inset-0">
                  {/* Architectural Elements */}
                  {figure.id === 'fatih_sultan_mehmet' && (
                    <>
                      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-amber-800 to-amber-600 opacity-30"></div>
                      <div className="absolute bottom-2 left-4 w-1 h-4 bg-amber-700 opacity-50"></div>
                      <div className="absolute bottom-2 right-4 w-1 h-4 bg-amber-700 opacity-50"></div>
                    </>
                  )}
                  
                  {figure.id === 'ataturk' && (
                    <>
                      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-gray-700 to-gray-500 opacity-30"></div>
                      <div className="absolute bottom-2 left-4 w-1.5 h-4 bg-gray-600 opacity-50"></div>
                      <div className="absolute bottom-2 right-4 w-1.5 h-4 bg-gray-600 opacity-50"></div>
                    </>
                  )}
                  
                  {figure.id === 'napoleon' && (
                    <>
                      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-slate-700 to-slate-500 opacity-30"></div>
                      <div className="absolute bottom-2 left-4 w-1 h-4 bg-slate-600 opacity-50"></div>
                      <div className="absolute bottom-2 right-4 w-1 h-4 bg-slate-600 opacity-50"></div>
                    </>
                  )}
                </div>

                {/* Floating Historical Elements */}
                <div className="absolute inset-0">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute text-lg opacity-20 animate-float ${
                        figure.id === 'fatih_sultan_mehmet' ? 'text-yellow-600' :
                        figure.id === 'ataturk' ? 'text-blue-600' : 'text-blue-800'
                      }`}
                      style={{
                        left: `${20 + (i * 25)}%`,
                        top: `${30 + (i * 15)}%`,
                        animationDelay: `${i * 0.7}s`,
                        animationDuration: '2.5s'
                      }}
                    >
                      {figure.id === 'fatih_sultan_mehmet' ? '🏰' :
                       figure.id === 'ataturk' ? '🏛️' : '⚔️'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Character */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Head */}
                <div className={`relative w-20 h-24 transition-all duration-500 ${
                  currentAnimation === 'speaking' ? 'scale-105 animate-pulse' : 
                  currentAnimation === 'listening' ? 'scale-102 animate-pulse' : 'hover:scale-102'
                }`} style={{
                  background: `radial-gradient(ellipse at center, #F4A460 0%, #DEB887 50%, #CD853F 100%)`,
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  boxShadow: '0 0 25px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.1)',
                  transform: 'perspective(1000px) rotateX(5deg) rotateY(-2deg)'
                }}>
                  
                  {/* Eyes */}
                  <div className="absolute top-8 left-5 w-4 h-4 bg-black rounded-full">
                    <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-black rounded-full"></div>
                    {currentAnimation === 'speaking' && (
                      <div className="absolute -top-0.5 -left-0.5 w-5 h-5 border border-green-400 rounded-full animate-ping opacity-40"></div>
                    )}
                  </div>
                  <div className="absolute top-8 right-5 w-4 h-4 bg-black rounded-full">
                    <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-black rounded-full"></div>
                    {currentAnimation === 'speaking' && (
                      <div className="absolute -top-0.5 -left-0.5 w-5 h-5 border border-green-400 rounded-full animate-ping opacity-40"></div>
                    )}
                  </div>

                  {/* Eyebrows */}
                  <div className={`absolute top-6 left-4 w-5 h-0.5 bg-black rounded-full transition-all duration-300 ${
                    currentAnimation === 'speaking' ? 'animate-pulse' : ''
                  }`} style={{transform: 'rotate(-8deg)'}}></div>
                  <div className={`absolute top-6 right-4 w-5 h-0.5 bg-black rounded-full transition-all duration-300 ${
                    currentAnimation === 'speaking' ? 'animate-pulse' : ''
                  }`} style={{transform: 'rotate(8deg)'}}></div>

                  {/* Nose */}
                  <div className="absolute top-12 left-1/2 w-1 h-3 bg-gradient-to-b from-yellow-300 to-orange-300 rounded-full transform -translate-x-1/2 shadow-inner"></div>

                  {/* Mouth */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    {currentAnimation === 'speaking' ? (
                      <div className="relative">
                        <div className="w-5 h-2 bg-black rounded-full animate-pulse shadow-inner">
                          <div className="w-4 h-1 bg-white rounded-full mx-auto mt-0.5"></div>
                          <div className="w-3 h-0.5 bg-pink-400 rounded-full mx-auto mt-0.5"></div>
                        </div>
                        <div className="absolute -top-1 -left-1 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-ping"></div>
                        <div className="absolute -top-1 -right-1 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      </div>
                    ) : currentAnimation === 'listening' ? (
                      <div className="w-4 h-1 bg-black rounded-full animate-pulse"></div>
                    ) : (
                      <div className="w-5 h-0.5 bg-black rounded-full"></div>
                    )}
                  </div>

                  {/* Character Accessories */}
                  {figure.id === 'fatih_sultan_mehmet' && (
                    <>
                      {/* Crown */}
                      <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 ${
                        currentAnimation === 'speaking' ? 'animate-bounce' : ''
                      }`}>
                        <div className="w-10 h-5 bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-lg"
                             style={{
                               clipPath: 'polygon(20% 100%, 0% 0%, 100% 0%, 80% 100%)',
                               boxShadow: '0 5px 15px rgba(255,215,0,0.8)'
                             }}>
                          <div className="absolute top-0.5 left-1/2 w-1 h-1 bg-yellow-700 rounded-full transform -translate-x-1/2 animate-pulse"></div>
                        </div>
                      </div>
                      {/* Beard */}
                      <div className="absolute bottom-2 left-1/2 w-8 h-4 bg-black rounded-full transform -translate-x-1/2 opacity-80 shadow-lg"></div>
                      {/* Mustache */}
                      <div className="absolute bottom-10 left-1/2 w-6 h-1 bg-black rounded-full transform -translate-x-1/2 shadow-lg"></div>
                    </>
                  )}

                  {figure.id === 'ataturk' && (
                    <>
                      {/* Hat */}
                      <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 ${
                        currentAnimation === 'speaking' ? 'animate-pulse' : ''
                      }`}>
                        <div className="w-12 h-4 bg-gradient-to-b from-blue-800 to-blue-900 rounded-full shadow-lg">
                          <div className="absolute top-0.5 left-1/2 w-10 h-0.5 bg-yellow-400 rounded-full transform -translate-x-1/2"></div>
                        </div>
                      </div>
                      {/* Mustache */}
                      <div className="absolute bottom-10 left-1/2 w-6 h-1 bg-black rounded-full transform -translate-x-1/2 shadow-lg"></div>
                    </>
                  )}

                  {figure.id === 'napoleon' && (
                    <>
                      {/* Military Hat */}
                      <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 ${
                        currentAnimation === 'speaking' ? 'animate-pulse' : ''
                      }`}>
                        <div className="w-11 h-3 bg-gradient-to-b from-gray-800 to-black rounded-full shadow-lg">
                          <div className="absolute top-0.5 left-1/2 w-8 h-0.5 bg-yellow-400 rounded-full transform -translate-x-1/2"></div>
                        </div>
                      </div>
                      {/* Military Collar */}
                      <div className="absolute bottom-12 left-1/2 w-10 h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform -translate-x-1/2 shadow-lg"></div>
                    </>
                  )}
                </div>

                {/* Body */}
                <div className="absolute top-20 left-1/2 w-12 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform -translate-x-1/2 shadow-lg"></div>
              </div>

              {/* Historical Effects */}
              {currentAnimation === 'speaking' && (
                <>
                  {/* Sound Waves */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-24 border-2 border-green-400 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute w-20 h-20 border-2 border-blue-400 rounded-full animate-ping opacity-15" style={{animationDelay: '0.5s'}}></div>
                  </div>
                  
                  {/* Historical Speaking Elements */}
                  <div className="absolute top-2 left-2 text-xl animate-bounce opacity-60">
                    {figure.id === 'fatih_sultan_mehmet' ? '👑' :
                     figure.id === 'ataturk' ? '🏛️' : '⚔️'}
                  </div>
                  <div className="absolute top-2 right-2 text-xl animate-bounce opacity-60" style={{animationDelay: '0.5s'}}>
                    {figure.id === 'fatih_sultan_mehmet' ? '🏰' :
                     figure.id === 'ataturk' ? '📜' : '🎖️'}
                  </div>
                  <div className="absolute bottom-2 left-2 text-xl animate-bounce opacity-60" style={{animationDelay: '1s'}}>
                    {figure.id === 'fatih_sultan_mehmet' ? '⚔️' :
                     figure.id === 'ataturk' ? '🌟' : '🏆'}
                  </div>
                  <div className="absolute bottom-2 right-2 text-xl animate-bounce opacity-60" style={{animationDelay: '1.5s'}}>
                    {figure.id === 'fatih_sultan_mehmet' ? '📜' :
                     figure.id === 'ataturk' ? '⚖️' : '🗺️'}
                  </div>
                </>
              )}

              {currentAnimation === 'listening' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-200/10 to-purple-200/10 animate-pulse" style={{borderRadius: '15px'}}></div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-bounce opacity-60"></div>
                  <div className="absolute top-4 right-4 text-lg animate-bounce opacity-60">👂</div>
                </>
              )}

              {/* Idle Historical Effects */}
              {currentAnimation === 'idle' && (
                <>
                  <div className="absolute top-1 left-1 text-lg animate-pulse opacity-40">
                    {figure.id === 'fatih_sultan_mehmet' ? '👑' :
                     figure.id === 'ataturk' ? '🏛️' : '⚔️'}
                  </div>
                  <div className="absolute top-1 right-1 text-lg animate-pulse opacity-40" style={{animationDelay: '1s'}}>
                    {figure.id === 'fatih_sultan_mehmet' ? '🏰' :
                     figure.id === 'ataturk' ? '📜' : '🎖️'}
                  </div>
                  <div className="absolute bottom-1 left-1 text-lg animate-pulse opacity-40" style={{animationDelay: '2s'}}>
                    {figure.id === 'fatih_sultan_mehmet' ? '⚔️' :
                     figure.id === 'ataturk' ? '🌟' : '🏆'}
                  </div>
                  <div className="absolute bottom-1 right-1 text-lg animate-pulse opacity-40" style={{animationDelay: '3s'}}>
                    {figure.id === 'fatih_sultan_mehmet' ? '📜' :
                     figure.id === 'ataturk' ? '⚖️' : '🗺️'}
                  </div>
                </>
              )}
            </div>
            {/* Enhanced speaking visualizer with facial expressions */}
            {currentAnimation === 'speaking' && (
              <>
                
                {/* Enhanced speaking bars - Fotoğrafın altında */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i}
                      className="w-2 bg-gradient-to-t from-amber-500 to-orange-500 rounded-sm shadow-lg animate-[bounce_0.6s_infinite] border border-white" 
                      style={{ 
                        height: `${10 + Math.random() * 8}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    ></span>
                  ))}
                </div>
                
                
                {/* Speaking indicator */}
                <div className="absolute bottom-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              </>
            )}
            
            {/* Listening state */}
            {isListening && (
              <>
                <div className="absolute inset-0 bg-blue-200/20 animate-pulse rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </>
            )}
          </div>
        ) : (
          <div className="w-32 h-32 mx-auto">
            <ThreeDAvatar 
              character={figure}
              isSpeaking={currentAnimation === 'speaking'}
              isListening={isListening}
            />
          </div>
        )}
        
        {/* Status Indicator */}
        <div className="absolute -bottom-2 -right-2">
          <div
            className={`w-6 h-6 rounded-full border-2 border-white ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></div>
        </div>
      </div>

      {/* Figure Info */}
      <div className="space-y-2">
        <h4 className="font-historical font-semibold text-gray-800">
          {figure.name}
        </h4>
        <p className="text-sm text-gray-600">{figure.era}</p>
        <p className="text-xs text-gray-500">{figure.location}</p>
      </div>

      {/* Personality Preview */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-700 italic">
          "{figure.personality.substring(0, 100)}..."
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={speakGreeting}
          className={`p-2 rounded-full transition-colors ${
            isSpeaking
              ? 'bg-amber-500 text-white animate-pulse'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Konuşma simülasyonu"
        >
          <SpeakerWaveIcon className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
          className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
          title="3D/2D Görünüm"
        >
          <CubeIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Connection Status */}
      <div className="mt-3 text-xs text-gray-500">
        {isConnected ? (
          <span className="text-green-600">✓ Bağlı</span>
        ) : (
          <span className="text-red-600">✗ Bağlantı yok</span>
        )}
      </div>
    </div>
  );
};

export default Avatar;
