import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CharacterCard from '@/components/CharacterCard';
import CharacterInteraction from '@/components/CharacterInteraction';
import { Sparkles, BookOpen, Users } from 'lucide-react';
import ataturkAvatar from '@/assets/ataturk-avatar.jpg';
import mehmetAvatar from '@/assets/mehmet-avatar.jpg';
import napoleonAvatar from '@/assets/napoleon-avatar.jpg';

const characters = [
  {
    id: 'ataturk',
    name: 'Mustafa Kemal Atatürk',
    period: '19-20. yüzyıl',
    country: 'Türkiye',
    title: 'Türkiye Cumhuriyeti\'nin Kurucusu',
    description: 'Türkiye Cumhuriyeti\'nin kurucusu ve ilk cumhurbaşkanı. 19 Mayıs 1919\'da Samsun\'a çıkarak Kurtuluş Savaşı\'nı başlattı. Modern Türkiye\'nin mimarı.',
    avatarSrc: ataturkAvatar,
    variant: 'gold' as const,
    gradientClass: 'gradient-primary'
  },
  {
    id: 'fatih_sultan_mehmet',
    name: 'Fatih Sultan Mehmet',
    period: '15. yüzyıl',
    country: 'Osmanlı İmparatorluğu',
    title: 'İstanbul\'un Fatihi',
    description: '1453\'te Konstantinopolis\'i fetheden büyük fatih. 21 yaşında şehri alarak tarihi değiştirdi. Bilim, sanat ve strateji konusunda ünlü.',
    avatarSrc: mehmetAvatar,
    variant: 'bronze' as const,
    gradientClass: 'gradient-secondary'
  },
  {
    id: 'napoleon',
    name: 'Napolyon Bonaparte',
    period: '18-19. yüzyıl',
    country: 'Fransa',
    title: 'Fransız İmparatoru',
    description: 'Fransız İmparatoru ve büyük askeri deha. Austerlitz, Jena, Friedland zaferleriyle Avrupa\'yı fethetti. Waterloo\'da son yenilgisini aldı.',
    avatarSrc: napoleonAvatar,
    variant: 'silver' as const,
    gradientClass: 'gradient-accent'
  }
];

const Index = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'selection' | 'interaction'>('selection');

  const handleCharacterSelect = (id: string) => {
    setSelectedCharacter(id);
    setCurrentView('interaction');
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
    setSelectedCharacter(null);
  };

  const currentCharacter = characters.find(char => char.id === selectedCharacter);

  if (currentView === 'interaction' && currentCharacter) {
    return (
      <CharacterInteraction 
        character={currentCharacter}
        onBack={handleBackToSelection}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center mb-6">
            <div className="gradient-primary p-4 rounded-full shadow-glow">
              <BookOpen className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Tarih-i Sima
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Tarihi Karakterlerle Sohbet Et
          </p>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Öğrenmek istediğiniz tarihi figürü seçin ve onunla konuşmaya başlayın
          </p>
          
          <div className="flex justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Etkileşimli Avatarlar</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5 text-accent" />
              <span>Tarihi Karakterler</span>
            </div>
          </div>
        </div>
      </section>

      {/* Character Selection */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Tarihi Karakterleri Keşfedin
            </h2>
            <p className="text-muted-foreground">
              Aşağıdaki karakterlerden birini seçerek onların hayat hikayelerini öğrenin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                id={character.id}
                name={character.name}
                period={character.period}
                country={character.country}
                title={character.title}
                description={character.description}
                avatarSrc={character.avatarSrc}
                onSelect={handleCharacterSelect}
                isSelected={selectedCharacter === character.id}
                variant={character.variant}
                gradientClass={character.gradientClass}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Öğrenme Deneyimini Keşfedin
            </h2>
            <p className="text-muted-foreground">
              Yapay Zeka Destekli Tarih Anlatıcısı - Geçmişi Geleceğe Taşıyoruz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="gradient-primary p-2 rounded-lg">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  Etkileşimli Avatarlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tarihi karakterlerle gerçek zamanlı etkileşim. Animasyonlu avatarlar ve oyun benzeri deneyim.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="gradient-accent p-2 rounded-lg">
                    <BookOpen className="w-6 h-6 text-accent-foreground" />
                  </div>
                  Tarihi Hikayeler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Önemli tarihi olayları karakterlerin ağzından dinleyin. Interaktif öğrenme deneyimi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
