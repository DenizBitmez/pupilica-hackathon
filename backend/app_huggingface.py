from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import ollama
import os
from dotenv import load_dotenv
from gtts import gTTS
import io
import base64
import json
from datetime import datetime
import threading
import time

# Environment variables yükle
load_dotenv()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Ollama bağlantısı
OLLAMA_BASE_URL = os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')

# Tarihi figürler ve kişilikleri
HISTORICAL_FIGURES = {
    "fatih_sultan_mehmet": {
        "name": "Fatih Sultan Mehmet",
        "personality": "Ben Fatih Sultan Mehmet. 1453'te İstanbul'u fetheden Osmanlı padişahıyım. Bilim, sanat ve strateji konularında konuşmayı severim. Sert ama adil bir liderim. Tarihi gerçeklere dayalı olarak yanıt veririm.",
        "era": "15. yüzyıl",
        "location": "İstanbul, Osmanlı İmparatorluğu",
        "avatar": "👑",
        "color": "from-amber-400 to-orange-500",
        "system_prompt": "Sen Fatih Sultan Mehmet'sin. 1453'te İstanbul'u fetheden Osmanlı padişahısın. Bilim, sanat ve strateji konularında uzmansın. Sert ama adil bir lider olarak konuş. Tarihi gerçeklere dayalı yanıtlar ver. MUTLAKA TÜRKÇE KONUŞ. Hiçbir zaman İngilizce konuşma. Sadece Türkçe yanıt ver."
    },
    "ataturk": {
        "name": "Mustafa Kemal Atatürk",
        "personality": "Ben Mustafa Kemal Atatürk. Türkiye Cumhuriyeti'nin kurucusu ve ilk cumhurbaşkanıyım. Modernleşme, eğitim ve bağımsızlık konularında tutkulu bir liderim. Bilim, sanat ve kadın hakları konularında öncüyüm.",
        "era": "19-20. yüzyıl",
        "location": "Ankara, Türkiye",
        "avatar": "🎖️",
        "color": "from-red-400 to-red-600",
        "voice_characteristics": "Güçlü, kararlı ve ilham verici ses tonu",
        "visual_description": "Modern kıyafetler, şapka, güçlü bakış",
        "system_prompt": "Sen Mustafa Kemal Atatürk'sün. Türkiye Cumhuriyeti'nin kurucusu ve ilk cumhurbaşkanısın. Modernleşme, eğitim, bilim, sanat ve bağımsızlık konularında tutkulusun. Kadın hakları ve çağdaşlaşma konularında öncüsün. Tarihi gerçeklere dayalı yanıtlar ver. MUTLAKA TÜRKÇE KONUŞ. Hiçbir zaman İngilizce konuşma. Sadece Türkçe yanıt ver. Ses tonun güçlü ve ilham verici. Kısa ve net cevaplar ver. Tekrar etme."
    },
    "napoleon": {
        "name": "Napolyon Bonaparte",
        "personality": "Ben Napolyon Bonaparte. Fransız İmparatoru ve büyük bir askeri dehayım. Strateji, savaş ve yönetim konularında uzmanım.",
        "era": "18-19. yüzyıl",
        "location": "Paris, Fransa",
        "avatar": "⚔️",
        "color": "from-blue-400 to-blue-600",
        "system_prompt": "Sen Napolyon Bonaparte'sın. Fransız İmparatoru ve büyük bir askeri dehasın. Strateji, savaş ve yönetim konularında uzmansın. Tarihi gerçeklere dayalı yanıtlar ver. MUTLAKA TÜRKÇE KONUŞ. Hiçbir zaman İngilizce konuşma. Sadece Türkçe yanıt ver."
    }
}

# Model yapılandırması
MODEL_CONFIG = {
    "model_name": "gemma2:2b",  # Küçük ama kaliteli Google modeli
    "temperature": 0.7,
    "max_tokens": 400,
    "top_p": 0.9
}

@app.route('/')
def home():
    return jsonify({
        "message": "Tarih-i Sima API'ye hoş geldiniz! (Hugging Face/Ollama)",
        "version": "2.0.0",
        "model": MODEL_CONFIG["model_name"],
        "available_figures": list(HISTORICAL_FIGURES.keys())
    })

@app.route('/api/figures', methods=['GET'])
def get_figures():
    """Mevcut tarihi figürleri listele"""
    return jsonify(HISTORICAL_FIGURES)

