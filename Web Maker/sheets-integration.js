// Google Sheets Integration untuk KAINKAMU
// File ini berisi kode untuk mengintegrasikan website dengan Google Sheets sebagai database

// Konfigurasi Google Sheets dengan kategori terpisah
const SHEETS_CONFIG = {
    SPREADSHEET_ID: '1vSsejK_ZwmcP37dDpoAEYkkZKCoBhmRhc-MrWkApocuXml6mQ2-PruxxoJ7UPhZwg',
    API_KEY: '', // Kosongkan jika tidak menggunakan API
    BASE_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSsejK_ZwmcP37dDpoAEYkkZKCoBhmRhc-MrWkApocuXml6mQ2-PruxxoJ7UPhZwg/pub',
    CATEGORIES: {
        'BUNGA KECIL': {
            '1_WARNA': { gid: '1146897966', price: 35000 },
            '2_WARNA': { gid: '513003886', price: 45000 }
        },
        'ABSTRAK': {
            '1_WARNA': { gid: '33400752', price: 35000 },
            '2_WARNA': { gid: '60318192', price: 45000 }
        },
        'SALUR_POLKA_KOTAK': {
            '1_WARNA': { gid: '1266861465', price: 35000 },
            '2_WARNA': { gid: '1791579568', price: 45000 }
        },
        'KARAKTER': {
            '1_WARNA': { gid: '1241151524', price: 35000 },
            '2_WARNA': { gid: '548931478', price: 45000 }
        },
        'BUNGA BESAR': {
            '1_WARNA': { gid: '1276689187', price: 35000 },
            '2_WARNA': { gid: '1317035021', price: 45000 }
        }
    },
    
    // Range data artikel di spreadsheet
    ARTICLES_RANGE: 'Articles!A2:F1000',
    
    // URL publik spreadsheet untuk fallback
    PUBLIC_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSsejK_ZwmcP37dDpoAEYkkZKCoBhmRhc-MrWkApocuXml6mQ2-PruxxoJ7UPhZwg/pub?output=csv'
};

// Fungsi untuk mengambil data dari Google Sheets
class SheetsAPI {
    constructor(config) {
        this.config = config || SHEETS_CONFIG;
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    }
    
    // Mengambil data dari semua kategori
    async getProducts() {
        try {
            const allProducts = [];
            
            for (const [categoryName, variants] of Object.entries(SHEETS_CONFIG.CATEGORIES)) {
                for (const [variantName, config] of Object.entries(variants)) {
                    try {
                        const products = await this.fetchCategoryData(categoryName, variantName, config);
                        allProducts.push(...products);
                    } catch (error) {
                        console.warn(`Error fetching ${categoryName} ${variantName}:`, error);
                    }
                }
            }
            
            return allProducts.length > 0 ? allProducts : this.getDefaultProducts();
            
        } catch (error) {
            console.error('Error fetching products:', error);
            return this.getDefaultProducts(); // Fallback ke data default
        }
    }
    
    // Fungsi untuk mengambil data dari kategori tertentu
    async fetchCategoryData(categoryName, variantName, config) {
        const url = `${SHEETS_CONFIG.BASE_URL}?gid=${config.gid}&single=true&output=csv`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const data = this.parseCSVData(csvText);
        
        return this.parseCategoryProducts(data, categoryName, variantName, config);
    }
    
    // Fungsi untuk mencoba mengakses gambar dari Google Sheets
    async checkImageAvailability(gid, rowNumber) {
        try {
            const imageUrl = `https://docs.google.com/spreadsheets/d/1vSsejK_ZwmcP37dDpoAEYkkZKCoBhmRhc-MrWkApocuXml6mQ2-PruxxoJ7UPhZwg/export?format=png&gid=${gid}&range=A${rowNumber}`;
            
            // Coba akses gambar dengan HEAD request untuk cek ketersediaan
            const response = await fetch(imageUrl, { method: 'HEAD' });
            
            if (response.ok && response.headers.get('content-type')?.includes('image')) {
                return imageUrl;
            }
            return null;
        } catch (error) {
            console.log(`Image check failed for row ${rowNumber}:`, error);
            return null;
        }
    }
    
