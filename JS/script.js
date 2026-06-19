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

// --- MESIN TEMA GELAP TERANG ---
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Cek memori, kemaren user milih tema apa?
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        if(themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            body.classList.toggle('light-mode');
            
            // Simpan pilihan ke otak browser
            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            } else {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            }
        });
    }
});

