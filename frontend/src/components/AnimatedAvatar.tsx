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

  useEffect(() => {
    // Giriş animasyonu
    setIsVisible(true);
    setCurrentAnimation('entrance');
    
    // Karaktere göre detaylı tarihi hikaye
    const greetings = {
      'fatih_sultan_mehmet': 'Selam! Ben Fatih Sultan Mehmet. 1453 yılında Konstantinopolis\'i fethederek tarihi değiştirdim. 29 Mayıs günü, dev toplarımın sesiyle başlayan kuşatma 53 gün sürdü. Şehri aldığımda sadece 21 yaşındaydım. Bilim, sanat ve strateji konularında tutkulu bir liderdim. İstanbul\'u fethettikten sonra şehri yeniden inşa ettim, Ayasofya\'yı camiye çevirdim ve Topkapı Sarayı\'nı yaptırdım. Sorularınızı bekliyorum!',
      'ataturk': 'Merhaba! Ben Mustafa Kemal Atatürk. 19 Mayıs 1919\'da Samsun\'a çıkarak Türk Kurtuluş Savaşı\'nı başlattım. 1923\'te Türkiye Cumhuriyeti\'ni kurdum ve ilk cumhurbaşkanı oldum. Harf devrimi, kadın hakları, eğitim reformları ve çağdaşlaşma hareketlerini gerçekleştirdim. "Hayatta en hakiki mürşit ilimdir" diyerek bilimi rehber edindim. Modern Türkiye\'nin mimarı olarak, ülkemizi çağdaş medeniyetler seviyesine çıkarmak için çalıştım. Size nasıl yardımcı olabilirim?',
      'napoleon': 'Bonjour! Ben Napolyon Bonaparte. 1804\'te kendimi Fransız İmparatoru ilan ettim. Austerlitz, Jena, Friedland savaşlarında büyük zaferler kazandım. Avrupa\'nın büyük bölümünü fethettim. Waterloo\'da 1815\'te son yenilgimi aldım. Strateji, savaş ve yönetim konularında uzmanım. "İmpossible n\'est pas français" - İmkansız kelimesi Fransızca\'da yoktur derdim. Askeri deham ve yönetim yeteneklerimle tarihe geçtim.'
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

  const speakGreeting = () => {
    if (!greetingMessage) return;
    try {
      if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(greetingMessage);
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
        } catch {}
        utter.onstart = () => {
          setIntroMouthOpen(8);
          setCurrentAnimation('speaking');
          setCtaVisible(false);
        };
        utter.onboundary = () => {
          const v = 6 + Math.floor(Math.random() * 10);
          setIntroMouthOpen(v);
        };
        utter.onend = () => {
          setIntroMouthOpen(undefined);
          setCurrentAnimation('idle');
        };
        utterRef.current = utter;
        window.speechSynthesis.speak(utter);
      }
    } catch {}
  };

  // Greeting otomatik Web Speech TTS ve basit lip-sync
  useEffect(() => {
    if (!greetingMessage) return;
    // Otomatik başlatmayı dene; eğer tarayıcı engellerse CTA gösterilir
    try {
      if ('speechSynthesis' in window) {
        // Bazı tarayıcılarda otomatik okuma engellenebilir; kısa gecikme ile dene
        const id = setTimeout(() => {
          // Sessizce konuşmayı tetikle
          speakGreeting();
          // 2 sn sonra hâlâ konuşma başlamadıysa CTA aç
          setTimeout(() => {
            const speaking = (window as any).speechSynthesis.speaking;
            if (!speaking) {
              setCtaVisible(true);
              console.log('Ses çalma engellendi, CTA gösteriliyor');
            }
          }, 2000);
        }, 500);
        return () => clearTimeout(id);
      }
    } catch {}
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
            {/* Real Game-Quality Avatar with CSS Art */}
            <div className="relative w-full h-full">
              {/* Character Portrait Container */}
              <div className="relative w-full h-full overflow-hidden rounded-full">
                {/* Background with Character Theme */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100"></div>
                
                {/* Character Portrait */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Face Base */}
                  <div className="relative w-32 h-40 bg-gradient-to-b from-yellow-200 to-orange-200 rounded-full shadow-2xl" 
                       style={{
                         background: 'linear-gradient(135deg, #F4A460 0%, #DEB887 30%, #CD853F 70%, #8B4513 100%)',
                         boxShadow: 'inset 0 0 30px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.3)',
                         transform: 'perspective(1000px) rotateX(5deg) rotateY(-5deg)'
                       }}>
                    
                    {/* Eyes */}
                    <div className="absolute top-8 left-8 w-6 h-6 bg-black rounded-full shadow-inner">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"></div>
                      <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full opacity-90"></div>
                      <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
                    </div>
                    <div className="absolute top-8 right-8 w-6 h-6 bg-black rounded-full shadow-inner">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"></div>
                      <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full opacity-90"></div>
                      <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
                    </div>

                    {/* Eyebrows */}
                    <div className="absolute top-6 left-6 w-8 h-1 bg-black rounded-full transform rotate-12"></div>
                    <div className="absolute top-6 right-6 w-8 h-1 bg-black rounded-full transform -rotate-12"></div>

                    {/* Nose */}
                    <div className="absolute top-16 left-1/2 w-2 h-6 bg-gradient-to-b from-yellow-300 to-orange-300 rounded-full transform -translate-x-1/2 shadow-inner"></div>

                    {/* Mouth */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                      {currentAnimation === 'speaking' ? (
                        <div className="w-8 h-4 bg-black rounded-full animate-pulse shadow-inner">
                          <div className="w-6 h-3 bg-white rounded-full mx-auto mt-0.5"></div>
                          <div className="w-4 h-2 bg-pink-400 rounded-full mx-auto mt-0.5"></div>
                        </div>
                      ) : currentAnimation === 'listening' ? (
                        <div className="w-6 h-2 bg-black rounded-full"></div>
                      ) : (
                        <div className="w-8 h-1 bg-black rounded-full"></div>
                      )}
                    </div>

                    {/* Character-Specific Features */}
                    {character.id === 'fatih_sultan_mehmet' && (
                      <>
                        {/* Crown */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="w-16 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-full shadow-lg"
                               style={{
                                 clipPath: 'polygon(20% 100%, 0% 0%, 100% 0%, 80% 100%)',
                                 boxShadow: '0 5px 15px rgba(255,215,0,0.6)'
                               }}>
                            <div className="absolute top-1 left-1/2 w-2 h-2 bg-yellow-700 rounded-full transform -translate-x-1/2"></div>
                            <div className="absolute top-2 left-2 w-1 h-1 bg-yellow-700 rounded-full"></div>
                            <div className="absolute top-2 right-2 w-1 h-1 bg-yellow-700 rounded-full"></div>
                          </div>
                        </div>
                        {/* Beard */}
                        <div className="absolute bottom-4 left-1/2 w-12 h-6 bg-black rounded-full transform -translate-x-1/2 opacity-80"></div>
                        {/* Mustache */}
                        <div className="absolute bottom-12 left-1/2 w-8 h-2 bg-black rounded-full transform -translate-x-1/2"></div>
                      </>
                    )}

                    {character.id === 'ataturk' && (
                      <>
                        {/* Hat */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <div className="w-20 h-6 bg-gradient-to-b from-blue-800 to-blue-900 rounded-full shadow-lg">
                            <div className="absolute top-1 left-1/2 w-1 h-1 bg-yellow-400 rounded-full transform -translate-x-1/2"></div>
                            <div className="absolute top-2 left-1/2 w-16 h-1 bg-yellow-400 rounded-full transform -translate-x-1/2"></div>
                          </div>
                        </div>
                        {/* Mustache */}
                        <div className="absolute bottom-12 left-1/2 w-8 h-2 bg-black rounded-full transform -translate-x-1/2"></div>
                      </>
                    )}

                    {character.id === 'napoleon' && (
                      <>
                        {/* Military Hat */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="w-18 h-5 bg-gradient-to-b from-gray-800 to-black rounded-full shadow-lg">
                            <div className="absolute top-0.5 left-1/2 w-12 h-1 bg-yellow-400 rounded-full transform -translate-x-1/2"></div>
                            <div className="absolute top-1 left-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2"></div>
                          </div>
                        </div>
                        {/* Military Collar */}
                        <div className="absolute bottom-16 left-1/2 w-16 h-4 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform -translate-x-1/2"></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Dynamic Effects */}
                {currentAnimation === 'speaking' && (
                  <>
                    {/* Speaking Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-blue-200/30 rounded-full animate-pulse"></div>
                    {/* Sound Waves */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 border-4 border-green-400 rounded-full animate-ping opacity-30"></div>
                      <div className="absolute w-32 h-32 border-4 border-blue-400 rounded-full animate-ping opacity-20" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute w-24 h-24 border-4 border-purple-400 rounded-full animate-ping opacity-10" style={{animationDelay: '1s'}}></div>
                    </div>
                  </>
                )}

                {currentAnimation === 'listening' && (
                  <>
                    {/* Listening Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full animate-pulse"></div>
                    {/* Listening Indicator */}
                    <div className="absolute top-4 right-4 w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                  </>
                )}
              </div>
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
            <div className="mt-4 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border-2 border-amber-300">
              <div className="text-center">
                <div className="text-lg font-bold text-amber-800 mb-2">🎵 Ses Çalma İzni Gerekli</div>
                <p className="text-sm text-amber-700 mb-3">Karakterin hikayesini dinlemek için aşağıdaki butona tıklayın</p>
                <button 
                  onClick={speakGreeting} 
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg shadow-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 border-2 border-amber-400"
                >
                  🔊 Anlatmaya Başla
                </button>
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

        {/* Enhanced Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onStartChat}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-xl border-2 border-amber-400"
          >
            💬 Sohbet Etmeye Başla
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
