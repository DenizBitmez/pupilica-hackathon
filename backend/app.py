from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import openai
import os
from dotenv import load_dotenv
from gtts import gTTS
import io
import base64
import json
from datetime import datetime, timedelta

# Environment variables yükle
load_dotenv()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Demo kullanıcılar
DEMO_USERS = [
    {
        'username': 'ogrenci1',
        'email': 'ogrenci1@example.com',
        'password': '123456',
        'full_name': 'Ahmet Yılmaz',
        'level': 3,
        'experience': 340,
        'coins': 1250,
        'gems': 45,
        'current_streak': 7,
        'longest_streak': 15
    },
    {
        'username': 'ogrenci2',
        'email': 'ogrenci2@example.com',
        'password': '123456',
        'full_name': 'Ayşe Demir',
        'level': 2,
        'experience': 180,
        'coins': 800,
        'gems': 25,
        'current_streak': 3,
        'longest_streak': 8
    },
    {
        'username': 'ogretmen1',
        'email': 'ogretmen1@example.com',
        'password': '123456',
        'full_name': 'Mehmet Öğretmen',
        'level': 5,
        'experience': 890,
        'coins': 2500,
        'gems': 120,
        'current_streak': 12,
        'longest_streak': 25
    }
]

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
        "message": "Pupilica API'ye hoş geldiniz!",
        "version": "2.0.0",
        "available_figures": list(HISTORICAL_FIGURES.keys()),
        "features": ["authentication", "chat", "quiz", "progress_tracking"],
        "database": "MSSQL" if "mssql" in DATABASE_URL else "SQLite"
    })

# Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validasyon
        if not data.get('username') or not data.get('email') or not data.get('password') or not data.get('fullName'):
            return jsonify({"error": "Tüm alanlar gerekli"}), 400
        
        # Kullanıcı zaten var mı kontrol et
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Bu e-posta adresi zaten kullanılıyor"}), 400
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Bu kullanıcı adı zaten kullanılıyor"}), 400
        
        # Yeni kullanıcı oluştur
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            full_name=data['fullName'],
            level=1,
            experience=0,
            coins=100,
            gems=10,
            current_streak=0,
            longest_streak=0
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Token oluştur
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            "message": "Kayıt başarılı",
            "access_token": access_token,
            "user": user.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print(f"🔍 Login attempt - Data: {data}")
        
        email = data.get('email')
        password = data.get('password')
        
        print(f"📧 Email: {email}")
        print(f"🔐 Password: {password}")
        
        if not email or not password:
            print("❌ Email veya password eksik")
            return jsonify({"error": "E-posta ve şifre gerekli"}), 400
        
        # Demo kullanıcıları kontrol et
        print(f"📋 Available demo users: {[user['email'] for user in DEMO_USERS]}")
        demo_user = next((user for user in DEMO_USERS if user['email'] == email), None)
        print(f"👤 Demo user found: {demo_user is not None}")
        
        if demo_user:
            print(f"🔐 Password match: {demo_user['password'] == password}")
            print(f"📧 Demo user email: {demo_user['email']}")
            print(f"🔑 Demo user password: {demo_user['password']}")
        
        if demo_user and demo_user['password'] == password:
            # Demo kullanıcı için token oluştur
            access_token = create_access_token(identity=f"demo_{demo_user['username']}")
            return jsonify({
                "message": "Demo giriş başarılı",
                "access_token": access_token,
                "user": {
                    'id': f"demo_{demo_user['username']}",
                    'username': demo_user['username'],
                    'email': demo_user['email'],
                    'fullName': demo_user['full_name'],
                    'level': demo_user['level'],
                    'experience': demo_user['experience'],
                    'coins': demo_user['coins'],
                    'gems': demo_user['gems'],
                    'currentStreak': demo_user['current_streak'],
                    'longestStreak': demo_user['longest_streak'],
                    'createdAt': datetime.utcnow().isoformat(),
                    'lastLogin': datetime.utcnow().isoformat()
                }
            })
        
        # Gerçek kullanıcıları kontrol et
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            # Son giriş tarihini güncelle
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            # Token oluştur
            access_token = create_access_token(identity=user.id)
            
            return jsonify({
                "message": "Giriş başarılı",
                "access_token": access_token,
                "user": user.to_dict()
            })
        
        return jsonify({"error": "Geçersiz e-posta veya şifre"}), 401
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        
        # Demo kullanıcı kontrolü
        if str(user_id).startswith('demo_'):
            username = str(user_id).replace('demo_', '')
            demo_user = next((user for user in DEMO_USERS if user['username'] == username), None)
            if demo_user:
                return jsonify({
                    'id': f"demo_{demo_user['username']}",
                    'username': demo_user['username'],
                    'email': demo_user['email'],
                    'fullName': demo_user['full_name'],
                    'level': demo_user['level'],
                    'experience': demo_user['experience'],
                    'coins': demo_user['coins'],
                    'gems': demo_user['gems'],
                    'currentStreak': demo_user['current_streak'],
                    'longestStreak': demo_user['longest_streak'],
                    'createdAt': datetime.utcnow().isoformat(),
                    'lastLogin': datetime.utcnow().isoformat()
                })
        
        # Gerçek kullanıcı
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Kullanıcı bulunamadı"}), 404
        
        return jsonify(user.to_dict())
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Demo kullanıcılar için güncelleme yok
        if str(user_id).startswith('demo_'):
            return jsonify({"error": "Demo kullanıcılar profil güncelleyemez"}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Kullanıcı bulunamadı"}), 404
        
        # Güncellenebilir alanlar
        if 'fullName' in data:
            user.full_name = data['fullName']
        if 'level' in data:
            user.level = data['level']
        if 'experience' in data:
            user.experience = data['experience']
        if 'coins' in data:
            user.coins = data['coins']
        if 'gems' in data:
            user.gems = data['gems']
        if 'currentStreak' in data:
            user.current_streak = data['currentStreak']
        if 'longestStreak' in data:
            user.longest_streak = data['longestStreak']
        
        db.session.commit()
        
        return jsonify({
            "message": "Profil güncellendi",
            "user": user.to_dict()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/figures', methods=['GET'])
def get_figures():
    """Mevcut tarihi figürleri listele"""
    return jsonify(HISTORICAL_FIGURES)

@app.route('/api/chat', methods=['POST'])
@jwt_required()
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

# Progress tracking endpoints
@app.route('/api/progress/<figure_id>', methods=['GET'])
@jwt_required()
def get_progress(figure_id):
    """Kullanıcının belirli bir figür için ilerlemesini getir"""
    try:
        user_id = get_jwt_identity()
        # Bu endpoint'te ilerleme verilerini localStorage'dan alacak frontend
        # Backend'de ilerleme verilerini saklamak için gelecekte Progress modeli eklenebilir
        return jsonify({
            "message": "İlerleme verileri frontend'de saklanıyor",
            "user_id": str(user_id),
            "figure_id": figure_id
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/progress/<figure_id>/update', methods=['POST'])
@jwt_required()
def update_progress(figure_id):
    """Kullanıcının ilerlemesini güncelle"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Demo kullanıcılar için güncelleme yok
        if str(user_id).startswith('demo_'):
            return jsonify({"message": "Demo kullanıcı ilerlemesi güncellenemez"}), 200
        
        # Gerçek kullanıcılar için ilerleme güncelleme
        # Bu endpoint'te gelecekte Progress modeli ile veritabanında saklanacak
        return jsonify({
            "message": "İlerleme güncellendi",
            "user_id": str(user_id),
            "figure_id": figure_id,
            "data": data
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
def handle_connect(auth=None):
    """WebSocket bağlantısı - JWT token kontrolü"""
    try:
        if auth and auth.get('token'):
            # JWT token doğrulama (basit bir kontrol)
            print(f'Kullanıcı bağlandı: {auth.get("token")}')
            emit('connected', {'message': 'Sunucuya başarıyla bağlandınız'}) # Bu satır token başarılıysa çalışmalı
        else:
            print('Token olmadan bağlantı denemesi')
            emit('auth_error', {'message': 'Token gerekli'})
            return False
    except Exception as e:
        print(f'Bağlantı hatası: {e}')
        emit('error', {'message': 'Bağlantı hatası'})
        return False
@socketio.on('disconnect')
def handle_disconnect():
    print('Kullanıcı ayrıldı')

@socketio.on('chat_message')
def handle_chat_message(data):
    """WebSocket üzerinden sohbet mesajı işle"""
    try:
        figure_id = data.get('figure_id')
        message = data.get('message')
        
        if not figure_id or not message:
            emit('error', {'message': 'figure_id ve message gerekli'})
            return
        
        if figure_id not in HISTORICAL_FIGURES:
            emit('error', {'message': 'Geçersiz figür ID\'si'})
            return
        
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
    port = int(os.getenv('PORT', 5001))  # Farklı port kullan
    print(f"🚀 Backend başlatılıyor: http://localhost:{port}")
    socketio.run(app, host='0.0.0.0', port=port, debug=True)
