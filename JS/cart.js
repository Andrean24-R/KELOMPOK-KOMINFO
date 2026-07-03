const CART_KEY = "mikroskil_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function getCartTotalItems() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
  const count = getCartTotalItems();
  document.querySelectorAll("#cartCount").forEach((badge) => {
    if (badge) badge.textContent = count;
  });
}

/* ================== ANIMASI TERBANG KE KERANJANG + TOAST ================== */

function flyToCart(imageSrc, startRect) {
  const cartIcon = document.querySelector(".cart-link");
  if (!cartIcon || !imageSrc || !startRect) return;

  const cartRect = cartIcon.getBoundingClientRect();

  const flyEl = document.createElement("img");
  flyEl.src = imageSrc;
  flyEl.className = "fly-cart-img";
  flyEl.style.left = startRect.left + "px";
  flyEl.style.top = startRect.top + "px";
  flyEl.style.width = startRect.width + "px";
  flyEl.style.height = startRect.height + "px";
  document.body.appendChild(flyEl);

  // paksa reflow supaya transisi berikutnya kepakai
  void flyEl.offsetWidth;

  requestAnimationFrame(() => {
    flyEl.style.left = cartRect.left + cartRect.width / 2 - 14 + "px";
    flyEl.style.top = cartRect.top + cartRect.height / 2 - 14 + "px";
    flyEl.style.width = "28px";
    flyEl.style.height = "28px";
    flyEl.style.opacity = "0.15";
    flyEl.style.transform = "rotate(360deg)";
  });

  const cleanup = () => {
    flyEl.remove();
    cartIcon.classList.add("cart-bump");
    setTimeout(() => cartIcon.classList.remove("cart-bump"), 400);
  };

  flyEl.addEventListener("transitionend", cleanup, { once: true });
  setTimeout(cleanup, 900); // jaga-jaga kalau transitionend gak fire
}

function showToast(message) {
  let toast = document.getElementById("addToCartToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "addToCartToast";
    toast.className = "add-cart-toast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${message}</span>`;

  toast.classList.remove("show");
  void toast.offsetWidth;
  toast.classList.add("show");

  clearTimeout(toast._hideTimeout);
  toast._hideTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* ================== TOMBOL SIKAT! (TAMBAH KE KERANJANG) ================== */

document.querySelectorAll(".btn-buy").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.getAttribute("data-name");
    const price = parseInt(btn.getAttribute("data-price"));

    const card = btn.closest(".product-card");
    const imgEl = card ? card.querySelector("img") : null;
    const image = imgEl ? imgEl.src : "";
    const id = "prod_" + name.replace(/\s+/g, "_").toLowerCase();

    const cart = getCart();
    const existing = cart.find((item) => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, image, quantity: 1 });
    }

    saveCart(cart);

    // animasi produk terbang ke ikon keranjang
    if (imgEl) {
      flyToCart(image, imgEl.getBoundingClientRect());
    }

    // notifikasi toast
    showToast(`${name} berhasil ditambahkan ke keranjang!`);

    const cartSidebar = document.getElementById("cartSidebar");
    if (cartSidebar) cartSidebar.classList.add("open");

    renderCartPage();
  });
});

const cartToggle = document.getElementById("cartToggle");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");

if (cartToggle && cartSidebar)
  cartToggle.onclick = () => cartSidebar.classList.toggle("open");
if (closeCart && cartSidebar)
  closeCart.onclick = () => cartSidebar.classList.remove("open");

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  renderCartPage();
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(productId);
    return;
  }
  const cart = getCart();
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
    renderCartPage();
  }
}

