# KAINKAMU - Website Toko Kain Modern

## 📋 Deskripsi
Website toko kain modern untuk brand KAINKAMU yang menyediakan katalog motif kain berdasarkan kategori, artikel tekstil, dan sistem manajemen stok terintegrasi dengan Google Sheets. Website ini responsif, modern, dan siap untuk di-deploy ke berbagai platform hosting gratis.

## 🚀 Fitur Utama
- ✅ **Katalog Produk Dinamis** - Filter berdasarkan 8 kategori motif kain
- ✅ **Integrasi Google Sheets** - Manajemen stok dan produk real-time
- ✅ **Sistem Kategori Lengkap** - Abstrak, Salur, Bunga Kecil/Besar, Border, Digital Print, Eco Print
- ✅ **Artikel & Tips** - Section khusus untuk konten edukatif
- ✅ **WhatsApp Integration** - Form kontak langsung ke WhatsApp
- ✅ **Manajemen Stok** - Indikator stok dengan badge warna
- ✅ **Desain Responsif** - Optimal di semua perangkat
- ✅ **Animasi Modern** - Smooth scrolling dan hover effects
- ✅ **Loading States** - UX yang smooth dengan loading indicators

## 📁 Struktur File
```
Web Maker/
├── index.html              # File HTML utama dengan struktur toko
├── style.css               # CSS styling untuk toko kain modern
├── script.js               # JavaScript dengan katalog dan filter
├── sheets-integration.js   # Integrasi Google Sheets API
├── open-website.bat        # Batch file untuk buka di browser
└── README.md              # Dokumentasi lengkap
```

## 🎨 Kategori Motif Kain
1. **Abstrak** - Motif modern dengan pola geometris dan fluid
2. **Salur** - Motif garis klasik dan diagonal
3. **Bunga Kecil** - Motif floral vintage dengan bunga kecil
4. **Bunga Besar** - Motif tropical dengan bunga besar
5. **Single Border** - Desain border tunggal yang elegan
6. **Double Border** - Desain border ganda yang mewah
7. **Digital Print** - Teknologi cetak digital dengan detail tajam
8. **Eco Print** - Ramah lingkungan dengan pewarna alami

## 🌐 Cara Deploy ke Domain Gratis

