
import React, { useState } from 'react';
import { HistoricalFigure } from '../types/historical';

interface CharacterSelectionProps {
  onCharacterSelect: (character: HistoricalFigure) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onCharacterSelect }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<HistoricalFigure | null>(null);

  const characters: HistoricalFigure[] = [
    {
      id: 'fatih_sultan_mehmet',
      name: 'Fatih Sultan Mehmet',
      era: '15. yüzyıl',
      location: 'İstanbul, Osmanlı İmparatorluğu',
      personality: '1453\'te Konstantinopolis\'i fetheden büyük fatih. 21 yaşında şehri alarak tarihi değiştirdi. Bilim, sanat ve strateji konularında tutkulu bir lider.',
      avatar: '👑',
      color: 'from-amber-400 to-orange-500',
      image: undefined
    },
    {
      id: 'ataturk',
      name: 'Mustafa Kemal Atatürk',
      era: '19-20. yüzyıl',
      location: 'Türkiye',
      personality: 'Türkiye Cumhuriyeti\'nin kurucusu ve ilk cumhurbaşkanı. 19 Mayıs 1919\'da Samsun\'a çıkarak Kurtuluş Savaşı\'nı başlattı. Modern Türkiye\'nin mimarı.',
      avatar: '🎖️',
      color: 'from-red-400 to-red-600',
      image: undefined
    },
    {
      id: 'napoleon',
      name: 'Napolyon Bonaparte',
      era: '18-19. yüzyıl',
      location: 'Fransa',
      personality: 'Fransız İmparatoru ve büyük askeri deha. Austerlitz, Jena, Friedland zaferleriyle Avrupa\'yı fethetti. Waterloo\'da son yenilgisini aldı.',
      avatar: '⚔️',
      color: 'from-blue-400 to-blue-600',
      image: undefined
    }
  ];

  const handleCharacterClick = (character: HistoricalFigure) => {
    setSelectedCharacter(character);
    setTimeout(() => {
      onCharacterSelect(character);
    }, 1000); // Animasyon için kısa bekleme
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tarih-i Sima
            </h1>
            <p className="text-xl text-white/80 mb-4">
              Tarihi Karakterlerle Sohbet Et
            </p>
            <p className="text-lg text-white/60">
              Öğrenmek istediğiniz tarihi figürü seçin ve onunla konuşmaya başlayın
            </p>
          </div>
        </div>

        {/* Character Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => handleCharacterClick(character)}
              className={`group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                selectedCharacter?.id === character.id ? 'scale-110' : ''
              }`}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden h-full border border-white/20 hover:border-white/40 transition-all duration-500">
                {/* Character Avatar */}
                <div className={`h-56 bg-gradient-to-br ${
                  character.id === 'fatih_sultan_mehmet' ? 'from-amber-500/30 to-orange-500/30' :
                  character.id === 'ataturk' ? 'from-red-500/30 to-red-600/30' :
                  'from-blue-500/30 to-blue-600/30'
                } flex items-center justify-center relative overflow-hidden`}>
                  {/* Large Emoji Avatar */}
                  <div className={`text-9xl transition-all duration-500 ${
                    selectedCharacter?.id === character.id ? 'scale-110 animate-bounce' : 'group-hover:scale-105'
                  }`}>
                    {character.id === 'fatih_sultan_mehmet' ? '👑' :
                     character.id === 'ataturk' ? '🎖️' : '⚔️'}
                  </div>
                  
                  {/* Selection Animation */}
                  {selectedCharacter?.id === character.id && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-t-3xl"></div>
                  )}
                  
                  {/* Sparkle Effects */}
                  <div className="absolute top-4 right-4 text-yellow-300 text-2xl animate-spin">
                    ✨
                  </div>
                  <div className="absolute bottom-4 left-4 text-blue-300 text-xl animate-bounce">
                    ⭐
                  </div>
                  <div className="absolute top-1/2 left-4 text-purple-300 text-lg animate-pulse">
                    💫
                  </div>
                </div>

                {/* Character Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {character.name}
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-white/80 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                      <span className="text-lg mr-2">📅</span>
                      <span className="text-sm font-medium">{character.era}</span>
                    </div>
                    <div className="flex items-center text-white/80 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                      <span className="text-lg mr-2">📍</span>
                      <span className="text-sm font-medium">{character.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    {character.personality.substring(0, 120)}...
                  </p>

                  {/* Action Button */}
                  <button
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-500 transform ${
                      selectedCharacter?.id === character.id
                        ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white animate-pulse scale-105'
                        : 'bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:scale-105'
                    }`}
                  >
                    {selectedCharacter?.id === character.id ? 'Seçiliyor...' : 'Bu Karakteri Seç'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selection Status */}
        {selectedCharacter && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-lg rounded-full px-8 py-4 shadow-2xl border border-white/20">
              <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${
                selectedCharacter.id === 'fatih_sultan_mehmet' ? 'from-amber-500 to-orange-500' :
                selectedCharacter.id === 'ataturk' ? 'from-red-500 to-red-600' :
                'from-blue-500 to-blue-600'
              } mr-4 animate-pulse`}></div>
              <span className="text-white font-bold text-lg">
                {selectedCharacter.name} seçiliyor...
              </span>
              <div className="ml-4 text-2xl animate-spin">⚡</div>
            </div>
          </div>
        )}

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterSelection;