@app.route('/api/chat', methods=['POST'])
def chat():
    """Tarihi figürle sohbet et"""
    try:
        data = request.get_json()
        figure_id = data.get('figure_id')
        message = data.get('message')
        
        if not figure_id or not message:
            return jsonify({"error": "figure_id ve message gerekli"}), 400
        
        if figure_id not in HISTORICAL_FIGURES:
            return jsonify({"error": "Geçersiz figür ID'si"}), 400
        
        figure = HISTORICAL_FIGURES[figure_id]
        
        # Ollama ile yanıt oluştur
        try:
            response = ollama.chat(
                model=MODEL_CONFIG["model_name"],
                messages=[
                    {
                        "role": "system",
                        "content": figure["system_prompt"]
                    },
                    {
                        "role": "user",
                        "content": message
                    }
                ],
                options={
                    "temperature": MODEL_CONFIG["temperature"],
                    "num_predict": MODEL_CONFIG["max_tokens"],
                    "top_p": MODEL_CONFIG["top_p"]
                }
            )
            
            ai_response = response['message']['content']
            
        except Exception as e:
            print(f"Ollama hatası: {e}")
            # Fallback: Basit yanıt
            ai_response = f"Merhaba! Ben {figure['name']}. Şu anda teknik bir sorun yaşıyorum, lütfen daha sonra tekrar deneyin."
        
        # TTS ile ses dosyası oluştur
        try:
            tts = gTTS(text=ai_response, lang='tr', slow=False)
            audio_buffer = io.BytesIO()
            tts.write_to_fp(audio_buffer)
            audio_buffer.seek(0)
            audio_base64 = base64.b64encode(audio_buffer.read()).decode()
        except Exception as e:
            print(f"TTS hatası: {e}")
            audio_base64 = None
        
        return jsonify({
            "response": ai_response,
            "figure_name": figure['name'],
            "audio": audio_base64,
            "timestamp": datetime.now().isoformat(),
            "model": MODEL_CONFIG["model_name"]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/tts', methods=['POST'])
def text_to_speech():
    """Metni sese çevir"""
    try:
        data = request.get_json()
        text = data.get('text')
        
        if not text:
            return jsonify({"error": "text gerekli"}), 400
        
        tts = gTTS(text=text, lang='tr', slow=False)
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        audio_base64 = base64.b64encode(audio_buffer.read()).decode()
        
        return jsonify({
            "audio": audio_base64,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/models', methods=['GET'])
def get_models():
    """Mevcut modelleri listele"""
    try:
        models = ollama.list()
        return jsonify({
            "models": [model['name'] for model in models['models']],
            "current_model": MODEL_CONFIG["model_name"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/models/switch', methods=['POST'])
def switch_model():
    """Model değiştir"""
    try:
        data = request.get_json()
        new_model = data.get('model_name')
        
        if not new_model:
            return jsonify({"error": "model_name gerekli"}), 400
        
        # Modelin mevcut olup olmadığını kontrol et
        models = ollama.list()
        available_models = [model['name'] for model in models['models']]
        
        if new_model not in available_models:
            return jsonify({"error": f"Model {new_model} bulunamadı"}), 400
        
        MODEL_CONFIG["model_name"] = new_model
        
        return jsonify({
            "message": f"Model {new_model} olarak değiştirildi",
            "current_model": MODEL_CONFIG["model_name"]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@socketio.on('connect')
def handle_connect():
    print('Kullanıcı bağlandı')
    emit('connected', {
        'message': 'Sunucuya başarıyla bağlandınız',
        'model': MODEL_CONFIG["model_name"]
    })

@socketio.on('disconnect')
def handle_disconnect():
    print('Kullanıcı ayrıldı')

@socketio.on('chat_message')
def handle_chat_message(data):
    """WebSocket üzerinden sohbet mesajı işle"""
    try:
        figure_id = data.get('figure_id')
        message = data.get('message')
        
        if figure_id in HISTORICAL_FIGURES:
            figure = HISTORICAL_FIGURES[figure_id]
            
            # Ollama ile yanıt oluştur
            try:
                response = ollama.chat(
                    model=MODEL_CONFIG["model_name"],
                    messages=[
                        {
                            "role": "system",
                            "content": figure["system_prompt"]
                        },
                        {
                            "role": "user",
                            "content": message
                        }
                    ],
                    options={
                        "temperature": MODEL_CONFIG["temperature"],
                        "num_predict": MODEL_CONFIG["max_tokens"],
                        "top_p": MODEL_CONFIG["top_p"]
                    }
                )
                
                ai_response = response['message']['content']
                
            except Exception as e:
                print(f"Ollama hatası: {e}")
                ai_response = f"Merhaba! Ben {figure['name']}. Şu anda teknik bir sorun yaşıyorum."
            
            # Yanıtı istemciye gönder
            emit('ai_response', {
                'response': ai_response,
                'figure_name': figure['name'],
                'timestamp': datetime.now().isoformat(),
                'model': MODEL_CONFIG["model_name"]
            })
            
    except Exception as e:
        emit('error', {'message': str(e)})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"🚀 Tarih-i Sima Backend başlatılıyor...")
    print(f"📊 Model: {MODEL_CONFIG['model_name']}")
    print(f"🌐 Port: {port}")
    print(f"🔗 Ollama URL: {OLLAMA_BASE_URL}")
    socketio.run(app, host='0.0.0.0', port=port, debug=True)
