
const CART_KEY = 'mikroskil_cart';

function getCart() { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function getCartTotalItems() { return getCart().reduce((sum, item) => sum + item.quantity, 0); }

function updateCartCount() {
    const count = getCartTotalItems();
    document.querySelectorAll('#cartCount').forEach(badge => {
        if (badge) badge.textContent = count;
    });
}

document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const price = parseInt(btn.getAttribute('data-price'));
        
        const card = btn.closest('.product-card');
        const imgEl = card ? card.querySelector('img') : null;
        const image = imgEl ? imgEl.src : '';
        const id = 'prod_' + name.replace(/\s+/g, '_').toLowerCase();

        const cart = getCart();
        const existing = cart.find(item => item.id === id);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }
        
        saveCart(cart);
        
        
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) cartSidebar.classList.add('open');

        
        renderCartPage(); 
    });
});


const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');

if (cartToggle && cartSidebar) cartToggle.onclick = () => cartSidebar.classList.toggle('open');
if (closeCart && cartSidebar) closeCart.onclick = () => cartSidebar.classList.remove('open');


function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCartPage(); 
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) { removeFromCart(productId); return; }
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        renderCartPage();
    }
}


function renderCartPage() {
    
    const container = document.getElementById('cartItemsContainer') || document.getElementById('cartItems');
    const summaryDiv = document.getElementById('cartSummary');
    const totalAmount = document.getElementById('totalAmount'); 
    const totalPrice = document.getElementById('totalPrice'); 
    
    if (!container) return; 

    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart" style="text-align:center; padding:20px; color:#aaa;">Keranjang lu masih kosong, Bos! Gas belanja dulu! 🏎️</p>';
        if (summaryDiv) summaryDiv.style.display = 'none';
        if (totalAmount) totalAmount.innerText = 'Rp 0';
        if (totalPrice) totalPrice.innerText = 'Rp 0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
       html += `
            <div class="cart-item" data-id="${item.id}" style="display: flex; justify-content: space-between; margin-bottom: 15px; background: #1a1a1a; padding: 15px; border-radius: 8px; border-left: 3px solid #ff0000; align-items:center; gap: 10px;">
                <img src="${item.image}" alt="${item.name}" style="width:60px; height:60px; border-radius:5px; object-fit:cover;">
                <div style="flex:1;">
                    <div style="color:#fff; font-weight:bold; font-size:14px;">${item.name}</div>
                    <div style="color:#ff0000; font-weight:bold; margin-top:5px;">Rp ${item.price.toLocaleString('id-ID')}</div>
                </div>
                
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="display:flex; align-items:center; gap:5px; background:#111; padding:5px; border-radius:5px;">
                        <button class="quantity-btn minus" data-id="${item.id}" style="background:#222; color:#fff; border:none; padding:5px 12px; cursor:pointer; font-size:16px; font-weight:bold; border-radius:3px;">-</button>
                        
                        <span style="color:#fff; font-weight:bold; font-size:16px; min-width:30px; text-align:center; display:inline-block;">${item.quantity}</span>
                        
                        <button class="quantity-btn plus" data-id="${item.id}" style="background:#222; color:#fff; border:none; padding:5px 12px; cursor:pointer; font-size:16px; font-weight:bold; border-radius:3px;">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}" style="background:none; border:none; color:#ff0000; cursor:pointer; font-size: 20px; transition:0.3s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">🗑️</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (totalPrice) totalPrice.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    if (totalAmount) totalAmount.innerText = `Rp ${total.toLocaleString('id-ID')}`;
    if (summaryDiv) summaryDiv.style.display = 'block';

    
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.onclick = (e) => {
            const id = e.target.dataset.id;
            const item = getCart().find(i => i.id === id);
            if (item) updateQuantity(id, item.quantity - 1);
        };
    });

    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.onclick = (e) => {
            const id = e.target.dataset.id;
            const item = getCart().find(i => i.id === id);
            if (item) updateQuantity(id, item.quantity + 1);
        };
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.onclick = (e) => removeFromCart(e.target.dataset.id);
    });
}

// --- LOGIKA CHECKOUT FINAL ---
let countdownInterval; 

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    clearInterval(countdownInterval); 
    
    countdownInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countdownInterval);
            alert("WAKTU LU ABIS, TONG! Transaksi batal otomatis.");
            document.getElementById('paymentModal').style.display = 'none';
        }
    }, 1000);
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Keranjang lu masih kosong, mau checkout angin?!');
        return;
    }
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.style.display = 'flex';
        document.getElementById('step1').style.display = 'block';
        document.getElementById('step2').style.display = 'none';
    }
}

function lanjutKePembayaran() {
    const addressInput = document.getElementById('shippingAddress').value;
    if (addressInput.trim() === '') {
        alert("WOI! Alamat pengiriman lu kosong! Isi dulu alamatnya!");
        return;
    }

    const selectedMethod = document.querySelector('input[name="payment"]:checked').value;
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    
    document.getElementById('selectedMethodName').innerText = selectedMethod;
    const instruction = document.getElementById('paymentInstruction');
    const vaBox = document.getElementById('vaCodeContainer');
    const qrisBox = document.getElementById('qrisContainer');

    if (selectedMethod === "COD") {
        vaBox.style.display = 'none';
        qrisBox.style.display = 'none';
        instruction.innerText = "Siapkan uang pas saat kurir ngirim part ke alamat lu!";
    } else if (selectedMethod === "QRIS") {
        vaBox.style.display = 'none';
        qrisBox.style.display = 'inline-block';
        instruction.innerText = "Scan QR Code di bawah pakai M-Banking / E-Wallet lu:";
    } else {
        vaBox.style.display = 'flex';
        qrisBox.style.display = 'none';
        instruction.innerText = "Silakan transfer ke nomor Virtual Account berikut:";
        document.getElementById('vaNumber').innerText = "88" + Math.floor(10000000 + Math.random() * 90000000); 
    }

    startTimer(15 * 60, document.querySelector('#paymentTimer'));

    step1.style.display = 'none';
    step2.style.display = 'block';
}

function prosesVerifikasiFinal() {
    const addressInput = document.getElementById('shippingAddress').value; 
    clearInterval(countdownInterval); 
    document.getElementById('paymentModal').style.display = 'none';

    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.style.display = 'flex';
        setTimeout(() => {
            localStorage.removeItem(CART_KEY);
            updateCartCount();

            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('successIcon').style.display = 'block';
            
            const loadingText = document.getElementById('loadingText');
            loadingText.innerHTML = `TRANSAKSI BERHASIL!<br><span style="font-size: 16px; color: #ccc;">Barang siap dikirim ke:<br>${addressInput}</span>`; 
            loadingText.classList.add('success-mode');

            setTimeout(() => {
                window.location.href = 'beranda.html'; 
            }, 3500); 
        }, 3000);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCartPage(); 

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);

    const closePayment = document.getElementById('closePayment');
    if (closePayment) closePayment.addEventListener('click', () => {
        document.getElementById('paymentModal').style.display = 'none';
    });

    const btnLanjut = document.getElementById('btnLanjutBayar');
    if (btnLanjut) btnLanjut.addEventListener('click', lanjutKePembayaran);

    const btnVerif = document.getElementById('btnVerifikasi');
    if (btnVerif) btnVerif.addEventListener('click', prosesVerifikasiFinal);
});