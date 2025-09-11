# Tarih-i Sima Kurulum Rehberi

## Gereksinimler

- Python 3.8+
- Node.js 16+
- npm veya yarn
- OpenAI API Key

## Kurulum Adımları

### 1. Projeyi İndirin
```bash
git clone <repository-url>
cd pupilica
```

### 2. Backend Kurulumu

```bash
cd backend
pip install -r requirements.txt
```

### 3. Environment Variables Ayarlayın

Backend klasöründe `.env` dosyası oluşturun:

```env
OPENAI_API_KEY=your_openai_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
HOST=localhost
PORT=5000
TTS_LANGUAGE=tr
TTS_SLOW=False
```

### 4. Frontend Kurulumu

```bash
cd frontend
npm install
```

### 5. Uygulamayı Çalıştırın

**Backend'i başlatın:**
```bash
cd backend
python app.py
```

**Frontend'i başlatın (yeni terminal):**
```bash
cd frontend
npm start
```

### 6. Uygulamayı Kullanın

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Özellikler

### ✅ Tamamlanan Özellikler
- [x] React TypeScript frontend
- [x] Flask backend API
- [x] OpenAI GPT-3.5 entegrasyonu
- [x] Text-to-Speech (TTS) desteği
- [x] Socket.io gerçek zamanlı iletişim
- [x] Tarihi figür seçimi
- [x] Sohbet arayüzü
- [x] Interaktif harita (Leaflet)
- [x] Avatar sistemi
- [x] Modern UI (Tailwind CSS)

### 🔄 Geliştirilecek Özellikler
- [ ] 3D avatar animasyonları (Three.js)
- [ ] Sesli giriş (Speech-to-Text)
- [ ] Daha fazla tarihi figür
- [ ] Tarihi olay zaman çizelgesi
- [ ] Çoklu dil desteği
- [ ] Kullanıcı hesapları
- [ ] Sohbet geçmişi kaydetme

## API Endpoints

### GET /api/figures
Mevcut tarihi figürleri listeler.

### POST /api/chat
Tarihi figürle sohbet eder.

**Request:**
```json
{
  "figure_id": "fatih_sultan_mehmet",
  "message": "Merhaba, nasılsınız?"
}
```

**Response:**
```json
{
  "response": "Merhaba! Ben Fatih Sultan Mehmet...",
  "figure_name": "Fatih Sultan Mehmet",
  "audio": "base64_encoded_audio",
  "timestamp": "2024-01-01T12:00:00"
}
```

### POST /api/tts
Metni sese çevirir.

**Request:**
```json
{
  "text": "Merhaba dünya"
}
```

## Sorun Giderme

### Backend Bağlantı Hatası
- OpenAI API key'inizi kontrol edin
- Port 5000'in kullanımda olmadığından emin olun
- Python paketlerinin doğru yüklendiğini kontrol edin

### Frontend Hatası
- Node.js ve npm versiyonlarını kontrol edin
- `npm install` komutunu tekrar çalıştırın
- Port 3000'in kullanımda olmadığından emin olun

### Harita Görünmüyor
- İnternet bağlantınızı kontrol edin
- Leaflet CSS dosyalarının yüklendiğinden emin olun

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
