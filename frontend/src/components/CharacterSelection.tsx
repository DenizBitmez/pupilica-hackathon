
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-historical font-bold text-gray-800 mb-4">
            Tarih-i Sima
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Tarihi Karakterlerle Sohbet Et
          </p>
          <p className="text-lg text-gray-500">
            Öğrenmek istediğiniz tarihi figürü seçin ve onunla konuşmaya başlayın
          </p>
        </div>

        {/* Character Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => handleCharacterClick(character)}
              className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedCharacter?.id === character.id ? 'scale-110 shadow-2xl' : 'hover:shadow-xl'
              }`}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                {/* Character Avatar */}
                <div className={`h-48 bg-gradient-to-br ${character.color || 'from-gray-400 to-gray-600'} flex items-center justify-center relative overflow-hidden`}>
                  {/* SVG Avatar System */}
                  <svg 
                    className={`w-full h-full transition-all duration-500 ${
                      selectedCharacter?.id === character.id ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                    viewBox="0 0 200 200" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background Circle */}
                    <circle 
                      cx="100" 
                      cy="100" 
                      r="95" 
                      fill={`url(#${character.id}GradientCard)`}
                      className="transition-all duration-300"
                    />
                    
                    {/* Gradient Definitions */}
                    <defs>
                      <radialGradient id="fatih_sultan_mehmetGradientCard" cx="50%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FF8C00" />
                      </radialGradient>
                      <radialGradient id="ataturkGradientCard" cx="50%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#DC143C" />
                        <stop offset="100%" stopColor="#8B0000" />
                      </radialGradient>
                      <radialGradient id="napoleonGradientCard" cx="50%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#4169E1" />
                        <stop offset="100%" stopColor="#000080" />
                      </radialGradient>
                    </defs>
                    
                    {/* Face */}
                    <ellipse cx="100" cy="120" rx="60" ry="70" fill="#F4A460" />
                    
                    {/* Eyes */}
                    <circle cx="80" cy="100" r="8" fill="black" />
                    <circle cx="120" cy="100" r="8" fill="black" />
                    
                    {/* Eye highlights */}
                    <circle cx="82" cy="98" r="3" fill="white" />
                    <circle cx="122" cy="98" r="3" fill="white" />
                    
                    {/* Eyebrows */}
                    <path d="M 70 85 Q 80 80 90 85" stroke="black" strokeWidth="3" fill="none" />
                    <path d="M 110 85 Q 120 80 130 85" stroke="black" strokeWidth="3" fill="none" />
                    
                    {/* Nose */}
                    <ellipse cx="100" cy="115" rx="4" ry="8" fill="#DEB887" />
                    
                    {/* Mouth */}
                    <path d="M 85 140 Q 100 150 115 140" stroke="black" strokeWidth="3" fill="none" />
                    
                    {/* Character-specific accessories */}
                    {character.id === 'fatih_sultan_mehmet' && (
                      <>
                        {/* Crown */}
                        <polygon points="70,60 100,40 130,60 125,50 100,35 75,50" fill="#FFD700" stroke="#FF8C00" strokeWidth="2" />
                        <circle cx="100" cy="35" r="3" fill="#FF8C00" />
                      </>
                    )}
                    
                    {character.id === 'ataturk' && (
                      <>
                        {/* Hat */}
                        <ellipse cx="100" cy="70" rx="50" ry="15" fill="#000080" />
                        <rect x="80" y="70" width="40" height="20" fill="#000080" />
                      </>
                    )}
                    
                    {character.id === 'napoleon' && (
                      <>
                        {/* Military hat */}
                        <ellipse cx="100" cy="65" rx="45" ry="12" fill="#000000" />
                        <rect x="85" y="65" width="30" height="15" fill="#000000" />
                        {/* Hat decoration */}
                        <rect x="95" y="60" width="10" height="5" fill="#FFD700" />
                      </>
                    )}
                  </svg>
                  
                  {/* Selection Animation */}
                  {selectedCharacter?.id === character.id && (
                    <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
                  )}
                  
                  {/* Sparkle Effect */}
                  <div className="absolute top-4 right-4 text-yellow-300 text-2xl animate-spin">
                    ✨
                  </div>
                </div>

                {/* Character Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-historical font-bold text-gray-800 mb-2">
                    {character.name}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <span className="text-sm font-medium">Dönem:</span>
                      <span className="ml-2 text-sm">{character.era}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="text-sm font-medium">Konum:</span>
                      <span className="ml-2 text-sm">{character.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {character.personality.substring(0, 120)}...
                  </p>

                  {/* Action Button */}
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                      selectedCharacter?.id === character.id
                        ? 'bg-green-500 text-white animate-pulse'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          <div className="mt-8 text-center">
            <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${selectedCharacter.color || 'from-gray-400 to-gray-600'} mr-3 animate-pulse`}></div>
              <span className="text-gray-700 font-medium">
                {selectedCharacter.name} seçiliyor...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSelection;
