// --- 1. LOGIKA LOGIN ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        let usnInput = document.getElementById('username').value;
        let pwInput = document.getElementById('password').value;

        if (usnInput === "kominfo" && pwInput === "admin123@") {
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) loadingOverlay.style.display = 'flex';
            
            setTimeout(() => {
                window.location.href = "beranda.html"; 
            }, 2500);
        } else {
            alert("Username atau Password salah! Coba lagi");
        }
    });
}


// --- KODE BARU: LOGIKA HAMBURGER MENU RESPONSIVITAS MOBILE ---
const hamburger = document.getElementById('hamburgerMenu');
const navLinks = document.getElementById('navLinks');
const menuOverlay = document.getElementById('menuOverlay');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    });
}

if (menuOverlay) {
    menuOverlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        menuOverlay.classList.remove('active');
    });
}


document.getElementById('liveSearch').addEventListener('input', function() {
            // Ambil apa yang diketik user, paksa jadi huruf kecil semua biar ga sensitif
            const keyword = this.value.toLowerCase().trim();
            
            // Targetin class product-card yang ada di halaman ini
            const products = document.querySelectorAll('.product-card');

            products.forEach(product => {
                // Ambil data nama dari atribut, ama teks deskripsi di dalamnya
                const name = product.getAttribute('data-name').toLowerCase();
                const desc = product.querySelector('.desc').textContent.toLowerCase();

                // Logika: Cocok gak kata kunci ama nama atau deskripsi barang?
                if (name.includes(keyword) || desc.includes(keyword)) {
                    product.style.display = ""; // Munculin kalau cocok
                } else {
                    product.style.setProperty('display', 'none', 'important'); // Tendang kalau kagak cocok
                }
            });
        });