import React, { useState, useEffect } from 'react';
import { HistoricalFigure } from '../types/historical';

interface AnimatedAvatarProps {
  character: HistoricalFigure;
  isSpeaking: boolean;
  isListening: boolean;
  onStartChat: () => void;
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({
  character,
  isSpeaking,
  isListening,
  onStartChat
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<'entrance' | 'idle' | 'speaking' | 'listening'>('entrance');
  const [greetingMessage, setGreetingMessage] = useState('');

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
    
    setTimeout(() => {
      setGreetingMessage(greetings[character.id as keyof typeof greetings] || 'Merhaba! Benimle sohbet etmek ister misiniz?');
      setCurrentAnimation('idle');
    }, 2000);

    return () => {
      setIsVisible(false);
    };
  }, [character]);

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
          <div className={`${getAvatarSize()} mx-auto rounded-full bg-gradient-to-br ${character.color || 'from-gray-400 to-gray-600'} flex items-center justify-center text-8xl shadow-2xl transition-all duration-500 ${getAvatarAnimation()}`}>
            {character.avatar || '👤'}
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
