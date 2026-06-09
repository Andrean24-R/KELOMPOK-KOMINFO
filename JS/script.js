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

const logo = document.getElementById('easterEgg');
const modal = document.getElementById('videoModal');
const closeVideo = document.querySelector('.close-video');
const vidEGG = document.getElementById('myVideo');

if (logo) {
    logo.onclick = () => {
        if(modal) modal.style.display = 'flex';
        if(vidEGG) vidEGG.play();
    };
}
if (closeVideo) {
    closeVideo.onclick = () => {
        if(modal) modal.style.display = 'none';
        if(vidEGG) vidEGG.pause();
    };
}