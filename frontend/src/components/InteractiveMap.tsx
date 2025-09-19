import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { HistoricalFigure, MapLocation } from '../types/historical';
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet icon fix
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
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
            },
            {
              id: 'topkapi_palace',
              title: 'Topkapı Sarayı İnşası',
              description: 'Fatih\'in yeni sarayının yapımı',
              date: '1460-1478',
              location: {} as MapLocation,
              significance: 'Osmanlı saray mimarisinin zirvesi'
            }
          ]
        },
        {
          id: 'edirne',
          name: 'Edirne',
          coordinates: [41.6771, 26.5557],
          description: 'Fatih Sultan Mehmet\'in doğum yeri ve gençlik dönemi.',
          era: '15. yüzyıl',
          relatedFigure: 'Fatih Sultan Mehmet',
          events: [
            {
              id: 'birth_place',
              title: 'Doğum Yeri',
              description: 'Fatih Sultan Mehmet\'in doğduğu şehir',
              date: '1432',
              location: {} as MapLocation,
              significance: 'Büyük fatihin doğum yeri'
            }
          ]
        },
        {
          id: 'gallipoli',
          name: 'Gelibolu',
          coordinates: [40.4075, 26.6708],
          description: 'Fatih\'in Avrupa\'ya geçiş noktası ve stratejik önemi.',
          era: '15. yüzyıl',
          relatedFigure: 'Fatih Sultan Mehmet'
        },
        {
          id: 'trabzon',
          name: 'Trabzon',
          coordinates: [41.0015, 39.7178],
          description: 'Fatih\'in Trabzon Rum İmparatorluğu\'nu fethettiği şehir.',
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
            },
            {
              id: 'republic_declaration',
              title: 'Cumhuriyet İlanı',
              description: '29 Ekim 1923\'te Cumhuriyet\'in ilan edildiği şehir',
              date: '1923',
              location: {} as MapLocation,
              significance: 'Türkiye Cumhuriyeti\'nin kuruluşu'
            }
          ]
        },
        {
          id: 'istanbul_ataturk',
          name: 'İstanbul',
          coordinates: [41.0082, 28.9784],
          description: 'Atatürk\'ün eğitim gördüğü ve askeri kariyerine başladığı şehir.',
          era: '19-20. yüzyıl',
          relatedFigure: 'Mustafa Kemal Atatürk',
          events: [
            {
              id: 'military_academy',
              title: 'Harbiye Mektebi',
              description: 'Atatürk\'ün askeri eğitim aldığı okul',
              date: '1899-1902',
              location: {} as MapLocation,
              significance: 'Askeri kariyerinin başlangıcı'
            }
          ]
        },
        {
          id: 'samsun',
          name: 'Samsun',
          coordinates: [41.2928, 36.3313],
          description: 'Atatürk\'ün Kurtuluş Savaşı\'nı başlattığı şehir.',
          era: '20. yüzyıl',
          relatedFigure: 'Mustafa Kemal Atatürk',
          events: [
            {
              id: 'samsun_landing',
              title: 'Samsun\'a Çıkış',
              description: '19 Mayıs 1919\'da Kurtuluş Savaşı\'nın başlangıcı',
              date: '1919',
              location: {} as MapLocation,
              significance: 'Milli Mücadele\'nin başlangıcı'
            }
          ]
        },
        {
          id: 'izmir',
          name: 'İzmir',
          coordinates: [38.4192, 27.1287],
          description: 'Atatürk\'ün Yunan işgalinden kurtardığı şehir.',
          era: '20. yüzyıl',
          relatedFigure: 'Mustafa Kemal Atatürk',
          events: [
            {
              id: 'izmir_liberation',
              title: 'İzmir\'in Kurtuluşu',
              description: '9 Eylül 1922\'de İzmir\'in düşman işgalinden kurtarılması',
              date: '1922',
              location: {} as MapLocation,
              significance: 'Kurtuluş Savaşı\'nın zaferle sonuçlanması'
            }
          ]
        },
        {
          id: 'bursa',
          name: 'Bursa',
          coordinates: [40.1826, 29.0665],
          description: 'Atatürk\'ün eğitim reformlarını başlattığı şehir.',
          era: '20. yüzyıl',
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
            },
            {
              id: 'arc_de_triomphe',
              title: 'Arc de Triomphe',
              description: 'Napolyon\'un zaferlerini kutlamak için yaptırdığı anıt',
              date: '1806-1836',
              location: {} as MapLocation,
              significance: 'Fransız askeri zaferlerinin simgesi'
            }
          ]
        },
        {
          id: 'waterloo',
          name: 'Waterloo',
          coordinates: [50.7147, 4.3991],
          description: 'Napolyon\'un son savaşı ve yenilgisi.',
          era: '19. yüzyıl',
          relatedFigure: 'Napolyon Bonaparte',
          events: [
            {
              id: 'battle_of_waterloo',
              title: 'Waterloo Savaşı',
              description: '18 Haziran 1815\'te Napolyon\'un son yenilgisi',
              date: '1815',
              location: {} as MapLocation,
              significance: 'Napolyon\'un imparatorluk döneminin sonu'
            }
          ]
        },
        {
          id: 'ajaccio',
          name: 'Ajaccio',
          coordinates: [41.9267, 8.7369],
          description: 'Napolyon\'un doğum yeri ve çocukluk şehri.',
          era: '18. yüzyıl',
          relatedFigure: 'Napolyon Bonaparte',
          events: [
            {
              id: 'birth_place_napoleon',
              title: 'Doğum Yeri',
              description: 'Napolyon Bonaparte\'ın doğduğu şehir',
              date: '1769',
              location: {} as MapLocation,
              significance: 'Büyük imparatorun doğum yeri'
            }
          ]
        },
        {
          id: 'moscow',
          name: 'Moskova',
          coordinates: [55.7558, 37.6176],
          description: 'Napolyon\'un Rusya seferi ve büyük yenilgisi.',
          era: '19. yüzyıl',
          relatedFigure: 'Napolyon Bonaparte',
          events: [
            {
              id: 'moscow_campaign',
              title: 'Rusya Seferi',
              description: '1812\'de Napolyon\'un Rusya\'ya düzenlediği sefer',
              date: '1812',
              location: {} as MapLocation,
              significance: 'Napolyon\'un gücünün azalmasının başlangıcı'
            }
          ]
        },
        {
          id: 'elba',
          name: 'Elba Adası',
          coordinates: [42.7667, 10.2333],
          description: 'Napolyon\'un ilk sürgün yeri.',
          era: '19. yüzyıl',
          relatedFigure: 'Napolyon Bonaparte',
          events: [
            {
              id: 'first_exile',
              title: 'İlk Sürgün',
              description: 'Napolyon\'un 1814-1815 arası sürgün yeri',
              date: '1814-1815',
              location: {} as MapLocation,
              significance: 'Napolyon\'un ilk sürgün dönemi'
            }
          ]
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
            zoom={4}
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
