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
            className={`w-32 h-32 mx-auto shadow-lg transition-all duration-300 ${
              currentAnimation === 'speaking' ? 'scale-105' : ''
            }`}
          >
            {/* Enhanced SVG Avatar System */}
            <svg 
              className="w-full h-full" 
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Gradient Definitions */}
              <defs>
                <radialGradient id="fatih_sultan_mehmetGradientSmall" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FF8C00" />
                </radialGradient>
                <radialGradient id="ataturkGradientSmall" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#DC143C" />
                  <stop offset="100%" stopColor="#8B0000" />
                </radialGradient>
                <radialGradient id="napoleonGradientSmall" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#4169E1" />
                  <stop offset="100%" stopColor="#000080" />
                </radialGradient>
                
                {/* Shadow effects */}
                <filter id="shadowSmall" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.3)"/>
                </filter>
              </defs>
              
              {/* Background Circle with glow */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill={`url(#${figure.id}GradientSmall)`}
                className={`transition-all duration-300 ${currentAnimation === 'speaking' ? 'animate-pulse' : ''}`}
                filter="url(#shadowSmall)"
              />
              
              {/* Animated background particles */}
              {currentAnimation === 'speaking' && (
                <>
                  <circle cx="25" cy="25" r="1" fill="white" opacity="0.8" className="animate-ping" />
                  <circle cx="75" cy="25" r="1" fill="white" opacity="0.8" className="animate-ping" style={{animationDelay: '0.5s'}} />
                  <circle cx="25" cy="75" r="1" fill="white" opacity="0.8" className="animate-ping" style={{animationDelay: '1s'}} />
                  <circle cx="75" cy="75" r="1" fill="white" opacity="0.8" className="animate-ping" style={{animationDelay: '1.5s'}} />
                </>
              )}
              
              {/* Face with dynamic expressions */}
              <ellipse 
                cx="50" 
                cy="60" 
                rx="25" 
                ry="30" 
                fill="#F4A460" 
                filter="url(#shadowSmall)"
                className={`transition-all duration-300 ${currentAnimation === 'speaking' ? 'scale-105' : ''}`}
              />
              
              {/* Dynamic Eyes with blinking */}
              <g className={currentAnimation === 'speaking' ? 'animate-pulse' : ''}>
                {/* Left Eye */}
                <circle cx="40" cy="50" r="4" fill="black" />
                <circle cx="41" cy="49" r="1.5" fill="white" className="animate-pulse" />
                <circle cx="40.5" cy="48.5" r="0.5" fill="white" opacity="0.8" />
                
                {/* Right Eye */}
                <circle cx="60" cy="50" r="4" fill="black" />
                <circle cx="61" cy="49" r="1.5" fill="white" className="animate-pulse" />
                <circle cx="60.5" cy="48.5" r="0.5" fill="white" opacity="0.8" />
              </g>
              
              {/* Animated Eyebrows */}
              <g className={currentAnimation === 'speaking' ? 'animate-pulse' : ''}>
                <path d="M 35 42 Q 40 40 45 42" stroke="black" strokeWidth="2" fill="none" filter="url(#shadowSmall)" />
                <path d="M 55 42 Q 60 40 65 42" stroke="black" strokeWidth="2" fill="none" filter="url(#shadowSmall)" />
              </g>
              
              {/* Nose with subtle animation */}
              <ellipse 
                cx="50" 
                cy="57" 
                rx="2" 
                ry="4" 
                fill="#DEB887" 
                className={currentAnimation === 'speaking' ? 'animate-pulse' : ''}
              />
              
              {/* Dynamic Mouth with multiple expressions */}
              {currentAnimation === 'speaking' ? (
                <g className="animate-pulse">
                  {/* Open mouth */}
                  <ellipse cx="50" cy="70" rx="7" ry="4" fill="black" />
                  {/* Teeth */}
                  <ellipse cx="50" cy="70" rx="6" ry="3" fill="white" />
                  {/* Tongue */}
                  <ellipse cx="50" cy="71.5" rx="4" ry="2" fill="#FF69B4" />
                  {/* Mouth corners */}
                  <circle cx="43" cy="70" r="1" fill="black" />
                  <circle cx="57" cy="70" r="1" fill="black" />
                </g>
              ) : currentAnimation === 'listening' ? (
                <g>
                  {/* Listening expression - slightly open */}
                  <ellipse cx="50" cy="70" rx="6" ry="2" fill="black" />
                  <path d="M 44 70 Q 50 72 56 70" stroke="black" strokeWidth="1" fill="none" />
                </g>
              ) : (
                <g>
                  {/* Normal smile */}
                  <path d="M 42 70 Q 50 75 58 70" stroke="black" strokeWidth="2" fill="none" filter="url(#shadowSmall)" />
                  {/* Smile lines */}
                  <path d="M 37 65 Q 40 67 43 65" stroke="black" strokeWidth="0.5" fill="none" opacity="0.5" />
                  <path d="M 57 65 Q 60 67 63 65" stroke="black" strokeWidth="0.5" fill="none" opacity="0.5" />
                </g>
              )}
              
              {/* Enhanced Character-specific accessories */}
              {figure.id === 'fatih_sultan_mehmet' && (
                <g className={currentAnimation === 'speaking' ? 'animate-bounce' : ''}>
                  {/* Crown with jewels */}
                  <polygon points="35,30 50,20 65,30 62,25 50,17 38,25" fill="#FFD700" stroke="#FF8C00" strokeWidth="1" filter="url(#shadowSmall)" />
                  <circle cx="50" cy="17" r="1.5" fill="#FF8C00" className="animate-pulse" />
                  <circle cx="42" cy="22" r="1" fill="#FF8C00" className="animate-pulse" style={{animationDelay: '0.3s'}} />
                  <circle cx="58" cy="22" r="1" fill="#FF8C00" className="animate-pulse" style={{animationDelay: '0.6s'}} />
                </g>
              )}
              
              {figure.id === 'ataturk' && (
                <g className={currentAnimation === 'speaking' ? 'animate-pulse' : ''}>
                  {/* Hat with details */}
                  <ellipse cx="50" cy="35" rx="25" ry="8" fill="#000080" filter="url(#shadowSmall)" />
                  <rect x="40" y="35" width="20" height="10" fill="#000080" />
                  {/* Hat band */}
                  <rect x="42" y="37" width="16" height="1.5" fill="#FFD700" />
                  {/* Hat badge */}
                  <circle cx="50" cy="38" r="1" fill="#FFD700" className="animate-pulse" />
                </g>
              )}
              
              {figure.id === 'napoleon' && (
                <g className={currentAnimation === 'speaking' ? 'animate-pulse' : ''}>
                  {/* Military hat with details */}
                  <ellipse cx="50" cy="32" rx="22" ry="6" fill="#000000" filter="url(#shadowSmall)" />
                  <rect x="42" y="32" width="16" height="8" fill="#000000" />
                  {/* Hat decoration */}
                  <rect x="47" y="30" width="6" height="2" fill="#FFD700" />
                  {/* Military insignia */}
                  <polygon points="50,29 51,30 50,31 49,30" fill="#FFD700" className="animate-pulse" />
                  {/* Hat plume */}
                  <path d="M 50 25 Q 52 23 50 21 Q 48 23 50 25" fill="#FFD700" opacity="0.7" className="animate-pulse" />
                </g>
              )}
              
              {/* Facial hair for character distinction */}
              {figure.id === 'fatih_sultan_mehmet' && (
                <g className={currentAnimation === 'speaking' ? 'animate-pulse' : ''}>
                  {/* Mustache */}
                  <path d="M 45 62 Q 50 64 55 62" stroke="black" strokeWidth="1" fill="none" />
                  {/* Beard */}
                  <path d="M 42 75 Q 50 78 58 75" stroke="black" strokeWidth="1.5" fill="none" />
                </g>
              )}
              
              {figure.id === 'ataturk' && (
                <g className={currentAnimation === 'speaking' ? 'animate-pulse' : ''}>
                  {/* Mustache */}
                  <path d="M 45 62 Q 50 64 55 62" stroke="black" strokeWidth="1" fill="none" />
                </g>
              )}
              
              {/* Dynamic facial expressions based on mood */}
              {currentAnimation === 'speaking' && (
                <g className="animate-pulse">
                  {/* Speaking lines */}
                  <path d="M 30 55 Q 32 57 34 55" stroke="black" strokeWidth="0.5" fill="none" opacity="0.3" />
                  <path d="M 66 55 Q 68 57 70 55" stroke="black" strokeWidth="0.5" fill="none" opacity="0.3" />
                </g>
              )}
            </svg>
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
