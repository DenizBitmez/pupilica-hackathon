import React, { useState } from 'react';
import { HistoricalFigure } from '../types/historical';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  significance: 'major' | 'important' | 'minor';
  location?: string;
}

interface HistoricalTimelineProps {
  character: HistoricalFigure;
  isVisible: boolean;
  onClose: () => void;
}

const HistoricalTimeline: React.FC<HistoricalTimelineProps> = ({ character, isVisible, onClose }) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const getTimelineEvents = (): TimelineEvent[] => {
    switch (character.id) {
      case 'fatih_sultan_mehmet':
        return [
          {
            year: '1432',
            title: 'Doğum',
            description: 'Fatih Sultan Mehmet, II. Murad ve Hüma Hatun\'un oğlu olarak Edirne\'de doğdu.',
            significance: 'major',
            location: 'Edirne'
          },
          {
            year: '1444',
            title: 'İlk Tahta Çıkış',
            description: '12 yaşında ilk kez tahta çıktı, ancak kısa süre sonra babası geri döndü.',
            significance: 'important',
            location: 'Edirne'
          },
          {
            year: '1451',
            title: 'İkinci Tahta Çıkış',
            description: 'Babasının ölümü üzerine 19 yaşında ikinci kez tahta çıktı.',
            significance: 'major',
            location: 'Edirne'
          },
          {
            year: '1453',
            title: 'İstanbul\'un Fethi',
            description: '29 Mayıs\'ta Konstantinopolis\'i fethederek Bizans İmparatorluğu\'na son verdi.',
            significance: 'major',
            location: 'İstanbul'
          },
          {
            year: '1456',
            title: 'Belgrad Kuşatması',
            description: 'Belgrad\'ı kuşattı ancak başarısız oldu.',
            significance: 'important',
            location: 'Belgrad'
          },
          {
            year: '1461',
            title: 'Trabzon\'un Fethi',
            description: 'Trabzon Rum İmparatorluğu\'nu fethetti.',
            significance: 'important',
            location: 'Trabzon'
          },
          {
            year: '1481',
            title: 'Ölüm',
            description: '49 yaşında Gebze\'de vefat etti.',
            significance: 'major',
            location: 'Gebze'
          }
        ];
      case 'ataturk':
        return [
          {
            year: '1881',
            title: 'Doğum',
            description: 'Mustafa Kemal Atatürk, Selanik\'te doğdu.',
            significance: 'major',
            location: 'Selanik'
          },
          {
            year: '1893',
            title: 'Askeri Okula Giriş',
            description: 'Selanik Askeri Rüştiyesi\'ne girdi.',
            significance: 'important',
            location: 'Selanik'
          },
          {
            year: '1905',
            title: 'Harp Akademisi Mezuniyeti',
            description: 'Harp Akademisi\'nden kurmay yüzbaşı olarak mezun oldu.',
            significance: 'important',
            location: 'İstanbul'
          },
          {
            year: '1915',
            title: 'Çanakkale Zaferi',
            description: 'Çanakkale Savaşı\'nda büyük zafer kazandı.',
            significance: 'major',
            location: 'Çanakkale'
          },
          {
            year: '1919',
            title: 'Samsun\'a Çıkış',
            description: '19 Mayıs\'ta Samsun\'a çıkarak Kurtuluş Savaşı\'nı başlattı.',
            significance: 'major',
            location: 'Samsun'
          },
          {
            year: '1920',
            title: 'TBMM\'nin Açılması',
            description: '23 Nisan\'da Türkiye Büyük Millet Meclisi açıldı.',
            significance: 'major',
            location: 'Ankara'
          },
          {
            year: '1923',
            title: 'Cumhuriyet\'in İlanı',
            description: '29 Ekim\'de Türkiye Cumhuriyeti ilan edildi.',
            significance: 'major',
            location: 'Ankara'
          },
          {
            year: '1938',
            title: 'Ölüm',
            description: '57 yaşında Dolmabahçe Sarayı\'nda vefat etti.',
            significance: 'major',
            location: 'İstanbul'
          }
        ];
      case 'napoleon':
        return [
          {
            year: '1769',
            title: 'Doğum',
            description: 'Napolyon Bonaparte, Korsika\'da doğdu.',
            significance: 'major',
            location: 'Korsika'
          },
          {
            year: '1796',
            title: 'İtalya Seferi',
            description: 'İtalya\'da büyük zaferler kazandı.',
            significance: 'major',
            location: 'İtalya'
          },
          {
            year: '1798',
            title: 'Mısır Seferi',
            description: 'Mısır\'ı işgal etti ancak İngiliz donanması tarafından yenildi.',
            significance: 'important',
            location: 'Mısır'
          },
          {
            year: '1804',
            title: 'İmparatorluk',
            description: 'Kendini Fransız İmparatoru ilan etti.',
            significance: 'major',
            location: 'Paris'
          },
          {
            year: '1805',
            title: 'Austerlitz Zaferi',
            description: 'Austerlitz Savaşı\'nda büyük zafer kazandı.',
            significance: 'major',
            location: 'Austerlitz'
          },
          {
            year: '1812',
            title: 'Rusya Seferi',
            description: 'Rusya\'ya sefer düzenledi ancak başarısız oldu.',
            significance: 'major',
            location: 'Rusya'
          },
          {
            year: '1815',
            title: 'Waterloo Savaşı',
            description: 'Waterloo Savaşı\'nda kesin olarak yenildi.',
            significance: 'major',
            location: 'Waterloo'
          },
          {
            year: '1821',
            title: 'Ölüm',
            description: '51 yaşında St. Helena Adası\'nda vefat etti.',
            significance: 'major',
            location: 'St. Helena'
          }
        ];
      default:
        return [];
    }
  };

  const events = getTimelineEvents();

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'major': return 'from-red-500 to-pink-500';
      case 'important': return 'from-blue-500 to-cyan-500';
      case 'minor': return 'from-gray-400 to-gray-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getSignificanceIcon = (significance: string) => {
    switch (significance) {
      case 'major': return '⭐';
      case 'important': return '🔸';
      case 'minor': return '🔹';
      default: return '🔹';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              📅 {character.name} Zaman Çizelgesi
            </h2>
            <p className="text-gray-600">
              Tarihi olayları kronolojik sırayla keşfedin
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500 rounded-full"></div>

          {/* Events */}
          <div className="space-y-8">
            {events.map((event, index) => (
              <div key={index} className="relative flex items-start space-x-6">
                {/* Timeline Dot */}
                <div className={`relative z-10 w-16 h-16 rounded-full bg-gradient-to-r ${getSignificanceColor(event.significance)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {event.year}
                </div>

                {/* Event Content */}
                <div 
                  className={`flex-1 p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    selectedEvent === event 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-lg' 
                      : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedEvent(selectedEvent === event ? null : event)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      {getSignificanceIcon(event.significance)} {event.title}
                    </h3>
                    {event.location && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                        📍 {event.location}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Expanded Details */}
                  {selectedEvent === event && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-amber-800 mb-2">📖 Detaylı Bilgi:</h4>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        {character.id === 'fatih_sultan_mehmet' && event.year === '1453' && 
                          'Bu fetih, Orta Çağ\'ın sonu ve Yeni Çağ\'ın başlangıcı olarak kabul edilir. Fatih Sultan Mehmet, bu başarısıyla sadece 21 yaşında tarihe geçmiştir.'
                        }
                        {character.id === 'ataturk' && event.year === '1919' && 
                          'Bu tarih, Türk Kurtuluş Savaşı\'nın başlangıcı olarak kabul edilir. Mustafa Kemal, bu girişimiyle Türkiye\'nin kurtuluşunu başlatmıştır.'
                        }
                        {character.id === 'napoleon' && event.year === '1805' && 
                          'Austerlitz Savaşı, Napolyon\'un en büyük askeri başarısı olarak kabul edilir. Bu zaferle Avrupa\'da büyük güç haline gelmiştir.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">📊 Önem Seviyeleri:</h4>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
              <span className="text-sm text-gray-700">⭐ Büyük Önem</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              <span className="text-sm text-gray-700">🔸 Önemli</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
              <span className="text-sm text-gray-700">🔹 Normal</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ✅ Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoricalTimeline;
