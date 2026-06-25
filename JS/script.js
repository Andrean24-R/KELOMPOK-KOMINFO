const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
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


document.getElementById('liveSearch').addEventListener('input', function () {

    const keyword = this.value.toLowerCase().trim();


    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {

        const name = product.getAttribute('data-name').toLowerCase();
        const desc = product.querySelector('.desc').textContent.toLowerCase();


        if (name.includes(keyword) || desc.includes(keyword)) {
            product.style.display = "";
        } else {
            product.style.setProperty('display', 'none', 'important');
        }
    });
});