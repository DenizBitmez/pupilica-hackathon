# 🗄️ MSSQL Veritabanı Kurulum Rehberi

## 📋 Gereksinimler

### 1. SQL Server Kurulumu
- **SQL Server Express** (ücretsiz): [İndirme Linki](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **SQL Server Developer** (geliştirici için ücretsiz)
- **Azure SQL Database** (bulut tabanlı)

### 2. ODBC Driver
- **Microsoft ODBC Driver 17 for SQL Server**: [İndirme Linki](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server)

## 🔧 Kurulum Adımları

### 1. SQL Server Kurulumu
```bash
# Windows için SQL Server Express indirin ve kurun
# Kurulum sırasında:
# - Mixed Mode Authentication seçin
# - SA kullanıcısı için güçlü bir şifre belirleyin
# - Default port 1433'ü kullanın
```

### 2. ODBC Driver Kurulumu
```bash
# ODBC Driver 17 for SQL Server'ı indirin ve kurun
# Bu driver Python'un pyodbc paketinin SQL Server'a bağlanması için gerekli
```

### 3. Veritabanı Oluşturma
```sql
-- SQL Server Management Studio (SSMS) ile bağlanın
-- Yeni veritabanı oluşturun:

CREATE DATABASE PupilicaDB;
GO

USE PupilicaDB;
GO

-- Kullanıcı oluşturma (opsiyonel)
CREATE LOGIN pupilica_user WITH PASSWORD = 'YourStrongPassword123!';
GO

CREATE USER pupilica_user FOR LOGIN pupilica_user;
GO

-- Gerekli yetkileri verin
ALTER ROLE db_owner ADD MEMBER pupilica_user;
GO
```

## 🔐 .env Dosyası Yapılandırması

### .env dosyanızda şu satırları ekleyin:

```env
# MSSQL Connection String
DATABASE_URL=mssql+pyodbc://sa:YourPassword@localhost:1433/PupilicaDB?driver=ODBC+Driver+17+for+SQL+Server

# Alternatif olarak kullanıcı adı/şifre ile:
# DATABASE_URL=mssql+pyodbc://pupilica_user:YourStrongPassword123!@localhost:1433/PupilicaDB?driver=ODBC+Driver+17+for+SQL+Server

# Diğer ayarlar
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET_KEY=your_super_secret_jwt_key_here
PORT=5000
```

## 🐍 Python Bağımlılıkları

```bash
cd backend
pip install -r requirements.txt
```

## 🚀 Uygulama Başlatma

```bash
cd backend
python app.py
```

## 🔍 Bağlantı Testi

### 1. API Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Ana Sayfa
```bash
curl http://localhost:5000/
```

## 🛠️ Sorun Giderme

### 1. ODBC Driver Hatası
```
Error: [Microsoft][ODBC Driver Manager] Data source name not found
```
**Çözüm**: ODBC Driver 17 for SQL Server'ın yüklü olduğundan emin olun.

### 2. Bağlantı Reddedildi
```
Error: Login failed for user 'sa'
```
**Çözüm**: 
- SQL Server'da Mixed Mode Authentication'ın açık olduğundan emin olun
- SA kullanıcısının aktif olduğunu kontrol edin
- Şifrenin doğru olduğundan emin olun

### 3. Port Bağlantı Hatası
```
Error: TCP Provider: No connection could be made
```
**Çözüm**:
- SQL Server'ın 1433 portunda çalıştığından emin olun
- Windows Firewall'da 1433 portunu açın
- SQL Server Configuration Manager'da TCP/IP protokolünün açık olduğunu kontrol edin

### 4. Veritabanı Bulunamadı
```
Error: Cannot open database "PupilicaDB"
```
**Çözüm**: Veritabanının oluşturulduğundan emin olun.

## 📊 Veritabanı Yönetimi

### Tabloları Görüntüleme
```sql
USE PupilicaDB;
SELECT * FROM INFORMATION_SCHEMA.TABLES;
```

### Kullanıcıları Görüntüleme
```sql
SELECT * FROM [user];
```

### Backup Alma
```sql
BACKUP DATABASE PupilicaDB 
TO DISK = 'C:\Backup\PupilicaDB.bak'
WITH FORMAT, COMPRESSION;
```

## 🌐 Azure SQL Database (Alternatif)

### Connection String Formatı:
```env
DATABASE_URL=mssql+pyodbc://username:password@server.database.windows.net:1433/database?driver=ODBC+Driver+17+for+SQL+Server&Encrypt=yes&TrustServerCertificate=no&Connection+Timeout=30
```

### Avantajları:
- Bulut tabanlı
- Otomatik backup
- Ölçeklenebilir
- Yüksek kullanılabilirlik

## 🔒 Güvenlik Önerileri

1. **Güçlü Şifreler**: SA ve kullanıcı şifrelerini güçlü yapın
2. **Firewall**: Sadece gerekli IP'lerden erişime izin verin
3. **SSL**: Production'da SSL sertifikası kullanın
4. **Regular Updates**: SQL Server'ı düzenli güncelleyin
5. **Backup**: Düzenli backup alın

## 📈 Performans Optimizasyonu

1. **Index**: Sık kullanılan kolonlarda index oluşturun
2. **Connection Pooling**: Flask-SQLAlchemy otomatik olarak connection pooling yapar
3. **Query Optimization**: N+1 query problemlerini önleyin
4. **Monitoring**: SQL Server Activity Monitor kullanın

## 🆘 Yardım

Sorun yaşarsanız:
1. SQL Server Error Log'larını kontrol edin
2. Windows Event Viewer'da SQL Server log'larını inceleyin
3. Network bağlantısını test edin
4. Firewall ayarlarını kontrol edin

---

**Not**: Bu rehber Windows için yazılmıştır. Linux/Mac kullanıyorsanız Docker ile SQL Server çalıştırabilirsiniz.

