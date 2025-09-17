import React, { useState, useEffect } from 'react';
import { HistoricalFigure } from '../types/historical';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: 'conversation' | 'learning' | 'exploration' | 'special';
}

interface AchievementSystemProps {
  character: HistoricalFigure;
  messageCount: number;
  isVisible: boolean;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({ character, messageCount, isVisible }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_conversation',
      title: 'İlk Sohbet',
      description: 'İlk kez bir tarihi figürle konuştun',
      icon: '🎯',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      category: 'conversation'
    },
    {
      id: 'chat_master',
      title: 'Sohbet Ustası',
      description: '10 mesaj gönder',
      icon: '💬',
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      category: 'conversation'
    },
    {
      id: 'history_scholar',
      title: 'Tarih Bilgini',
      description: '25 mesaj gönder',
      icon: '📚',
      unlocked: false,
      progress: 0,
      maxProgress: 25,
      category: 'learning'
    },
    {
      id: 'character_expert',
      title: 'Karakter Uzmanı',
      description: '50 mesaj gönder',
      icon: '👑',
      unlocked: false,
      progress: 0,
      maxProgress: 50,
      category: 'learning'
    },
    {
      id: 'map_explorer',
      title: 'Harita Kaşifi',
      description: 'Haritayı keşfet',
      icon: '🗺️',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      category: 'exploration'
    },
    {
      id: 'voice_master',
      title: 'Ses Ustası',
      description: 'Sesli komutları kullan',
      icon: '🎤',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      category: 'special'
    }
  ]);

  const [showNotification, setShowNotification] = useState<Achievement | null>(null);

  useEffect(() => {
    // Update achievements based on message count
    setAchievements(prev => prev.map(achievement => {
      let newProgress = achievement.progress;
      let newUnlocked = achievement.unlocked;

      switch (achievement.id) {
        case 'first_conversation':
          newProgress = messageCount >= 1 ? 1 : 0;
          newUnlocked = messageCount >= 1;
          break;
        case 'chat_master':
          newProgress = Math.min(messageCount, 10);
          newUnlocked = messageCount >= 10;
          break;
        case 'history_scholar':
          newProgress = Math.min(messageCount, 25);
          newUnlocked = messageCount >= 25;
          break;
        case 'character_expert':
          newProgress = Math.min(messageCount, 50);
          newUnlocked = messageCount >= 50;
          break;
      }

      // Show notification for newly unlocked achievements
      if (newUnlocked && !achievement.unlocked && isVisible) {
        setShowNotification({ ...achievement, unlocked: newUnlocked, progress: newProgress });
        setTimeout(() => setShowNotification(null), 5000);
      }

      return { ...achievement, progress: newProgress, unlocked: newUnlocked };
    }));
  }, [messageCount, isVisible]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'conversation': return 'from-blue-500 to-cyan-500';
      case 'learning': return 'from-green-500 to-emerald-500';
      case 'exploration': return 'from-orange-500 to-red-500';
      case 'special': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Achievement Notification */}
      {showNotification && (
        <div className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 shadow-2xl animate-bounce border-2 border-white">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{showNotification.icon}</div>
            <div>
              <div className="text-white font-bold text-lg">🏆 Başarı Açıldı!</div>
              <div className="text-white font-medium">{showNotification.title}</div>
              <div className="text-yellow-100 text-sm">{showNotification.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Panel */}
      <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-2xl border border-white/20 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800">🏆 Başarılar</h3>
          <div className="text-sm text-gray-600 font-medium">
            {unlockedCount}/{totalCount}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            %{Math.round((unlockedCount / totalCount) * 100)} tamamlandı
          </div>
        </div>

        {/* Achievement List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                achievement.unlocked 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium text-sm ${
                  achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                }`}>
                  {achievement.title}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {achievement.description}
                </div>
                {achievement.maxProgress > 1 && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-500 ${
                          achievement.unlocked 
                            ? `bg-gradient-to-r ${getCategoryColor(achievement.category)}` 
                            : 'bg-gray-400'
                        }`}
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {achievement.progress}/{achievement.maxProgress}
                    </div>
                  </div>
                )}
              </div>
              {achievement.unlocked && (
                <div className="text-green-500 text-lg">✓</div>
              )}
            </div>
          ))}
        </div>

        {/* Character-specific Achievement */}
        <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
          <div className="text-center">
            <div className="text-2xl mb-1">👑</div>
            <div className="text-sm font-medium text-amber-800">
              {character.name} Uzmanı
            </div>
            <div className="text-xs text-amber-600">
              Bu karakterle {messageCount} mesaj gönderdin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;
