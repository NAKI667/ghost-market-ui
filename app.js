// --- STATE YÖNETİMİ ---
let cart = []; // Sepetteki ürünler burada tutulur

// DOM Elementleri
const sidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');

// --- FONKSİYONLAR ---

// Sepeti Aç/Kapa
function toggleCart() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Sepete Ürün Ekle
function addToCart(id, name, price) {
    // 1. Ürün zaten sepette mi kontrol et
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        // Varsa adedi artır
        existingItem.qty++;
    } else {
        // Yoksa yeni obje olarak ekle
        cart.push({
            id: id,
            name: name,
            price: price,
            qty: 1
        });
    }

    // 2. Arayüzü güncelle
    renderCart();
    
    // 3. Sepet kapalıysa kullanıcı görsün diye aç
    if (!sidebar.classList.contains('active')) {
        toggleCart();
    }
}

// Sepeti Ekrana Çiz (Render)
function renderCart() {
    // Önce listeyi temizle
    cartItemsContainer.innerHTML = '';
    
    let totalPrice = 0;
    let totalCount = 0;

    // Sepet boşsa mesaj göster
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg" style="text-align:center; color:#666; margin-top:20px;">// BUFFER EMPTY</p>';
    }

    // Sepetteki her ürün için HTML oluştur
    cart.forEach(item => {
        totalPrice += item.price * item.qty;
        totalCount += item.qty;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        cartItem.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <span>$${item.price} x ${item.qty}</span>
            </div>
            <div class="item-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeItem(${item.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });

    // Toplam fiyatı ve sepet ikonundaki sayıyı güncelle
    cartTotalElement.innerText = '$' + totalPrice.toFixed(2);
    cartCountElement.innerText = totalCount;
}

// Adet Değiştirme (+ veya -)
function changeQty(id, change) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.qty += change;
        
        // Eğer adet 0 veya altına düşerse ürünü sil
        if (item.qty <= 0) {
            removeItem(id);
        } else {
            renderCart();
        }
    }
}

// Ürünü Tamamen Sil
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}