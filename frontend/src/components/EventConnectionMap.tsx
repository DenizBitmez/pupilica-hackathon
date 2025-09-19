import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  MapIcon, 
  ArrowRightIcon,
  LinkIcon,
  EyeIcon,
  ClockIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface HistoricalEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  significance: string;
  icon: string;
  category: 'war' | 'politics' | 'culture' | 'economy' | 'science' | 'religion';
  location?: string;
  participants?: string[];
  causes?: string[];
  effects?: string[];
  connections?: string[];
}

interface EventConnectionMapProps {
  character: any;
  isVisible: boolean;
  onClose: () => void;
}

const EventConnectionMap: React.FC<EventConnectionMapProps> = ({ 
  character, 
  isVisible, 
  onClose 
}) => {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [showConnections, setShowConnections] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const svgRef = useRef<SVGSVGElement>(null);

  // Karakter özel tarihi olaylar ve bağlantıları
  const getCharacterEvents = (characterId: string): HistoricalEvent[] => {
    const eventsMap: { [key: string]: HistoricalEvent[] } = {
      'fatih_sultan_mehmet': [
        {
          id: 'birth',
          title: 'Doğum',
          date: '1432',
          description: 'Fatih Sultan Mehmet\'in doğumu',
          significance: 'Osmanlı İmparatorluğu\'nun en büyük hükümdarlarından birinin dünyaya gelişi',
          icon: '👶',
          category: 'politics',
          location: 'Edirne',
          effects: ['education', 'first_reign']
        },
        {
          id: 'education',
          title: 'Eğitim Dönemi',
          date: '1438-1444',
          description: 'Molla Gürani ve Akşemseddin ile eğitimi',
          significance: 'Çok dilli ve kültürlü bir hükümdar olarak yetiştirilmesi',
          icon: '📚',
          category: 'culture',
          causes: ['birth'],
          effects: ['first_reign', 'constantinople_conquest']
        },
        {
          id: 'first_reign',
          title: 'İlk Saltanat',
          date: '1444-1446',
          description: 'Babası II. Murad\'ın tahttan çekilmesi ile ilk saltanatı',
          significance: 'Genç yaşta yönetim deneyimi kazanması',
          icon: '👑',
          category: 'politics',
          causes: ['birth', 'education'],
          effects: ['second_reign']
        },
        {
          id: 'constantinople_conquest',
          title: 'İstanbul Fethi',
          date: '1453',
          description: 'Konstantinopolis\'in fethi ve Bizans İmparatorluğu\'nun sonu',
          significance: 'Orta Çağ\'ın sonu ve Yeni Çağ\'ın başlangıcı',
          icon: '🏰',
          category: 'war',
          location: 'İstanbul',
          causes: ['education', 'cannon_construction'],
          effects: ['topkapi_palace', 'kanunname', 'cultural_renaissance']
        },
        {
          id: 'cannon_construction',
          title: 'Şahi Topunun Dökümü',
          date: '1452',
          description: 'Urban Usta tarafından dünyanın en büyük topunun yapımı',
          significance: 'Savaş teknolojisinde devrim',
          icon: '⚔️',
          category: 'science',
          location: 'Edirne',
          effects: ['constantinople_conquest']
        },
        {
          id: 'cultural_renaissance',
          title: 'Kültürel Rönesans',
          date: '1453-1481',
          description: 'Fetih sonrası İstanbul\'da kültürel ve bilimsel canlanma',
          significance: 'Doğu ve Batı kültürlerinin sentezi',
          icon: '🎨',
          category: 'culture',
          location: 'İstanbul',
          causes: ['constantinople_conquest'],
          effects: ['kanunname']
        },
        {
          id: 'kanunname',
          title: 'Kanunname-i Âl-i Osman',
          date: '1477',
          description: 'Osmanlı hukuk sisteminin temelini oluşturan kanunname',
          significance: 'Sistematik hukuk düzeninin kurulması',
          icon: '📜',
          category: 'politics',
          causes: ['constantinople_conquest', 'cultural_renaissance']
        }
      ],
      'ataturk': [
        {
          id: 'birth_ataturk',
          title: 'Doğum',
          date: '1881',
          description: 'Mustafa Kemal Atatürk\'ün doğumu',
          significance: 'Türkiye Cumhuriyeti\'nin kurucusunun dünyaya gelişi',
          icon: '👶',
          category: 'politics',
          location: 'Selanik',
          effects: ['military_education', 'young_turk_revolution']
        },
        {
          id: 'military_education',
          title: 'Askeri Eğitim',
          date: '1899-1905',
          description: 'Harbiye ve Erkan-ı Harbiye eğitimi',
          significance: 'Stratejik düşünce ve liderlik becerilerinin gelişimi',
          icon: '🎖️',
          category: 'politics',
          causes: ['birth_ataturk'],
          effects: ['tripoli_war', 'gallipoli', 'independence_war']
        },
        {
          id: 'young_turk_revolution',
          title: 'Jön Türk Hareketi',
          date: '1908',
          description: 'II. Abdülhamid\'e karşı devrim hareketi',
          significance: 'Osmanlı\'da anayasal monarşi döneminin başlangıcı',
          icon: '⚡',
          category: 'politics',
          causes: ['birth_ataturk'],
          effects: ['military_education']
        },
        {
          id: 'tripoli_war',
          title: 'Trablusgarp Savaşı',
          date: '1911-1912',
          description: 'İtalya ile Libya\'da savaş',
          significance: 'İlk askeri başarıları ve liderlik deneyimi',
          icon: '🏜️',
          category: 'war',
          location: 'Libya',
          causes: ['military_education'],
          effects: ['balkan_wars', 'gallipoli']
        },
        {
          id: 'gallipoli',
          title: 'Çanakkale Savaşı',
          date: '1915',
          description: 'İtilaf Devletleri\'ne karşı Çanakkale zaferi',
          significance: 'Türk ulusal bilincinin uyanışı',
          icon: '🏴',
          category: 'war',
          location: 'Çanakkale',
          causes: ['military_education', 'tripoli_war'],
          effects: ['independence_war', 'national_consciousness']
        },
        {
          id: 'national_consciousness',
          title: 'Ulusal Bilinç Uyanışı',
          date: '1915-1919',
          description: 'Çanakkale zaferi sonrası Türk ulusal kimliğinin güçlenmesi',
          significance: 'Kurtuluş Savaşı\'nın toplumsal temelinin oluşması',
          icon: '🔥',
          category: 'culture',
          causes: ['gallipoli'],
          effects: ['independence_war']
        },
        {
          id: 'independence_war',
          title: 'Kurtuluş Savaşı',
          date: '1919-1923',
          description: 'Yunan işgaline karşı bağımsızlık savaşı',
          significance: 'Modern Türkiye\'nin doğuşu',
          icon: '⚔️',
          category: 'war',
          location: 'Anadolu',
          causes: ['gallipoli', 'national_consciousness'],
          effects: ['republic_founding', 'reforms']
        },
        {
          id: 'republic_founding',
          title: 'Cumhuriyet İlanı',
          date: '1923',
          description: 'Türkiye Cumhuriyeti\'nin kuruluşu',
          significance: 'Modern laik devletin temellerinin atılması',
          icon: '🏛️',
          category: 'politics',
          location: 'Ankara',
          causes: ['independence_war'],
          effects: ['reforms']
        },
        {
          id: 'reforms',
          title: 'Atatürk Devrimleri',
          date: '1923-1938',
          description: 'Laiklik, eğitim, hukuk alanlarında köklü değişimler',
          significance: 'Modern toplumun inşası',
          icon: '🔄',
          category: 'culture',
          causes: ['republic_founding'],
          effects: ['modern_turkey']
        }
      ],
      'napoleon': [
        {
          id: 'birth_napoleon',
          title: 'Doğum',
          date: '1769',
          description: 'Napoleon Bonaparte\'ın doğumu',
          significance: 'Fransız Devrimi ve Avrupa\'yı değiştirecek liderin dünyaya gelişi',
          icon: '👶',
          category: 'politics',
          location: 'Korsika',
          effects: ['military_school', 'french_revolution']
        },
        {
          id: 'military_school',
          title: 'Askeri Okul',
          date: '1779-1785',
          description: 'Brienne ve Paris askeri okullarında eğitim',
          significance: 'Stratejik zeka ve askeri deha gelişimi',
          icon: '🎖️',
          category: 'politics',
          causes: ['birth_napoleon'],
          effects: ['french_revolution', 'italy_campaign']
        },
        {
          id: 'french_revolution',
          title: 'Fransız Devrimi',
          date: '1789-1799',
          description: 'Monarşiye karşı devrim hareketi',
          significance: 'Napoleon\'un yükselişinin toplumsal zemini',
          icon: '⚡',
          category: 'politics',
          location: 'Fransa',
          causes: ['birth_napoleon'],
          effects: ['military_school', 'italy_campaign']
        },
        {
          id: 'italy_campaign',
          title: 'İtalya Seferi',
          date: '1796-1797',
          description: 'Avusturya\'ya karşı İtalya\'da zaferler',
          significance: 'Napoleon\'un askeri dehasının ortaya çıkışı',
          icon: '⚔️',
          category: 'war',
          location: 'İtalya',
          causes: ['military_school', 'french_revolution'],
          effects: ['egypt_campaign', 'first_consul']
        },
        {
          id: 'egypt_campaign',
          title: 'Mısır Seferi',
          date: '1798-1799',
          description: 'İngilizleri vurmak için Mısır\'a sefer',
          significance: 'Bilimsel keşifler ve arkeolojik bulgular',
          icon: '🏺',
          category: 'science',
          location: 'Mısır',
          causes: ['italy_campaign'],
          effects: ['first_consul']
        },
        {
          id: 'first_consul',
          title: 'Birinci Konsül',
          date: '1799',
          description: 'Fransa\'da yönetimi ele alması',
          significance: 'Fransız Devrimi\'nin sonu ve yeni düzenin başlangıcı',
          icon: '👑',
          category: 'politics',
          location: 'Paris',
          causes: ['italy_campaign', 'egypt_campaign'],
          effects: ['napoleonic_code', 'emperor']
        },
        {
          id: 'napoleonic_code',
          title: 'Napoleon Kanunları',
          date: '1804',
          description: 'Modern hukuk sisteminin temelini oluşturan kanunlar',
          significance: 'Avrupa hukuk sisteminin modernleşmesi',
          icon: '📋',
          category: 'politics',
          causes: ['first_consul'],
          effects: ['emperor']
        },
        {
          id: 'emperor',
          title: 'İmparatorluk İlanı',
          date: '1804',
          description: 'Napoleon\'un kendini imparator ilan etmesi',
          significance: 'Fransız İmparatorluğu\'nun kuruluşu',
          icon: '👑',
          category: 'politics',
          causes: ['first_consul', 'napoleonic_code'],
          effects: ['austerlitz', 'russia_campaign']
        },
        {
          id: 'austerlitz',
          title: 'Austerlitz Zaferi',
          date: '1805',
          description: 'Üç İmparator Savaşı\'nda büyük zafer',
          significance: 'Napoleon\'un askeri dehasının zirvesi',
          icon: '☀️',
          category: 'war',
          location: 'Austerlitz',
          causes: ['emperor'],
          effects: ['russia_campaign']
        },
        {
          id: 'russia_campaign',
          title: 'Rusya Seferi',
          date: '1812',
          description: 'Moskova\'ya sefer ve büyük yenilgi',
          significance: 'Napoleon\'un düşüşünün başlangıcı',
          icon: '❄️',
          category: 'war',
          location: 'Rusya',
          causes: ['emperor', 'austerlitz'],
          effects: ['waterloo', 'exile']
        },
        {
          id: 'waterloo',
          title: 'Waterloo Yenilgisi',
          date: '1815',
          description: 'Son savaş ve kesin yenilgi',
          significance: 'Napoleon\'un sonu ve Avrupa\'da yeni düzen',
          icon: '💔',
          category: 'war',
          location: 'Waterloo',
          causes: ['russia_campaign'],
          effects: ['exile']
        }
      ]
    };
    
    return eventsMap[characterId] || [];
  };

  useEffect(() => {
    const characterEvents = getCharacterEvents(character.id);
    setEvents(characterEvents);
  }, [character.id]);

  const filteredEvents = filterCategory === 'all' 
    ? events 
    : events.filter(event => event.category === filterCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      'war': 'bg-red-100 text-red-800 border-red-200',
      'politics': 'bg-blue-100 text-blue-800 border-blue-200',
      'culture': 'bg-purple-100 text-purple-800 border-purple-200',
      'economy': 'bg-green-100 text-green-800 border-green-200',
      'science': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'religion': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'war': '⚔️',
      'politics': '🏛️',
      'culture': '🎨',
      'economy': '💰',
      'science': '🔬',
      'religion': '⛪'
    };
    return icons[category as keyof typeof icons] || '📅';
  };

  const renderEventConnections = () => {
    if (!selectedEvent) return null;

    const connectedEvents = events.filter(event => 
      event.connections?.includes(selectedEvent.id) ||
      selectedEvent.connections?.includes(event.id) ||
      event.causes?.includes(selectedEvent.id) ||
      selectedEvent.causes?.includes(event.id) ||
      event.effects?.includes(selectedEvent.id) ||
      selectedEvent.effects?.includes(event.id)
    );

    return (
      <div className="mt-6 space-y-4">
        <h4 className="font-semibold text-gray-800 flex items-center">
          <LinkIcon className="w-5 h-5 mr-2 text-blue-600" />
          Bağlantılı Olaylar ({connectedEvents.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {connectedEvents.map(event => (
            <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedEvent(event)}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{event.icon}</span>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">{event.title}</h5>
                    <p className="text-sm text-gray-600">{event.date}</p>
                    <Badge className={`mt-2 text-xs ${getCategoryColor(event.category)}`}>
                      {getCategoryIcon(event.category)} {event.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MapIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {character.name} - Tarihi Olay Bağlantı Haritası
              </h2>
              <p className="text-gray-600">
                {events.length} tarihi olay • Bağlantıları keşfedin
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
              onClick={() => setFilterCategory('all')}
              variant={filterCategory === 'all' ? 'default' : 'outline'}
              size="sm"
            >
              Tümü ({events.length})
            </Button>
            {['war', 'politics', 'culture', 'economy', 'science', 'religion'].map(category => {
              const count = events.filter(e => e.category === category).length;
              if (count === 0) return null;
              return (
                <Button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  variant={filterCategory === category ? 'default' : 'outline'}
                  size="sm"
                  className="capitalize"
                >
                  {getCategoryIcon(category)} {category} ({count})
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Events List */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tarihi Olaylar ({filteredEvents.length})
              </h3>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <Card 
                    key={event.id} 
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedEvent?.id === event.id 
                        ? 'ring-2 ring-blue-500 shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <span className="text-3xl">{event.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-800 text-lg">
                                {event.title}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <ClockIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 font-medium">{event.date}</span>
                                {event.location && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-600">{event.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Badge className={getCategoryColor(event.category)}>
                              {getCategoryIcon(event.category)} {event.category}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                            {event.description}
                          </p>
                          {event.participants && event.participants.length > 0 && (
                            <div className="flex items-center space-x-1 mt-2">
                              <UsersIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                Katılımcılar: {event.participants.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Event Details */}
            <div className="lg:col-span-1">
              {selectedEvent ? (
                <div className="sticky top-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <span className="text-4xl">{selectedEvent.icon}</span>
                        <div>
                          <CardTitle className="text-xl">{selectedEvent.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <ClockIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{selectedEvent.date}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={`w-fit ${getCategoryColor(selectedEvent.category)}`}>
                        {getCategoryIcon(selectedEvent.category)} {selectedEvent.category}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Açıklama</h5>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {selectedEvent.description}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Önemi</h5>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {selectedEvent.significance}
                        </p>
                      </div>

                      {selectedEvent.location && (
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Konum</h5>
                          <p className="text-gray-600 text-sm">{selectedEvent.location}</p>
                        </div>
                      )}

                      {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Katılımcılar</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedEvent.participants.map((participant, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {participant}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {renderEventConnections()}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="sticky top-6">
                  <CardContent className="p-6 text-center">
                    <EyeIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                      Olay Seçin
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Detaylarını görmek için sol taraftan bir olay seçin
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventConnectionMap;