function renderCartPage() {
  const container =
    document.getElementById("cartItemsContainer") ||
    document.getElementById("cartItems");
  const summaryDiv = document.getElementById("cartSummary");
  const totalAmount = document.getElementById("totalAmount");
  const totalPrice = document.getElementById("totalPrice");

  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML =
      '<p class="empty-cart">Keranjang lu masih kosong, Bos! <br><br><a href="aksesoris_body.html" style="border: 2px solid red; padding: 5px 10px; border-radius: 5px; text-decoration: none; color: red;">Gas belanja dulu!</a></p>';
    if (summaryDiv) summaryDiv.style.display = "none";
    if (totalAmount) totalAmount.innerText = "Rp 0";
    if (totalPrice) totalPrice.innerText = "Rp 0";
    return;
  }

  let html = `
        <div class="select-all-box" style="background: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="selectAll" style="width: 20px; height: 20px; cursor: pointer;">
            <label for="selectAll" style="color: white; font-weight: bold; font-family: 'Oswald', sans-serif; cursor: pointer; letter-spacing: 1px;">PILIH SEMUA ITEM</label>
        </div>
    `;

  cart.forEach((item) => {
    let isChecked = item.selected !== false ? "checked" : "";

    html += `
            <div class="cart-item" data-id="${item.id}" style="display: flex; align-items: center; gap: 15px;">
                <input type="checkbox" class="item-checkbox" data-id="${item.id}" data-price="${item.price}" data-qty="${item.quantity}" style="width: 20px; height: 20px; cursor: pointer;" ${isChecked}>
                
                <img class="cart-item-img" src="${item.image}" alt="${item.name}">
                <div class="cart-item-details" style="flex-grow: 1;">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">Rp ${item.price.toLocaleString("id-ID")}</div>
                </div>
                
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="item-qty">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">🗑️</button>
                </div>
            </div>
        `;
  });

  container.innerHTML = html;
  if (summaryDiv) summaryDiv.style.display = "block";

  document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
    btn.onclick = (e) => {
      const id = e.target.dataset.id;
      const item = getCart().find((i) => i.id === id);
      if (item) updateQuantity(id, item.quantity - 1);
    };
  });

  document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
    btn.onclick = (e) => {
      const id = e.target.dataset.id;
      const item = getCart().find((i) => i.id === id);
      if (item) updateQuantity(id, item.quantity + 1);
    };
  });

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.onclick = (e) => removeFromCart(e.target.dataset.id);
  });

  attachCheckboxListeners();
}

let countdownInterval;

function startTimer(duration, display) {
  let timer = duration,
    minutes,
    seconds;
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
      const modal = document.getElementById("paymentModal");
      if (modal) modal.style.display = "none";
    }
  }, 1000);
}

function checkout() {
  const cart = getCart();
  const barangDicentang = cart.filter((item) => item.selected !== false);

  if (barangDicentang.length === 0) {
    alert("WOI! Centang dulu minimal satu barang, mau checkout angin lu?!");
    return;
  }
  const paymentModal = document.getElementById("paymentModal");
  if (paymentModal) {
    paymentModal.style.display = "flex";
    document.getElementById("step1").style.display = "block";
    document.getElementById("step2").style.display = "none";
  }
}

