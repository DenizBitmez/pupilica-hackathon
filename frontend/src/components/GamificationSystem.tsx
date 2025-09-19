import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrophyIcon,
  StarIcon,
  FireIcon,
  GiftIcon,
  SparklesIcon,
  RocketIcon,
  CrownIcon,
  MedalIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface GamificationSystemProps {
  character: any;
  isVisible: boolean;
  onClose: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'study' | 'quiz' | 'notes' | 'time' | 'streak' | 'special';
  requirement: number;
  current: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward: {
    xp: number;
    badge?: string;
    title?: string;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

interface UserStats {
  level: number;
  experience: number;
  nextLevelExp: number;
  totalXP: number;
  coins: number;
  gems: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  achievements: Achievement[];
  dailyQuests: Array<{
    id: string;
    title: string;
    description: string;
    reward: { xp: number; coins: number };
    completed: boolean;
    progress: number;
    maxProgress: number;
  }>;
  weeklyChallenges: Array<{
    id: string;
    title: string;
    description: string;
    reward: { xp: number; gems: number; badge?: string };
    completed: boolean;
    progress: number;
    maxProgress: number;
    deadline: string;
  }>;
}

const GamificationSystem: React.FC<GamificationSystemProps> = ({ 
  character, 
  isVisible, 
  onClose 
}) => {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    experience: 0,
    nextLevelExp: 100,
    totalXP: 0,
    coins: 0,
    gems: 0,
    currentStreak: 0,
    longestStreak: 0,
    badges: [],
    achievements: [],
    dailyQuests: [],
    weeklyChallenges: []
  });

  const [selectedTab, setSelectedTab] = useState<'achievements' | 'badges' | 'quests' | 'shop'>('achievements');

  useEffect(() => {
    // LocalStorage'dan kullanıcı istatistiklerini yükle
    const savedStats = localStorage.getItem(`gamification_${character.id}`);
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    } else {
      // Örnek veri oluştur
      const sampleStats: UserStats = {
        level: 5,
        experience: 340,
        nextLevelExp: 500,
        totalXP: 2340,
        coins: 1250,
        gems: 45,
        currentStreak: 7,
        longestStreak: 15,
        badges: [
          { id: 'first_note', name: 'İlk Not', description: 'İlk notunuzu oluşturdunuz', icon: '📝', unlocked: true, unlockedAt: '2024-01-10' },
          { id: 'quiz_master', name: 'Quiz Ustası', description: '10 quiz tamamladınız', icon: '🧠', unlocked: true, unlockedAt: '2024-01-12' },
          { id: 'streak_5', name: '5 Gün Seri', description: '5 gün üst üste çalıştınız', icon: '🔥', unlocked: true, unlockedAt: '2024-01-15' },
          { id: 'time_master', name: 'Zaman Ustası', description: '5 saat çalışma süresi', icon: '⏰', unlocked: false },
          { id: 'perfectionist', name: 'Mükemmeliyetçi', description: '%100 doğruluk oranı', icon: '🎯', unlocked: false }
        ],
        achievements: [
          {
            id: 'first_steps',
            title: 'İlk Adımlar',
            description: 'İlk kez uygulamayı kullandınız',
            icon: '👶',
            category: 'study',
            requirement: 1,
            current: 1,
            unlocked: true,
            unlockedAt: '2024-01-10',
            rarity: 'common',
            reward: { xp: 50, badge: 'first_note' }
          },
          {
            id: 'note_taker',
            title: 'Not Alıcı',
            description: '10 not oluşturun',
            icon: '📝',
            category: 'notes',
            requirement: 10,
            current: 8,
            unlocked: false,
            rarity: 'common',
            reward: { xp: 100, coins: 50 }
          },
          {
            id: 'quiz_champion',
            title: 'Quiz Şampiyonu',
            description: '20 quiz tamamlayın',
            icon: '🏆',
            category: 'quiz',
            requirement: 20,
            current: 15,
            unlocked: false,
            rarity: 'rare',
            reward: { xp: 200, coins: 100, badge: 'quiz_master' }
          },
          {
            id: 'time_investor',
            title: 'Zaman Yatırımcısı',
            description: '10 saat çalışma süresi',
            icon: '⏰',
            category: 'time',
            requirement: 600,
            current: 420,
            unlocked: false,
            rarity: 'epic',
            reward: { xp: 300, gems: 25 }
          },
          {
            id: 'streak_legend',
            title: 'Seri Efsanesi',
            description: '30 gün üst üste çalışın',
            icon: '🔥',
            category: 'streak',
            requirement: 30,
            current: 7,
            unlocked: false,
            rarity: 'legendary',
            reward: { xp: 500, gems: 50, badge: 'streak_legend', title: 'Seri Ustası' }
          }
        ],
        dailyQuests: [
          {
            id: 'daily_chat',
            title: 'Günlük Sohbet',
            description: 'Karakterle 10 dakika sohbet edin',
            reward: { xp: 50, coins: 25 },
            completed: false,
            progress: 7,
            maxProgress: 10
          },
          {
            id: 'daily_quiz',
            title: 'Günlük Quiz',
            description: '1 quiz tamamlayın',
            reward: { xp: 75, coins: 30 },
            completed: true,
            progress: 1,
            maxProgress: 1
          },
          {
            id: 'daily_notes',
            title: 'Not Alma',
            description: '2 not oluşturun',
            reward: { xp: 60, coins: 20 },
            completed: false,
            progress: 1,
            maxProgress: 2
          }
        ],
        weeklyChallenges: [
          {
            id: 'weekly_study',
            title: 'Haftalık Çalışma',
            description: 'Bu hafta 5 saat çalışın',
            reward: { xp: 300, gems: 15 },
            completed: false,
            progress: 240,
            maxProgress: 300,
            deadline: '2024-01-21'
          },
          {
            id: 'weekly_events',
            title: 'Tarihi Olaylar',
            description: '10 tarihi olay inceleyin',
            reward: { xp: 250, gems: 10, badge: 'event_explorer' },
            completed: false,
            progress: 7,
            maxProgress: 10,
            deadline: '2024-01-21'
          }
        ]
      };
      setUserStats(sampleStats);
      localStorage.setItem(`gamification_${character.id}`, JSON.stringify(sampleStats));
    }
  }, [character.id]);

  const getLevelProgress = () => {
    return Math.round((userStats.experience / userStats.nextLevelExp) * 100);
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      'common': 'bg-gray-100 text-gray-800 border-gray-300',
      'rare': 'bg-blue-100 text-blue-800 border-blue-300',
      'epic': 'bg-purple-100 text-purple-800 border-purple-300',
      'legendary': 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityIcon = (rarity: string) => {
    const icons = {
      'common': '⚪',
      'rare': '🔵',
      'epic': '🟣',
      'legendary': '🟡'
    };
    return icons[rarity as keyof typeof icons] || icons.common;
  };

  const renderAchievements = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userStats.achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`transition-all duration-200 ${
              achievement.unlocked 
                ? 'ring-2 ring-green-500 bg-green-50' 
                : 'bg-gray-50 opacity-75'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {getRarityIcon(achievement.rarity)} {achievement.rarity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span>İlerleme</span>
                      <span>{achievement.current} / {achievement.requirement}</span>
                    </div>
                    <Progress 
                      value={(achievement.current / achievement.requirement) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">
                        +{achievement.reward.xp} XP
                      </Badge>
                      {achievement.reward.coins && (
                        <Badge variant="outline" className="text-xs">
                          +{achievement.reward.coins} 💰
                        </Badge>
                      )}
                      {achievement.reward.gems && (
                        <Badge variant="outline" className="text-xs">
                          +{achievement.reward.gems} 💎
                        </Badge>
                      )}
                    </div>
                    {achievement.unlocked && (
                      <span className="text-green-600 text-xs font-medium">✓ Tamamlandı</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBadges = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {userStats.badges.map((badge) => (
          <Card 
            key={badge.id} 
            className={`text-center transition-all duration-200 ${
              badge.unlocked 
                ? 'ring-2 ring-yellow-500 bg-yellow-50' 
                : 'bg-gray-50 opacity-50'
            }`}
          >
            <CardContent className="p-4">
              <div className={`text-4xl mb-2 ${badge.unlocked ? '' : 'grayscale'}`}>
                {badge.icon}
              </div>
              <h4 className="font-semibold text-sm text-gray-800 mb-1">{badge.name}</h4>
              <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
              {badge.unlocked && badge.unlockedAt && (
                <Badge variant="outline" className="text-xs">
                  {badge.unlockedAt}
                </Badge>
              )}
              {!badge.unlocked && (
                <Badge variant="secondary" className="text-xs">
                  Kilitli
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderQuests = () => (
    <div className="space-y-6">
      {/* Daily Quests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ClockIcon className="w-5 h-5 text-blue-600" />
            <span>Günlük Görevler</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userStats.dailyQuests.map((quest) => (
              <div 
                key={quest.id} 
                className={`p-3 rounded-lg border-2 ${
                  quest.completed 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{quest.title}</h4>
                  {quest.completed && (
                    <Badge className="bg-green-500 text-white">Tamamlandı</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{quest.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="text-xs">
                      +{quest.reward.xp} XP
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      +{quest.reward.coins} 💰
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {quest.progress} / {quest.maxProgress}
                  </div>
                </div>
                {!quest.completed && (
                  <Progress 
                    value={(quest.progress / quest.maxProgress) * 100} 
                    className="h-2 mt-2"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AcademicCapIcon className="w-5 h-5 text-purple-600" />
            <span>Haftalık Meydan Okumalar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userStats.weeklyChallenges.map((challenge) => (
              <div 
                key={challenge.id} 
                className={`p-3 rounded-lg border-2 ${
                  challenge.completed 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{challenge.title}</h4>
                  <div className="flex space-x-2">
                    {challenge.completed && (
                      <Badge className="bg-purple-500 text-white">Tamamlandı</Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {challenge.deadline}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="text-xs">
                      +{challenge.reward.xp} XP
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      +{challenge.reward.gems} 💎
                    </Badge>
                    {challenge.reward.badge && (
                      <Badge variant="outline" className="text-xs">
                        🏆 Rozet
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {challenge.progress} / {challenge.maxProgress}
                  </div>
                </div>
                {!challenge.completed && (
                  <Progress 
                    value={(challenge.progress / challenge.maxProgress) * 100} 
                    className="h-2 mt-2"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderShop = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* XP Booster */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-4xl mb-2">⚡</div>
            <h4 className="font-semibold mb-2">XP Hızlandırıcı</h4>
            <p className="text-sm text-gray-600 mb-3">1 saat boyunca %50 daha fazla XP kazanın</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline">25 💰</Badge>
              <Button size="sm" disabled={userStats.coins < 25}>
                Satın Al
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Streak Saver */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-4xl mb-2">🛡️</div>
            <h4 className="font-semibold mb-2">Seri Koruyucu</h4>
            <p className="text-sm text-gray-600 mb-3">Günlük çalışma serinizi koruyun</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline">15 💎</Badge>
              <Button size="sm" disabled={userStats.gems < 15}>
                Satın Al
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Premium Avatar */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-4xl mb-2">👑</div>
            <h4 className="font-semibold mb-2">Premium Avatar</h4>
            <p className="text-sm text-gray-600 mb-3">Özel avatar çerçevesi</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline">50 💎</Badge>
              <Button size="sm" disabled={userStats.gems < 50}>
                Satın Al
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {character.name} - Oyunlaştırma
              </h2>
              <p className="text-gray-600">
                Seviye {userStats.level} • {userStats.totalXP} XP • {userStats.coins} 💰 • {userStats.gems} 💎
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="outline" size="sm">
            ✕ Kapat
          </Button>
        </div>

        {/* Level Progress */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Seviye {userStats.level}</span>
            <span className="text-sm text-gray-600">
              {userStats.experience} / {userStats.nextLevelExp} XP
            </span>
          </div>
          <Progress value={getLevelProgress()} className="h-3" />
          <p className="text-xs text-gray-500 mt-1">
            Bir sonraki seviye için {userStats.nextLevelExp - userStats.experience} XP gerekli
          </p>
        </div>

        {/* Tabs */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-4">
            {[
              { id: 'achievements', label: 'Başarılar', icon: '🏆' },
              { id: 'badges', label: 'Rozetler', icon: '🎖️' },
              { id: 'quests', label: 'Görevler', icon: '🎯' },
              { id: 'shop', label: 'Mağaza', icon: '🛒' }
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                variant={selectedTab === tab.id ? 'default' : 'outline'}
                size="sm"
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedTab === 'achievements' && renderAchievements()}
          {selectedTab === 'badges' && renderBadges()}
          {selectedTab === 'quests' && renderQuests()}
          {selectedTab === 'shop' && renderShop()}
        </div>
      </div>
    </div>
  );
};

export default GamificationSystem;
