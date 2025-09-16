import React, { useState, useEffect } from 'react';
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
            className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center overflow-hidden shadow-lg transition-all duration-300 ${
              currentAnimation === 'speaking' ? 'scale-105' : ''
            }`}
          >
            {figure.image ? (
              <img
                src={figure.image}
                alt={figure.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl">{getAvatarEmoji()}</span>
            )}
            {/* Speaking visualizer */}
            {currentAnimation === 'speaking' && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
                <span className="w-1.5 bg-white/80 rounded-sm animate-[bounce_0.6s_infinite]" style={{ height: '10px' }}></span>
                <span className="w-1.5 bg-white/80 rounded-sm animate-[bounce_0.6s_infinite_0.2s]" style={{ height: '14px' }}></span>
                <span className="w-1.5 bg-white/80 rounded-sm animate-[bounce_0.6s_infinite_0.4s]" style={{ height: '18px' }}></span>
              </div>
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
          onClick={() => setIsSpeaking(!isSpeaking)}
          className={`p-2 rounded-full transition-colors ${
            isSpeaking
              ? 'bg-amber-500 text-white'
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
