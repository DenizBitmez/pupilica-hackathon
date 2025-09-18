import React, { useState, useEffect, useRef } from 'react';
import { HistoricalFigure } from '../types/historical';

interface AnimatedAvatarProps {
  character: HistoricalFigure;
  isSpeaking: boolean;
  isListening: boolean;
  mouthOpen?: number;
  onStartChat: () => void;
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({
  character,
  isSpeaking,
  isListening,
  onStartChat,
  mouthOpen
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<'entrance' | 'idle' | 'speaking' | 'listening'>('entrance');
  const [greetingMessage, setGreetingMessage] = useState('');
  const [introMouthOpen, setIntroMouthOpen] = useState<number | undefined>(undefined);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showEvents, setShowEvents] = useState(false);

  useEffect(() => {
    // Giriş animasyonu
    setIsVisible(true);
    setCurrentAnimation('entrance');
    
    // Karaktere göre kısa tanıtım
    const greetings = {
      'fatih_sultan_mehmet': 'Selam! Ben Fatih Sultan Mehmet. Konstantinopolis\'i fetheden büyük fatih. Hayatımın önemli olaylarını dinlemek ister misiniz?',
      'ataturk': 'Merhaba! Ben Mustafa Kemal Atatürk. Modern Türkiye\'nin kurucusu. Tarihi başarılarımı öğrenmek ister misiniz?',
      'napoleon': 'Bonjour! Ben Napolyon Bonaparte. Avrupa\'nın fatihi. Askeri zaferlerimi ve stratejilerimi dinlemek ister misiniz?'
    } as Record<string, string>;
    
    // Mesajı hemen hazırla ve kısa süre sonra idle'a geç
    setGreetingMessage(greetings[character.id] || 'Merhaba! Benimle sohbet etmek ister misiniz?');
    setTimeout(() => setCurrentAnimation('idle'), 400);

    return () => {
      setIsVisible(false);
      // Her ihtimale karşı TTS iptal
      try { window.speechSynthesis.cancel(); } catch {}
    };
  }, [character]);

  // Tarihi olaylar tanımları
  const historicalEvents = {
    'fatih_sultan_mehmet': [
      {
        id: 'constantinople_conquest',
        title: 'Konstantinopolis Fethi',
        icon: '🏰',
        description: '1453 yılında Konstantinopolis\'i fethederek tarihi değiştirdim. 29 Mayıs günü, dev toplarımın sesiyle başlayan kuşatma 53 gün sürdü. Şehri aldığımda sadece 21 yaşındaydım. Bu fetih, Orta Çağ\'ın sonu ve Yeni Çağ\'ın başlangıcı olarak kabul edilir. Şehri almak için dev toplar döktürdüm, gemileri karadan yürüttüm ve Bizans\'ın son direnişini kırdım. Konstantinopolis\'in düşmesi, Avrupa\'da büyük bir şok yarattı ve Rönesans\'ın başlamasına katkı sağladı.'
      },
      {
        id: 'hagia_sophia_conversion',
        title: 'Ayasofya\'nın Camiiye Çevrilmesi',
        icon: '🕌',
        description: 'Fetihten sonra Ayasofya\'yı camiye çevirdim. Bu, İslam\'ın Konstantinopolis\'teki zaferinin sembolü oldu. Ayasofya, 916 yıl kilise olarak hizmet verdikten sonra camiye dönüştürüldü. Bu dönüşüm sadece dini bir değişim değil, aynı zamanda şehrin yeni kimliğinin simgesi oldu. Ayasofya\'nın mimari güzelliği korundu ve İslami unsurlar eklendi. Bugün hala bu muhteşem yapıyı görebilirsiniz.'
      },
      {
        id: 'topkapi_palace',
        title: 'Topkapı Sarayı\'nın İnşası',
        icon: '🏛️',
        description: 'Topkapı Sarayı\'nı yaptırdım ve burada yaşadım. Bu saray, Osmanlı İmparatorluğu\'nun yönetim merkezi oldu ve dünyanın en güzel saraylarından biri haline geldi. Saray, 400 yıl boyunca Osmanlı padişahlarının evi oldu. Topkapı Sarayı\'nda Harem, Divan-ı Hümayun, Hazine ve diğer önemli bölümler bulunuyordu. Bu saray, Osmanlı\'nın gücünü ve zenginliğini dünyaya gösteren bir simge oldu.'
      },
      {
        id: 'scientific_achievements',
        title: 'Bilim ve Sanat Patronajı',
        icon: '📚',
        description: 'Bilim, sanat ve strateji konularında tutkulu bir liderdim. İstanbul\'u fethettikten sonra şehri yeniden inşa ettim ve bilim insanlarını destekledim. Avrupa\'dan kaçan bilim insanlarını İstanbul\'a davet ettim. Matematik, astronomi, tıp ve diğer bilim dallarında çalışmalar yapılmasını teşvik ettim. İstanbul\'u sadece askeri bir merkez değil, aynı zamanda bilim ve kültür merkezi haline getirdim. Bu dönemde İstanbul, dünyanın en önemli bilim merkezlerinden biri oldu.'
      }
    ],
    'ataturk': [
      {
        id: 'samsun_landing',
        title: 'Samsun\'a Çıkış',
        icon: '🚢',
        description: '19 Mayıs 1919\'da Samsun\'a çıkarak Türk Kurtuluş Savaşı\'nı başlattım. Bu tarih, Türk milletinin yeniden doğuşunun başlangıcı oldu. Bandırma Vapuru ile Samsun\'a çıktığımda, Anadolu\'nun işgal altında olduğunu gördüm. Burada "Ya istiklal, ya ölüm!" parolasıyla mücadeleyi başlattım. Samsun\'a çıkışım, Türk milletinin kurtuluş mücadelesinin ilk adımıydı ve bu tarih, Türkiye\'de Gençlik ve Spor Bayramı olarak kutlanmaktadır.'
      },
      {
        id: 'republic_founding',
        title: 'Cumhuriyet\'in İlanı',
        icon: '🏛️',
        description: '1923\'te Türkiye Cumhuriyeti\'ni kurdum ve ilk cumhurbaşkanı oldum. Bu, Türk milletinin kendi kaderini tayin etme hakkının gerçekleşmesiydi. Cumhuriyet\'in ilanı ile 600 yıllık saltanat sistemi sona erdi ve modern bir devlet yapısı kuruldu. "Egemenlik kayıtsız şartsız milletindir" ilkesiyle, halkın yönetimde söz sahibi olmasını sağladım. Bu devrim, Türkiye\'yi çağdaş medeniyetler seviyesine çıkarma yolunda en önemli adımlardan biri oldu.'
      },
      {
        id: 'alphabet_reform',
        title: 'Harf Devrimi',
        icon: '📝',
        description: '1928\'de harf devrimini gerçekleştirdim. Arap harflerinden Latin harflerine geçiş, okuma yazma oranını artırdı ve modernleşmeyi hızlandırdı. Bu devrim ile Türkçe\'nin ses yapısına uygun yeni bir alfabe oluşturuldu. Harf devrimi, sadece bir yazı değişikliği değil, aynı zamanda kültürel ve sosyal bir dönüşümdü. Bu sayede okuma yazma oranı hızla arttı ve Türk milleti çağdaş dünyayla daha kolay iletişim kurabildi.'
      },
      {
        id: 'women_rights',
        title: 'Kadın Hakları',
        icon: '👩',
        description: 'Kadınlara seçme ve seçilme hakkı verdim. Türk kadını, dünyada bu hakkı elde eden ilk kadınlardan biri oldu. 1934\'te kadınlara milletvekili seçme ve seçilme hakkı tanıdım. Bu hak, birçok Avrupa ülkesinden önce verildi. Kadınların eğitim, çalışma ve sosyal hayatta aktif rol almasını sağladım. "Ey kahraman Türk kadını, sen yerde sürünmeye değil, omuzlar üzerinde göklere yükselmeye layıksın" sözümle kadınların değerini vurguladım.'
      },
      {
        id: 'education_reform',
        title: 'Eğitim Reformları',
        icon: '🎓',
        description: '"Hayatta en hakiki mürşit ilimdir" diyerek bilimi rehber edindim. Eğitim sistemini modernleştirdim ve herkese eğitim hakkı sağladım. Medreseleri kapatarak modern okullar açtım. Eğitimi laikleştirdim ve bilimsel temellere dayandırdım. Köy Enstitüleri\'ni kurarak köylü çocuklarının eğitim almasını sağladım. Bu reformlar sayesinde Türkiye, eğitim alanında büyük ilerlemeler kaydetti ve okuma yazma oranı hızla arttı.'
      }
    ],
    'napoleon': [
      {
        id: 'emperor_coronation',
        title: 'İmparatorluk İlanı',
        icon: '👑',
        description: '1804\'te kendimi Fransız İmparatoru ilan ettim. Notre Dame Katedrali\'nde yapılan törenle tarihe geçtim. Bu törende, Papa\'nın elinden tacı alarak kendi başıma taktım. Bu hareket, "İmparatorluğu kendi gücümle kazandım" mesajını veriyordu. İmparatorluk ilanım, Fransız Devrimi\'nin sona erdiğini ve yeni bir dönemin başladığını simgeliyordu. Bu unvanla, Avrupa\'nın en güçlü hükümdarı oldum.'
      },
      {
        id: 'austerlitz_battle',
        title: 'Austerlitz Savaşı',
        icon: '⚔️',
        description: '1805\'te Austerlitz\'de Avusturya ve Rusya\'ya karşı büyük zafer kazandım. Bu savaş, askeri dehamın en güzel örneklerinden biridir. "Üç İmparator Savaşı" olarak da bilinen bu savaşta, sayıca üstün düşman ordusunu yenmeyi başardım. Austerlitz Zaferi, askeri strateji ve taktik açısından tarihin en parlak örneklerinden biridir. Bu zaferle, Avrupa\'daki güç dengesini tamamen değiştirdim.'
      },
      {
        id: 'jena_friedland',
        title: 'Jena ve Friedland Zaferleri',
        icon: '🏆',
        description: '1806-1807\'de Jena ve Friedland savaşlarında Prusya ve Rusya\'ya karşı zaferler kazandım. Avrupa\'nın büyük bölümünü fethettim. Jena\'da Prusya ordusunu tamamen yok ettim ve Berlin\'e girdim. Friedland\'da ise Rus ordusunu yenerek Tilsit Antlaşması\'nı imzaladım. Bu zaferlerle, Avrupa\'da Napolyon düzenini kurmuş oldum. Kıta Ablukası\'nı başlatarak İngiltere\'yi ekonomik olarak zayıflatmaya çalıştım.'
      },
      {
        id: 'waterloo_defeat',
        title: 'Waterloo Yenilgisi',
        icon: '💔',
        description: '1815\'te Waterloo\'da son yenilgimi aldım. Bu savaş, imparatorluğumun sonu oldu ama askeri deham tarihe geçti. Elba Adası\'ndan kaçtıktan sonra "100 Gün" döneminde tekrar iktidara geldim. Waterloo\'da İngiliz ve Prusya ordularına karşı savaştım. Bu savaş, askeri kariyerimin sonu oldu ama stratejik düşüncem ve liderlik yeteneklerim hala dünyada takdir edilmektedir. "İmkansız kelimesi Fransızca\'da yoktur" sözümle tarihe geçtim.'
      },
      {
        id: 'napoleonic_code',
        title: 'Napolyon Kanunları',
        icon: '📜',
        description: 'Napolyon Kanunları\'nı hazırlattım. Bu kanunlar, modern hukuk sisteminin temelini oluşturdu ve dünyada yaygınlaştı. 1804\'te yürürlüğe giren bu kanunlar, eşitlik, özgürlük ve mülkiyet haklarını güvence altına aldı. Napolyon Kanunları, sadece Fransa\'da değil, fethettiğim ülkelerde de uygulandı. Bu kanunlar, modern hukuk sisteminin temelini oluşturdu ve bugün hala birçok ülkede etkisini sürdürmektedir. Hukuki reformlarım, askeri zaferlerim kadar önemlidir.'
      }
    ]
  } as Record<string, Array<{id: string, title: string, icon: string, description: string}>>;

  const speakEvent = (eventId: string) => {
    const events = historicalEvents[character.id] || [];
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const message = `${event.title}: ${event.description}`;
    
    console.log('Tarihi olay anlatılıyor:', message);
    
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utter = new SpeechSynthesisUtterance(message);
        utter.lang = 'tr-TR';
        
        try {
          const stored = localStorage.getItem('tts_settings');
          if (stored) {
            const s = JSON.parse(stored);
            utter.rate = s.rate ?? 1;
            utter.pitch = s.pitch ?? 1;
            utter.volume = s.volume ?? 1;
            
            if (s.voice) {
              const vs = window.speechSynthesis.getVoices();
              const found = vs.find(v => v.name === s.voice);
              if (found) utter.voice = found;
            }
          }
        } catch (e) {
          console.log('TTS ayarları yüklenemedi:', e);
        }
        
        utter.onstart = () => {
          console.log('Tarihi olay anlatımı başladı');
          setIntroMouthOpen(8);
          setCurrentAnimation('speaking');
          setSelectedEvent(eventId);
        };
        
        utter.onboundary = () => {
          const v = 6 + Math.floor(Math.random() * 10);
          setIntroMouthOpen(v);
        };
        
        utter.onend = () => {
          console.log('Tarihi olay anlatımı bitti');
          setIntroMouthOpen(undefined);
          setCurrentAnimation('idle');
          setSelectedEvent(null);
        };
        
        utter.onerror = (event) => {
          console.error('TTS hatası:', event.error);
          setCurrentAnimation('idle');
          setSelectedEvent(null);
        };
        
        utterRef.current = utter;
        window.speechSynthesis.speak(utter);
        
      } else {
        console.log('Web Speech API desteklenmiyor');
      }
    } catch (error) {
      console.error('Tarihi olay anlatım hatası:', error);
    }
  };

  const speakGreeting = () => {
    if (!greetingMessage) return;
    
    console.log('Konuşma başlatılıyor:', greetingMessage);
    
    try {
      if ('speechSynthesis' in window) {
        // Önceki konuşmaları iptal et
        window.speechSynthesis.cancel();
        
        const utter = new SpeechSynthesisUtterance(greetingMessage);
        utter.lang = 'tr-TR';
        
        // Ses ayarlarını uygula
        try {
          const stored = localStorage.getItem('tts_settings');
          if (stored) {
            const s = JSON.parse(stored);
            utter.rate = s.rate ?? 1;
            utter.pitch = s.pitch ?? 1;
            utter.volume = s.volume ?? 1;
            console.log('TTS ayarları uygulandı:', s);
            
            if (s.voice) {
              const vs = window.speechSynthesis.getVoices();
              const found = vs.find(v => v.name === s.voice);
              if (found) {
                utter.voice = found;
                console.log('Ses seçildi:', found.name);
              }
            }
          }
        } catch (e) {
          console.log('TTS ayarları yüklenemedi:', e);
        }
        
        // Event handlers
        utter.onstart = () => {
          console.log('Konuşma başladı');
          setIntroMouthOpen(8);
          setCurrentAnimation('speaking');
          setCtaVisible(false);
        };
        
        utter.onboundary = () => {
          const v = 6 + Math.floor(Math.random() * 10);
          setIntroMouthOpen(v);
        };
        
        utter.onend = () => {
          console.log('Konuşma bitti');
          setIntroMouthOpen(undefined);
          setCurrentAnimation('idle');
        };
        
        utter.onerror = (event) => {
          console.error('TTS hatası:', event.error);
          setCurrentAnimation('idle');
          setCtaVisible(true);
        };
        
        utterRef.current = utter;
        
        // Konuşmayı başlat
        window.speechSynthesis.speak(utter);
        
        // Konuşma başlamadıysa CTA göster
        setTimeout(() => {
          if (!window.speechSynthesis.speaking) {
            console.log('Konuşma başlamadı, CTA gösteriliyor');
            setCtaVisible(true);
          }
        }, 1000);
        
      } else {
        console.log('Web Speech API desteklenmiyor');
        setCtaVisible(true);
      }
    } catch (error) {
      console.error('Konuşma hatası:', error);
      setCtaVisible(true);
    }
  };

  // Greeting otomatik Web Speech TTS ve basit lip-sync
  useEffect(() => {
    if (!greetingMessage) return;
    
    console.log('Greeting mesajı hazır:', greetingMessage);
    
    // Otomatik başlatmayı dene; eğer tarayıcı engellerse CTA gösterilir
    try {
      if ('speechSynthesis' in window) {
        // Seslerin yüklenmesini bekle
        const checkVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            console.log('Sesler yüklendi:', voices.length);
            // Kısa gecikme ile konuşmayı başlat
            setTimeout(() => {
              speakGreeting();
            }, 500);
          } else {
            // Sesler henüz yüklenmediyse tekrar dene
            setTimeout(checkVoices, 100);
          }
        };
        
        // Seslerin yüklenmesini bekle
        if (window.speechSynthesis.getVoices().length > 0) {
          setTimeout(() => {
            speakGreeting();
          }, 500);
        } else {
          window.speechSynthesis.addEventListener('voiceschanged', () => {
            setTimeout(() => {
              speakGreeting();
            }, 500);
          });
        }
        
      } else {
        console.log('Web Speech API desteklenmiyor');
        setCtaVisible(true);
      }
    } catch (error) {
      console.error('Otomatik konuşma hatası:', error);
      setCtaVisible(true);
    }
  }, [greetingMessage]);

  useEffect(() => {
    if (isSpeaking) {
      setCurrentAnimation('speaking');
    } else if (isListening) {
      setCurrentAnimation('listening');
    } else {
      setCurrentAnimation('idle');
    }
  }, [isSpeaking, isListening]);

  const getAvatarSize = () => {
    switch (currentAnimation) {
      case 'entrance':
        return 'w-64 h-64';
      case 'speaking':
        return 'w-72 h-72';
      case 'listening':
        return 'w-68 h-68';
      default:
        return 'w-64 h-64';
    }
  };

  const getAvatarAnimation = () => {
    switch (currentAnimation) {
      case 'entrance':
        return 'animate-bounce scale-110';
      case 'speaking':
        return 'animate-pulse scale-105 shadow-3xl';
      case 'listening':
        return 'animate-bounce scale-102';
      default:
        return 'hover:scale-105';
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900 flex items-center justify-center z-50">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      
      <div className={`bg-gradient-to-br from-white via-amber-50 to-orange-50 rounded-3xl shadow-2xl p-8 max-w-4xl w-full mx-4 transform transition-all duration-700 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      }`}>
        {/* Avatar Container */}
        <div className="text-center mb-8 relative">
          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute top-20 right-16 w-1.5 h-1.5 bg-orange-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-20 left-16 w-1 h-1 bg-amber-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-10 right-10 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
          </div>
          
          <div onClick={speakGreeting} className={`${getAvatarSize()} mx-auto shadow-2xl transition-all duration-500 ${getAvatarAnimation()} cursor-pointer relative`}>
            {/* Historical Character Portrait */}
            <div className="relative w-full h-full">
              {/* Historical Background Scene */}
              <div className="absolute inset-0 overflow-hidden" style={{
                background: `linear-gradient(135deg, ${
                  character.id === 'fatih_sultan_mehmet' ? 
                    '#8B4513 0%, #D2691E 30%, #CD853F 70%, #F4A460 100%' :
                  character.id === 'ataturk' ? 
                    '#2F4F4F 0%, #4682B4 30%, #87CEEB 70%, #F0F8FF 100%' :
                    '#191970 0%, #4169E1 30%, #87CEEB 70%, #F0F8FF 100%'
                })`,
                borderRadius: '20px'
              }}>
                {/* Historical Elements */}
                <div className="absolute inset-0">
                  {/* Architectural Elements */}
                  {character.id === 'fatih_sultan_mehmet' && (
                    <>
                      {/* Ottoman Architecture */}
                      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-amber-800 to-amber-600 opacity-30"></div>
                      <div className="absolute bottom-4 left-8 w-2 h-8 bg-amber-700 opacity-50"></div>
                      <div className="absolute bottom-4 right-8 w-2 h-8 bg-amber-700 opacity-50"></div>
                      <div className="absolute bottom-8 left-1/2 w-12 h-2 bg-amber-700 opacity-50 transform -translate-x-1/2"></div>
                    </>
                  )}
                  
                  {character.id === 'ataturk' && (
                    <>
                      {/* Modern Architecture */}
                      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-700 to-gray-500 opacity-30"></div>
                      <div className="absolute bottom-4 left-8 w-3 h-8 bg-gray-600 opacity-50"></div>
                      <div className="absolute bottom-4 right-8 w-3 h-8 bg-gray-600 opacity-50"></div>
                      <div className="absolute bottom-8 left-1/2 w-16 h-2 bg-gray-600 opacity-50 transform -translate-x-1/2"></div>
                    </>
                  )}
                  
                  {character.id === 'napoleon' && (
                    <>
                      {/* European Architecture */}
                      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-700 to-slate-500 opacity-30"></div>
                      <div className="absolute bottom-4 left-8 w-2 h-8 bg-slate-600 opacity-50"></div>
                      <div className="absolute bottom-4 right-8 w-2 h-8 bg-slate-600 opacity-50"></div>
                      <div className="absolute bottom-8 left-1/2 w-14 h-2 bg-slate-600 opacity-50 transform -translate-x-1/2"></div>
                    </>
                  )}
                </div>

                {/* Floating Historical Elements */}
                <div className="absolute inset-0">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute text-2xl opacity-20 animate-float ${
                        character.id === 'fatih_sultan_mehmet' ? 'text-yellow-600' :
                        character.id === 'ataturk' ? 'text-blue-600' : 'text-blue-800'
                      }`}
                      style={{
                        left: `${15 + (i * 15)}%`,
                        top: `${20 + (i * 10)}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: '3s'
                      }}
                    >
                      {character.id === 'fatih_sultan_mehmet' ? '🏰' :
                       character.id === 'ataturk' ? '🏛️' : '⚔️'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Character Portrait */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative">
                  {/* Character Head */}
                  <div className={`relative w-32 h-40 transition-all duration-500 ${
                    currentAnimation === 'speaking' ? 'scale-105 animate-pulse' : 
                    currentAnimation === 'listening' ? 'scale-102 animate-pulse' : 'hover:scale-102'
                  }`} style={{
                    background: `radial-gradient(ellipse at center, #F4A460 0%, #DEB887 50%, #CD853F 100%)`,
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    boxShadow: '0 0 40px rgba(0,0,0,0.4), inset 0 0 30px rgba(255,255,255,0.1)',
                    transform: 'perspective(1000px) rotateX(5deg) rotateY(-2deg)'
                  }}>
                    
                    {/* Eyes */}
                    <div className="absolute top-12 left-8 w-6 h-6 bg-black rounded-full">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full animate-pulse"></div>
                      <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full"></div>
                      <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
                      {currentAnimation === 'speaking' && (
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-2 border-green-400 rounded-full animate-ping opacity-40"></div>
                      )}
                    </div>
                    <div className="absolute top-12 right-8 w-6 h-6 bg-black rounded-full">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full animate-pulse"></div>
                      <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full"></div>
                      <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
                      {currentAnimation === 'speaking' && (
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-2 border-green-400 rounded-full animate-ping opacity-40"></div>
                      )}
                    </div>

                    {/* Eyebrows */}
                    <div className={`absolute top-8 left-6 w-8 h-1 bg-black rounded-full transition-all duration-300 ${
                      currentAnimation === 'speaking' ? 'animate-pulse' : ''
                    }`} style={{transform: 'rotate(-10deg)'}}></div>
                    <div className={`absolute top-8 right-6 w-8 h-1 bg-black rounded-full transition-all duration-300 ${
                      currentAnimation === 'speaking' ? 'animate-pulse' : ''
                    }`} style={{transform: 'rotate(10deg)'}}></div>

                    {/* Nose */}
                    <div className="absolute top-20 left-1/2 w-2 h-6 bg-gradient-to-b from-yellow-300 to-orange-300 rounded-full transform -translate-x-1/2 shadow-inner"></div>

                    {/* Mouth */}
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                      {currentAnimation === 'speaking' ? (
                        <div className="relative">
                          <div className="w-8 h-4 bg-black rounded-full animate-pulse shadow-inner">
                            <div className="w-6 h-3 bg-white rounded-full mx-auto mt-0.5"></div>
                            <div className="w-4 h-2 bg-pink-400 rounded-full mx-auto mt-0.5"></div>
                          </div>
                          {/* Speaking Effects */}
                          <div className="absolute -top-3 -left-3 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
                          <div className="absolute -top-3 -right-3 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                        </div>
                      ) : currentAnimation === 'listening' ? (
                        <div className="w-6 h-2 bg-black rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-8 h-1 bg-black rounded-full"></div>
                      )}
                    </div>

                    {/* Character-Specific Features */}
                    {character.id === 'fatih_sultan_mehmet' && (
                      <>
                        {/* Crown */}
                        <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${
                          currentAnimation === 'speaking' ? 'animate-bounce' : ''
                        }`}>
                          <div className="w-16 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-2xl"
                               style={{
                                 clipPath: 'polygon(20% 100%, 0% 0%, 100% 0%, 80% 100%)',
                                 boxShadow: '0 8px 20px rgba(255,215,0,0.8)'
                               }}>
                            <div className="absolute top-1 left-1/2 w-2 h-2 bg-yellow-700 rounded-full transform -translate-x-1/2 animate-pulse"></div>
                            <div className="absolute top-2 left-2 w-1 h-1 bg-yellow-700 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                            <div className="absolute top-2 right-2 w-1 h-1 bg-yellow-700 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                          </div>
                        </div>
                        {/* Beard */}
                        <div className="absolute bottom-4 left-1/2 w-12 h-8 bg-black rounded-full transform -translate-x-1/2 opacity-80 shadow-lg"></div>
                        {/* Mustache */}
                        <div className="absolute bottom-16 left-1/2 w-10 h-2 bg-black rounded-full transform -translate-x-1/2 shadow-lg"></div>
                      </>
                    )}

                    {character.id === 'ataturk' && (
                      <>
                        {/* Hat */}
                        <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 ${
                          currentAnimation === 'speaking' ? 'animate-pulse' : ''
                        }`}>
                          <div className="w-20 h-6 bg-gradient-to-b from-blue-800 to-blue-900 rounded-full shadow-2xl">
                            <div className="absolute top-1 left-1/2 w-1 h-1 bg-yellow-400 rounded-full transform -translate-x-1/2 animate-pulse"></div>
                            <div className="absolute top-2 left-1/2 w-16 h-1 bg-yellow-400 rounded-full transform -translate-x-1/2"></div>
                          </div>
                        </div>
                        {/* Mustache */}
                        <div className="absolute bottom-16 left-1/2 w-10 h-2 bg-black rounded-full transform -translate-x-1/2 shadow-lg"></div>
                      </>
                    )}

                    {character.id === 'napoleon' && (
                      <>
                        {/* Military Hat */}
                        <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${
                          currentAnimation === 'speaking' ? 'animate-pulse' : ''
                        }`}>
                          <div className="w-18 h-5 bg-gradient-to-b from-gray-800 to-black rounded-full shadow-2xl">
                            <div className="absolute top-0.5 left-1/2 w-12 h-1 bg-yellow-400 rounded-full transform -translate-x-1/2"></div>
                            <div className="absolute top-1 left-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2"></div>
                          </div>
                        </div>
                        {/* Military Collar */}
                        <div className="absolute bottom-20 left-1/2 w-16 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform -translate-x-1/2 shadow-lg"></div>
                      </>
                    )}
                  </div>

                  {/* Character Body */}
                  <div className="absolute top-32 left-1/2 w-20 h-24 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform -translate-x-1/2 shadow-2xl"></div>
                </div>
              </div>

              {/* Historical Effects */}
              {currentAnimation === 'speaking' && (
                <>
                  {/* Sound Waves */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-40 h-40 border-4 border-green-400 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute w-32 h-32 border-4 border-blue-400 rounded-full animate-ping opacity-15" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute w-24 h-24 border-4 border-purple-400 rounded-full animate-ping opacity-10" style={{animationDelay: '1s'}}></div>
                  </div>
                  
                  {/* Historical Speaking Elements */}
                  <div className="absolute top-4 left-4 text-3xl animate-bounce opacity-60">
                    {character.id === 'fatih_sultan_mehmet' ? '👑' :
                     character.id === 'ataturk' ? '🏛️' : '⚔️'}
                  </div>
                  <div className="absolute top-4 right-4 text-3xl animate-bounce opacity-60" style={{animationDelay: '0.5s'}}>
                    {character.id === 'fatih_sultan_mehmet' ? '🏰' :
                     character.id === 'ataturk' ? '📜' : '🎖️'}
                  </div>
                  <div className="absolute bottom-4 left-4 text-3xl animate-bounce opacity-60" style={{animationDelay: '1s'}}>
                    {character.id === 'fatih_sultan_mehmet' ? '⚔️' :
                     character.id === 'ataturk' ? '🌟' : '🏆'}
                  </div>
                  <div className="absolute bottom-4 right-4 text-3xl animate-bounce opacity-60" style={{animationDelay: '1.5s'}}>
                    {character.id === 'fatih_sultan_mehmet' ? '📜' :
                     character.id === 'ataturk' ? '⚖️' : '🗺️'}
                  </div>
                </>
              )}

              {currentAnimation === 'listening' && (
                <>
                  {/* Listening Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-200/10 to-purple-200/10 animate-pulse" style={{borderRadius: '20px'}}></div>
                  <div className="absolute top-4 right-4 w-4 h-4 bg-blue-500 rounded-full animate-bounce opacity-60"></div>
                  <div className="absolute top-8 right-8 text-2xl animate-bounce opacity-60">👂</div>
                </>
              )}

              {/* Idle Historical Effects */}
              {currentAnimation === 'idle' && (
                <>
                  <div className="absolute top-2 left-2 text-2xl animate-pulse opacity-40">
                    {character.id === 'fatih_sultan_mehmet' ? '👑' :
                     character.id === 'ataturk' ? '🏛️' : '⚔️'}
                  </div>
                  <div className="absolute top-2 right-2 text-2xl animate-pulse opacity-40" style={{animationDelay: '1s'}}>
                    {character.id === 'fatih_sultan_mehmet' ? '🏰' :
                     character.id === 'ataturk' ? '📜' : '🎖️'}
                  </div>
                  <div className="absolute bottom-2 left-2 text-2xl animate-pulse opacity-40" style={{animationDelay: '2s'}}>
                    {character.id === 'fatih_sultan_mehmet' ? '⚔️' :
                     character.id === 'ataturk' ? '🌟' : '🏆'}
                  </div>
                  <div className="absolute bottom-2 right-2 text-2xl animate-pulse opacity-40" style={{animationDelay: '3s'}}>
                    {character.id === 'fatih_sultan_mehmet' ? '📜' :
                     character.id === 'ataturk' ? '⚖️' : '🗺️'}
                  </div>
                </>
              )}
            </div>
            
            {/* Enhanced Speaking Visualizer with Mimics */}
            {currentAnimation === 'speaking' && (
              <>
                
                {/* Large Enhanced Speaking Bars - Fotoğrafın altında */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
                  {[...Array(7)].map((_, i) => (
                    <span 
                      key={i}
                      className="w-4 bg-gradient-to-t from-amber-500 to-orange-500 rounded-sm shadow-xl animate-[bounce_0.5s_infinite] border-2 border-white" 
                      style={{ 
                        height: `${20 + Math.random() * 20}px`,
                        animationDelay: `${i * 0.08}s`
                      }}
                    ></span>
                  ))}
                </div>
                
                
                {/* Enhanced Speaking Indicator */}
                <div className="absolute bottom-3 right-3 w-4 h-4 bg-green-400 rounded-full animate-ping shadow-xl border-2 border-white"></div>
                
                {/* Enhanced Speech Bubble Effect */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full px-6 py-3 shadow-xl animate-bounce border-2 border-white">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <div className="text-xs text-gray-600 font-medium mt-1">Konuşuyor</div>
                </div>
              </>
            )}
            
            {/* Listening State */}
            {isListening && (
              <>
                <div className="absolute inset-0 bg-blue-200/20 animate-pulse rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin shadow-lg"></div>
                </div>
                <div className="absolute bottom-2 right-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
              </>
            )}
          </div>
          
          {/* Enhanced CTA if autoplay blocked */}
          {ctaVisible && (
            <div className="mt-6 p-6 bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl border-4 border-red-300 shadow-2xl animate-pulse">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-800 mb-3 flex items-center justify-center">
                  <span className="mr-2">🔊</span>
                  Ses Çalma İzni Gerekli
                  <span className="ml-2">🔊</span>
                </div>
                <p className="text-base text-red-700 mb-4 font-medium">Karakterin hikayesini dinlemek için aşağıdaki butona tıklayın</p>
                <button 
                  onClick={speakGreeting} 
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-bold text-xl shadow-2xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-110 border-4 border-red-400 animate-bounce"
                >
                  🎵 Anlatmaya Başla
                </button>
                <div className="mt-3 text-sm text-red-600">
                  💡 İpucu: Tarayıcınızın ses ayarlarını kontrol edin
                </div>
              </div>
            </div>
          )}
          
          {/* Sparkle Effects */}
          <div className="absolute top-8 left-8 text-yellow-300 text-3xl animate-spin">
            ✨
          </div>
          <div className="absolute top-8 right-8 text-blue-300 text-2xl animate-bounce">
            ⭐
          </div>
          <div className="absolute bottom-8 left-8 text-purple-300 text-2xl animate-pulse">
            💫
          </div>
          <div className="absolute bottom-8 right-8 text-green-300 text-3xl animate-spin">
            🌟
          </div>
        </div>


        {/* Character Info */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-historical font-bold text-gray-800 mb-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {character.name}
          </h2>
          <div className="space-y-2 mb-4">
            <p className="text-xl text-gray-600 font-medium">{character.era}</p>
            <p className="text-lg text-gray-500">{character.location}</p>
          </div>
          
          {/* Enhanced Status Indicator */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className={`w-4 h-4 rounded-full shadow-lg ${
              currentAnimation === 'speaking' ? 'bg-green-500 animate-ping' :
              currentAnimation === 'listening' ? 'bg-blue-500 animate-bounce' :
              currentAnimation === 'entrance' ? 'bg-yellow-500 animate-pulse' :
              'bg-gray-400'
            }`}></div>
            <span className={`text-lg font-medium ${
              currentAnimation === 'speaking' ? 'text-green-600' :
              currentAnimation === 'listening' ? 'text-blue-600' :
              currentAnimation === 'entrance' ? 'text-yellow-600' :
              'text-gray-600'
            }`}>
              {currentAnimation === 'speaking' ? 'Konuşuyor...' :
               currentAnimation === 'listening' ? 'Dinliyor...' :
               currentAnimation === 'entrance' ? 'Geliyor...' :
               'Hazır'}
            </span>
          </div>
        </div>

        {/* Enhanced Greeting Message */}
        {greetingMessage && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-6 border-2 border-amber-200 shadow-lg">
            <div className="text-center">
              <h4 className="text-xl font-bold text-amber-800 mb-4 flex items-center justify-center">
                <span className="mr-2">📖</span>
                Tarihi Hikayem
                <span className="ml-2">📖</span>
              </h4>
              <p className="text-gray-700 leading-relaxed text-base font-medium">
                {greetingMessage}
              </p>
            </div>
          </div>
        )}

        {/* Tarihi Olaylar Butonları */}
        <div className="mb-6">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <span className="mr-2">📚</span>
              Tarihi Olaylarım
              <span className="ml-2">📚</span>
            </h3>
            <p className="text-gray-600 text-sm">Aşağıdaki butonlara tıklayarak önemli olaylarımı detaylı olarak dinleyebilirsiniz</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {historicalEvents[character.id]?.map((event) => (
              <button
                key={event.id}
                onClick={() => speakEvent(event.id)}
                className={`p-4 rounded-xl font-medium text-left transition-all duration-300 transform hover:scale-105 shadow-lg border-2 ${
                  selectedEvent === event.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 animate-pulse'
                    : 'bg-gradient-to-r from-amber-50 to-orange-50 text-gray-700 border-amber-200 hover:from-amber-100 hover:to-orange-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{event.icon}</span>
                  <div>
                    <div className="font-bold text-sm">{event.title}</div>
                    <div className="text-xs opacity-80 mt-1 line-clamp-2">
                      {event.description.substring(0, 80)}...
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onStartChat}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-xl border-2 border-amber-400"
          >
            💬 Sohbet Etmeye Başla
          </button>
          
          <button
            onClick={speakGreeting}
            className="px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl border-2 border-green-400"
          >
            🔊 Hikayeyi Dinle
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-xl border-2 border-gray-300"
          >
            🔄 Yeniden Seç
          </button>
        </div>

        {/* Personality Preview */}
        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Kişilik Özellikleri:</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {character.personality}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnimatedAvatar;
