import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// InteractiveAvatar removed - using simple img instead
import { cn } from '@/lib/utils';
import { CalendarDays, MapPin, Crown } from 'lucide-react';

interface CharacterCardProps {
  id: string;
  name: string;
  period: string;
  country: string;
  title: string;
  description: string;
  avatarSrc: string;
  onSelect: (id: string) => void;
  isSelected?: boolean;
  variant?: 'gold' | 'bronze' | 'silver';
  gradientClass?: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  id,
  name,
  period,
  country,
  title,
  description,
  avatarSrc,
  onSelect,
  isSelected = false,
  variant = 'gold',
  gradientClass = 'gradient-primary'
}) => {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-smooth card-interactive group cursor-pointer",
        "hover:border-primary/50",
        isSelected && "border-primary shadow-glow"
      )}
      onClick={() => onSelect(id)}
    >
      {/* Background gradient overlay */}
      <div className={cn("absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity", gradientClass)} />
      
      <CardHeader className="relative pb-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={avatarSrc}
              alt={name}
              className={cn(
                "w-20 h-20 rounded-full object-cover border-4 transition-all duration-300",
                isSelected ? "border-primary shadow-glow" : "border-muted",
                variant === 'gold' && "border-yellow-500",
                variant === 'silver' && "border-gray-400",
                variant === 'bronze' && "border-orange-600"
              )}
            />
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            
            <Badge variant="secondary" className="text-xs">
              <Crown className="w-3 h-3 mr-1" />
              {title}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span>{period}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{country}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        <Button 
          variant={isSelected ? "default" : "secondary"}
          size="sm" 
          className="w-full transition-smooth"
        >
          {isSelected ? "Seçili Karakter" : "Bu Karakteri Seç"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CharacterCard;