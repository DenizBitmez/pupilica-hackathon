import React, { useState, useEffect } from 'react';
import { HistoricalFigure } from '../types/historical';

interface HackathonFeaturesProps {
  character: HistoricalFigure;
  isVisible: boolean;
  onClose?: () => void;
}

const HackathonFeatures: React.FC<HackathonFeaturesProps> = ({ character, isVisible, onClose }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const features = [
    {
      title: "🎭 AI-Powered Character Simulation",
      description: "Advanced NLP with personality modeling",
      icon: "🤖",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "🗣️ Real-time Voice Synthesis",
      description: "Web Speech API + Custom TTS Engine",
      icon: "🎤",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "🎨 3D Avatar Rendering",
      description: "CSS3 3D transforms + SVG animations",
      icon: "🎮",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "🌍 Interactive Historical Maps",
      description: "Leaflet.js with historical data layers",
      icon: "🗺️",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "📚 Educational Content System",
      description: "Structured learning with character stories",
      icon: "📖",
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "🎯 Gamification Elements",
      description: "Achievements, progress tracking, quizzes",
      icon: "🏆",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentFeature((prev) => (prev + 1) % features.length);
          setIsAnimating(false);
        }, 300);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible, features.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center z-50">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="max-w-6xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 animate-pulse">
            🚀 Hackathon Showcase
          </h1>
          <p className="text-2xl text-gray-300 mb-2">
            Revolutionary AI-Powered Historical Education Platform
          </p>
          <p className="text-lg text-gray-400">
            Meet {character.name} - Experience history like never before
          </p>
        </div>

        {/* Feature Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transition-all duration-500 ${
                currentFeature === index 
                  ? 'scale-110 shadow-2xl bg-white/20' 
                  : 'hover:scale-105 hover:bg-white/15'
              } ${isAnimating && currentFeature === index ? 'animate-bounce' : ''}`}
            >
              <div className="text-center">
                <div className={`text-6xl mb-4 ${currentFeature === index ? 'animate-spin' : ''}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {feature.description}
                </p>
                <div className={`mt-4 h-2 bg-gradient-to-r ${feature.color} rounded-full ${
                  currentFeature === index ? 'animate-pulse' : ''
                }`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            🛠️ Technology Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "React 18", icon: "⚛️", color: "from-blue-400 to-blue-600" },
              { name: "TypeScript", icon: "📘", color: "from-blue-500 to-blue-700" },
              { name: "Tailwind CSS", icon: "🎨", color: "from-cyan-400 to-blue-500" },
              { name: "Flask", icon: "🐍", color: "from-green-400 to-green-600" },
              { name: "Socket.io", icon: "🔌", color: "from-purple-400 to-purple-600" },
              { name: "Ollama AI", icon: "🤖", color: "from-orange-400 to-orange-600" },
              { name: "Web Speech API", icon: "🎤", color: "from-pink-400 to-pink-600" },
              { name: "Leaflet Maps", icon: "🗺️", color: "from-green-500 to-green-700" }
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className="text-white font-medium text-sm">{tech.name}</div>
                <div className={`mt-2 h-1 bg-gradient-to-r ${tech.color} rounded-full`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Innovation Points */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            💡 Innovation Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span className="text-white">Real-time AI conversation with historical accuracy</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span className="text-white">3D-style avatar animations with CSS transforms</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span className="text-white">Interactive historical maps with timeline events</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span className="text-white">Voice synthesis with character-specific tones</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span className="text-white">Gamified learning with achievements system</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span className="text-white">Responsive design for all devices</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-xl">
            🎮 Start Experience
          </button>
          <button className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20">
            📊 View Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default HackathonFeatures;
