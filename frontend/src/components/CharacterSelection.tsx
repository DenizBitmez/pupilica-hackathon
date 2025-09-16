
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
      personality: 'Cesur, stratejik düşünen, bilim ve sanata değer veren büyük bir lider. Konstantinopolis\'i fethederek tarihi değiştiren fatih.',
      avatar: '👑',
      color: 'from-amber-400 to-orange-500',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Gentile_Bellini_003.jpg/512px-Gentile_Bellini_003.jpg'
    },
    {
      id: 'ataturk',
      name: 'Mustafa Kemal Atatürk',
      era: '19-20. yüzyıl',
      location: 'Türkiye',
      personality: 'Türkiye Cumhuriyeti\'nin kurucusu, büyük reformcu ve lider. Modern Türkiye\'nin mimarı.',
      avatar: '🎖️',
      color: 'from-red-400 to-red-600',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Ataturk1930s.jpg/512px-Ataturk1930s.jpg'
    },
    {
      id: 'napoleon',
      name: 'Napolyon Bonaparte',
      era: '18-19. yüzyıl',
      location: 'Fransa',
      personality: 'Fransız İmparatoru, büyük askeri deha ve stratejist. Avrupa\'yı fetheden büyük lider.',
      avatar: '⚔️',
      color: 'from-blue-400 to-blue-600',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg/512px-Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg'
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
                  <div className={`text-8xl transition-all duration-500 ${
                    selectedCharacter?.id === character.id ? 'animate-bounce scale-125' : 'group-hover:scale-110'
                  }`}>
                    {character.avatar || '👤'}
                  </div>
                  
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
