import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { HistoricalFigure, MapLocation } from '../types/historical';
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface InteractiveMapProps {
  selectedFigure: HistoricalFigure | null;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ selectedFigure }) => {
  const mapRef = useRef<L.Map>(null);

  // Tarihi figürlere göre konumlar
  const getHistoricalLocations = (figure: HistoricalFigure | null): MapLocation[] => {
    if (!figure) return [];

    const locations: { [key: string]: MapLocation[] } = {
      fatih_sultan_mehmet: [
        {
          id: 'istanbul_1453',
          name: 'İstanbul Fethi (1453)',
          coordinates: [41.0082, 28.9784],
          description: 'Fatih Sultan Mehmet\'in İstanbul\'u fethettiği tarihi olay.',
          era: '15. yüzyıl',
          relatedFigure: 'Fatih Sultan Mehmet',
          events: [
            {
              id: 'fall_of_constantinople',
              title: 'Konstantinopolis\'in Düşüşü',
              description: '29 Mayıs 1453\'te İstanbul\'un fethi',
              date: '1453',
              location: {} as MapLocation,
              significance: 'Orta Çağ\'ın sonu, Yeni Çağ\'ın başlangıcı'
            }
          ]
        },
        {
          id: 'edirne',
          name: 'Edirne',
          coordinates: [41.6771, 26.5557],
          description: 'Fatih Sultan Mehmet\'in doğum yeri ve gençlik dönemi.',
          era: '15. yüzyıl',
          relatedFigure: 'Fatih Sultan Mehmet'
        }
      ],
      ataturk: [
        {
          id: 'ankara',
          name: 'Ankara',
          coordinates: [39.9334, 32.8597],
          description: 'Türkiye Cumhuriyeti\'nin başkenti ve Atatürk\'ün çalışma merkezi.',
          era: '20. yüzyıl',
          relatedFigure: 'Mustafa Kemal Atatürk',
          events: [
            {
              id: 'independence_war',
              title: 'Kurtuluş Savaşı',
              description: 'Türk Kurtuluş Savaşı\'nın yönetildiği merkez',
              date: '1919-1923',
              location: {} as MapLocation,
              significance: 'Türkiye\'nin bağımsızlığının kazanılması'
            }
          ]
        },
        {
          id: 'istanbul_ataturk',
          name: 'İstanbul',
          coordinates: [41.0082, 28.9784],
          description: 'Atatürk\'ün eğitim gördüğü ve askeri kariyerine başladığı şehir.',
          era: '19-20. yüzyıl',
          relatedFigure: 'Mustafa Kemal Atatürk'
        }
      ],
      napoleon: [
        {
          id: 'paris',
          name: 'Paris',
          coordinates: [48.8566, 2.3522],
          description: 'Napolyon\'un imparatorluk merkezi ve yönetim başkenti.',
          era: '18-19. yüzyıl',
          relatedFigure: 'Napolyon Bonaparte',
          events: [
            {
              id: 'coronation',
              title: 'Taç Giyme Töreni',
              description: 'Napolyon\'un imparator olarak taç giydiği tören',
              date: '1804',
              location: {} as MapLocation,
              significance: 'Fransız İmparatorluğu\'nun kuruluşu'
            }
          ]
        },
        {
          id: 'waterloo',
          name: 'Waterloo',
          coordinates: [50.7147, 4.3991],
          description: 'Napolyon\'un son savaşı ve yenilgisi.',
          era: '19. yüzyıl',
          relatedFigure: 'Napolyon Bonaparte'
        }
      ]
    };

    return locations[figure.id] || [];
  };

  const locations = getHistoricalLocations(selectedFigure);

  // Harita merkezini seçili figüre göre ayarla
  useEffect(() => {
    if (mapRef.current && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => loc.coordinates));
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [locations]);

  return (
    <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <h3 className="font-historical font-semibold text-gray-800 flex items-center">
          <MapPinIcon className="h-5 w-5 mr-2 text-amber-600" />
          Tarihi Harita
        </h3>
        {selectedFigure && (
          <p className="text-sm text-gray-600 mt-1">
            {selectedFigure.name} ile ilgili önemli konumlar
          </p>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {selectedFigure ? (
          <MapContainer
            ref={mapRef}
            center={[39.9334, 32.8597]} // Ankara merkez
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            className="rounded-b-xl"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={location.coordinates}
                icon={L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div class="bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">📍</div>`,
                  iconSize: [32, 32],
                  iconAnchor: [16, 16]
                })}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-historical font-semibold text-gray-800 mb-2">
                      {location.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {location.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {location.era}
                    </div>
                    {location.events && location.events.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-amber-600 mb-1">
                          Önemli Olaylar:
                        </p>
                        {location.events.map((event) => (
                          <div key={event.id} className="text-xs text-gray-600">
                            • {event.title} ({event.date})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-center p-8">
            <div>
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-lg font-historical text-gray-700 mb-2">
                Tarihi Harita
              </h3>
              <p className="text-gray-600">
                Bir tarihi figür seçin ve ilgili konumları haritada görün
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
