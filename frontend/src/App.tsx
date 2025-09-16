import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import ChatInterface from './components/ChatInterface';
import HistoricalFigureSelector from './components/HistoricalFigureSelector';
import InteractiveMap from './components/InteractiveMap';
import Avatar from './components/Avatar';
import Header from './components/Header';
import AnimatedAvatar from './components/AnimatedAvatar';
import CharacterSelection from './components/CharacterSelection';
import { HistoricalFigure } from './types/historical';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [selectedFigure, setSelectedFigure] = useState<HistoricalFigure | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mouthOpen, setMouthOpen] = useState<number | undefined>(undefined);
  const [currentView, setCurrentView] = useState<'selection' | 'avatar' | 'chat'>('selection');

  useEffect(() => {
    // Socket.io bağlantısı kur
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Sunucuya bağlandı');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Sunucudan ayrıldı');
    });

    newSocket.on('ai_response', () => {
      setIsAvatarSpeaking(true);
      setTimeout(() => setIsAvatarSpeaking(false), 3000);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleCharacterSelect = (character: HistoricalFigure) => {
    setSelectedFigure(character);
    setCurrentView('avatar');
  };

  const handleStartChat = () => {
    setCurrentView('chat');
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
    setSelectedFigure(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Character Selection View */}
      {currentView === 'selection' && (
        <CharacterSelection onCharacterSelect={handleCharacterSelect} />
      )}

      {/* Animated Avatar View */}
      {currentView === 'avatar' && selectedFigure && (
        <AnimatedAvatar
          character={selectedFigure}
          isSpeaking={isAvatarSpeaking}
          isListening={isListening}
          mouthOpen={mouthOpen}
          onStartChat={handleStartChat}
        />
      )}

      {/* Chat Interface View */}
      {currentView === 'chat' && selectedFigure && (
        <>
          <Header />
          
          <main className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={handleBackToSelection}
                className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span>←</span>
                <span>Karakter Seçimine Dön</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sol Panel - Avatar */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-historical font-semibold text-gray-800 mb-4">
                    {selectedFigure.name}
                  </h3>
                  <Avatar 
                    figure={selectedFigure}
                    isConnected={isConnected}
                    isSpeaking={isAvatarSpeaking}
                    isListening={isListening}
                  />
                </div>
              </div>

              {/* Orta Panel - Sohbet Arayüzü */}
              <div className="lg:col-span-1">
                <ChatInterface 
                  figure={selectedFigure}
                  socket={socket}
                  isConnected={isConnected}
                  onListeningChange={setIsListening}
                  onMouthOpenChange={setMouthOpen}
                  onSpeakingChange={setIsAvatarSpeaking}
                />
              </div>

              {/* Sağ Panel - Interaktif Harita */}
              <div className="lg:col-span-1">
                <InteractiveMap 
                  selectedFigure={selectedFigure}
                />
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-white py-6 mt-12">
            <div className="container mx-auto px-4 text-center">
              <p className="font-historical text-lg mb-2">Tarih-i Sima</p>
              <p className="text-gray-400">
                Yapay Zeka Destekli Tarih Anlatıcısı - Geçmişi Geleceğe Taşıyoruz
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
