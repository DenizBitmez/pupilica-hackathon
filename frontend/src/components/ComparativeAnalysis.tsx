import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ChartBarIcon, 
  ScaleIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface HistoricalFigure {
  id: string;
  name: string;
  birthYear: number;
  deathYear: number;
  era: string;
  region: string;
  achievements: string[];
  challenges: string[];
  legacy: string[];
  leadershipStyle: string;
  militaryTactics?: string[];
  reforms?: string[];
}

interface ComparativeAnalysisProps {
  character: any;
  isVisible: boolean;
  onClose: () => void;
}

const ComparativeAnalysis: React.FC<ComparativeAnalysisProps> = ({ 
  character, 
  isVisible, 
  onClose 
}) => {
  const [figures, setFigures] = useState<HistoricalFigure[]>([]);
  const [selectedComparison, setSelectedComparison] = useState<string>('era');
  const [analysisMode, setAnalysisMode] = useState<'timeline' | 'achievements' | 'leadership'>('timeline');

  const historicalFigures: HistoricalFigure[] = [
    {
      id: 'fatih_sultan_mehmet',
      name: 'Fatih Sultan Mehmet',
      birthYear: 1432,
      deathYear: 1481,
      era: 'Orta Çağ Sonu',
      region: 'Osmanlı İmparatorluğu',
      achievements: [
        'İstanbul\'un fethi (1453)',
        'Şahi topunun geliştirilmesi',
        'Topkapı Sarayı\'nın inşası',
        'Kanunname-i Âl-i Osman',
        'Bilim ve sanatın korunması'
      ],
      challenges: [
        'Bizans savunmasının güçlülüğü',
        'Avrupa\'dan gelen tehditler',
        'İç isyanlar ve komplolar',
        'Ekonomik zorluklar'
      ],
      legacy: [
        'Orta Çağ\'ın sonu ve Yeni Çağ\'ın başlangıcı',
        'Osmanlı İmparatorluğu\'nun altın çağı',
        'Doğu-Batı kültür sentezi',
        'Modern savaş teknolojisinin gelişimi'
      ],
      leadershipStyle: 'Vizyoner ve Stratejik',
      militaryTactics: [
        'Teknoloji kullanımı (Şahi top)',
        'Psikolojik savaş',
        'Deniz ve kara koordinasyonu',
        'İstihbarat ağı'
      ],
      reforms: [
        'Merkezi yönetim güçlendirme',
        'Hukuk sistemi düzenleme',
        'Kültürel hoşgörü politikası'
      ]
    },
    {
      id: 'ataturk',
      name: 'Mustafa Kemal Atatürk',
      birthYear: 1881,
      deathYear: 1938,
      era: 'Modern Çağ',
      region: 'Türkiye',
      achievements: [
        'Türkiye Cumhuriyeti\'nin kuruluşu',
        'Kurtuluş Savaşı\'nın kazanılması',
        'Laik devlet sisteminin kurulması',
        'Harf devrimi',
        'Kadın haklarının tanınması'
      ],
      challenges: [
        'Osmanlı\'nın yıkılışı',
        'İşgal güçleriyle savaş',
        'Geleneksel toplumun direnci',
        'Ekonomik yıkım'
      ],
      legacy: [
        'Modern Türkiye\'nin kuruluşu',
        'Laik demokratik sistem',
        'Ulusal kimlik oluşumu',
        'Eğitim reformu'
      ],
      leadershipStyle: 'Reformcu ve Demokratik',
      militaryTactics: [
        'Geri çekilme ve savunma',
        'Halkın desteğini alma',
        'Stratejik noktaların korunması',
        'Psikolojik üstünlük'
      ],
      reforms: [
        'Siyasi sistem değişikliği',
        'Eğitim reformu',
        'Hukuk sistemi modernizasyonu',
        'Sosyal reformlar'
      ]
    },
    {
      id: 'napoleon',
      name: 'Napoleon Bonaparte',
      birthYear: 1769,
      deathYear: 1821,
      era: 'Modern Çağ Başı',
      region: 'Fransa/Avrupa',
      achievements: [
        'Fransız Devrimi\'nin tamamlanması',
        'Napoleon Kanunları',
        'Avrupa\'nın birleştirilmesi',
        'Modern hukuk sistemi',
        'Eğitim reformu'
      ],
      challenges: [
        'Koalisyon savaşları',
        'İngiltere\'nin deniz üstünlüğü',
        'Rusya\'nın sert iklimi',
        'Avrupa monarşilerinin direnci'
      ],
      legacy: [
        'Modern hukuk sisteminin temeli',
        'Milliyetçilik hareketlerinin yayılması',
        'Merkezi yönetim modeli',
        'Askeri strateji ve taktikler'
      ],
      leadershipStyle: 'Karizmatik ve Merkezi',
      militaryTactics: [
        'Hızlı hareket (Blitzkrieg)',
        'Topçu koordinasyonu',
        'Psikolojik üstünlük',
        'Düşmanı bölme stratejisi'
      ],
      reforms: [
        'Merkezi bürokrasi',
        'Eğitim sistemi',
        'Ekonomik düzenlemeler',
        'Sosyal eşitlik'
      ]
    }
  ];

  useEffect(() => {
    setFigures(historicalFigures);
  }, []);

  const getCurrentFigure = () => figures.find(f => f.id === character.id);
  const getOtherFigures = () => figures.filter(f => f.id !== character.id);

  const renderTimelineComparison = () => {
    const currentFigure = getCurrentFigure();
    if (!currentFigure) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Zaman Çizelgesi Karşılaştırması
        </h3>
        
        <div className="relative">
          {/* Timeline */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          
          {figures.map((figure, index) => (
            <div key={figure.id} className="relative mb-8 ml-12">
              <div className={`absolute -left-2 w-4 h-4 rounded-full border-2 border-white ${
                figure.id === character.id ? 'bg-blue-500' : 'bg-gray-400'
              }`}></div>
              
              <Card className={`${figure.id === character.id ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{figure.name}</h4>
                      <p className="text-gray-600">{figure.birthYear} - {figure.deathYear}</p>
                      <Badge variant="outline" className="mt-1">
                        {figure.era}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Yaşam Süresi</p>
                      <p className="font-bold text-lg">{figure.deathYear - figure.birthYear} yıl</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Era Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5 text-blue-600" />
              <span>Dönem Analizi</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {figures.map(figure => (
                <div key={figure.id} className={`p-4 rounded-lg border-2 ${
                  figure.id === character.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <h5 className="font-semibold">{figure.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{figure.era}</p>
                  <p className="text-xs text-gray-500 mt-2">{figure.region}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAchievementsComparison = () => {
    const currentFigure = getCurrentFigure();
    if (!currentFigure) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Başarılar Karşılaştırması
        </h3>

        {figures.map(figure => (
          <Card key={figure.id} className={figure.id === character.id ? 'ring-2 ring-blue-500' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{figure.name}</span>
                <Badge variant={figure.id === character.id ? 'default' : 'outline'}>
                  {figure.achievements.length} başarı
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-green-700 mb-2">🏆 Başarılar</h5>
                  <ul className="space-y-1">
                    {figure.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-red-700 mb-2">⚠️ Zorluklar</h5>
                  <ul className="space-y-1">
                    {figure.challenges.map((challenge, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-red-500 mr-2">⚠</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderLeadershipComparison = () => {
    const currentFigure = getCurrentFigure();
    if (!currentFigure) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Liderlik Tarzı Karşılaştırması
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {figures.map(figure => (
            <Card key={figure.id} className={figure.id === character.id ? 'ring-2 ring-blue-500' : ''}>
              <CardHeader>
                <CardTitle className="text-center">{figure.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-semibold text-blue-700 mb-2">👑 Liderlik Tarzı</h5>
                  <p className="text-sm text-gray-700">{figure.leadershipStyle}</p>
                </div>

                {figure.militaryTactics && (
                  <div>
                    <h5 className="font-semibold text-red-700 mb-2">⚔️ Askeri Taktikler</h5>
                    <ul className="space-y-1">
                      {figure.militaryTactics.map((tactic, index) => (
                        <li key={index} className="text-xs text-gray-700">• {tactic}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {figure.reforms && (
                  <div>
                    <h5 className="font-semibold text-purple-700 mb-2">🔄 Reformlar</h5>
                    <ul className="space-y-1">
                      {figure.reforms.map((reform, index) => (
                        <li key={index} className="text-xs text-gray-700">• {reform}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h5 className="font-semibold text-green-700 mb-2">🏆 Miras</h5>
                  <ul className="space-y-1">
                    {figure.legacy.slice(0, 3).map((legacy, index) => (
                      <li key={index} className="text-xs text-gray-700">• {legacy}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparative Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LightBulbIcon className="w-5 h-5 text-yellow-600" />
              <span>Karşılaştırmalı Analiz</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">🎯 Ortak Özellikler</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Hepsi kendi dönemlerinin en büyük liderlerinden</li>
                  <li>• Askeri ve siyasi deha sahibi</li>
                  <li>• Toplumlarında köklü değişimler yaratmış</li>
                  <li>• Modernleşme ve reform hareketlerinin öncüleri</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">📊 Farklılıklar</h5>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• <strong>Fatih:</strong> Teknolojik yenilik odaklı, fetihçi</li>
                  <li>• <strong>Atatürk:</strong> Demokratik reform odaklı, kurtarıcı</li>
                  <li>• <strong>Napoleon:</strong> Merkezi yönetim odaklı, imparator</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h5 className="font-semibold text-purple-800 mb-2">🌍 Tarihsel Etki</h5>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• <strong>Fatih:</strong> Orta Çağ'ın sonu, Yeni Çağ'ın başlangıcı</li>
                  <li>• <strong>Atatürk:</strong> Modern Türkiye'nin kuruluşu</li>
                  <li>• <strong>Napoleon:</strong> Modern Avrupa'nın şekillenmesi</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ScaleIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Karşılaştırmalı Analiz
              </h2>
              <p className="text-gray-600">
                {character.name} ve diğer büyük liderler
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="outline" size="sm">
            ✕ Kapat
          </Button>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setAnalysisMode('timeline')}
              variant={analysisMode === 'timeline' ? 'default' : 'outline'}
              size="sm"
            >
              <ClockIcon className="w-4 h-4 mr-2" />
              Zaman Çizelgesi
            </Button>
            <Button
              onClick={() => setAnalysisMode('achievements')}
              variant={analysisMode === 'achievements' ? 'default' : 'outline'}
              size="sm"
            >
              <ChartBarIcon className="w-4 h-4 mr-2" />
              Başarılar
            </Button>
            <Button
              onClick={() => setAnalysisMode('leadership')}
              variant={analysisMode === 'leadership' ? 'default' : 'outline'}
              size="sm"
            >
              <ScaleIcon className="w-4 h-4 mr-2" />
              Liderlik
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {analysisMode === 'timeline' && renderTimelineComparison()}
          {analysisMode === 'achievements' && renderAchievementsComparison()}
          {analysisMode === 'leadership' && renderLeadershipComparison()}
        </div>
      </div>
    </div>
  );
};

export default ComparativeAnalysis;
