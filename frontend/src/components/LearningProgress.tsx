import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ChartBarIcon, 
  TrophyIcon,
  ClockIcon,
  BookOpenIcon,
  StarIcon,
  FireIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface LearningProgressProps {
  character: any;
  isVisible: boolean;
  onClose: () => void;
}

interface ProgressData {
  totalStudyTime: number;
  notesCount: number;
  eventsStudied: number;
  quizzesCompleted: number;
  correctAnswers: number;
  totalQuestions: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  experience: number;
  nextLevelExp: number;
  studySessions: Array<{
    date: string;
    duration: number;
    type: 'chat' | 'quiz' | 'timeline' | 'notes' | 'map';
  }>;
  weeklyProgress: Array<{
    week: string;
    studyTime: number;
    eventsStudied: number;
    notesCreated: number;
  }>;
}

const LearningProgress: React.FC<LearningProgressProps> = ({ 
  character, 
  isVisible, 
  onClose 
}) => {
  const [progressData, setProgressData] = useState<ProgressData>({
    totalStudyTime: 0,
    notesCount: 0,
    eventsStudied: 0,
    quizzesCompleted: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    achievementsUnlocked: 0,
    totalAchievements: 12,
    currentStreak: 0,
    longestStreak: 0,
    level: 1,
    experience: 0,
    nextLevelExp: 100,
    studySessions: [],
    weeklyProgress: []
  });

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    // LocalStorage'dan ilerleme verilerini yükle
    const savedProgress = localStorage.getItem(`progress_${character.id}`);
    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress));
    } else {
      // Örnek veri oluştur
      const sampleData: ProgressData = {
        totalStudyTime: 1245, // dakika
        notesCount: 23,
        eventsStudied: 15,
        quizzesCompleted: 8,
        correctAnswers: 42,
        totalQuestions: 56,
        achievementsUnlocked: 7,
        totalAchievements: 12,
        currentStreak: 5,
        longestStreak: 12,
        level: 3,
        experience: 340,
        nextLevelExp: 500,
        studySessions: [
          { date: '2024-01-15', duration: 45, type: 'chat' },
          { date: '2024-01-14', duration: 30, type: 'quiz' },
          { date: '2024-01-13', duration: 60, type: 'timeline' },
          { date: '2024-01-12', duration: 25, type: 'notes' },
          { date: '2024-01-11', duration: 40, type: 'map' }
        ],
        weeklyProgress: [
          { week: 'Bu Hafta', studyTime: 200, eventsStudied: 5, notesCreated: 8 },
          { week: 'Geçen Hafta', studyTime: 180, eventsStudied: 4, notesCreated: 6 },
          { week: '2 Hafta Önce', studyTime: 160, eventsStudied: 3, notesCreated: 4 }
        ]
      };
      setProgressData(sampleData);
      localStorage.setItem(`progress_${character.id}`, JSON.stringify(sampleData));
    }
  }, [character.id]);

  const getAccuracy = () => {
    if (progressData.totalQuestions === 0) return 0;
    return Math.round((progressData.correctAnswers / progressData.totalQuestions) * 100);
  };

  const getLevelProgress = () => {
    return Math.round((progressData.experience / progressData.nextLevelExp) * 100);
  };

  const getAchievementProgress = () => {
    return Math.round((progressData.achievementsUnlocked / progressData.totalAchievements) * 100);
  };

  const getStudyTimeFormatted = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}s ${mins}dk`;
    }
    return `${mins}dk`;
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 10) return '🔥';
    if (streak >= 7) return '⭐';
    if (streak >= 3) return '📚';
    return '📖';
  };

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

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Toplam Çalışma</p>
              <p className="text-2xl font-bold text-blue-800">
                {getStudyTimeFormatted(progressData.totalStudyTime)}
              </p>
            </div>
            <ClockIcon className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Doğruluk Oranı</p>
              <p className="text-2xl font-bold text-green-800">
                %{getAccuracy()}
              </p>
            </div>
            <AcademicCapIcon className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Seviye</p>
              <p className="text-2xl font-bold text-purple-800">
                {progressData.level}
              </p>
              <p className="text-xs text-purple-600">{getLevelTitle(progressData.level)}</p>
            </div>
            <StarIcon className="w-8 h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Günlük Seri</p>
              <p className="text-2xl font-bold text-orange-800">
                {progressData.currentStreak}
              </p>
              <p className="text-xs text-orange-600">
                {getStreakEmoji(progressData.currentStreak)} {progressData.longestStreak} rekor
              </p>
            </div>
            <FireIcon className="w-8 h-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProgressBars = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ChartBarIcon className="w-5 h-5 text-blue-600" />
          <span>İlerleme Durumu</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Seviye İlerlemesi</span>
            <span className="text-sm text-gray-600">
              {progressData.experience} / {progressData.nextLevelExp} XP
            </span>
          </div>
          <Progress value={getLevelProgress()} className="h-3" />
          <p className="text-xs text-gray-500 mt-1">
            Bir sonraki seviye için {progressData.nextLevelExp - progressData.experience} XP gerekli
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Başarılar</span>
            <span className="text-sm text-gray-600">
              {progressData.achievementsUnlocked} / {progressData.totalAchievements}
            </span>
          </div>
          <Progress value={getAchievementProgress()} className="h-3" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Tarihi Olaylar</span>
            <span className="text-sm text-gray-600">
              {progressData.eventsStudied} olay incelendi
            </span>
          </div>
          <Progress value={(progressData.eventsStudied / 20) * 100} className="h-3" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Notlar</span>
            <span className="text-sm text-gray-600">
              {progressData.notesCount} not oluşturuldu
            </span>
          </div>
          <Progress value={(progressData.notesCount / 50) * 100} className="h-3" />
        </div>
      </CardContent>
    </Card>
  );

  const renderStudySessions = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpenIcon className="w-5 h-5 text-green-600" />
          <span>Son Çalışma Oturumları</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {progressData.studySessions.slice(0, 5).map((session, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                  session.type === 'chat' ? 'bg-blue-500' :
                  session.type === 'quiz' ? 'bg-purple-500' :
                  session.type === 'timeline' ? 'bg-green-500' :
                  session.type === 'notes' ? 'bg-orange-500' : 'bg-pink-500'
                }`}>
                  {session.type === 'chat' ? '💬' :
                   session.type === 'quiz' ? '🧠' :
                   session.type === 'timeline' ? '⏰' :
                   session.type === 'notes' ? '📝' : '🗺️'}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {session.type === 'chat' ? 'Sohbet' :
                     session.type === 'quiz' ? 'Quiz' :
                     session.type === 'timeline' ? 'Zaman Çizelgesi' :
                     session.type === 'notes' ? 'Not Alma' : 'Harita'}
                  </p>
                  <p className="text-sm text-gray-600">{session.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{session.duration}dk</p>
                <p className="text-xs text-gray-500">süre</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderWeeklyProgress = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AcademicCapIcon className="w-5 h-5 text-purple-600" />
            <span>Haftalık İlerleme</span>
          </div>
          <div className="flex space-x-2">
            {(['week', 'month', 'all'] as const).map((period) => (
              <Button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                className="capitalize"
              >
                {period === 'week' ? 'Hafta' : period === 'month' ? 'Ay' : 'Tümü'}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progressData.weeklyProgress.map((week, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{week.week}</h4>
                <Badge variant="outline">{getStudyTimeFormatted(week.studyTime)}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{week.eventsStudied}</p>
                  <p className="text-sm text-gray-600">Olay İncelendi</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{week.notesCreated}</p>
                  <p className="text-sm text-gray-600">Not Oluşturuldu</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {character.name} - Öğrenme İlerlemesi
              </h2>
              <p className="text-gray-600">
                Seviye {progressData.level} • {getLevelTitle(progressData.level)}
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="outline" size="sm">
            ✕ Kapat
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStatsCards()}
          {renderProgressBars()}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderStudySessions()}
          </div>
          
          {renderWeeklyProgress()}
        </div>
      </div>
    </div>
  );
};

export default LearningProgress;
