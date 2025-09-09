// Data produk akan dimuat dari Google Sheets
let productsData = [];

// Fungsi untuk inisialisasi Google Sheets API
function initSheetsAPI() {
    if (typeof SheetsAPI !== 'undefined') {
        window.sheetsAPI = new SheetsAPI();
        loadProductsFromSheets();
        return true;
    } else {
        // Fallback ke data default jika sheets-integration.js tidak dimuat
        productsData = getDefaultProductsData();
        return false;
    }
}

// Fungsi untuk memuat produk dari Google Sheets
async function loadProductsFromSheets() {
    const loadingElement = document.getElementById('loading');
    const statusElement = document.getElementById('connection-status');
    
    try {
        // Tampilkan loading dengan pesan yang lebih informatif
        if (loadingElement) {
            loadingElement.style.display = 'block';
            loadingElement.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Memuat data produk dari Google Sheets...</p>
                <small>Proses ini membutuhkan waktu 10-30 detik</small>
            `;
        }
        
        // Update status
        if (statusElement) {
            statusElement.textContent = 'Menghubungkan ke Google Sheets...';
            statusElement.className = 'status connecting';
        }
        
        let products;
        if (window.sheetsAPI) {
            products = await window.sheetsAPI.getProducts();
            if (products && products.length > 0) {
                productsData = products;
                window.allProducts = products;
                displayProducts(productsData);
                createCategoryFilter(products);
                
                // Hitung status gambar
                 const realImageCount = products.filter(p => p.hasRealImage === true).length;
                 const sheetImageCount = products.filter(p => p.hasRealImage === 'sheet').length;
                 const placeholderCount = products.filter(p => !p.hasRealImage || p.hasRealImage === false).length;
                 
                 // Update status sukses
                 if (statusElement) {
                     let statusText = `✓ Terhubung (${products.length} produk`;
                     if (realImageCount > 0) statusText += `, ${realImageCount} gambar URL`;
                     if (sheetImageCount > 0) statusText += `, ${sheetImageCount} dari sheet`;
                     if (placeholderCount > 0) statusText += `, ${placeholderCount} placeholder`;
                     statusText += ')';
                     
                     statusElement.textContent = statusText;
                     statusElement.className = 'status connected';
                 }
                 
                 // Log informasi gambar
                 if (sheetImageCount > 0) {
                     console.info(`✅ Berhasil memuat ${sheetImageCount} gambar dari Google Sheets`);
                 }
                 if (placeholderCount > 0) {
                     console.info(`ℹ️ ${placeholderCount} produk menggunakan placeholder`);
                 }
                
                console.log('✅ Data produk berhasil dimuat dari Google Sheets');
                return;
            }
        }
        
        // Fallback ke data default
        products = getDefaultProductsData();
        productsData = products;
        window.allProducts = products;
        displayProducts(productsData);
        createCategoryFilter(products);
        console.log('⚠️ Menggunakan data produk default');
        
        // Update status error
        if (statusElement) {
            statusElement.textContent = '⚠ Offline (menggunakan data default)';
            statusElement.className = 'status offline';
        }
        
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    } catch (error) {
        console.error('❌ Error loading products from sheets:', error);
        const defaultProducts = getDefaultProductsData();
        productsData = defaultProducts;
        window.allProducts = defaultProducts;
        displayProducts(productsData);
        createCategoryFilter(defaultProducts);
        
        // Update status error
        if (statusElement) {
            statusElement.textContent = '⚠ Offline (menggunakan data default)';
            statusElement.className = 'status offline';
        }
        
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

// Fungsi untuk refresh data dari Google Sheets
async function refreshProductData() {
    console.log('Refreshing product data...');
    await loadProductsFromSheets();
}

// Fungsi untuk mendapatkan nama kategori yang sesuai
function getCategoryName(category) {
    const categoryMap = {
        'BUNGA KECIL': 'Bunga Kecil',
        'ABSTRAK': 'Abstrak', 
        'SALUR_POLKA_KOTAK': 'Salur, Polka, Kotak',
        'SALUR POLKA KOTAK': 'Salur, Polka, Kotak',
        'KARAKTER': 'Karakter',
        'BUNGA BESAR': 'Bunga Besar'
    };
    
    return categoryMap[category] || category;
}

// Fungsi untuk mendapatkan semua kategori unik
function getUniqueCategories(products) {
    const categories = new Set();
    products.forEach(product => {
        if (product.category) {
            categories.add(product.category);
        }
    });
    return Array.from(categories);
}

// Data produk default sebagai fallback
function getDefaultProductsData() {
    return [
        {
            id: 1,
            name: 'Kain Bunga Kecil 1 Warna',
            category: 'bunga-kecil',
            price: 35000,
            stock: 25,
            image: '🌸',
            description: 'Kain dengan motif bunga kecil yang elegan, 1 warna tersedia.'
        },
        {
            id: 2,
            name: 'Kain Bunga Kecil 2 Warna',
            category: 'bunga-kecil',
            price: 45000,
            stock: 30,
            image: '🌸',
            description: 'Kain dengan motif bunga kecil yang elegan, 2 warna tersedia.'
        },
        {
            id: 3,
            name: 'Kain Abstrak 1 Warna',
            category: 'abstrak',
            price: 35000,
            stock: 20,
            image: '🎨',
            description: 'Desain abstrak modern dengan pola geometris, 1 warna tersedia.'
        },
        {
            id: 4,
            name: 'Kain Abstrak 2 Warna',
            category: 'abstrak',
            price: 45000,
            stock: 18,
            image: '🎨',
            description: 'Desain abstrak modern dengan pola geometris, 2 warna tersedia.'
        },
        {
            id: 5,
            name: 'Kain Salur, Polka, Kotak 1 Warna',
            category: 'salur',
            price: 35000,
            stock: 22,
            image: '📏',
            description: 'Motif salur, polka, dan kotak klasik, 1 warna tersedia.'
        },
        {
            id: 6,
            name: 'Kain Salur, Polka, Kotak 2 Warna',
            category: 'salur',
            price: 45000,
            stock: 15,
            image: '📏',
            description: 'Motif salur, polka, dan kotak klasik, 2 warna tersedia.'
        },
        {
            id: 7,
            name: 'Kain Karakter 1 Warna',
            category: 'digital-print',
            price: 35000,
            stock: 28,
            image: '🖨️',
            description: 'Motif karakter dengan teknologi digital print, 1 warna tersedia.'
        },
        {
            id: 8,
            name: 'Kain Karakter 2 Warna',
            category: 'digital-print',
            price: 45000,
            stock: 12,
            image: '🖨️',
            description: 'Motif karakter dengan teknologi digital print, 2 warna tersedia.'
        },
        {
            id: 9,
            name: 'Kain Bunga Besar 1 Warna',
            category: 'bunga-besar',
            price: 35000,
            stock: 16,
            image: '🌺',
            description: 'Motif bunga besar yang bold dan eye-catching, 1 warna tersedia.'
        },
        {
            id: 10,
            name: 'Kain Bunga Besar 2 Warna',
            category: 'bunga-besar',
            price: 45000,
            stock: 14,
            image: '🌺',
            description: 'Motif bunga besar yang bold dan eye-catching, 2 warna tersedia.'
        }
    ];
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi SheetsAPI
    initSheetsAPI();
    
    // Load products dari Google Sheets
    loadProductsFromSheets();
    
    // Tampilkan status koneksi setelah delay
    setTimeout(() => {
        if (typeof displaySheetsStatus === 'function') {
            displaySheetsStatus();
        }
        if (typeof addRefreshButton === 'function') {
            addRefreshButton();
        }
    }, 1000);
    
    // Inisialisasi navigasi dan tombol CTA
    initNavigation();
    
    // Inisialisasi Google Authentication
    initGoogleAuth();
    
    // Smooth scrolling untuk navigation links
    // Smooth scrolling untuk semua anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlight
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    function highlightNavigation() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('header').offsetHeight;
            
            if (window.pageYOffset >= (sectionTop - headerHeight - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // Form submission handler
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Ambil data form
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const category = this.querySelector('select').value;
        const message = this.querySelector('textarea').value;
        
        // Validasi sederhana
        if (!name || !email || !phone || !category || !message) {
            alert('Mohon lengkapi semua field!');
            return;
        }
        
        // Validasi email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Format email tidak valid!');
            return;
        }
        
        // Validasi nomor telepon
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phone)) {
            alert('Format nomor telepon tidak valid!');
            return;
        }
        
        // Simulasi pengiriman form
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Mengirim...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            // Generate WhatsApp message
            const whatsappMessage = `Halo KAINKAMU!\n\nNama: ${name}\nEmail: ${email}\nNo. WhatsApp: ${phone}\nKategori: ${category}\nPesan: ${message}\n\nTerima kasih!`;
            const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(whatsappMessage)}`;
            
            alert('Terima kasih! Pesan Anda akan diteruskan ke WhatsApp untuk respon yang lebih cepat.');
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
    
    // CTA Button click handler
    const ctaButton = document.querySelector('.cta-button');
    
    ctaButton.addEventListener('click', function() {
        const catalogSection = document.querySelector('#catalog');
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = catalogSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
    
    // Product catalog functionality
    function initProductCatalog() {
        const productGrid = document.getElementById('productGrid');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const loading = document.getElementById('loading');
        
        let currentFilter = 'all';
        
        // Render products
        function renderProducts(products) {
            if (products.length === 0) {
                productGrid.innerHTML = '<div class="no-products">Tidak ada produk ditemukan</div>';
                return;
            }
            
            productGrid.innerHTML = products.map(product => {
                const stockStatus = product.stock === 0 ? 'out' : product.stock <= 10 ? 'low' : 'in';
                const stockText = product.stock === 0 ? 'Habis' : product.stock <= 10 ? `Sisa ${product.stock}` : `Stok ${product.stock}`;
                
                return `
                    <div class="product-card" data-category="${product.category}">
                        <div class="product-image">
                            <span class="stock-badge ${stockStatus}">${stockText}</span>
                            <div style="font-size: 4rem;">${product.image}</div>
                        </div>
                        <div class="product-info">
                            <div class="product-category">${getCategoryName(product.category)}</div>
                            <h3 class="product-title">${product.name}</h3>
                            <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}/meter</div>
                            <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">${product.description}</p>
                            <div class="product-actions">
                                <button class="btn-primary" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                                    ${product.stock === 0 ? 'Habis' : 'Tambah ke Keranjang'}
                                </button>
                                <button class="btn-secondary" onclick="viewDetails(${product.id})">
                                    Detail
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        // Get category display name
        function getCategoryName(category) {
            const categoryNames = {
                'abstrak': 'Abstrak',
                'salur': 'Salur',
                'bunga-kecil': 'Bunga Kecil',
                'bunga-besar': 'Bunga Besar',
                'single-border': 'Single Border',
                'double-border': 'Double Border',
                'digital-print': 'Digital Print',
                'eco-print': 'Eco Print'
            };
            return categoryNames[category] || category;
        }
        
        // Filter products
        function filterProducts(category) {
            const products = window.allProducts || productsData;
            let filteredProducts;
            
            if (category === 'all') {
                filteredProducts = products;
            } else {
                filteredProducts = products.filter(product => product.category === category);
            }
            
            renderProducts(filteredProducts);
            return filteredProducts;
        }
        
        // Handle filter button clicks
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Get filter value
                currentFilter = this.getAttribute('data-filter');
                
                // Show loading
                loading.style.display = 'block';
                productGrid.style.opacity = '0.5';
                
                // Simulate API call delay
                setTimeout(() => {
                    const filteredProducts = filterProducts(currentFilter);
                    renderProducts(filteredProducts);
                    loading.style.display = 'none';
                    productGrid.style.opacity = '1';
                }, 500);
            });
        });
        
        // Initial load
        setTimeout(() => {
            renderProducts(productsData);
            loading.style.display = 'none';
        }, 1000);
    }
    
    // Initialize product catalog
    initProductCatalog();
    
    // Display produk (akan dimuat dari sheets atau default)
    if (productsData.length > 0) {
        const productGrid = document.getElementById('productGrid');
        if (productGrid) {
            const filteredProducts = productsData;
            renderProducts(filteredProducts);
        }
    } else {
        // Tunggu sebentar untuk sheets API loading
        setTimeout(() => {
            if (productsData.length === 0) {
                productsData = getDefaultProductsData();
            }
            const productGrid = document.getElementById('productGrid');
            if (productGrid) {
                const filteredProducts = productsData;
                renderProducts(filteredProducts);
            }
        }, 1000);
    }
    
    // Inisialisasi Google Sheets API
    initSheetsAPI();
    
    // Tampilkan status koneksi Google Sheets
    setTimeout(() => {
        displaySheetsStatus();
    }, 500);
    
    // Tambahkan tombol refresh data
    setTimeout(() => {
        addRefreshButton();
    }, 1000);
    
    // Global functions for product actions
    window.addToCart = function(productId) {
        const product = productsData.find(p => p.id === productId);
        if (product && product.stock > 0) {
            const cartMessage = `${product.name}\n${product.kodeMotif ? `Kode Motif: ${product.kodeMotif}\n` : ''}Harga: Rp ${product.price.toLocaleString('id-ID')}/meter\n\nTelah ditambahkan ke keranjang!\n\nSilakan hubungi kami melalui WhatsApp untuk melanjutkan pemesanan.`;
            alert(cartMessage);
            
            // Simulate stock reduction
            product.stock -= 1;
            
            // Re-render products to update stock
            const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            const filteredProducts = currentFilter === 'all' ? productsData : productsData.filter(p => p.category === currentFilter);
            const productGrid = document.getElementById('productGrid');
            
            setTimeout(() => {
                if (productGrid.innerHTML.includes(product.name)) {
                    initProductCatalog();
                    document.querySelector(`[data-filter="${currentFilter}"]`).click();
                }
            }, 100);
        }
    };
    
    window.viewDetails = function(productId) {
        const product = productsData.find(p => p.id === productId);
        if (product) {
            const detailMessage = `Detail Produk:\n\nNama: ${product.name}\nKategori: ${getCategoryName(product.category)}\n${product.variant ? `Varian: ${product.variant}\n` : ''}${product.kodeMotif ? `Kode Motif: ${product.kodeMotif}\n` : ''}Harga: Rp ${product.price.toLocaleString('id-ID')}/meter\nJumlah Roll Tersedia: ${product.stock} roll\nDeskripsi: ${product.description}\n\nUntuk informasi lebih lanjut, silakan hubungi kami.`;
            alert(detailMessage);
        }
    };
    
    function getCategoryName(category) {
        const categoryNames = {
            'abstrak': 'Abstrak',
            'salur': 'Salur',
            'bunga-kecil': 'Bunga Kecil',
            'bunga-besar': 'Bunga Besar',
            'single-border': 'Single Border',
            'double-border': 'Double Border',
            'digital-print': 'Digital Print',
            'eco-print': 'Eco Print'
        };
        return categoryNames[category] || category;
    }
    
    // Animasi scroll reveal
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.feature, .service-card');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('reveal');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    
    // Header background change on scroll
    function changeHeaderBackground() {
        const header = document.querySelector('header');
        
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 87, 34, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)';
            header.style.backdropFilter = 'none';
        }
    }
    
    window.addEventListener('scroll', changeHeaderBackground);
    
    // Mobile menu toggle (untuk implementasi future)
    function createMobileMenu() {
        const nav = document.querySelector('nav');
        const navLinks = document.querySelector('.nav-links');
        
        // Buat hamburger button
        const hamburger = document.createElement('div');
        hamburger.classList.add('hamburger');
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // Tambahkan CSS untuk hamburger
        const style = document.createElement('style');
        style.textContent = `
            .hamburger {
                display: none;
                flex-direction: column;
                cursor: pointer;
                gap: 4px;
            }
            
            .hamburger span {
                width: 25px;
                height: 3px;
                background: white;
                transition: 0.3s;
            }
            
            @media (max-width: 768px) {
                .hamburger {
                    display: flex;
                }
                
                .nav-links {
                    position: fixed;
                    top: 70px;
                    right: -100%;
                    width: 100%;
                    height: calc(100vh - 70px);
                    background: rgba(102, 126, 234, 0.95);
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                    padding-top: 2rem;
                    transition: right 0.3s ease;
                }
                
                .nav-links.active {
                    right: 0;
                }
                
                .nav-links li {
                    margin: 1rem 0;
                }
            }
        `;
        
        document.head.appendChild(style);
        nav.appendChild(hamburger);
        
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    createMobileMenu();
    
    // Typing effect untuk hero title
    function typeWriter() {
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            
            let i = 0;
            function type() {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 100);
                }
            }
            
            setTimeout(type, 1000);
        }
    }
    
    typeWriter();
});

// Fungsi untuk menampilkan status koneksi Google Sheets
function displaySheetsStatus() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'sheets-status';
    statusDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 1000;
        transition: opacity 0.3s;
    `;
    
    if (window.sheetsAPI && typeof SheetsAPI !== 'undefined') {
        statusDiv.innerHTML = '🟢 Google Sheets Connected';
        statusDiv.style.background = 'rgba(0,128,0,0.8)';
    } else {
        statusDiv.innerHTML = '🟡 Using Default Data';
        statusDiv.style.background = 'rgba(255,165,0,0.8)';
    }
    
    document.body.appendChild(statusDiv);
    
    // Auto hide setelah 3 detik
    setTimeout(() => {
        statusDiv.style.opacity = '0';
        setTimeout(() => statusDiv.remove(), 300);
    }, 3000);
}

// Fungsi untuk menambahkan tombol refresh data
function addRefreshButton() {
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
        const refreshButton = document.createElement('button');
        refreshButton.innerHTML = '🔄 Refresh Data';
        refreshButton.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px 0;
            font-size: 14px;
            transition: transform 0.2s;
        `;
        
        refreshButton.addEventListener('click', async function() {
            this.innerHTML = '⏳ Loading...';
            this.disabled = true;
            
            if (window.sheetsAPI) {
                await loadProductsFromSheets();
            } else {
                productsData = getDefaultProductsData();
                displayProducts(productsData);
            }
            
            this.innerHTML = '🔄 Refresh Data';
            this.disabled = false;
        });
        
        refreshButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        refreshButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        const filterContainer = catalogSection.querySelector('.filter-container');
        if (filterContainer) {
            filterContainer.appendChild(refreshButton);
        }
    }
}

// Fungsi untuk menampilkan produk (diperlukan untuk integrasi sheets)
function displayProducts(products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid || !products) return;
    
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Buat elemen gambar dengan error handling
        const imageElement = `<img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200/f5f5f5/999?text=Gambar+tidak+tersedia';">`;
        
        // Tambahkan indikator jenis gambar
        let imageIndicator = '';
        if (product.hasRealImage === 'sheet') {
            imageIndicator = '<div class="image-source-indicator sheet">📄 Dari Sheet</div>';
        } else if (product.hasRealImage === true) {
            imageIndicator = '<div class="image-source-indicator url">🔗 URL</div>';
        } else {
            imageIndicator = '<div class="image-source-indicator placeholder">📷 Placeholder</div>';
        }
        
        productCard.innerHTML = `
            <div class="product-image-container">
                ${imageElement}
                ${imageIndicator}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-variant">${product.variant || ''}</p>
                <p class="product-code">Kode: ${product.kodeMotif || 'N/A'}</p>
                <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <p class="product-stock">Stok: ${product.stock} roll</p>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
}

// Fungsi untuk menampilkan loading indicator
function showLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
        loadingElement.innerHTML = '<div class="loading-spinner"></div><p>Memuat produk...</p>';
    }
}

// Fungsi untuk menyembunyikan loading indicator
function hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// Fungsi untuk membuat filter kategori
function createCategoryFilter(products) {
    const filterContainer = document.getElementById('category-filter');
    if (!filterContainer) return;
    
    const categories = getUniqueCategories(products);
    
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-category="all">Semua Kategori</button>
        ${categories.map(category => 
            `<button class="filter-btn" data-category="${category}">${getCategoryName(category)}</button>`
        ).join('')}
    `;
    
    // Event listener untuk filter
    filterContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // Update active state
            filterContainer.querySelectorAll('.filter-btn').forEach(btn => 
                btn.classList.remove('active')
            );
            e.target.classList.add('active');
            
            // Filter produk
            const category = e.target.dataset.category;
            filterProducts(category);
        }
    });
}

// Fungsi renderProducts yang akan dipanggil dari initProductCatalog
function renderProducts(products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    if (products.length === 0) {
        productGrid.innerHTML = '<div class="no-products">Tidak ada produk ditemukan</div>';
        return;
    }
    
    productGrid.innerHTML = products.map(product => {
        const stockStatus = product.stock === 0 ? 'out' : product.stock <= 10 ? 'low' : 'in';
        const stockText = product.stock === 0 ? 'Habis' : product.stock <= 10 ? `Sisa ${product.stock}` : `Stok ${product.stock}`;
        
        return `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <span class="stock-badge ${stockStatus}">${stockText}</span>
                    <div style="font-size: 4rem;">${product.image}</div>
                </div>
                <div class="product-info">
                    <div class="product-category">${getCategoryName(product.category)}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-meta">
                        ${product.variant ? `<span class="product-variant">${product.variant}</span>` : ''}
                    </div>
                    ${product.kodeMotif ? `<p class="product-code"><strong>Kode Motif:</strong> ${product.kodeMotif}</p>` : ''}
                    <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}/meter</div>
                    <p class="product-stock"><strong>Jumlah Roll:</strong> ${product.stock} roll</p>
                    <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">${product.description}</p>
                    <div class="product-actions">
                        <button class="btn-primary" onclick="addToCart('${product.id}')" ${product.stock === 0 ? 'disabled' : ''}>
                            ${product.stock === 0 ? 'Habis' : 'Tambah ke Keranjang'}
                        </button>
                        <button class="btn-secondary" onclick="viewDetails('${product.id}')">
                            Detail
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Smooth scrolling untuk navigasi
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Fungsi untuk tombol CTA Hero Section
function initCTAButtons() {
    const primaryCTA = document.querySelector('.cta-button.primary');
    const secondaryCTA = document.querySelector('.cta-button.secondary');
    
    if (primaryCTA) {
        primaryCTA.addEventListener('click', function() {
            const catalogSection = document.querySelector('#catalog');
            if (catalogSection) {
                catalogSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    if (secondaryCTA) {
        secondaryCTA.addEventListener('click', function() {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Fungsi untuk menampilkan artikel lengkap
function showFullArticle(articleId) {
    const articles = {
        'tips-memilih-kain': {
            title: 'Tips Memilih Kain Berkualitas: Panduan Lengkap Memilih Bahan Rayon',
            content: `
                <div class="article-full-content">
                    <h2>Tips Memilih Kain Berkualitas: Panduan Lengkap Memilih Bahan Rayon</h2>
                    
                    <p>Rayon merupakan serat alami yang terbuat dari pohon kayu cellulose, sehingga serat kimia ini memiliki sifat yang mirip dengan kain sutra. Rayon digunakan dalam berbagai jenis pakaian dan memiliki keunggulan dalam hal ketahanan getaran, serap keringat yang baik, dan juga kelembutan yang nyaman untuk kulit.</p>
                    
                    <p>Namun, memilih bahan rayon yang tepat untuk kebutuhan Anda tidak mudah karena ada banyak jenis dan variasi bahan yang tersedia. Berikut beberapa tips untuk memilih bahan rayon yang pas untuk berbagai kebutuhan Anda:</p>
                    
                    <h3>🧵 Jenis Rayon</h3>
                    <p>Ada dua jenis rayon utama yang perlu Anda ketahui:</p>
                    <ul>
                        <li><strong>Rayon Viscose:</strong> Lebih sering digunakan dalam pembuatan pakaian karena biaya produksi yang lebih rendah dan kualitas yang baik. Cocok untuk pakaian sehari-hari dan fashion casual.</li>
                        <li><strong>Rayon Modal:</strong> Memiliki serat yang lebih kuat namun lebih mahal. Ideal untuk pakaian premium dan aplikasi yang membutuhkan daya tahan tinggi.</li>
                    </ul>
                    
                    <h3>📏 Ketebalan Bahan</h3>
                    <p>Ketebalan bahan rayon sangat mempengaruhi kenyamanan saat dipakai:</p>
                    <ul>
                        <li>Pilih ketebalan yang sesuai dengan kebutuhan dan iklim</li>
                        <li>Bahan yang terlalu tipis dapat terasa tidak nyaman dan mudah robek</li>
                        <li>Bahan yang terlalu tebal mungkin tidak cocok untuk cuaca tropis</li>
                        <li>Untuk pakaian formal, pilih ketebalan medium yang memberikan draping yang baik</li>
                    </ul>
                    
                    <h3>🎨 Pemilihan Warna</h3>
                    <p>Bahan rayon tersedia dalam berbagai pilihan warna:</p>
                    <ul>
                        <li><strong>Warna Netral:</strong> Hitam, putih, abu-abu, dan krem - cocok untuk pakaian formal dan serbaguna</li>
                        <li><strong>Warna Cerah:</strong> Merah, biru, hijau - ideal untuk pakaian kasual dan statement pieces</li>
                        <li><strong>Warna Pastel:</strong> Pink, lavender, mint - sempurna untuk pakaian feminin dan musim semi</li>
                        <li>Pertimbangkan warna kulit dan preferensi personal Anda</li>
                    </ul>
                    
                    <h3>✨ Menilai Kualitas</h3>
                    <p>Pastikan untuk memilih bahan rayon dengan kualitas terbaik:</p>
                    <ul>
                        <li><strong>Tekstur:</strong> Pilih bahan yang terasa lembut dan halus di kulit</li>
                        <li><strong>Daya Tahan:</strong> Periksa kekuatan serat dengan menarik sedikit bagian kain</li>
                        <li><strong>Kemudahan Perawatan:</strong> Pilih bahan yang mudah dicuci dan dirawat</li>
                        <li><strong>Warna Tahan Lama:</strong> Pastikan warna tidak mudah pudar setelah dicuci</li>
                    </ul>
                    
                    <h3>📐 Ukuran dan Elastisitas</h3>
                    <p>Pertimbangkan faktor ukuran dan elastisitas:</p>
                    <ul>
                        <li>Pilih bahan yang sesuai dengan ukuran tubuh Anda</li>
                        <li>Cari bahan rayon yang memiliki sedikit elastisitas untuk kenyamanan</li>
                        <li>Bahan dengan campuran spandex memberikan fleksibilitas lebih baik</li>
                        <li>Perhatikan shrinkage (penyusutan) setelah pencucian pertama</li>
                    </ul>
                    
                    <h3>🤲 Kehalusan dan Kenyamanan</h3>
                    <p>Faktor kenyamanan sangat penting dalam pemilihan kain:</p>
                    <ul>
                        <li>Bahan rayon berkualitas tinggi terasa lembut dan halus</li>
                        <li>Tidak menyebabkan iritasi atau gatal pada kulit sensitif</li>
                        <li>Memiliki sirkulasi udara yang baik untuk kenyamanan sepanjang hari</li>
                        <li>Mudah menyerap keringat dan cepat kering</li>
                    </ul>
                    
                    <h3>💰 Pertimbangan Harga</h3>
                    <p>Seimbangkan antara kualitas dan budget:</p>
                    <ul>
                        <li>Harga bahan rayon bervariasi tergantung jenis, kualitas, dan merek</li>
                        <li>Investasi pada kualitas yang baik akan lebih ekonomis dalam jangka panjang</li>
                        <li>Bandingkan harga dari beberapa supplier untuk mendapatkan deal terbaik</li>
                        <li>Pertimbangkan biaya perawatan dan daya tahan bahan</li>
                    </ul>
                    
                    <h3>🔍 Tips Tambahan untuk Pembeli Cerdas</h3>
                    <ul>
                        <li><strong>Periksa Label:</strong> Baca komposisi bahan dan instruksi perawatan</li>
                        <li><strong>Test Feel:</strong> Sentuh dan rasakan tekstur bahan sebelum membeli</li>
                        <li><strong>Cek Reputasi Supplier:</strong> Pilih toko atau supplier yang terpercaya</li>
                        <li><strong>Tanyakan Garansi:</strong> Pastikan ada jaminan kualitas dari penjual</li>
                        <li><strong>Beli Sample:</strong> Untuk pembelian dalam jumlah besar, beli sample terlebih dahulu</li>
                    </ul>
                    
                    <h3>❓ FAQ - Pertanyaan Umum</h3>
                    <div class="faq-section">
                        <div class="faq-item">
                            <h4>Apakah bahan rayon dapat dicuci menggunakan mesin cuci?</h4>
                            <p>Ya, tetapi disarankan untuk menggunakan deterjen yang lembut dan menjaga suhu agar tidak terlalu panas. Gunakan setting gentle atau delicate pada mesin cuci.</p>
                        </div>
                        
                        <div class="faq-item">
                            <h4>Apakah bahan rayon mudah luntur saat dicuci?</h4>
                            <p>Bahan rayon berkualitas baik tidak cenderung luntur saat dicuci, tetapi masih disarankan untuk memisahkan dari pakaian lain pada pencucian pertama.</p>
                        </div>
                        
                        <div class="faq-item">
                            <h4>Apakah bahan rayon cepat kusut?</h4>
                            <p>Bahan rayon memiliki kecenderungan untuk kusut, sehingga disarankan untuk menyetrika saat masih sedikit lembab atau menggunakan steamer.</p>
                        </div>
                        
                        <div class="faq-item">
                            <h4>Apakah bahan rayon tahan air?</h4>
                            <p>Bahan rayon tidak tahan air dengan baik, sehingga disarankan untuk menghindari penggunaan dalam cuaca hujan atau lingkungan yang basah.</p>
                        </div>
                        
                        <div class="faq-item">
                            <h4>Apakah bahan rayon ramah lingkungan?</h4>
                            <p>Bahan rayon termasuk ramah lingkungan karena terbuat dari bahan dasar yang dapat didaur ulang, meskipun proses produksinya menggunakan bahan kimia.</p>
                        </div>
                    </div>
                    
                    <h3>🎯 Kesimpulan</h3>
                    <p>Memilih bahan rayon yang tepat memerlukan pertimbangan berbagai faktor mulai dari jenis, kualitas, hingga budget. Dengan mengikuti panduan ini, Anda dapat membuat keputusan yang tepat dan mendapatkan bahan rayon berkualitas tinggi yang sesuai dengan kebutuhan Anda.</p>
                    
                    <p>Di <strong>KAINKAMU</strong>, kami menyediakan berbagai pilihan kain rayon berkualitas tinggi dengan harga terjangkau. Kunjungi showroom kami atau hubungi tim customer service untuk konsultasi lebih lanjut!</p>
                    
                    <div class="article-cta">
                        <a href="#catalog" class="btn-primary" onclick="closeArticleModal(); document.querySelector('#catalog').scrollIntoView({behavior: 'smooth'});">Lihat Katalog Kain</a>
                        <a href="#contact" class="btn-secondary" onclick="closeArticleModal(); document.querySelector('#contact').scrollIntoView({behavior: 'smooth'});">Hubungi Kami</a>
                    </div>
                </div>
            `
        }
    };
    
    const article = articles[articleId];
    if (article) {
        showArticleModal(article.title, article.content);
    }
}

// Fungsi untuk menampilkan modal artikel
function showArticleModal(title, content) {
    // Buat modal jika belum ada
    let modal = document.getElementById('article-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'article-modal';
        modal.className = 'article-modal';
        modal.innerHTML = `
            <div class="article-modal-content">
                <span class="article-close" onclick="closeArticleModal()">&times;</span>
                <div class="article-modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Isi konten modal
    const modalBody = modal.querySelector('.article-modal-body');
    modalBody.innerHTML = content;
    
    // Tampilkan modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fungsi untuk menutup modal artikel
function closeArticleModal() {
    const modal = document.getElementById('article-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Event listener untuk menutup modal saat klik di luar konten
document.addEventListener('click', function(event) {
    const modal = document.getElementById('article-modal');
    if (modal && event.target === modal) {
        closeArticleModal();
    }
});

// Fungsi untuk kontak WhatsApp
function contactWhatsApp(productName = '', productPrice = '') {
    const phoneNumber = '6289603960882';
    let message = 'Halo, saya tertarik dengan produk di KAINKAMU.';
    
    if (productName && productPrice) {
        message = `Halo, saya tertarik dengan produk ${productName} (Rp ${productPrice}). Bisakah saya mendapatkan informasi lebih lanjut?`;
    }
    
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// Inisialisasi semua fungsi navigasi
function initNavigation() {
    initSmoothScrolling();
    initCTAButtons();
}

// Google Authentication
function initGoogleAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('googleUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        showUserMenu(user);
    }
    
    // Login button click handler
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            // Simulate Google login (in real implementation, use Google OAuth)
            simulateGoogleLogin();
        });
    }
    
    // Logout button click handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout();
        });
    }
    
    function simulateGoogleLogin() {
        // This is a simulation. In real implementation, use Google OAuth 2.0
        const mockUser = {
            name: 'Demo User',
            email: 'demo@gmail.com',
            picture: 'https://via.placeholder.com/32x32/4285F4/ffffff?text=DU'
        };
        
        // Save user data
        localStorage.setItem('googleUser', JSON.stringify(mockUser));
        showUserMenu(mockUser);
        
        // Show success message
        alert('Login berhasil! Selamat datang di KAINKAMU.');
    }
    
    function showUserMenu(user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userAvatar) userAvatar.src = user.picture;
        if (userName) userName.textContent = user.name;
    }
    
    function logout() {
        localStorage.removeItem('googleUser');
        if (loginBtn) loginBtn.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
        alert('Logout berhasil. Terima kasih telah menggunakan KAINKAMU!');
    }
}