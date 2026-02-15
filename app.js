// Simple client-side store for demo purposes
const PRODUCTS = [
  { id: 1, title: "Wild Game Droëwors", price: 120, size: "500g", img: "images/droewors.svg" },
  { id: 2, title: "Game Biltong", price: 150, size: "500g", img: "images/biltong.svg" },
  { id: 3, title: "Hunter's Combo Pack", price: 250, size: "1kg Combo", img: "images/combo.svg" },
  { id: 4, title: "Spicy Droëwors", price: 130, size: "500g", img: "images/spicy.svg" },
  { id: 5, title: "Mild Biltong", price: 140, size: "500g", img: "images/mild.svg" }
];

function formatCurrency(num){ return `R${num.toFixed(2)}`; }

// CART using localStorage
function getCart(){
  return JSON.parse(localStorage.getItem('nyamazane_cart') || '[]');
}
function saveCart(cart){ localStorage.setItem('nyamazane_cart', JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){ const count = getCart().reduce((s,i)=>s+i.qty,0); document.querySelectorAll('#cart-count').forEach(el=>el.textContent = count); }

function addToCart(productId, qty=1){
  const product = PRODUCTS.find(p=>p.id===productId);
  if(!product) return;
  const cart = getCart();
  const existing = cart.find(i=>i.id===productId);
  if(existing){ existing.qty += qty; }
  else{ cart.push({ id: product.id, title: product.title, price: product.price, qty }); }
  saveCart(cart);
}

// Render featured products on index
function renderFeatured(){
  document.querySelectorAll('.add-to-cart').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const title = btn.dataset.product;
      const price = parseFloat(btn.dataset.price);
      const product = PRODUCTS.find(p=>p.title===title) || { id: Date.now(), title, price };
      addToCart(product.id, 1);
      alert(`${title} added to cart`);
    });
  });
}

// Render products page
function renderProductsPage(){
  const list = document.getElementById('products-list');
  if(!list) return;
  PRODUCTS.forEach(p=>{
    const card = document.createElement('div'); card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="product-info">
        <h3>${p.title}</h3>
        <p>${p.size}</p>
        <div class="product-details"><span class="price">R${p.price}</span><button class="btn btn-secondary add-btn" data-id="${p.id}">Add</button></div>
      </div>
    `;
    list.appendChild(card);
  });
  document.querySelectorAll('.add-btn').forEach(b=> b.addEventListener('click', ()=>{ addToCart(parseInt(b.dataset.id)); alert('Added to cart'); }));
}

// Cart page rendering
function renderCartPage(){
  const container = document.getElementById('cart-items');
  if(!container) return;
  const cart = getCart();
  container.innerHTML = '';
  if(cart.length===0){ container.innerHTML = '<p>Your cart is empty.</p>'; document.getElementById('cart-total').textContent = 'R0'; return; }
  let total = 0;
  cart.forEach(item=>{
    total += item.price * item.qty;
    const row = document.createElement('div'); row.className = 'cart-row';
    row.innerHTML = `<div><strong>${item.title}</strong> x ${item.qty}</div><div>R${(item.price*item.qty).toFixed(2)}</div>`;
    container.appendChild(row);
  });
  document.getElementById('cart-total').textContent = `R${total.toFixed(2)}`;
}

// Contact form (demo) - just clears form
function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', e=>{ e.preventDefault(); alert('Message sent (demo)'); form.reset(); });
}

// Init
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount(); renderFeatured(); renderProductsPage(); renderCartPage(); initContactForm();
  // Simple hamburger
  const hb = document.querySelector('.hamburger');
  if(hb){ hb.addEventListener('click', ()=>{ document.querySelector('.nav-menu').classList.toggle('open'); }); }
});

// Navigate to demo checkout page (keeps behavior even if button is outside form)
document.addEventListener('click', (e)=>{
  if(e.target && e.target.id === 'checkout-btn'){
    const cart = getCart();
    if(cart.length === 0){ alert('Your cart is empty'); return; }
    window.location.href = 'checkout.html';
  }
});

// Expose simple API for checkout page and external scripts
window.NYAMAZANE = {
  getCart,
  saveCart,
  formatCurrency,
  clearCart: ()=>{ saveCart([]); }
};
