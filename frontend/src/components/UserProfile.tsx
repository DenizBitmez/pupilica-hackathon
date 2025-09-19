import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  UserIcon,
  TrophyIcon,
  StarIcon,
  FireIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface UserProfileProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: any;
}

const UserProfile: React.FC<UserProfileProps> = ({ isVisible, onClose, onLogout, user }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'achievements'>('profile');

  const getLevelTitle = (level: number) => {
    const titles = [
      'Başlangıç Öğrencisi',
      'Meraklı Öğrenci',
      'Aktif Öğrenci',
      'Deneyimli Öğrenci',
      'Uzman Öğrenci',
      'Tarih Uzmanı',
      'Tarih Profesörü'
    ];
    return titles[Math.min(level - 1, titles.length - 1)] || 'Tarih Ustası';
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 10) return '🔥';
    if (streak >= 7) return '⭐';
    if (streak >= 3) return '📚';
    return '📖';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Profil
              </h2>
              <p className="text-gray-600">
                {user.fullName} • {getLevelTitle(user.level)}
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="outline" size="sm">
            ✕
          </Button>
        </div>

        {/* Tabs */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-4">
            {[
              { id: 'profile', label: 'Profil', icon: '👤' },
              { id: 'stats', label: 'İstatistikler', icon: '📊' },
              { id: 'achievements', label: 'Başarılar', icon: '🏆' }
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                variant={activeTab === tab.id ? 'default' : 'outline'}
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
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                    <span>Kişisel Bilgiler</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ad Soyad
                        </label>
                        <p className="text-gray-800 font-medium">{user.fullName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kullanıcı Adı
                        </label>
                        <p className="text-gray-800 font-medium">@{user.username}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          E-posta
                        </label>
                        <p className="text-gray-800 font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Üyelik Tarihi
                        </label>
                        <p className="text-gray-800 font-medium">
                          {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Son Giriş
                        </label>
                        <p className="text-gray-800 font-medium">
                          {new Date(user.lastLogin).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Seviye
                        </label>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            Seviye {user.level}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {getLevelTitle(user.level)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <StarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-800">{user.experience}</p>
                    <p className="text-sm text-blue-600">XP</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-yellow-600 text-lg">💰</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-800">{user.coins}</p>
                    <p className="text-sm text-yellow-600">Coin</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-purple-600 text-lg">💎</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-800">{user.gems}</p>
                    <p className="text-sm text-purple-600">Gem</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <FireIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-800">{user.currentStreak}</p>
                    <p className="text-sm text-orange-600">Günlük Seri</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AcademicCapIcon className="w-5 h-5 text-green-600" />
                    <span>Öğrenme İstatistikleri</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-3xl font-bold text-gray-800">{user.level}</p>
                      <p className="text-sm text-gray-600">Mevcut Seviye</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-3xl font-bold text-gray-800">{user.experience}</p>
                      <p className="text-sm text-gray-600">Toplam XP</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-3xl font-bold text-gray-800">{user.currentStreak}</p>
                      <p className="text-sm text-gray-600">Günlük Seri</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-3xl font-bold text-gray-800">{user.longestStreak}</p>
                      <p className="text-sm text-gray-600">En Uzun Seri</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-3xl font-bold text-gray-800">{user.coins}</p>
                      <p className="text-sm text-gray-600">Toplam Coin</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-3xl font-bold text-gray-800">{user.gems}</p>
                      <p className="text-sm text-gray-600">Toplam Gem</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrophyIcon className="w-5 h-5 text-yellow-600" />
                    <span>Başarı Özeti</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🎓</span>
                        <div>
                          <p className="font-medium text-gray-800">Seviye Başarısı</p>
                          <p className="text-sm text-gray-600">{getLevelTitle(user.level)}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Seviye {user.level}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getStreakEmoji(user.currentStreak)}</span>
                        <div>
                          <p className="font-medium text-gray-800">Seri Başarısı</p>
                          <p className="text-sm text-gray-600">{user.currentStreak} gün üst üste</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">
                        {user.currentStreak} gün
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💎</span>
                        <div>
                          <p className="font-medium text-gray-800">Değerli Koleksiyon</p>
                          <p className="text-sm text-gray-600">{user.gems} gem toplandı</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {user.gems} 💎
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrophyIcon className="w-5 h-5 text-yellow-600" />
                    <span>Kazanılan Başarılar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Seviye Başarıları */}
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <div className="text-3xl mb-2">🎓</div>
                      <h4 className="font-semibold text-blue-800">Seviye {user.level}</h4>
                      <p className="text-xs text-blue-600">{getLevelTitle(user.level)}</p>
                      <Badge className="mt-2 bg-blue-500 text-white">Kazanıldı</Badge>
                    </div>

                    {/* Seri Başarıları */}
                    {user.currentStreak >= 3 && (
                      <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <div className="text-3xl mb-2">🔥</div>
                        <h4 className="font-semibold text-orange-800">3 Gün Seri</h4>
                        <p className="text-xs text-orange-600">Düzenli çalışma</p>
                        <Badge className="mt-2 bg-orange-500 text-white">Kazanıldı</Badge>
                      </div>
                    )}

                    {user.currentStreak >= 7 && (
                      <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                        <div className="text-3xl mb-2">🔥</div>
                        <h4 className="font-semibold text-red-800">7 Gün Seri</h4>
                        <p className="text-xs text-red-600">Haftalık başarı</p>
                        <Badge className="mt-2 bg-red-500 text-white">Kazanıldı</Badge>
                      </div>
                    )}

                    {/* XP Başarıları */}
                    {user.experience >= 100 && (
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                        <div className="text-3xl mb-2">⭐</div>
                        <h4 className="font-semibold text-green-800">100 XP</h4>
                        <p className="text-xs text-green-600">İlk kilometre taşı</p>
                        <Badge className="mt-2 bg-green-500 text-white">Kazanıldı</Badge>
                      </div>
                    )}

                    {user.experience >= 500 && (
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                        <div className="text-3xl mb-2">💎</div>
                        <h4 className="font-semibold text-purple-800">500 XP</h4>
                        <p className="text-xs text-purple-600">Deneyim toplama</p>
                        <Badge className="mt-2 bg-purple-500 text-white">Kazanıldı</Badge>
                      </div>
                    )}

                    {/* Para Başarıları */}
                    {user.coins >= 1000 && (
                      <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                        <div className="text-3xl mb-2">💰</div>
                        <h4 className="font-semibold text-yellow-800">1000 Coin</h4>
                        <p className="text-xs text-yellow-600">Zenginlik</p>
                        <Badge className="mt-2 bg-yellow-500 text-white">Kazanıldı</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Hesap ID:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {user.id}
              </Badge>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
