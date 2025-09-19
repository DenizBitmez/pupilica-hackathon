import React from 'react';
import { HistoricalFigure } from '../types/historical';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  significance: string;
  icon: string;
}

interface HistoricalTimelineProps {
  character: HistoricalFigure;
  isVisible: boolean;
  onClose: () => void;
}

const HistoricalTimeline: React.FC<HistoricalTimelineProps> = ({ 
  character, 
  isVisible, 
  onClose 
}) => {
  const getTimelineEvents = (figure: HistoricalFigure): TimelineEvent[] => {
    const events: { [key: string]: TimelineEvent[] } = {
      fatih_sultan_mehmet: [
        {
          id: 'birth',
          title: 'Doğum',
          date: '30 Mart 1432',
          description: 'Fatih Sultan Mehmet, II. Murad ve Hüma Hatun\'un oğlu olarak Edirne\'de doğdu. Çocukluğundan itibaren özel eğitim aldı ve Arapça, Farsça, Latince öğrendi.',
          significance: 'Büyük fatihin dünyaya gelişi - Gelecekte dünya tarihini değiştirecek liderin doğumu',
          icon: '👶'
        },
        {
          id: 'education',
          title: 'Eğitim Dönemi',
          date: '1438-1444',
          description: 'Özel hocalardan ders aldı. Akşemseddin, Molla Gürani gibi alimlerden eğitim gördü. Matematik, astronomi, felsefe ve askeri strateji öğrendi.',
          significance: 'Çok yönlü eğitim alması, gelecekteki başarılarının temelini oluşturdu',
          icon: '📚'
        },
        {
          id: 'first_reign',
          title: 'İlk Saltanat',
          date: '1444-1446',
          description: '12 yaşında ilk kez padişah oldu. Varna Savaşı sırasında babası II. Murad\'ın yardımına ihtiyaç duyuldu ve tahttan indirildi.',
          significance: 'İlk yönetim deneyimi - Genç yaşta sorumluluk alma',
          icon: '👑'
        },
        {
          id: 'second_reign',
          title: 'İkinci Saltanat Başlangıcı',
          date: '3 Şubat 1451',
          description: 'Babası II. Murad\'ın ölümü üzerine 19 yaşında tekrar tahta çıktı. İlk iş olarak Konstantinopolis fethi için hazırlıklara başladı.',
          significance: 'Asıl saltanatının başlangıcı - Büyük hedefler için hazırlık dönemi',
          icon: '⚔️'
        },
        {
          id: 'cannon_construction',
          title: 'Şahi Topunun Dökümü',
          date: '1452',
          description: 'Macar topçu ustası Urban\'ı getirterek dünyanın en büyük topunu döktürdü. Bu top, İstanbul kuşatmasında kritik rol oynayacaktı.',
          significance: 'Teknolojik üstünlük - Askeri teknolojide devrim',
          icon: '⚔️'
        },
        {
          id: 'constantinople_conquest',
          title: 'İstanbul Fethi',
          date: '29 Mayıs 1453',
          description: '53 gün süren kuşatma sonunda Konstantinopolis\'i fethetti. 80.000 askerle 7.000 Bizans askerine karşı zafer kazandı.',
          significance: 'Orta Çağ\'ın sonu, Yeni Çağ\'ın başlangıcı - Dünya tarihinin dönüm noktası',
          icon: '🏰'
        },
        {
          id: 'topkapi_palace',
          title: 'Topkapı Sarayı İnşaatı',
          date: '1460-1478',
          description: 'İstanbul\'da yeni bir saray kompleksi inşa ettirdi. Topkapı Sarayı, Osmanlı İmparatorluğu\'nun yönetim merkezi oldu.',
          significance: 'Mimari miras - Osmanlı yönetim sisteminin merkezi',
          icon: '🏛️'
        },
        {
          id: 'kanunname',
          title: 'Kanunname-i Âl-i Osman',
          date: '1477',
          description: 'Osmanlı hukuk sistemini düzenleyen ilk kanunnameyi hazırlattı. Bu kanunname, devletin yönetim esaslarını belirledi.',
          significance: 'Hukuki reform - Modern devlet yönetiminin temelleri',
          icon: '📜'
        },
        {
          id: 'death',
          title: 'Vefat',
          date: '3 Mayıs 1481',
          description: '49 yaşında Gebze\'de vefat etti. Ölümü, Avrupa\'da büyük sevinç yarattı çünkü daha fazla fetih planları vardı.',
          significance: 'Büyük fatihin sonu - Tarihe damga vuran liderin vedası',
          icon: '🕊️'
        }
      ],
      ataturk: [
        {
          id: 'birth',
          title: 'Doğum',
          date: '1881',
          description: 'Mustafa Kemal Atatürk, Ali Rıza Efendi ve Zübeyde Hanım\'ın oğlu olarak Selanik\'te doğdu. Çocukluğunda "Kemal" adını aldı.',
          significance: 'Türkiye Cumhuriyeti\'nin kurucusunun doğumu - Gelecekte Türk milletini kurtaracak liderin dünyaya gelişi',
          icon: '👶'
        },
        {
          id: 'military_academy',
          title: 'Harbiye Mektebi',
          date: '1899-1902',
          description: 'İstanbul Harbiye Mektebi\'nde askeri eğitim aldı. Matematik, geometri ve askeri strateji konularında üstün başarı gösterdi.',
          significance: 'Askeri kariyerinin başlangıcı - Gelecekteki askeri dehasının temelleri',
          icon: '🎖️'
        },
        {
          id: 'tripoli_war',
          title: 'Trablusgarp Savaşı',
          date: '1911-1912',
          description: 'Libya\'da İtalyanlara karşı savaştı. Derne ve Tobruk\'ta başarılı operasyonlar yönetti.',
          significance: 'İlk askeri başarıları - Özgün savaş taktikleri geliştirdi',
          icon: '⚔️'
        },
        {
          id: 'gallipoli',
          title: 'Çanakkale Savaşı',
          date: '1915',
          description: 'Çanakkale Cephesi\'nde Anafartalar Grup Komutanı olarak görev yaptı. "Anafartalar Kahramanı" unvanını aldı.',
          significance: 'Milli kahraman olma - Türk milletinin güvenini kazandı',
          icon: '🏴'
        },
        {
          id: 'samsun_landing',
          title: 'Samsun\'a Çıkış',
          date: '19 Mayıs 1919',
          description: 'Bandırma Vapuru ile Samsun\'a çıktı. Amasya Genelgesi ile ulusal mücadeleyi resmen başlattı.',
          significance: 'Milli Mücadele\'nin başlangıcı - Kurtuluş Savaşı\'nın fitilini ateşledi',
          icon: '🚢'
        },
        {
          id: 'sakarya_battle',
          title: 'Sakarya Meydan Muharebesi',
          date: '23 Ağustos - 13 Eylül 1921',
          description: '22 gün süren savaşta Yunan ordusunu yenerek "Gazi" unvanını aldı. "Hattı müdafaa yoktur, sathı müdafaa vardır" dedi.',
          significance: 'Kurtuluş Savaşı\'nın dönüm noktası - Mareşal rütbesi aldı',
          icon: '⚔️'
        },
        {
          id: 'republic_founding',
          title: 'Cumhuriyet İlanı',
          date: '29 Ekim 1923',
          description: 'TBMM\'de cumhuriyet ilan edildi ve ilk cumhurbaşkanı seçildi. Ankara başkent oldu.',
          significance: 'Modern Türkiye\'nin kuruluşu - Monarşiden demokrasiye geçiş',
          icon: '🏛️'
        },
        {
          id: 'alphabet_reform',
          title: 'Harf Devrimi',
          date: '1928',
          description: 'Arap harflerinden Latin harflerine geçişi sağladı. Yeni Türk alfabesi 29 harften oluşuyordu.',
          significance: 'Eğitim devrimi - Okuma yazma oranını artırdı',
          icon: '📝'
        },
        {
          id: 'women_rights',
          title: 'Kadın Hakları',
          date: '1934',
          description: 'Kadınlara seçme ve seçilme hakkını verdi. Türkiye\'yi kadın hakları konusunda dünyada öncü yaptı.',
          significance: 'Toplumsal devrim - Kadın haklarında dünya lideri',
          icon: '👩'
        },
        {
          id: 'death',
          title: 'Vefat',
          date: '10 Kasım 1938',
          description: '57 yaşında Dolmabahçe Sarayı\'nda vefat etti. Tüm dünya Türk milletiyle birlikte yas tuttu.',
          significance: 'Büyük liderin sonu - Ebedi istirahatgahı Anıtkabir',
          icon: '🕊️'
        }
      ],
      napoleon: [
        {
          id: 'birth',
          title: 'Doğum',
          date: '15 Ağustos 1769',
          description: 'Napolyon Bonaparte, Carlo Bonaparte ve Letizia Ramolino\'nun oğlu olarak Korsika\'nın Ajaccio şehrinde doğdu.',
          significance: 'Büyük imparatorun doğumu - Gelecekte Avrupa\'yı fethedecek liderin dünyaya gelişi',
          icon: '👶'
        },
        {
          id: 'military_school',
          title: 'Askeri Eğitim',
          date: '1779-1785',
          description: 'Fransa\'da askeri okullarda eğitim aldı. Brienne ve École Militaire\'de matematik ve askeri strateji öğrendi.',
          significance: 'Askeri kariyerinin temelleri - Gelecekteki askeri dehasının eğitimi',
          icon: '🎖️'
        },
        {
          id: 'italy_campaign',
          title: 'İtalya Seferi',
          date: '1796-1797',
          description: '27 yaşında İtalya ordusunun komutanı oldu. Hızlı hareket ve cesur taktiklerle Avusturya ordularını yendi.',
          significance: 'Askeri dehasının ortaya çıkışı - İlk büyük zaferleri',
          icon: '⚔️'
        },
        {
          id: 'egypt_campaign',
          title: 'Mısır Seferi',
          date: '1798-1799',
          description: 'Mısır\'a sefer düzenledi. Rosetta Taşı\'nın keşfi ve Mısır\'ın antik tarihinin araştırılması bu sefer sırasında gerçekleşti.',
          significance: 'Bilimsel keşifler - Arkeolojik bulgular',
          icon: '🏺'
        },
        {
          id: 'first_consul',
          title: 'Birinci Konsül',
          date: '1799',
          description: '18 Brumaire darbesi ile Fransa\'nın yönetimini ele aldı. Birinci Konsül olarak ülkeyi yönetmeye başladı.',
          significance: 'Siyasi gücün ele geçirilmesi - Diktatörlük döneminin başlangıcı',
          icon: '👑'
        },
        {
          id: 'napoleonic_code',
          title: 'Napoleon Kanunları',
          date: '1804',
          description: 'Fransız Medeni Kanunu\'nu hazırlattı. Bu kanun dünya hukuk sistemini etkiledi ve günümüze kadar geldi.',
          significance: 'Hukuki reform - Modern hukuk sisteminin temelleri',
          icon: '📋'
        },
        {
          id: 'emperor_coronation',
          title: 'İmparatorluk İlanı',
          date: '2 Aralık 1804',
          description: 'Notre-Dame Katedrali\'nde kendini Fransız İmparatoru ilan etti. Papa VII. Pius tarafından taç giydirildi.',
          significance: 'Fransız İmparatorluğu\'nun kuruluşu - Mutlak güç',
          icon: '👑'
        },
        {
          id: 'austerlitz',
          title: 'Austerlitz Zaferi',
          date: '2 Aralık 1805',
          description: 'Üç İmparator Savaşı\'nda Avusturya ve Rusya ordularını yendi. "Güneşin Savaşı" olarak tarihe geçti.',
          significance: 'Askeri dehasının zirvesi - En büyük zaferi',
          icon: '☀️'
        },
        {
          id: 'russia_campaign',
          title: 'Rusya Seferi',
          date: '1812',
          description: '600.000 kişilik Grande Armée ile Rusya\'ya sefer düzenledi. Moskova\'yı aldı ama kış şartları nedeniyle geri çekilmek zorunda kaldı.',
          significance: 'En büyük hatası - İmparatorluğunun dönüm noktası',
          icon: '❄️'
        },
        {
          id: 'waterloo_defeat',
          title: 'Waterloo Yenilgisi',
          date: '18 Haziran 1815',
          description: '100 Gün\'ün sonunda Wellington ve Blücher\'in ordularına karşı savaştı. Bu yenilgi, imparatorluğunun sonu oldu.',
          significance: 'İmparatorluk döneminin sonu - Son savaş',
          icon: '💔'
        },
        {
          id: 'exile',
          title: 'Sürgün',
          date: '1815-1821',
          description: 'Saint Helena Adası\'na sürgün edildi. Son yıllarını burada geçirdi ve hatıralarını yazdı.',
          significance: 'Son yıllar - Hatıraların yazılması',
          icon: '🏝️'
        },
        {
          id: 'death',
          title: 'Vefat',
          date: '5 Mayıs 1821',
          description: '51 yaşında Saint Helena\'da vefat etti. Ölüm nedeni kesin olarak bilinmemektedir.',
          significance: 'Büyük imparatorun sonu - Efsanenin sonu',
          icon: '🕊️'
        }
      ]
    };

    return events[figure.id] || [];
  };

  const events = getTimelineEvents(character);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              ⏰ {character.name} Zaman Çizelgesi
            </h2>
            <p className="text-gray-600">
              Hayatındaki önemli olayları kronolojik sırayla keşfedin!
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
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          
          <div className="space-y-8">
            {events.map((event, index) => (
              <div key={event.id} className="relative flex items-start space-x-6">
                {/* Timeline Dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                    {event.icon}
                  </div>
                </div>
                
                {/* Event Content */}
                <div className="flex-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      {event.title}
                    </h3>
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      {event.date}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="bg-white/50 rounded-lg p-3 border border-blue-100">
                    <h4 className="font-semibold text-blue-800 mb-1">💡 Önemi:</h4>
                    <p className="text-blue-700 text-sm">
                      {event.significance}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ✅ Tamamla
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoricalTimeline;