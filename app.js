const cart = new Map();
const sidebar = document.getElementById('cart-sidebar');
const openCart = document.getElementById('cart-open');
const closeCart = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

openCart.addEventListener('click', () => sidebar.showModal());
closeCart.addEventListener('click', () => sidebar.close());

function addToCart(id, name, price) {
    const item = cart.get(id) ?? { name, price, quantity: 0 };
    item.quantity += 1;
    cart.set(id, item);

    renderCart();
    if (!sidebar.open) {
        sidebar.showModal();
    }
}

function renderCart() {
    cartItems.replaceChildren();
    let total = 0;
    let count = 0;

    if (cart.size === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-msg';
        empty.textContent = 'Your cart is empty.';
        cartItems.append(empty);
    }

    for (const [id, item] of cart) {
        total += item.price * item.quantity;
        count += item.quantity;

        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="item-info"><h4></h4><span></span></div>
            <div class="item-controls">
                <button type="button" class="qty-btn">−</button>
                <span></span>
                <button type="button" class="qty-btn">+</button>
                <button type="button" class="remove-btn">Remove</button>
            </div>
        `;
        row.querySelector('h4').textContent = item.name;
        row.querySelector('.item-info span').textContent = dollars.format(item.price);
        row.querySelector('.item-controls span').textContent = item.quantity;

        const buttons = row.querySelectorAll('button');
        const deltas = [-1, 1, -item.quantity];
        const actions = ['Decrease quantity for', 'Increase quantity for', 'Remove'];
        buttons.forEach((button, index) => {
            button.setAttribute('aria-label', `${actions[index]} ${item.name}`);
            button.addEventListener('click', () => {
                item.quantity += deltas[index];
                if (item.quantity === 0) {
                    cart.delete(id);
                }

                renderCart();
                (cartItems.querySelector(`[aria-label="${actions[index]} ${CSS.escape(item.name)}"]`) ?? closeCart).focus();
            });
        });
        cartItems.append(row);
    }

    cartTotal.textContent = dollars.format(total);
    cartCount.textContent = count;
    openCart.setAttribute('aria-label', `Open cart, ${count} items`);
}
