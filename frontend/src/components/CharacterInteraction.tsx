import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AnimatedAvatar from './AnimatedAvatar';
import ChatInterface from './ChatInterface';
import HistoricalQuiz from './HistoricalQuiz';
import HistoricalTimeline from './HistoricalTimeline';
import InteractiveMap from './InteractiveMap';
import { HistoricalFigure } from '../types/historical';
import { io, Socket } from 'socket.io-client';

interface Character {
  id: string;
  name: string;
  period: string;
  country: string;
  title: string;
  avatarSrc: string;
  variant: 'gold' | 'bronze' | 'silver';
}

interface CharacterInteractionProps {
  character: Character;
  onBack: () => void;
}

const CharacterInteraction: React.FC<CharacterInteractionProps> = ({
  character,
  onBack
}) => {
  const [currentView, setCurrentView] = useState<'avatar' | 'chat' | 'quiz' | 'timeline' | 'map'>('avatar');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mouthOpen, setMouthOpen] = useState<number | undefined>(undefined);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Socket.io bağlantısı
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('Backend\'e bağlandı');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Backend bağlantısı kesildi');
      setIsConnected(false);
    });

    newSocket.on('ai_response', (data) => {
      console.log('AI yanıtı alındı:', data);
      setIsSpeaking(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Character'i HistoricalFigure formatına çevir
  const historicalFigure: HistoricalFigure = {
    id: character.id,
    name: character.name,
    era: character.period,
    location: character.country,
    description: character.title,
    achievements: [],
    personality: '',
    speechPattern: '',
    historicalContext: ''
  };

  const handleStartChat = () => {
    setCurrentView('chat');
  };

  const handleBackToAvatar = () => {
    setCurrentView('avatar');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'avatar':
        return (
          <AnimatedAvatar
            character={historicalFigure}
            isSpeaking={isSpeaking}
            isListening={isListening}
            mouthOpen={mouthOpen}
            onStartChat={handleStartChat}
            onStartQuiz={() => setCurrentView('quiz')}
            onStartTimeline={() => setCurrentView('timeline')}
            onStartMap={() => setCurrentView('map')}
            onBack={onBack}
          />
        );
      case 'chat':
        return (
          <div className="min-h-screen bg-background p-4">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleBackToAvatar}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Avatar'a Dön
                </Button>
                <Button variant="outline" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Karakter Seçimine Dön
                </Button>
              </div>
              <ChatInterface
                figure={historicalFigure}
                socket={socket}
                isConnected={isConnected}
                onListeningChange={setIsListening}
                onMouthOpenChange={setMouthOpen}
                onSpeakingChange={setIsSpeaking}
              />
            </div>
          </div>
        );
      case 'quiz':
        return (
          <div className="min-h-screen bg-background p-4">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleBackToAvatar}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Avatar'a Dön
                </Button>
                <Button variant="outline" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Karakter Seçimine Dön
                </Button>
              </div>
              <HistoricalQuiz
                character={historicalFigure}
                isVisible={true}
                onClose={handleBackToAvatar}
              />
            </div>
          </div>
        );
      case 'timeline':
        return (
          <div className="min-h-screen bg-background p-4">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleBackToAvatar}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Avatar'a Dön
                </Button>
                <Button variant="outline" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Karakter Seçimine Dön
                </Button>
              </div>
              <HistoricalTimeline
                character={historicalFigure}
                isVisible={true}
                onClose={handleBackToAvatar}
              />
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="min-h-screen bg-background p-4">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleBackToAvatar}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Avatar'a Dön
                </Button>
                <Button variant="outline" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Karakter Seçimine Dön
                </Button>
              </div>
              <InteractiveMap selectedFigure={historicalFigure} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return renderCurrentView();
};

export default CharacterInteraction;