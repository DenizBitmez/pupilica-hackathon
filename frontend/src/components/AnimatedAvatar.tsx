import React, { useState, useEffect, useRef } from 'react';
import { HistoricalFigure } from '../types/historical';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, MessageCircle, Brain, Clock, MapPin } from 'lucide-react';
import ataturkAvatar from '@/assets/ataturk-avatar.jpg';
import mehmetAvatar from '@/assets/mehmet-avatar.jpg';
import napoleonAvatar from '@/assets/napoleon-avatar.jpg';
import InteractiveNotes from './InteractiveNotes';
import EventConnectionMap from './EventConnectionMap';
import ComparativeAnalysis from './ComparativeAnalysis';
import LearningProgress from './LearningProgress';
import GamificationSystem from './GamificationSystem';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';
import { useAuth } from '../contexts/AuthContext';

interface AnimatedAvatarProps {
  character: HistoricalFigure;
  isSpeaking: boolean;
  isListening: boolean;
  mouthOpen?: number;
  onStartChat: () => void;
  onStartQuiz?: () => void;
  onStartTimeline?: () => void;
  onStartMap?: () => void;
  onBack?: () => void;
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({
  character,
  isSpeaking,
  isListening,
  onStartChat,
  onStartQuiz,
  onStartTimeline,
  onStartMap,
  onBack,
  mouthOpen
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<'entrance' | 'idle' | 'speaking' | 'listening'>('entrance');
  const [greetingMessage, setGreetingMessage] = useState('');
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [historicalEvents, setHistoricalEvents] = useState<any[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showLearningTips, setShowLearningTips] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [showEventMap, setShowEventMap] = useState(false);
  const [showComparativeAnalysis, setShowComparativeAnalysis] = useState(false);
  const [showLearningProgress, setShowLearningProgress] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    console.log('AnimatedAvatar karakter:', character.id, character.name);
    
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

    // Tarihi hikayeleri backend'den çek
    fetchHistoricalEvents();

    return () => {
      setIsVisible(false);
      // Her ihtimale karşı TTS iptal
      try { window.speechSynthesis.cancel(); } catch {}
    };
  }, [character]);

  // Backend'den tarihi hikayeleri çek
  const fetchHistoricalEvents = async () => {
    try {
      console.log('Backend\'den tarihi hikayeler çekiliyor...');
      const response = await fetch('http://localhost:5000/api/figures');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Backend yanıtı:', data);
      
      const characterData = data[character.id];
      console.log('Karakter verisi:', characterData);
      
      // Karaktere göre tarihi hikayeler
      const events = getHistoricalEventsForCharacter(character.id);
      console.log('Tarihi hikayeler:', events);
      setHistoricalEvents(events);
      
    } catch (error) {
      console.error('Tarihi hikayeler yüklenirken hata:', error);
      // Fallback: varsayılan hikayeler
      const events = getHistoricalEventsForCharacter(character.id);
      console.log('Fallback hikayeler:', events);
      setHistoricalEvents(events);
    }
  };

