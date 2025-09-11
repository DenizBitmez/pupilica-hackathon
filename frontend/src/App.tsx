import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import ChatInterface from './components/ChatInterface';
import HistoricalFigureSelector from './components/HistoricalFigureSelector';
import InteractiveMap from './components/InteractiveMap';
import Avatar from './components/Avatar';
import Header from './components/Header';
import { HistoricalFigure } from './types/historical';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [selectedFigure, setSelectedFigure] = useState<HistoricalFigure | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Panel - Tarihi Figür Seçimi ve Avatar */}
          <div className="lg:col-span-1 space-y-6">
            <HistoricalFigureSelector 
              selectedFigure={selectedFigure}
              onFigureSelect={setSelectedFigure}
            />
            
            {selectedFigure && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-historical font-semibold text-gray-800 mb-4">
                  {selectedFigure.name}
                </h3>
                <Avatar 
                  figure={selectedFigure}
                  isConnected={isConnected}
                />
              </div>
            )}
          </div>

          {/* Orta Panel - Sohbet Arayüzü */}
          <div className="lg:col-span-1">
            {selectedFigure ? (
              <ChatInterface 
                figure={selectedFigure}
                socket={socket}
                isConnected={isConnected}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">🏛️</div>
                <h2 className="text-2xl font-historical text-gray-700 mb-2">
                  Tarih-i Sima'ya Hoş Geldiniz
                </h2>
                <p className="text-gray-600">
                  Öğrenmek istediğiniz tarihi figürü seçin ve sohbet etmeye başlayın!
                </p>
              </div>
            )}
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
    </div>
  );
}

export default App;
