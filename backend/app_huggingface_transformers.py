from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
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

# Model yapılandırması
MODEL_CONFIG = {
    "model_name": "microsoft/DialoGPT-medium",  # Varsayılan model
    "max_length": 500,
    "temperature": 0.7,
    "do_sample": True,
    "pad_token_id": None
}

# Global model değişkenleri
tokenizer = None
model = None
generator = None

# Tarihi figürler ve kişilikleri
HISTORICAL_FIGURES = {
    "fatih_sultan_mehmet": {
        "name": "Fatih Sultan Mehmet",
        "personality": "Ben Fatih Sultan Mehmet. 1453'te İstanbul'u fetheden Osmanlı padişahıyım. Bilim, sanat ve strateji konularında konuşmayı severim. Sert ama adil bir liderim.",
        "era": "15. yüzyıl",
        "location": "İstanbul, Osmanlı İmparatorluğu",
        "system_prompt": "Sen Fatih Sultan Mehmet'sin. 1453'te İstanbul'u fetheden Osmanlı padişahısın. Bilim, sanat ve strateji konularında uzmansın. Sert ama adil bir lider olarak konuş. Tarihi gerçeklere dayalı yanıtlar ver. Türkçe konuş."
    },
    "ataturk": {
        "name": "Mustafa Kemal Atatürk",
        "personality": "Ben Mustafa Kemal Atatürk. Türkiye Cumhuriyeti'nin kurucusu ve ilk cumhurbaşkanıyım. Modernleşme, eğitim ve bağımsızlık konularında tutkulu bir liderim.",
        "era": "19-20. yüzyıl",
        "location": "Ankara, Türkiye",
        "system_prompt": "Sen Mustafa Kemal Atatürk'sün. Türkiye Cumhuriyeti'nin kurucusu ve ilk cumhurbaşkanısın. Modernleşme, eğitim ve bağımsızlık konularında tutkulusun. Tarihi gerçeklere dayalı yanıtlar ver. Türkçe konuş."
    },
    "napoleon": {
        "name": "Napolyon Bonaparte",
        "personality": "Ben Napolyon Bonaparte. Fransız İmparatoru ve büyük bir askeri dehayım. Strateji, savaş ve yönetim konularında uzmanım.",
        "era": "18-19. yüzyıl",
        "location": "Paris, Fransa",
        "system_prompt": "Sen Napolyon Bonaparte'sın. Fransız İmparatoru ve büyük bir askeri dehasın. Strateji, savaş ve yönetim konularında uzmansın. Tarihi gerçeklere dayalı yanıtlar ver. Türkçe konuş."
    }
}

def load_model():
    """Modeli yükle"""
    global tokenizer, model, generator
    
    try:
        print(f"🔄 Model yükleniyor: {MODEL_CONFIG['model_name']}")
        
        # Tokenizer ve model yükle
        tokenizer = AutoTokenizer.from_pretrained(MODEL_CONFIG['model_name'])
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_CONFIG['model_name'],
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            device_map="auto" if torch.cuda.is_available() else None
        )
        
        # Pad token ayarla
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
        
        # Generator pipeline oluştur
        generator = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            device=0 if torch.cuda.is_available() else -1
        )
        
        print("✅ Model başarıyla yüklendi!")
        
    except Exception as e:
        print(f"❌ Model yükleme hatası: {e}")
        # Fallback model
        MODEL_CONFIG["model_name"] = "gpt2"
        load_model()

def generate_response(figure, user_message):
    """AI yanıtı oluştur"""
    try:
        # Sistem prompt + kullanıcı mesajı
        prompt = f"{figure['system_prompt']}\n\nKullanıcı: {user_message}\n{figure['name']}:"
        
        # Yanıt oluştur
        response = generator(
            prompt,
            max_length=MODEL_CONFIG['max_length'],
            temperature=MODEL_CONFIG['temperature'],
            do_sample=MODEL_CONFIG['do_sample'],
            pad_token_id=tokenizer.pad_token_id,
            num_return_sequences=1
        )
        
        # Yanıtı temizle
        generated_text = response[0]['generated_text']
        ai_response = generated_text.split(f"{figure['name']}:")[-1].strip()
        
        # Eğer yanıt çok kısa veya boşsa, fallback yanıt
        if len(ai_response) < 10:
            ai_response = f"Merhaba! Ben {figure['name']}. {figure['personality']} Sorunuzu daha detaylı sorabilir misiniz?"
        
        return ai_response
        
    except Exception as e:
        print(f"❌ Yanıt oluşturma hatası: {e}")
        return f"Merhaba! Ben {figure['name']}. Şu anda teknik bir sorun yaşıyorum, lütfen daha sonra tekrar deneyin."

@app.route('/')
def home():
    return jsonify({
        "message": "Tarih-i Sima API'ye hoş geldiniz! (Hugging Face Transformers)",
        "version": "3.0.0",
        "model": MODEL_CONFIG["model_name"],
        "device": "cuda" if torch.cuda.is_available() else "cpu",
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
        
        # Model yüklü değilse yükle
        if generator is None:
            load_model()
        
        # AI yanıtı oluştur
        ai_response = generate_response(figure, message)
        
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

@app.route('/api/models/switch', methods=['POST'])
def switch_model():
    """Model değiştir"""
    try:
        data = request.get_json()
        new_model = data.get('model_name')
        
        if not new_model:
            return jsonify({"error": "model_name gerekli"}), 400
        
        MODEL_CONFIG["model_name"] = new_model
        
        # Yeni modeli yükle
        load_model()
        
        return jsonify({
            "message": f"Model {new_model} olarak değiştirildi",
            "current_model": MODEL_CONFIG["model_name"]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/models/available', methods=['GET'])
def get_available_models():
    """Mevcut modelleri listele"""
    available_models = [
        "microsoft/DialoGPT-medium",
        "microsoft/DialoGPT-small",
        "microsoft/DialoGPT-large",
        "facebook/blenderbot-400M-distill",
        "facebook/blenderbot-1B-distill",
        "EleutherAI/gpt-neo-2.7B",
        "EleutherAI/gpt-neo-1.3B",
        "gpt2",
        "gpt2-medium",
        "gpt2-large"
    ]
    
    return jsonify({
        "models": available_models,
        "current_model": MODEL_CONFIG["model_name"],
        "recommended": "microsoft/DialoGPT-medium"
    })

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
            
            # Model yüklü değilse yükle
            if generator is None:
                load_model()
            
            # AI yanıtı oluştur
            ai_response = generate_response(figure, message)
            
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
    print(f"🖥️ Device: {'cuda' if torch.cuda.is_available() else 'cpu'}")
    
    # Modeli arka planda yükle
    threading.Thread(target=load_model, daemon=True).start()
    
    socketio.run(app, host='0.0.0.0', port=port, debug=True)
