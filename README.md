# Spam Email Website

Website untuk mengirim request spam email dengan integrasi Telegram Bot.

## 📁 Struktur Folder

```
spam-email-website/
│
├── index.html              # Halaman welcome dengan info IP & battery
├── request.html            # Halaman form spam email request
├── foto.png                # Gambar yang digunakan di index.html
│
├── css/
│   └── fonts.css           # Font Inter (opsional, sudah pakai Google Fonts)
│
├── js/
│   ├── script.js           # JavaScript untuk index.html
│   └── request.js          # JavaScript untuk request.html (Telegram integration)
│
└── README.md               # File ini
```

## 🚀 Cara Menggunakan

### 1. Clone Repository
```bash
git clone https://github.com/username/spam-email-website.git
cd spam-email-website
```

### 2. Buka di Browser
Buka file `index.html` di browser Anda atau gunakan live server.

### 3. Konfigurasi Telegram Bot
Edit file `js/request.js` dan ganti:
```javascript
const TELEGRAM_TOKEN = "YOUR_BOT_TOKEN";
const CHAT_ID = "YOUR_CHAT_ID";
```

## 📌 Fitur

- ✅ Menampilkan IP publik user
- ✅ Menampilkan status battery & charging
- ✅ Form request spam email
- ✅ Integrasi dengan Telegram Bot
- ✅ Generate shareable API URL
- ✅ Responsive design
- ✅ Animasi smooth

## 🔗 API Endpoint

Format URL untuk direct API call:
```
https://your-domain.com/request.html/email=test@email.com/jumlah=100
```

Response JSON:
```json
{
  "code": 200,
  "status": "success",
  "email": "test@email.com",
  "jumlah": "100",
  "apiUrl": "https://your-domain.com/request.html/email=test@email.com/jumlah=100"
}
```

## ⚠️ Disclaimer

Website ini dibuat untuk tujuan edukasi. Penggunaan untuk spam atau aktivitas ilegal adalah tanggung jawab pengguna.

## 📱 Social Media

- Telegram: [@SpamEmailInformation](https://t.me/SpamEmailInformation)

## 📄 License

MIT License - Silakan digunakan dan dimodifikasi sesuai kebutuhan.