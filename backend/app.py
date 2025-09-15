from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import openai
import os
from dotenv import load_dotenv
from gtts import gTTS
import io
import base64
import json
from datetime import datetime

# Environment variables yükle
load_dotenv()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# OpenAI API key ayarla
openai.api_key = os.getenv('OPENAI_API_KEY')

# Tarihi figürler ve kişilikleri
HISTORICAL_FIGURES = {
    "fatih_sultan_mehmet": {
        "name": "Fatih Sultan Mehmet",
        "personality": "Ben Fatih Sultan Mehmet. 1453'te İstanbul'u fetheden Osmanlı padişahıyım. Bilim, sanat ve strateji konularında konuşmayı severim. Sert ama adil bir liderim.",
        "era": "15. yüzyıl",
        "location": "İstanbul, Osmanlı İmparatorluğu"
    },
    "ataturk": {
        "name": "Mustafa Kemal Atatürk",
        "personality": "Ben Mustafa Kemal Atatürk. Türkiye Cumhuriyeti'nin kurucusu ve ilk cumhurbaşkanıyım. Modernleşme, eğitim ve bağımsızlık konularında tutkulu bir liderim.",
        "era": "19-20. yüzyıl",
        "location": "Ankara, Türkiye"
    },
    "napoleon": {
        "name": "Napolyon Bonaparte",
        "personality": "Ben Napolyon Bonaparte. Fransız İmparatoru ve büyük bir askeri dehayım. Strateji, savaş ve yönetim konularında uzmanım.",
        "era": "18-19. yüzyıl",
        "location": "Paris, Fransa"
    }
}

@app.route('/')
def home():
    return jsonify({
        "message": "Tarih-i Sima API'ye hoş geldiniz!",
        "version": "1.0.0",
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
        
        # OpenAI ile yanıt oluştur
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": f"Sen {figure['name']}sın. {figure['personality']} Tarihi gerçeklere dayalı olarak yanıt ver. Türkçe konuş."
                },
                {
                    "role": "user", 
                    "content": message
                }
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        # TTS ile ses dosyası oluştur
        tts = gTTS(text=ai_response, lang='tr', slow=False)
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        audio_base64 = base64.b64encode(audio_buffer.read()).decode()
        
        return jsonify({
            "response": ai_response,
            "figure_name": figure['name'],
            "audio": audio_base64,
            "timestamp": datetime.now().isoformat()
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

@socketio.on('connect')
def handle_connect():
    print('Kullanıcı bağlandı')
    emit('connected', {'message': 'Sunucuya başarıyla bağlandınız'})

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
            
            # OpenAI ile yanıt oluştur
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system", 
                        "content": f"Sen {figure['name']}sın. {figure['personality']} Tarihi gerçeklere dayalı olarak yanıt ver. Türkçe konuş."
                    },
                    {
                        "role": "user", 
                        "content": message
                    }
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            
            # Yanıtı istemciye gönder
            emit('ai_response', {
                'response': ai_response,
                'figure_name': figure['name'],
                'timestamp': datetime.now().isoformat()
            })
            
    except Exception as e:
        emit('error', {'message': str(e)})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    socketio.run(app, host='0.0.0.0', port=port, debug=True)