    // Mengambil data artikel dari spreadsheet
    async getArticles() {
        try {
            const url = `${this.baseUrl}/${this.config.SPREADSHEET_ID}/values/${this.config.ARTICLES_RANGE}?key=${this.config.API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.values) {
                return this.parseArticlesData(data.values);
            }
            return [];
        } catch (error) {
            console.error('Error fetching articles:', error);
            return [];
        }
    }
    
    // Parse data produk dari kategori tertentu
    parseCategoryProducts(data, categoryName, variantName, config) {
        const products = [];
        let productCounter = 0;
        
        // Cari header row yang mengandung "Kode Motif"
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(10, data.length); i++) {
            if (data[i] && data[i].some(cell => cell && cell.toString().toLowerCase().includes('kode motif'))) {
                headerRowIndex = i;
                break;
            }
        }
        
        if (headerRowIndex === -1) {
            console.warn(`Header not found for ${categoryName} ${variantName}`);
            return [];
        }
        
        // Parse data mulai dari setelah header
        for (let i = headerRowIndex + 1; i < data.length; i++) {
            const row = data[i];
            if (row && row.length > 0) {
                const kodeMotif = row[1]; // Kolom B (Kode Motif)
                const jumlahRoll = row[3]; // Kolom D (JUMLAH ROLL)
                
                // Skip jika kode motif kosong atau berisi "ROLL"
                if (kodeMotif && kodeMotif.toString().trim() !== '' && 
                    !kodeMotif.toString().toLowerCase().includes('roll') &&
                    !isNaN(kodeMotif)) {
                    
                    productCounter++;
                    const displayCategory = categoryName.replace('_', ' ');
                    const variantDisplay = variantName === '1_WARNA' ? '1 Warna' : '2 Warna';
                    
                    // Cek apakah ada gambar di kolom A atau C
                    const gambarKolA = row[0]; // Kolom A (mungkin berisi gambar)
                    const fotoUrl = row[2]; // Kolom C (Foto)
                    let imageUrl = `https://via.placeholder.com/300x200/f0f0f0/666666?text=Kode+${kodeMotif}`;
                    let hasRealImage = false;
                    
                    // Prioritas: Cek kolom C dulu, lalu kolom A
                    if (fotoUrl && fotoUrl.toString().trim() !== '' && 
                        (fotoUrl.toString().includes('http') || fotoUrl.toString().includes('drive.google.com'))) {
                        imageUrl = fotoUrl.toString().trim();
                        hasRealImage = true;
                    } else if (gambarKolA && gambarKolA.toString().trim() !== '' && 
                               (gambarKolA.toString().includes('http') || gambarKolA.toString().includes('drive.google.com'))) {
                        imageUrl = gambarKolA.toString().trim();
                        hasRealImage = true;
                    }
                    
                    // Jika masih menggunakan placeholder, coba akses gambar melalui Google Sheets
                    if (!hasRealImage) {
                        // Coba akses gambar berdasarkan posisi row di sheet
                         const rowNumber = i + 1; // Nomor baris aktual di spreadsheet
                         
                         // Format URL untuk mengakses gambar dari Google Sheets berdasarkan cell
                         const possibleImageUrl = `https://docs.google.com/spreadsheets/d/1vSsejK_ZwmcP37dDpoAEYkkZKCoBhmRhc-MrWkApocuXml6mQ2-PruxxoJ7UPhZwg/export?format=png&gid=${config.gid}&range=A${rowNumber}`;
                         
                         // Coba gunakan URL gambar langsung dari Google Sheets
                         imageUrl = possibleImageUrl;
                         hasRealImage = 'sheet'; // Status khusus untuk gambar dari sheet
                         
                         console.log(`Trying to load image for ${kodeMotif} from: ${possibleImageUrl}`);
                    }
                    
                    products.push({
                        id: `${categoryName}_${variantName}_${productCounter}`,
                        name: `${displayCategory} - Kode ${kodeMotif}`,
                        category: displayCategory,
                        variant: variantDisplay,
                        kodeMotif: kodeMotif.toString(),
                        price: config.price,
                        image: imageUrl,
                        stock: jumlahRoll && !isNaN(jumlahRoll) ? parseInt(jumlahRoll) : Math.floor(Math.random() * 30) + 5,
                        description: `Kain rayon ${displayCategory.toLowerCase()} ${variantDisplay.toLowerCase()} dengan kode motif ${kodeMotif}`,
                        hasRealImage: hasRealImage
                    });
                }
            }
        }
        
        return products;
    }
    
    // Parse data CSV untuk fallback
    parseCSVData(csvText) {
        const lines = csvText.split('\n');
        const products = [];
        
        // Parsing berdasarkan struktur spreadsheet KAINKAMU
        const categories = [
            { name: 'BUNGA KECIL 1 WARNA', category: 'bunga-kecil', colors: 1 },
            { name: 'BUNGA KECIL 2 WARNA', category: 'bunga-kecil', colors: 2 },
            { name: 'ABSTRAK 1 WARNA', category: 'abstrak', colors: 1 },
            { name: 'ABSTRAK 2 WARNA', category: 'abstrak', colors: 2 },
            { name: 'SALUR ,POLKA, KOTAK 1 WARNA', category: 'salur', colors: 1 },
            { name: 'SALUR, POLKA , KOTAK 2 WARNA', category: 'salur', colors: 2 },
            { name: 'KARAKTER 1 WARNA', category: 'digital-print', colors: 1 },
            { name: 'KARAKTER 2 WARNA', category: 'digital-print', colors: 2 },
            { name: 'BUNGA BESAR 1 WARNA', category: 'bunga-besar', colors: 1 },
            { name: 'BUNGA BESAR 2 WARNA', category: 'bunga-besar', colors: 2 }
        ];
        
        // Simulasi data berdasarkan kategori yang ada
        categories.forEach((cat, index) => {
            products.push({
                id: index + 1,
                name: `Kain ${cat.name}`,
                category: cat.category,
                price: cat.colors === 1 ? 35000 : 45000,
                stock: Math.floor(Math.random() * 50) + 10, // Random stock 10-60
                image: this.getIconByCategory(cat.category),
                description: `Kain berkualitas tinggi dengan motif ${cat.name.toLowerCase()}. ${cat.colors} warna tersedia.`,
                imageUrl: `https://via.placeholder.com/300x200?text=${encodeURIComponent(cat.name)}`,
                tags: [cat.category, `${cat.colors}-warna`]
            });
        });
        
        return products;
    }
    
    // Fungsi untuk mendapatkan icon berdasarkan kategori
    getIconByCategory(category) {
        const icons = {
            'bunga-kecil': '🌸',
            'bunga-besar': '🌺',
            'abstrak': '🎨',
            'salur': '📏',
            'digital-print': '🖨️',
            'eco-print': '🌿',
            'single-border': '🔲',
            'double-border': '🔳'
        };
        return icons[category] || '🧵';
    }
    
    // Fungsi fallback untuk data default
    getDefaultProducts() {
        return [
            {
                id: 'default_1',
                name: "BUNGA KECIL - Kode 836",
                category: "BUNGA KECIL",
                variant: "1 Warna",
                kodeMotif: "836",
                price: 35000,
                image: "https://via.placeholder.com/300x200?text=Kode+836",
                stock: 25,
                description: "Kain rayon bunga kecil 1 warna dengan kode motif 836"
            },
            {
                id: 'default_2',
                name: "ABSTRAK - Kode 66371",
                category: "ABSTRAK",
                variant: "2 Warna",
                kodeMotif: "66371",
                price: 45000,
                image: "https://via.placeholder.com/300x200?text=Kode+66371",
                stock: 18,
                description: "Kain rayon abstrak 2 warna dengan kode motif 66371"
            },
            {
                id: 'default_3',
                name: "SALUR POLKA KOTAK - Kode 96755",
                category: "SALUR POLKA KOTAK",
                variant: "1 Warna",
                kodeMotif: "96755",
                price: 35000,
                image: "https://via.placeholder.com/300x200?text=Kode+96755",
                stock: 32,
                description: "Kain rayon salur polka kotak 1 warna dengan kode motif 96755"
            },
            {
                id: 'default_4',
                name: "KARAKTER - Kode 57432",
                category: "KARAKTER",
                variant: "2 Warna",
                kodeMotif: "57432",
                price: 45000,
                image: "https://via.placeholder.com/300x200?text=Kode+57432",
                stock: 15,
                description: "Kain rayon karakter 2 warna dengan kode motif 57432"
            },
            {
                id: 'default_5',
                name: "BUNGA BESAR - Kode 65887",
                category: "BUNGA BESAR",
                variant: "1 Warna",
                kodeMotif: "65887",
                price: 35000,
                image: "https://via.placeholder.com/300x200?text=Kode+65887",
                stock: 22,
                description: "Kain rayon bunga besar 1 warna dengan kode motif 65887"
            }
        ];
    }
    
    // Parse data artikel dari format spreadsheet
    parseArticlesData(rows) {
        return rows.map((row, index) => {
            return {
                id: index + 1,
                title: row[0] || '',
                excerpt: row[1] || '',
                content: row[2] || '',
                imageUrl: row[3] || '',
                author: row[4] || 'Admin KAINKAMU',
                publishDate: row[5] || new Date().toISOString().split('T')[0]
            };
        }).filter(article => article.title); // Filter artikel yang memiliki judul
    }
    
    // Update stok produk (memerlukan Google Apps Script)
    async updateStock(productId, newStock) {
        // Ini memerlukan Google Apps Script untuk menulis ke spreadsheet
        // Karena Google Sheets API v4 hanya read-only untuk public access
        console.log(`Update stock for product ${productId} to ${newStock}`);
        
        // Implementasi dengan Google Apps Script Web App
        try {
            const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'updateStock',
                    productId: productId,
                    newStock: newStock
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error updating stock:', error);
            return { success: false, error: error.message };
        }
    }
}