  // Karaktere göre tarihi hikayeler
  const getHistoricalEventsForCharacter = (characterId: string) => {
    const eventsMap: Record<string, any[]> = {
      'fatih_sultan_mehmet': [
        {
          id: 'istanbul_fethi',
          title: 'İstanbul\'un Fethi (1453)',
          description: '29 Mayıs 1453 tarihinde Konstantinopolis\'i fethederek tarihi değiştirdim. 53 gün süren kuşatma sonunda şehri aldım ve Bizans İmparatorluğu\'na son verdim. Bu fetih, Orta Çağ\'ın sonu ve Yeni Çağ\'ın başlangıcı olarak kabul edilir.',
          icon: '🏰',
          date: '29 Mayıs 1453',
          details: 'Kuşatma sırasında şehri karadan ve denizden kuşattım. Şahi toplarıyla surları yıktım ve gemilerimi karadan yürüterek Haliç\'e indirdim. 80.000 askerimle 7.000 Bizans askerine karşı savaştım.',
          sources: ['İbn Kemal, Tevârih-i Âl-i Osman', 'Kritovulos, Tarih-i Sultan Mehmed Han', 'Dukas, Bizans Tarihi'],
          prompt: 'İstanbul\'un fethi hakkında detaylı bilgi ver. Kuşatma stratejilerimi, kullandığım teknolojileri ve bu fethin tarihsel önemini anlat.'
        },
        {
          id: 'top_dökümü',
          title: 'Şahi Toplarının Dökümü',
          description: '1452 yılında Macar topçu ustası Urban\'ın yardımıyla dünyanın en büyük toplarını döktürdüm. Bu toplar, Konstantinopolis\'in surlarını yıkarak fetih için kritik rol oynadı.',
          icon: '⚔️',
          date: '1452',
          details: 'Şahi topu 8 metre uzunluğunda ve 1.2 metre çapındaydı. 680 kg\'lık gülleler atabiliyordu ve sesi 13 km uzaktan duyulabiliyordu. Edirne\'de dökülen bu top, günde 7 gülle atabiliyordu.',
          sources: ['Kritovulos, Tarih-i Sultan Mehmed Han', 'Franz Babinger, Mehmed der Eroberer', 'Steven Runciman, Konstantinopolis Düştü'],
          prompt: 'Şahi toplarının yapım sürecini, teknik özelliklerini ve kuşatmada nasıl kullandığımı detaylı anlat.'
        },
        {
          id: 'gemiler_karadan',
          title: 'Gemilerin Karadan Yürütülmesi',
          description: '21-22 Nisan 1453 gecesi Haliç\'e girişi engelleyen zinciri aşmak için gemilerimi karadan yürüttüm. Bu cesur hamle, kuşatmanın dönüm noktası oldu.',
          icon: '🚢',
          date: '21-22 Nisan 1453',
          details: '70 gemiyi Galata\'dan Haliç\'e kadar karadan yürüttüm. Gemiler yağlanmış kızaklar üzerinde çekildi ve gece boyunca bu işlem tamamlandı. 1.5 km\'lik mesafe, 2.000 kişilik işçi ordusuyla aşıldı.',
          sources: ['Kritovulos, Tarih-i Sultan Mehmed Han', 'Dukas, Bizans Tarihi', 'Laonikos Chalkokondyles, Tarih'],
          prompt: 'Gemileri karadan yürütme operasyonunu nasıl planladım ve gerçekleştirdim? Bu stratejinin kuşatmaya etkisini anlat.'
        },
        {
          id: 'bilim_sanat',
          title: 'Bilim ve Sanat Hamiliği',
          description: 'Fetih sonrası İstanbul\'u bilim ve sanat merkezi haline getirdim. Bizanslı bilim insanlarını korudum ve onları İstanbul\'da çalışmaya teşvik ettim.',
          icon: '📚',
          date: '1453-1481',
          details: 'Ayasofya\'yı camiye çevirdim ama içindeki sanat eserlerini korudum. İstanbul\'a bilim insanları ve sanatçılar getirttim.',
          prompt: 'İstanbul\'u nasıl bir bilim ve sanat merkezi haline getirdim? Hangi bilim insanlarını korudum ve nasıl destekledim?'
        },
        {
          id: 'kanunname',
          title: 'Kanunname-i Âl-i Osman',
          description: 'Osmanlı hukuk sistemini düzenleyen ilk kanunnameyi hazırlattım. Bu kanunname, devletin yönetim esaslarını belirledi.',
          icon: '📜',
          date: '1477',
          details: 'Kanunname, padişahın yetkilerini, devlet memurlarının görevlerini ve ceza hukukunu düzenledi. Bu sistem yüzyıllarca kullanıldı.',
          prompt: 'Kanunname-i Âl-i Osman\'ın içeriğini ve Osmanlı hukuk sistemine katkılarını detaylı anlat.'
        },
        {
          id: 'topkapi_sarayi',
          title: 'Topkapı Sarayı\'nın İnşası',
          description: 'İstanbul\'da yeni bir saray kompleksi inşa ettirdim. Topkapı Sarayı, Osmanlı İmparatorluğu\'nun yönetim merkezi oldu.',
          icon: '🏛️',
          date: '1460-1478',
          details: 'Saray, hem yönetim hem de padişahın özel yaşam alanı olarak tasarlandı. Harem, divan ve hazine bölümlerini içeriyordu.',
          prompt: 'Topkapı Sarayı\'nın mimari özelliklerini, bölümlerini ve Osmanlı yönetimindeki rolünü anlat.'
        }
      ],
      'ataturk': [
        {
          id: 'kurtulus_savasi',
          title: 'Kurtuluş Savaşı\'nın Başlatılması',
          description: '19 Mayıs 1919\'da Samsun\'a çıkarak Türk Kurtuluş Savaşı\'nı başlattım. Bu tarih, Türk milletinin bağımsızlık mücadelesinin başlangıcıdır.',
          icon: '🚢',
          date: '19 Mayıs 1919',
          details: 'Bandırma Vapuru ile Samsun\'a çıktım. Amasya Genelgesi ile ulusal mücadeleyi resmen başlattım ve kongreler düzenledim. Erzurum ve Sivas kongrelerinde ulusal birlik sağlandı.',
          sources: ['Mustafa Kemal Atatürk, Nutuk', 'İsmet İnönü, Hatıralar', 'Lord Kinross, Atatürk: Bir Milletin Yeniden Doğuşu'],
          prompt: 'Kurtuluş Savaşı\'nı nasıl başlattım? Samsun\'a çıkışımın önemi ve sonrasında yaptığım çalışmaları detaylı anlat.'
        },
        {
          id: 'sakarya_savasi',
          title: 'Sakarya Meydan Muharebesi',
          description: '23 Ağustos - 13 Eylül 1921 tarihleri arasında Sakarya\'da Yunan ordusunu yenerek Kurtuluş Savaşı\'nın dönüm noktasını oluşturdum. "Hattı müdafaa yoktur, sathı müdafaa vardır" dedim.',
          icon: '⚔️',
          date: '23 Ağustos - 13 Eylül 1921',
          details: '22 gün süren savaşta 96.000 askerimle 120.000 Yunan askerine karşı zafer kazandım. Bu zaferden sonra "Gazi" unvanını aldım ve Mareşal rütbesi verildim.',
          sources: ['Mustafa Kemal Atatürk, Nutuk', 'İsmet İnönü, Hatıralar', 'Türkiye Büyük Millet Meclisi Tutanakları'],
          prompt: 'Sakarya Meydan Muharebesi\'nin stratejisini, önemini ve sonuçlarını detaylı anlat.'
        },
        {
          id: 'cumhuriyet',
          title: 'Cumhuriyet\'in İlanı',
          description: '29 Ekim 1923\'te Türkiye Cumhuriyeti\'ni ilan ettim ve ilk cumhurbaşkanı oldum. Monarşiden demokrasiye geçişi sağladım.',
          icon: '👑',
          date: '1923',
          details: 'TBMM\'de cumhuriyet ilan edildi. Ankara başkent oldu ve modern Türkiye\'nin temelleri atıldı.',
          prompt: 'Cumhuriyet\'in ilan sürecini, nedenlerini ve Türkiye\'ye getirdiği değişiklikleri anlat.'
        },
        {
          id: 'harf_devrimi',
          title: 'Harf Devrimi',
          description: '1928\'de harf devrimini gerçekleştirdim. Arap harflerinden Latin harflerine geçerek halkın okuma yazma oranını artırdım.',
          icon: '📝',
          date: '1928',
          details: 'Yeni Türk alfabesi 29 harften oluşuyordu. Bu devrim, eğitimde büyük ilerleme sağladı.',
          prompt: 'Harf devriminin nedenlerini, sürecini ve Türk eğitimine etkilerini detaylı anlat.'
        },
        {
          id: 'kadin_haklari',
          title: 'Kadın Hakları',
          description: '1934\'te kadınlara seçme ve seçilme hakkını verdim. Türkiye\'yi kadın hakları konusunda dünyada öncü yaptım.',
          icon: '👩',
          date: '1934',
          details: 'Kadınlar önce belediye seçimlerinde, sonra genel seçimlerde oy kullanma hakkı kazandı.',
          prompt: 'Kadın hakları konusundaki reformlarımı ve bu hakların Türk toplumuna etkilerini anlat.'
        },
        {
          id: 'soyadi_kanunu',
          title: 'Soyadı Kanunu',
          description: '1934\'te Soyadı Kanunu\'nu çıkardım. Her Türk vatandaşının bir soyadı almasını zorunlu kıldım.',
          icon: '📋',
          date: '1934',
          details: 'TBMM tarafından "Atatürk" soyadı bana verildi. Bu kanun, modern kimlik sisteminin temelini oluşturdu.',
          prompt: 'Soyadı Kanunu\'nun önemini ve Türk toplumuna getirdiği değişiklikleri anlat.'
        },
        {
          id: 'dil_devrimi',
          title: 'Dil Devrimi',
          description: 'Türk Dil Kurumu\'nu kurarak dil devrimini başlattım. Türkçeyi yabancı kelimelerden arındırmaya çalıştım.',
          icon: '🗣️',
          date: '1932',
          details: 'Türkçenin köklerini araştırdım ve dilin sadeleştirilmesi için çalışmalar yaptım.',
          prompt: 'Dil devriminin amaçlarını ve Türkçeye katkılarını detaylı anlat.'
        }
      ],
      'napoleon': [
        {
          id: 'austerlitz',
          title: 'Austerlitz Zaferi',
          description: '2 Aralık 1805\'te Austerlitz\'de Avusturya ve Rusya ordularını yenerek askeri dehamı kanıtladım. "Güneşin Savaşı" olarak tarihe geçti.',
          icon: '☀️',
          date: '2 Aralık 1805',
          details: 'Üç İmparator Savaşı\'nda 73.000 askerimle 85.000 kişilik düşman ordusunu yendim. Bu zafer, askeri stratejideki ustalığımı gösterdi. Düşman kayıpları 27.000, bizim kayıplarımız 9.000 idi.',
          sources: ['Napoleon Bonaparte, Mémoires', 'Carl von Clausewitz, On War', 'David Chandler, The Campaigns of Napoleon'],
          prompt: 'Austerlitz Savaşı\'nın stratejisini, taktiklerimi ve bu zaferin askeri tarihteki önemini detaylı anlat.'
        },
        {
          id: 'napoleon_kod',
          title: 'Napoleon Kanunları',
          description: '1804\'te Fransız Medeni Kanunu\'nu hazırlattım. Bu kanun dünya hukuk sistemini etkiledi ve günümüze kadar geldi.',
          icon: '📋',
          date: '1804',
          details: 'Code Napoléon, eşitlik, özgürlük ve mülkiyet haklarını güvence altına aldı. Bu kanun, modern hukuk sisteminin temelini oluşturdu.',
          prompt: 'Napoleon Kanunları\'nın içeriğini, özelliklerini ve dünya hukuk sistemine etkilerini anlat.'
        },
        {
          id: 'italya_seferi',
          title: 'İtalya Seferi',
          description: '1796-1797\'de İtalya\'yı fethettim. Genç yaşta askeri dehamı göstererek Fransa\'da ün kazandım.',
          icon: '🇮🇹',
          date: '1796-1797',
          details: '27 yaşında İtalya ordusunun komutanı oldum. Hızlı hareket ve cesur taktiklerle Avusturya ordularını yendim.',
          prompt: 'İtalya Seferi\'ndeki stratejilerimi, zaferlerimi ve bu seferin kariyerime etkilerini anlat.'
        },
        {
          id: 'mısır_seferi',
          title: 'Mısır Seferi',
          description: '1798\'de Mısır\'a sefer düzenledim. Bu sefer, bilimsel keşifler ve arkeolojik bulgular açısından önemliydi.',
          icon: '🏺',
          date: '1798-1799',
          details: 'Rosetta Taşı\'nın keşfi ve Mısır\'ın antik tarihinin araştırılması bu sefer sırasında gerçekleşti.',
          prompt: 'Mısır Seferi\'nin amaçlarını, bilimsel keşiflerini ve tarihsel önemini anlat.'
        },
        {
          id: 'waterloo',
          title: 'Waterloo Savaşı',
          description: '1815\'te Waterloo\'da son yenilgimi aldım. Bu savaş Avrupa tarihini değiştirdi ve sürgün hayatımın başlangıcı oldu.',
          icon: '⚔️',
          date: '1815',
          details: '100 Gün\'ün sonunda Wellington ve Blücher\'in ordularına karşı savaştım. Bu yenilgi, imparatorluğumun sonu oldu.',
          prompt: 'Waterloo Savaşı\'nın nedenlerini, sürecini ve bu yenilginin sonuçlarını anlat.'
        },
        {
          id: 'elba_surgunu',
          title: 'Elba\'dan Dönüş',
          description: '1814\'te Elba Adası\'na sürgün edildim ama 1815\'te kaçarak Fransa\'ya döndüm. "100 Gün" dönemini başlattım.',
          icon: '🏝️',
          date: '1815',
          details: 'Elba\'dan kaçarak Cannes\'a çıktım ve Paris\'e doğru yürüdüm. Halk beni coşkuyla karşıladı.',
          prompt: 'Elba\'dan kaçışımı ve Fransa\'ya dönüşümü nasıl gerçekleştirdim? Bu dönemin önemini anlat.'
        },
        {
          id: 'kremlin_yangini',
          title: 'Moskova Seferi',
          description: '1812\'de Rusya\'ya sefer düzenledim. Moskova\'yı aldım ama kış ve gerilla savaşı nedeniyle geri çekilmek zorunda kaldım.',
          icon: '❄️',
          date: '1812',
          details: '600.000 kişilik Grande Armée ile Rusya\'ya girdim. Moskova\'yı aldım ama kış şartları ve gerilla savaşı beni geri çekilmeye zorladı.',
          prompt: 'Rusya Seferi\'nin stratejisini, Moskova\'ya girişimi ve geri çekilişimin nedenlerini anlat.'
        }
      ]
    };
    
    return eventsMap[characterId] || [];
  };