function lanjutKePembayaran() {
  const addressInput = document.getElementById("shippingAddress").value;
  if (addressInput.trim() === "") {
    alert("WOI! Alamat pengiriman lu kosong! Isi dulu alamatnya!");
    return;
  }

  const selectedMethodEl = document.querySelector(
    'input[name="payment"]:checked',
  );
  const selectedMethod = selectedMethodEl
    ? selectedMethodEl.value
    : "BCA Virtual Account";

  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");

  document.getElementById("selectedMethodName").innerText = selectedMethod;
  const instruction = document.getElementById("paymentInstruction");

  const vaBox = document.getElementById("vaCodeContainer");
  const qrisBox = document.getElementById("qrisContainer");

  if (selectedMethod === "COD") {
    if (vaBox) vaBox.style.display = "none";
    if (qrisBox) qrisBox.style.display = "none";
    instruction.innerText =
      "Siapkan uang pas saat kurir ngirim part ke alamat lu!";
  } else if (selectedMethod === "QRIS") {
    if (vaBox) vaBox.style.display = "none";
    if (qrisBox) {
      qrisBox.style.display = "inline-block";

      const qrisImg = qrisBox.querySelector("img");
      const randomInvoice =
        "INV-" + Math.floor(10000000 + Math.random() * 90000000);

      if (qrisImg) {
        qrisImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MIKROSKIL-AUTOSPEED-${randomInvoice}`;
      }
    }
    instruction.innerText =
      "Scan QR Code di bawah pakai M-Banking / E-Wallet lu:";
  } else {
    if (vaBox) vaBox.style.display = "flex";
    if (qrisBox) qrisBox.style.display = "none";
    instruction.innerText =
      "Silakan transfer ke nomor Virtual Account berikut:";
    const vaNumberEl = document.getElementById("vaNumber");
    if (vaNumberEl)
      vaNumberEl.innerText =
        "88" + Math.floor(10000000 + Math.random() * 90000000);
  }

  const timerDisplay = document.querySelector("#paymentTimer");
  if (timerDisplay) startTimer(15 * 60, timerDisplay);

  step1.style.display = "none";
  step2.style.display = "block";
}

function prosesVerifikasiFinal() {
  const addressInput = document.getElementById("shippingAddress").value;
  const selectedMethodEl = document.querySelector(
    'input[name="payment"]:checked',
  );
  const selectedMethod = selectedMethodEl
    ? selectedMethodEl.value
    : "Tidak Diketahui";

  clearInterval(countdownInterval);
  const paymentModal = document.getElementById("paymentModal");
  if (paymentModal) paymentModal.style.display = "none";

  const loading = document.getElementById("loadingOverlay");
  if (loading) {
    loading.style.display = "flex";

    const cart = getCart();

    const barangDibeli = cart.filter((item) => item.selected !== false);

    let rincianBelanja = "";
    let totalSemua = 0;

    barangDibeli.forEach((item, index) => {
      let subtotal = item.price * item.quantity;
      totalSemua += subtotal;
      rincianBelanja += `
                <tr>
                    <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${index + 1}</td>
                    <td style="border: 1px solid #ccc; padding: 6px; font-weight: bold; word-wrap: break-word; white-space: normal;">${item.name}</td>
                    <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${item.quantity}</td>
                    <td style="border: 1px solid #ccc; padding: 6px; word-wrap: break-word; white-space: normal;">Rp ${item.price.toLocaleString("id-ID")}</td>
                    <td style="border: 1px solid #ccc; padding: 6px; font-weight: bold; color: #d32f2f; word-wrap: break-word; white-space: normal;">Rp ${subtotal.toLocaleString("id-ID")}</td>
                </tr>
            `;
    });

    const tgl = new Date();
    const tanggalCetak = tgl.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    setTimeout(() => {
      const sisaBarangDiKeranjang = cart.filter(
        (item) => item.selected === false,
      );

      saveCart(sisaBarangDiKeranjang);
      updateCartCount();

      const spinner = document.getElementById("loadingSpinner");
      if (spinner) spinner.style.display = "none";

      const sIcon = document.getElementById("successIcon");
      if (sIcon) sIcon.style.display = "none";

      const loadingText = document.getElementById("loadingText");
      if (loadingText) {
        loadingText.innerHTML = `
                    <div id="invoiceArea" style="position: relative; text-align: left; background: #fff; color: #000; padding: 35px; border-radius: 8px; width: 90%; max-width: 750px; margin: 0 auto; font-family: 'Poppins', sans-serif; font-size: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); color: rgba(0, 0, 0, 0.05); white-space: nowrap; font-weight: 900; z-index: 0; pointer-events: none; font-family: 'Anton', sans-serif; text-transform: uppercase; line-height: 1; text-align: center;">
                            <span style="font-size: clamp(40px, 5vw, 70px);">MIKROSKIL AUTOSPEED</span><br>
                            <span style="font-size: clamp(60px, 8vw, 100px);">LUNAS</span>
                        </div>

                        <div style="position: relative; z-index: 1;">
                            
                            <div style="text-align: center; border-bottom: 3px solid #111; padding-bottom: 15px; margin-bottom: 25px;">
                                <h2 style="margin: 0; font-family: 'Anton', sans-serif; color: #d32f2f; font-size: 32px; font-style: italic; letter-spacing: 1px;">MIKROSKIL AUTOSPEED</h2>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 13px; font-weight: bold;">Spesialis Tuning, Engine Swap & Maintenance JDM</p>
                                <h3 style="margin: 15px 0 0 0; color: #000; letter-spacing: 3px;">BUKTI PEMBAYARAN SAH</h3>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; margin-bottom: 25px; border-bottom: 1px dashed #ccc; padding-bottom: 20px;">
                                <div>
                                    <p style="margin: 0; color: #666; font-size: 12px;">DIKIRIM KE:</p>
                                    <p style="margin: 5px 0 0 0; color: #111; font-weight: bold; max-width: 300px; line-height: 1.4;">${addressInput}</p>
                                </div>
                                <div style="text-align: right;">
                                    <p style="margin: 0; color: #666; font-size: 12px;">TANGGAL TRANSAKSI:</p>
                                    <p style="margin: 2px 0 10px 0; color: #111; font-weight: bold;">${tanggalCetak}</p>
                                    
                                    <p style="margin: 0; color: #666; font-size: 12px;">METODE PEMBAYARAN:</p>
                                    <p style="margin: 2px 0 0 0; color: #d32f2f; font-weight: 900; text-transform: uppercase;">${selectedMethod}</p>
                                    
                                    <h3 style="color: #25D366; margin: 15px 0 0 0; border: 3px solid #25D366; display: inline-block; padding: 5px 15px; transform: rotate(-5deg); letter-spacing: 2px; font-family: 'Anton', sans-serif;">PAID</h3>
                                </div>
                            </div>

                            <table style="width: 100%; max-width: 100%; table-layout: fixed; border-collapse: collapse; background: rgba(255, 255, 255, 0.9); font-size: 11px;">
                            <thead>
                                <tr style="background: #111; color: #fff;">
                                    <th style="border: 1px solid #333; padding: 6px; text-align: center; width: 5%;">NO</th>
                                    <th style="border: 1px solid #333; padding: 6px; text-align: left; width: 35%; word-wrap: break-word; white-space: normal;">MEREK / NAMA PART</th>
                                    <th style="border: 1px solid #333; padding: 6px; text-align: center; width: 10%;">QTY</th>
                                    <th style="border: 1px solid #333; padding: 6px; text-align: left; width: 25%; word-wrap: break-word; white-space: normal;">HARGA SATUAN</th>
                                    <th style="border: 1px solid #333; padding: 6px; text-align: left; width: 25%; word-wrap: break-word; white-space: normal;">SUBTOTAL</th>
                                </tr>
                            </thead>
                                    <tbody>
                                        ${rincianBelanja}
                                    </tbody>
                                    <tfoot>
                                        <tr style="background: #f9f9f9;">
                                            <td colspan="4" style="border: 1px solid #ccc; padding: 15px; text-align: right; font-weight: bold; font-size: 16px; font-family: 'Oswald', sans-serif;">TOTAL KESELURUHAN:</td>
                                            <td style="border: 1px solid #ccc; padding: 15px; font-weight: 900; font-size: 10px; color: #d32f2f; white-space: nowrap;">Rp ${totalSemua.toLocaleString("id-ID")}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                        </div>
                    </div>
                    <br>
                    <button onclick="window.print()" class="btn-print" style="padding:15px 30px; background:linear-gradient(90deg, #ff0000, #aa0000); color:white; border:none; font-weight:bold; cursor:pointer; border-radius:8px; font-size: 1.2rem; letter-spacing: 2px; box-shadow: 0 5px 15px rgba(255,0,0,0.4);">🖨️ CETAK INVOICE SEKARANG</button>
                `;
        loadingText.classList.add("success-mode");
      }

      setTimeout(() => {
        window.location.href = "beranda.html";
      }, 60000);
    }, 3000);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartPage();

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);

  const closePayment = document.getElementById("closePayment");
  if (closePayment)
    closePayment.addEventListener("click", () => {
      const pm = document.getElementById("paymentModal");
      if (pm) pm.style.display = "none";
    });

  const btnLanjut = document.getElementById("btnLanjutBayar");
  if (btnLanjut) btnLanjut.addEventListener("click", lanjutKePembayaran);

  const btnVerif = document.getElementById("btnVerifikasi");
  if (btnVerif) btnVerif.addEventListener("click", prosesVerifikasiFinal);
});

function attachCheckboxListeners() {
  const selectAll = document.getElementById("selectAll");
  const checkboxes = document.querySelectorAll(".item-checkbox");

  function hitungTotalDinamic() {
    let total = 0;
    let adaYangDicentang = false;
    let semuaDicentang = true;
    let cart = getCart();

    checkboxes.forEach((cb) => {
      const id = cb.dataset.id;
      const itemIndex = cart.findIndex((i) => i.id === id);

      if (cb.checked) {
        total += parseInt(cb.dataset.price) * parseInt(cb.dataset.qty);
        adaYangDicentang = true;
        if (itemIndex > -1) cart[itemIndex].selected = true;
      } else {
        semuaDicentang = false;
        if (itemIndex > -1) cart[itemIndex].selected = false;
      }
    });

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    const totalPrice = document.getElementById("totalPrice");
    const totalAmount = document.getElementById("totalAmount");
    if (totalPrice)
      totalPrice.textContent = `Rp ${total.toLocaleString("id-ID")}`;
    if (totalAmount)
      totalAmount.textContent = `Rp ${total.toLocaleString("id-ID")}`;

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
      checkoutBtn.disabled = !adaYangDicentang;
      checkoutBtn.style.opacity = adaYangDicentang ? "1" : "0.5";
      checkoutBtn.style.cursor = adaYangDicentang ? "pointer" : "not-allowed";
    }

    if (selectAll) selectAll.checked = semuaDicentang && checkboxes.length > 0;
  }

  if (selectAll) {
    selectAll.addEventListener("change", (e) => {
      checkboxes.forEach((cb) => (cb.checked = e.target.checked));
      hitungTotalDinamic();
    });
  }

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", hitungTotalDinamic);
  });

  hitungTotalDinamic();
}