### 1. GitHub Pages (Gratis)
1. Buat akun di [GitHub.com](https://github.com)
2. Buat repository baru dengan nama `username.github.io` (ganti username dengan username GitHub Anda)
3. Upload semua file website ke repository
4. Aktifkan GitHub Pages di Settings > Pages
5. Website akan tersedia di `https://username.github.io`

### 2. Netlify (Gratis)
1. Buat akun di [Netlify.com](https://netlify.com)
2. Drag & drop folder website ke dashboard Netlify
3. Website akan otomatis ter-deploy dengan subdomain gratis
4. Anda bisa custom domain atau menggunakan subdomain Netlify

### 3. Vercel (Gratis)
1. Buat akun di [Vercel.com](https://vercel.com)
2. Connect dengan GitHub repository
3. Import project dan deploy
4. Website akan tersedia dengan subdomain Vercel

### 4. Firebase Hosting (Gratis)
1. Buat akun di [Firebase.google.com](https://firebase.google.com)
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Login: `firebase login`
4. Init project: `firebase init hosting`
5. Deploy: `firebase deploy`

### 5. Surge.sh (Gratis)
1. Install Surge: `npm install -g surge`
2. Jalankan `surge` di folder website
3. Ikuti instruksi untuk deploy

## 🛠️ Cara Menjalankan Lokal

### Metode 1: Batch File (Termudah)
1. Double-click file `open-website.bat`
2. Website akan terbuka di browser default

### Metode 2: Live Server (Recommended untuk Development)
1. Install extension "Live Server" di VS Code
2. Klik kanan pada `index.html`
3. Pilih "Open with Live Server"

### Metode 3: Python Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Buka browser ke `http://localhost:8000`

### Metode 4: Node.js Server
```bash
npx http-server
```

## 📊 Integrasi Google Sheets

### Setup Google Sheets sebagai Database

1. **Buat Google Spreadsheet** dengan struktur berikut:

   **Sheet "Products":**
   ```
   A1: Nama Produk | B1: Kategori | C1: Harga | D1: Stok | E1: Icon | F1: Deskripsi | G1: URL Gambar | H1: Tags
   A2: Kain Batik Modern | abstrak | 45000 | 25 | 🎨 | Batik modern... | https://... | batik,modern
   ```

   **Sheet "Articles":**
   ```
   A1: Judul | B1: Excerpt | C1: Konten | D1: URL Gambar | E1: Penulis | F1: Tanggal
   A2: Tips Memilih Kain | Panduan lengkap... | Konten lengkap... | https://... | Admin | 2024-01-15
   ```

2. **Dapatkan Google Sheets API Key:**
   - Buka [Google Cloud Console](https://console.cloud.google.com/)
   - Buat project baru atau pilih existing
   - Enable Google Sheets API
   - Buat credentials (API Key)
   - Restrict API key untuk Google Sheets API

3. **Konfigurasi di `sheets-integration.js`:**
   ```javascript
   const SHEETS_CONFIG = {
       SPREADSHEET_ID: 'your_spreadsheet_id_here',
       API_KEY: 'your_api_key_here',
       PRODUCTS_RANGE: 'Products!A2:H1000',
       ARTICLES_RANGE: 'Articles!A2:F1000'
   };
   ```

4. **Aktifkan Integrasi:**
   - Tambahkan script tag di `index.html`:
   ```html
   <script src="sheets-integration.js"></script>
   ```

### Kategori Produk yang Didukung:
- `abstrak` - Motif Abstrak
- `salur` - Motif Salur
- `bunga-kecil` - Bunga Kecil
- `bunga-besar` - Bunga Besar
- `single-border` - Single Border
- `double-border` - Double Border
- `digital-print` - Digital Print
- `eco-print` - Eco Print

## 🎨 Kustomisasi

### Mengubah Brand dan Warna
1. **Ganti Nama Brand:**
   - Edit "KAINKAMU" di `index.html` (title, logo, footer)
   - Update meta tags dan descriptions

2. **Ubah Skema Warna:**
   ```css
   /* Di style.css, ganti gradient utama */
   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   
   /* Ganti warna aksen */
   background: #ffd700;
   ```

### Menambah Produk
1. **Via Google Sheets (Recommended):**
   - Tambah baris baru di spreadsheet
   - Data akan otomatis muncul di website

2. **Via Code (Static):**
   - Edit array `productsData` di `script.js`
   - Tambah objek produk baru dengan struktur yang sama

### Menambah Kategori Motif
1. Tambah button filter di `index.html`:
   ```html
   <button class="filter-btn" data-filter="kategori-baru">Kategori Baru</button>
   ```

2. Update fungsi `getCategoryName()` di `script.js`:
   ```javascript
   'kategori-baru': 'Nama Kategori Baru'
   ```

### Kustomisasi WhatsApp
- Edit nomor WhatsApp di `script.js`:
  ```javascript
  const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(whatsappMessage)}`;
  ```

### Menambah Halaman
1. Buat file HTML baru (misal: `detail-produk.html`)
2. Copy struktur dari `index.html`
3. Update navigation links
4. Tambah routing di `script.js` jika diperlukan

## 📱 Browser Support
- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)
- ✅ Mobile browsers

## 🔧 Troubleshooting

### Website tidak muncul setelah deploy
- Pastikan file `index.html` ada di root folder
- Cek console browser untuk error
- Pastikan semua path file benar (case-sensitive)

### CSS/JS tidak load
- Cek path file di `index.html`
- Pastikan nama file sesuai (case-sensitive)
- Cek network tab di developer tools

### Form tidak berfungsi
- Form terintegrasi dengan WhatsApp untuk respon cepat
- Untuk email integration, gunakan service seperti:
  - Formspree.io
  - Netlify Forms
  - EmailJS

### Google Sheets tidak terhubung
- Pastikan API Key valid dan aktif
- Cek CORS settings di Google Cloud Console
- Pastikan spreadsheet dapat diakses publik
- Periksa format data di spreadsheet sesuai dokumentasi

### Produk tidak muncul
- Cek console browser untuk error
- Pastikan kategori produk sesuai dengan filter yang tersedia
- Periksa format harga dan stok (harus angka)

### Stok tidak update
- Fitur update stok memerlukan Google Apps Script
- Saat ini hanya simulasi di frontend
- Untuk update real-time, implementasikan Google Apps Script Web App

## 🚀 Fitur Lanjutan (Roadmap)

### Phase 2:
- [ ] Shopping cart functionality
- [ ] User authentication
- [ ] Order management system
- [ ] Payment gateway integration
- [ ] Admin dashboard

### Phase 3:
- [ ] Mobile app (PWA)
- [ ] Advanced search & filters
- [ ] Product reviews & ratings
- [ ] Wishlist functionality
- [ ] Multi-language support

## 🤝 Kontribusi
Untuk berkontribusi pada pengembangan website KAINKAMU:
1. Fork repository ini
2. Buat branch untuk fitur baru
3. Commit perubahan Anda
4. Push ke branch
5. Buat Pull Request

## 📞 Support
- **Email:** support@kainkamu.com
- **WhatsApp:** +62 812 3456 7890
- **Website:** https://kainkamu.com

Untuk bantuan teknis, silakan buat issue di repository ini.

## 📄 License
MIT License - Bebas digunakan untuk project pribadi maupun komersial.

## 🙏 Credits
- Design inspiration: Modern e-commerce trends
- Icons: Unicode emoji
- Fonts: System fonts untuk performa optimal
- Color scheme: Modern gradient palettes

---
**KAINKAMU - Toko Kain Modern Terpercaya** 🧵✨

*"Kualitas Premium, Motif Beragam, Pengiriman Cepat"*