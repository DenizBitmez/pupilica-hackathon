import React, { useState, useEffect } from 'react';
import { HistoricalFigure } from '../types/historical';
import { UserIcon, CheckIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface HistoricalFigureSelectorProps {
  selectedFigure: HistoricalFigure | null;
  onFigureSelect: (figure: HistoricalFigure) => void;
}

const HistoricalFigureSelector: React.FC<HistoricalFigureSelectorProps> = ({
  selectedFigure,
  onFigureSelect
}) => {
  const [figures, setFigures] = useState<HistoricalFigure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFigures();
  }, []);

  const fetchFigures = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/figures');
      const figuresData = Object.entries(response.data).map(([id, figure]: [string, any]) => ({
        id,
        ...figure
      }));
      setFigures(figuresData);
    } catch (error) {
      console.error('Figürler yüklenirken hata:', error);
      // Fallback data
      setFigures([
        {
          id: 'fatih_sultan_mehmet',
          name: 'Fatih Sultan Mehmet',
          personality: 'Ben Fatih Sultan Mehmet. 1453\'te İstanbul\'u fetheden Osmanlı padişahıyım.',
          era: '15. yüzyıl',
          location: 'İstanbul, Osmanlı İmparatorluğu',
          avatar: '👑',
          color: 'from-amber-400 to-orange-500'
        },
        {
          id: 'ataturk',
          name: 'Mustafa Kemal Atatürk',
          personality: 'Ben Mustafa Kemal Atatürk. Türkiye Cumhuriyeti\'nin kurucusu ve ilk cumhurbaşkanıyım.',
          era: '19-20. yüzyıl',
          location: 'Ankara, Türkiye',
          avatar: '🎖️',
          color: 'from-red-400 to-red-600'
        },
        {
          id: 'napoleon',
          name: 'Napolyon Bonaparte',
          personality: 'Ben Napolyon Bonaparte. Fransız İmparatoru ve büyük bir askeri dehayım.',
          era: '18-19. yüzyıl',
          location: 'Paris, Fransa',
          avatar: '⚔️',
          color: 'from-blue-400 to-blue-600'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-historical font-semibold text-gray-800 mb-4 flex items-center">
        <UserIcon className="h-6 w-6 mr-2 text-amber-600" />
        Tarihi Figür Seçin
      </h2>
      
      <div className="space-y-3">
        {figures.map((figure) => (
          <button
            key={figure.id}
            onClick={() => onFigureSelect(figure)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedFigure?.id === figure.id
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                  figure.color || 'from-gray-400 to-gray-600'
                } flex items-center justify-center text-2xl shadow-md`}>
                  {figure.avatar || '👤'}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-historical font-semibold text-gray-800 mb-1">
                    {figure.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{figure.era}</p>
                  <p className="text-xs text-gray-500">{figure.location}</p>
                </div>
              </div>
              
              {selectedFigure?.id === figure.id && (
                <CheckIcon className="h-5 w-5 text-amber-600" />
              )}
            </div>
          </button>
        ))}
      </div>
      
      {selectedFigure && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Seçilen Figür:</strong> {selectedFigure.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoricalFigureSelector;
