# Ollama ile Açık Kaynaklı AI Kurulumu

## Ollama Nedir?

Ollama, büyük dil modellerini yerel olarak çalıştırmanızı sağlayan açık kaynaklı bir araçtır. OpenAI'a alternatif olarak ücretsiz ve özel modeller kullanabilirsiniz.

## Kurulum Adımları

### 1. Ollama'yı İndirin ve Kurun

**Windows için:**
1. https://ollama.ai/download adresinden Windows sürümünü indirin
2. İndirilen dosyayı çalıştırın ve kurulumu tamamlayın
3. Kurulum sonrası Ollama otomatik olarak başlayacak

**Alternatif (PowerShell ile):**
```powershell
# Winget ile kurulum
winget install Ollama.Ollama

# Veya Chocolatey ile
choco install ollama
```

### 2. Model İndirin

Kurulum sonrası terminal/command prompt açın ve şu komutları çalıştırın:

```bash
# Temel sohbet modeli (7B parametre)
ollama pull llama2:7b

# Daha gelişmiş model (13B parametre)
ollama pull llama2:13b

# Mistral modeli (daha hızlı)
ollama pull mistral:7b

# Code modeli (kod yazma için)
ollama pull codellama:7b

# Türkçe destekli model
ollama pull neural-chat:7b
```

### 3. Model Test Edin

```bash
# Modeli test et
ollama run llama2:7b

# Test mesajı
>>> Merhaba, nasılsın?
```

### 4. Backend'i Güncelleyin

```bash
cd backend
pip install -r requirements_huggingface.txt
```

### 5. Yeni Backend'i Çalıştırın

```bash
python app_huggingface.py
```

## Önerilen Modeller

### 🚀 Hızlı Modeller (7B parametre)
- `llama2:7b` - Genel amaçlı, iyi performans
- `mistral:7b` - Hızlı ve verimli
- `neural-chat:7b` - Türkçe destekli

### 🧠 Güçlü Modeller (13B+ parametre)
- `llama2:13b` - Daha iyi anlama
- `mistral:13b` - Gelişmiş mantık
- `codellama:13b` - Kod yazma

### 💡 Özel Modeller
- `llama2-uncensored` - Kısıtlamasız
- `wizard-vicuna-uncensored` - Detaylı yanıtlar
- `orca-mini` - Küçük ama etkili

## Performans Karşılaştırması

| Model | Boyut | RAM | Hız | Kalite |
|-------|-------|-----|-----|--------|
| llama2:7b | 3.8GB | 8GB | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| llama2:13b | 7.3GB | 16GB | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| mistral:7b | 4.1GB | 8GB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| neural-chat:7b | 3.8GB | 8GB | ⭐⭐⭐⭐ | ⭐⭐⭐ |

## Avantajlar

### ✅ Ollama Avantajları
- **Ücretsiz**: Hiçbir API ücreti yok
- **Gizlilik**: Verileriniz yerel kalır
- **Özelleştirilebilir**: İstediğiniz modeli kullanın
- **Offline**: İnternet bağlantısı olmadan çalışır
- **Hızlı**: Yerel işlem gücü

### ❌ Dezavantajlar
- **RAM Gereksinimi**: En az 8GB RAM gerekli
- **İlk Kurulum**: Model indirme süresi
- **Donanım**: GPU olmadan yavaş olabilir

## GPU Desteği

### NVIDIA GPU
```bash
# CUDA desteği için
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### AMD GPU
```bash
# ROCm desteği için
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.4.2
```

## Sorun Giderme

### Model İndirme Hatası
```bash
# Ollama servisini yeniden başlat
ollama serve

# Modeli tekrar indir
ollama pull llama2:7b
```

### RAM Yetersizliği
- Daha küçük model kullanın (`llama2:7b`)
- Diğer uygulamaları kapatın
- Virtual memory artırın

### Yavaş Yanıt
- GPU kullanın
- Daha küçük model seçin
- `num_predict` değerini azaltın

## Maliyet Karşılaştırması

### OpenAI GPT-3.5
- **Maliyet**: ~$0.002 per 1K token
- **Aylık tahmini**: $50-200
- **Bağımlılık**: İnternet + API key

### Ollama (Yerel)
- **Maliyet**: Sadece elektrik
- **Aylık tahmini**: $5-15
- **Bağımlılık**: Sadece donanım

## Sonuç

Ollama ile **%90 maliyet tasarrufu** sağlayabilir ve tamamen özel bir AI asistanınız olabilir! 🎉

**Önerilen Başlangıç:**
1. `llama2:7b` modelini indirin
2. Backend'i güncelleyin
3. Test edin ve beğendiğiniz modeli seçin