// Inisialisasi Sheets API
const sheetsAPI = new SheetsAPI(SHEETS_CONFIG);

// Fungsi untuk mengganti data statis dengan data dari Google Sheets
async function loadProductsFromSheets() {
    try {
        const products = await sheetsAPI.getProducts();
        if (products.length > 0) {
            // Ganti data produk global
            window.productsData = products;
            
            // Re-render katalog produk
            if (typeof initProductCatalog === 'function') {
                initProductCatalog();
            }
            
            console.log('Products loaded from Google Sheets:', products.length);
        }
    } catch (error) {
        console.error('Failed to load products from sheets:', error);
        // Fallback ke data statis jika gagal
    }
}

// Fungsi untuk memuat artikel dari Google Sheets
async function loadArticlesFromSheets() {
    try {
        const articles = await sheetsAPI.getArticles();
        if (articles.length > 0) {
            renderArticles(articles);
            console.log('Articles loaded from Google Sheets:', articles.length);
        }
    } catch (error) {
        console.error('Failed to load articles from sheets:', error);
    }
}

// Render artikel dinamis
function renderArticles(articles) {
    const articleGrid = document.querySelector('.article-grid');
    if (!articleGrid) return;
    
    articleGrid.innerHTML = articles.slice(0, 6).map(article => `
        <article class="article-card">
            <div class="article-image">
                ${article.imageUrl ? 
                    `<img src="${article.imageUrl}" alt="${article.title}" style="width: 100%; height: 100%; object-fit: cover;">` :
                    '<div class="placeholder-img">📰</div>'
                }
            </div>
            <div class="article-content">
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <small style="color: #999;">By ${article.author}</small>
                    <small style="color: #999;">${formatDate(article.publishDate)}</small>
                </div>
                <a href="#" class="read-more" onclick="readFullArticle(${article.id})">Baca Selengkapnya</a>
            </div>
        </article>
    `).join('');
}