  // Öğrenme ipuçları
  const learningTips = [
    {
      title: "📚 Etkili Öğrenme İpuçları",
      tips: [
        "Her tarihi olayı dinlerken not alın",
        "Önemli tarihleri tekrar edin",
        "Karakterlerin motivasyonlarını anlayın",
        "Olaylar arasındaki bağlantıları kurun"
      ]
    },
    {
      title: "🎯 Hafıza Teknikleri",
      tips: [
        "Tarihleri hikayelerle bağlayın",
        "Görsel imgeler kullanın",
        "Sesli tekrar yapın",
        "Önemli noktaları vurgulayın"
      ]
    },
    {
      title: "💡 Analiz Becerileri",
      tips: [
        "Sebep-sonuç ilişkilerini sorgulayın",
        "Alternatif senaryolar düşünün",
        "Günümüzle karşılaştırın",
        "Farklı perspektifleri değerlendirin"
      ]
    }
  ];

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % learningTips.length);
  };

  const handleAdvancedFeatureClick = (featureName: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    // Kullanıcı giriş yapmışsa ilgili özelliği aç
    switch (featureName) {
      case 'notes':
        setShowNotes(true);
        break;
      case 'eventMap':
        setShowEventMap(true);
        break;
      case 'comparative':
        setShowComparativeAnalysis(true);
        break;
      case 'progress':
        setShowLearningProgress(true);
        break;
      case 'gamification':
        setShowGamification(true);
        break;
    }
  };

  const speakEvent = (eventId: string) => {
    const event = historicalEvents.find(e => e.id === eventId);
    if (!event) return;

    setSelectedEvent(eventId);
    setCurrentAnimation('speaking');

    const message = `${event.title}. ${event.description}`;
    
    console.log('Tarihi olay anlatılıyor:', message);
    
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const settings = getVoiceSettings();
        const utter = new SpeechSynthesisUtterance(message);
        
        // Karakter özel ses ayarları
        utter.lang = 'tr-TR';
        utter.rate = settings.rate;
        utter.pitch = settings.pitch;
        utter.volume = settings.volume;
        utter.voice = settings.voice;
        
        // Daha iyi okuma için ayarlar
        // pause ve resume özellikleri SpeechSynthesisUtterance'da mevcut değil

        // Ses seviyesi simülasyonu
        const audioSimulation = setInterval(() => {
          setAudioLevel(Math.random() * 100);
        }, 100);

        utter.onstart = () => {
          console.log('Tarihi olay anlatımı başladı');
          setCurrentAnimation('speaking');
        };

        utter.onend = () => {
          console.log('Tarihi olay anlatımı bitti');
          setCurrentAnimation('idle');
          setSelectedEvent(null);
          clearInterval(audioSimulation);
          setAudioLevel(0);
        };

        utter.onerror = (event) => {
          console.error('TTS hatası:', event.error);
          setCurrentAnimation('idle');
          setSelectedEvent(null);
          clearInterval(audioSimulation);
          setAudioLevel(0);
        };

        utterRef.current = utter;
        window.speechSynthesis.speak(utter);
      } else {
        console.log('Web Speech API desteklenmiyor');
      }
    } catch (error) {
      console.error('Konuşma hatası:', error);
    }
  };

  const startChatWithEvent = (eventId: string) => {
    const event = historicalEvents.find(e => e.id === eventId);
    if (!event) return;

    console.log('Konu ile sohbet başlatılıyor:', event.title);
    console.log('Event prompt:', event.prompt);
    
    // Event prompt'unu localStorage'a kaydet
    localStorage.setItem('chat_prompt', event.prompt);
    localStorage.setItem('chat_topic', event.title);
    
    console.log('localStorage\'a kaydedildi:');
    console.log('chat_prompt:', localStorage.getItem('chat_prompt'));
    console.log('chat_topic:', localStorage.getItem('chat_topic'));
    
    // Chat sayfasına git
    onStartChat();
  };

  // Karakter özel ses ayarları
  const getVoiceSettings = () => {
    const voices = window.speechSynthesis.getVoices();
    const turkishVoices = voices.filter(voice => voice.lang.startsWith('tr'));
    
    // Karakter özel ses ayarları
    const characterSettings = {
      'fatih_sultan_mehmet': {
        rate: 0.8,
        pitch: 0.9,
        volume: 0.9,
        voice: turkishVoices.find(v => v.name.includes('Male')) || turkishVoices[0] || voices[0]
      },
      'ataturk': {
        rate: 0.85,
        pitch: 1.1,
        volume: 0.95,
        voice: turkishVoices.find(v => v.name.includes('Male')) || turkishVoices[0] || voices[0]
      },
      'napoleon': {
        rate: 0.75,
        pitch: 0.8,
        volume: 0.85,
        voice: turkishVoices.find(v => v.name.includes('Male')) || turkishVoices[0] || voices[0]
      }
    };
    
    return characterSettings[character.id] || {
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8,
      voice: turkishVoices[0] || voices[0]
    };
  };

  const speakGreeting = () => {
    console.log('Karakter selamlama başlatılıyor:', greetingMessage);

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const settings = getVoiceSettings();
        const utter = new SpeechSynthesisUtterance(greetingMessage);
        
        // Karakter özel ses ayarları
        utter.lang = 'tr-TR';
        utter.rate = settings.rate;
        utter.pitch = settings.pitch;
        utter.volume = settings.volume;
        utter.voice = settings.voice;
        
        // Daha iyi okuma için ayarlar
        // pause ve resume özellikleri SpeechSynthesisUtterance'da mevcut değil

        // Ses seviyesi simülasyonu
        const audioSimulation = setInterval(() => {
          setAudioLevel(Math.random() * 100);
        }, 100);

        utter.onstart = () => {
          console.log('Karakter selamlama başladı');
          setCurrentAnimation('speaking');
        };

        utter.onend = () => {
          console.log('Karakter selamlama bitti');
          setCurrentAnimation('idle');
          clearInterval(audioSimulation);
          setAudioLevel(0);
        };

        utter.onerror = (event) => {
          console.error('TTS hatası:', event.error);
          setCurrentAnimation('idle');
          clearInterval(audioSimulation);
          setAudioLevel(0);
        };

        utterRef.current = utter;
        window.speechSynthesis.speak(utter);

      } else {
        console.log('Web Speech API desteklenmiyor');
      }
    } catch (error) {
      console.error('Konuşma hatası:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-y-auto z-50">
      {/* Clean Modern Layout */}
      <div className={`bg-white rounded-2xl shadow-xl p-8 max-w-6xl w-full mx-auto my-8 transform transition-all duration-700 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      }`}>
        {/* Header with Back Button and User Info */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Karakter Seçimine Dön
          </Button>
          
          {/* User Info */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{user.fullName}</p>
                  <p className="text-xs text-gray-600">Seviye {user.level} • {user.coins} 💰</p>
                </div>
                <Button
                  onClick={() => setShowUserProfile(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                variant="outline"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              >
                Giriş Yap
              </Button>
            )}
          </div>
        </div>
          
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Character Profile */}
          <div className="space-y-6">
            {/* Character Avatar */}
            <div className="text-center">
              <div onClick={speakGreeting} className="w-56 h-56 mx-auto shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer relative group">
                {/* Character Photo */}
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <img 
                    src={
                      character.id === 'fatih_sultan_mehmet' ? mehmetAvatar :
                      character.id === 'ataturk' ? ataturkAvatar : 
                      napoleonAvatar
                    }
                    alt={character.name}
                    className={`w-full h-full object-cover border-4 border-white shadow-lg transition-all duration-300 ${
                      isSpeaking ? 'animate-speak animate-glow' : 'hover:animate-float'
                    }`}
                    onError={(e) => {
                      console.error('Resim yüklenemedi:', character.id, character.name);
                      console.error('Resim src:', e.currentTarget.src);
                    }}
                    onLoad={() => {
                      console.log('Resim yüklendi:', character.id, character.name);
                    }}
                  />
                  
                  {/* Dudak Hareketi Animasyonu */}
                  {isSpeaking && (
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                      {/* Dudak Simülasyonu */}
                      <div className="relative">
                        {/* Üst Dudak */}
                        <div 
                          className="absolute w-12 h-3 bg-red-400/80 rounded-full animate-mouth-move"
                          style={{
                            transform: `scaleY(${0.3 + (audioLevel / 100) * 0.4})`,
                            animationDuration: '0.3s'
                          }}
                        ></div>
                        
                        {/* Alt Dudak */}
                        <div 
                          className="absolute w-12 h-3 bg-red-500/80 rounded-full animate-mouth-move"
                          style={{
                            transform: `scaleY(${0.4 + (audioLevel / 100) * 0.5}) translateY(2px)`,
                            animationDuration: '0.4s',
                            animationDelay: '0.1s'
                          }}
                        ></div>
                        
                        {/* Ağız İçi */}
                        <div 
                          className="absolute w-8 h-2 bg-black/60 rounded-full"
                          style={{
                            transform: `scaleY(${0.2 + (audioLevel / 100) * 0.6})`,
                            left: '8px',
                            top: '4px'
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Konuşma Animasyonu - Ses Dalgaları */}
                  {isSpeaking && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                      {/* Dinamik Ses Dalgası Animasyonu */}
                      <div className="flex items-center space-x-1 mb-2">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => {
                          const height = isSpeaking ? 
                            (audioLevel / 100) * 20 + Math.random() * 10 + 5 : 0;
                          return (
                            <div
                              key={i}
                              className="w-1 bg-gradient-to-t from-green-600 to-green-400 rounded-full transition-all duration-100"
                              style={{
                                height: `${height}px`,
                                animationDelay: `${i * 0.05}s`,
                              }}
                            ></div>
                          );
                        })}
                      </div>
                      
                      {/* Konuşma Balonu */}
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg border border-green-200 animate-pulse">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Göz Kırpma Animasyonu */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                    <div className={`w-6 h-6 rounded-full bg-white/30 transition-all duration-300 ${
                      isSpeaking ? 'animate-blink' : ''
                    }`}>
                      <div className="absolute inset-1 bg-black/20 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Sol Göz */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -ml-8">
                    <div className={`w-4 h-4 rounded-full bg-white/30 transition-all duration-300 ${
                      isSpeaking ? 'animate-blink' : ''
                    }`}>
                      <div className="absolute inset-0.5 bg-black/20 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Sağ Göz */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 ml-4">
                    <div className={`w-4 h-4 rounded-full bg-white/30 transition-all duration-300 ${
                      isSpeaking ? 'animate-blink' : ''
                    }`}>
                      <div className="absolute inset-0.5 bg-black/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Speaking Indicator - Daha Gelişmiş */}
                {isSpeaking && (
                  <>
                    {/* Ana Konuşma Halkaları */}
                    <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-30"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-pulse opacity-50"></div>
                    
                    {/* Mikrofon İkonu */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-white text-xs">🎤</span>
                    </div>
                    
                    {/* Parçacık Efektleri */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping opacity-60"
                          style={{
                            top: `${20 + (i * 10)}%`,
                            left: `${15 + (i * 10)}%`,
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '2s'
                          }}
                        ></div>
                      ))}
                    </div>
                    
                    {/* Işık Efektleri */}
                    <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-green-400/20 via-transparent to-blue-400/20 animate-pulse opacity-50"></div>
                  </>
                )}
                
                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Karakter Özel Efektler */}
                {character.id === 'fatih_sultan_mehmet' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`text-2xl transition-all duration-500 ${isSpeaking ? 'animate-spin' : ''}`}>
                      👑
                    </div>
                  </div>
                )}
                
                {character.id === 'ataturk' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`text-2xl transition-all duration-500 ${isSpeaking ? 'animate-bounce' : ''}`}>
                      🎖️
                    </div>
                  </div>
                )}
                
                {character.id === 'napoleon' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`text-2xl transition-all duration-500 ${isSpeaking ? 'animate-pulse' : ''}`}>
                      ⚔️
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Character Info */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">{character.name}</h2>
              <div className="inline-block bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-md">
                {character.id === 'fatih_sultan_mehmet' ? 'İstanbul\'un Fatihi' :
                 character.id === 'ataturk' ? 'Türkiye Cumhuriyeti\'nin Kurucusu' : 'Fransız İmparatoru'}
              </div>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <span>📅</span>
                  <span>Dönem: {character.era}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>📍</span>
                  <span>Ülke: {character.location}</span>
                </div>
              </div>
            </div>

            {/* Interactive Greeting */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-md max-w-md mx-auto">
              <p className="text-gray-700 text-center leading-relaxed">
                {greetingMessage}
              </p>
            </div>
          </div>
          
          {/* Right Column - Historical Stories */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">📚</span>
                Tarihi Hikayeler
              </h3>
              <span className="text-sm text-gray-500">{historicalEvents.length} Hikaye</span>
            </div>

            <div className="space-y-4">
              {historicalEvents.map((event, index) => (
                <div key={event.id} className={`bg-white border rounded-xl p-4 shadow-sm transition-all duration-300 hover:shadow-md ${
                  selectedEvent === event.id ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{event.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">{event.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{event.description.substring(0, 120)}...</p>
                      {event.sources && (
                        <div className="mb-3">
                          <div className="text-xs text-blue-600 font-medium mb-1">📚 Kaynaklar:</div>
                          <div className="text-xs text-gray-500">
                            {event.sources.slice(0, 2).join(', ')}
                            {event.sources.length > 2 && ' ve diğerleri...'}
                          </div>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => speakEvent(event.id)}
                          size="sm"
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            selectedEvent === event.id
                              ? 'bg-orange-500 text-white hover:bg-orange-600'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Hikayeyi Dinle
                        </Button>
                        <Button 
                          onClick={() => startChatWithEvent(event.id)}
                          size="sm"
                          variant="outline"
                          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all duration-300"
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Sohbet Et
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Educational Tools */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Eğitim Araçları</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Button
              onClick={onStartQuiz}
              variant="outline"
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 h-auto"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-pink-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">Quiz</h4>
                  <p className="text-sm text-gray-600">Bilgilerini test et</p>
                </div>
              </div>
            </Button>
            <Button
              onClick={onStartTimeline}
              variant="outline"
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 h-auto"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-pink-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">Zaman Çizelgesi</h4>
                  <p className="text-sm text-gray-600">Olayları kronolojik sıraya koy</p>
                </div>
              </div>
            </Button>
            <Button
              onClick={onStartMap}
              variant="outline"
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 h-auto"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">Tarihi Harita</h4>
                  <p className="text-sm text-gray-600">Önemli konumları keşfet</p>
                </div>
              </div>
            </Button>
            <Button
              onClick={() => setShowLearningTips(!showLearningTips)}
              variant="outline"
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 h-auto"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">💡</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">Öğrenme İpuçları</h4>
                  <p className="text-sm text-gray-600">Etkili öğrenme teknikleri</p>
                </div>
              </div>
            </Button>
          </div>
          
          {/* Yeni Eğitim Araçları */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Gelişmiş Özellikler</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Button
                onClick={() => handleAdvancedFeatureClick('notes')}
                variant="outline"
                className="bg-white border border-blue-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 h-auto"
              >
                <div className="flex flex-col items-center space-y-2 w-full">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-lg">📝</span>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 text-sm">Not Alma</h4>
                    <p className="text-xs text-gray-600">İnteraktif notlar</p>
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleAdvancedFeatureClick('eventMap')}
                variant="outline"
                className="bg-white border border-green-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 h-auto"
              >
                <div className="flex flex-col items-center space-y-2 w-full">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-lg">🗺️</span>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 text-sm">Olay Haritası</h4>
                    <p className="text-xs text-gray-600">Bağlantıları keşfet</p>
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleAdvancedFeatureClick('comparative')}
                variant="outline"
                className="bg-white border border-purple-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 h-auto"
              >
                <div className="flex flex-col items-center space-y-2 w-full">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-lg">⚖️</span>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 text-sm">Karşılaştırma</h4>
                    <p className="text-xs text-gray-600">Analiz yap</p>
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleAdvancedFeatureClick('progress')}
                variant="outline"
                className="bg-white border border-yellow-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 h-auto"
              >
                <div className="flex flex-col items-center space-y-2 w-full">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 text-lg">📊</span>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 text-sm">İlerleme</h4>
                    <p className="text-xs text-gray-600">Takip et</p>
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleAdvancedFeatureClick('gamification')}
                variant="outline"
                className="bg-white border border-orange-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 h-auto"
              >
                <div className="flex flex-col items-center space-y-2 w-full">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-lg">🎮</span>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 text-sm">Oyunlaştırma</h4>
                    <p className="text-xs text-gray-600">Kazanç sistemi</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Öğrenme İpuçları Paneli */}
        {showLearningTips && (
          <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {learningTips[currentTipIndex].title}
              </h3>
              <div className="flex space-x-2">
                <Button
                  onClick={nextTip}
                  size="sm"
                  variant="outline"
                  className="px-3 py-1 text-sm"
                >
                  Sonraki
                </Button>
                <Button
                  onClick={() => setShowLearningTips(false)}
                  size="sm"
                  variant="ghost"
                  className="px-3 py-1 text-sm text-gray-500"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {learningTips[currentTipIndex].tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white/80 rounded-lg p-3 border border-green-100 flex items-start space-x-2"
                >
                  <span className="text-green-500 text-sm">✓</span>
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4">
          <Button
            onClick={onStartChat}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Sohbet Etmeye Başla
          </Button>
          <Button
            onClick={speakGreeting}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300"
          >
            <Play className="w-4 h-4 mr-2" />
            Hikayeyi Dinle
          </Button>
        </div>
      </div>

      {/* Yeni Component'ler */}
      <InteractiveNotes
        character={character}
        isVisible={showNotes}
        onClose={() => setShowNotes(false)}
      />

      <EventConnectionMap
        character={character}
        isVisible={showEventMap}
        onClose={() => setShowEventMap(false)}
      />

      <ComparativeAnalysis
        character={character}
        isVisible={showComparativeAnalysis}
        onClose={() => setShowComparativeAnalysis(false)}
      />

      <LearningProgress
        character={character}
        isVisible={showLearningProgress}
        onClose={() => setShowLearningProgress(false)}
      />

      <GamificationSystem
        character={character}
        isVisible={showGamification}
        onClose={() => setShowGamification(false)}
      />

      <AuthModal
        isVisible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          // Modal kapatıldıktan sonra kullanıcı bilgileri otomatik güncellenecek
        }}
      />

      {user && (
        <UserProfile
          isVisible={showUserProfile}
          onClose={() => setShowUserProfile(false)}
          onLogout={() => {
            logout();
            setShowUserProfile(false);
            window.location.reload();
          }}
          user={user}
        />
      )}
    </div>
  );
};

export default AnimatedAvatar;