// Format tanggal
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Baca artikel lengkap
window.readFullArticle = function(articleId) {
    // Implementasi modal atau halaman detail artikel
    alert('Fitur baca artikel lengkap akan segera hadir!');
};

// Auto-load data saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Delay untuk memastikan elemen sudah ter-render
    setTimeout(() => {
        loadProductsFromSheets();
        loadArticlesFromSheets();
    }, 2000);
});

// Export untuk penggunaan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SheetsAPI, sheetsAPI };
}

/* 
CONTOH STRUKTUR GOOGLE SHEETS:

Sheet "Products":
A1: Nama Produk | B1: Kategori | C1: Harga | D1: Stok | E1: Icon | F1: Deskripsi | G1: URL Gambar | H1: Tags
A2: Kain Batik Modern | abstrak | 45000 | 25 | 🎨 | Batik modern dengan motif kontemporer | https://... | batik,modern,abstrak

Sheet "Articles":
A1: Judul | B1: Excerpt | C1: Konten | D1: URL Gambar | E1: Penulis | F1: Tanggal
A2: Tips Memilih Kain | Panduan lengkap... | Konten artikel lengkap... | https://... | Admin | 2024-01-15

CATATAN:
1. Ganti YOUR_SPREADSHEET_ID_HERE dengan ID spreadsheet Anda
2. Ganti YOUR_API_KEY_HERE dengan Google Sheets API key Anda
3. Pastikan spreadsheet dapat diakses publik atau sesuai permission
4. Untuk update data (write), perlu Google Apps Script Web App
*/