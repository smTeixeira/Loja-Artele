document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart');
    const cartSummary = document.querySelector('.cart-summary');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Estado do carrinho
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Funções principais
    function initCart() {
        renderCartItems();
        setupCartControls();
        updateCartCount();
    }
    
    function renderCartItems() {
        // Mostra/oculta mensagem de carrinho vazio
        const isEmpty = cart.length === 0;
        emptyCartMessage.style.display = isEmpty ? 'block' : 'none';
        cartSummary.style.display = isEmpty ? 'none' : 'block';
        
        if (isEmpty) return;
        
        // Limpa o container e recalcula subtotal
        cartItemsContainer.innerHTML = '';
        const subtotal = calculateSubtotal();
        
        // Renderiza cada item do carrinho
        cart.forEach((item, index) => {
            const itemElement = createCartItemElement(item, index);
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Atualiza totais
        updateTotals(subtotal);
    }
    
    function setupCartControls() {
        // Delegação de eventos para evitar problemas com elementos dinâmicos
        cartItemsContainer.addEventListener('click', handleCartActions);
        
        // Evento do botão de finalizar compra
        checkoutBtn?.addEventListener('click', handleCheckout);
    }
    
    // Funções auxiliares
    function calculateSubtotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    function updateTotals(subtotal) {
        document.querySelector('.subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
        document.querySelector('.total span').textContent = `R$ ${subtotal.toFixed(2)}`;
    }
    
    function createCartItemElement(item, index) {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>R$ ${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                    <button class="remove-btn" data-index="${index}">Remover</button>
                </div>
            </div>
        `;
        return itemElement;
    }
    
    function handleCartActions(e) {
        const btn = e.target;
        if (!btn.dataset.index) return;
        
        const index = parseInt(btn.dataset.index);
        
        if (btn.classList.contains('decrease')) {
            adjustQuantity(index, -1);
        } else if (btn.classList.contains('increase')) {
            adjustQuantity(index, 1);
        } else if (btn.classList.contains('remove-btn')) {
            removeItem(index);
        }

        if (cart.length === 0) {
            window.location.reload(); // Recarrega a página se o carrinho estiver vazio
        }
    }
    
    function adjustQuantity(index, change) {
        const newQuantity = cart[index].quantity + change;
        
        if (newQuantity < 1) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = newQuantity;
        }
        
        updateCart();
    }
    
    function removeItem(index) {
        cart.splice(index, 1);
        updateCart(); 
        initCart();
    }
    
    function handleCheckout() {
        const confirmed = confirm('Compra finalizada com sucesso! Clique em OK para voltar à página inicial.');
        
        if (confirmed) {
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        }
    }
    
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
        console.log('Carrinho atualizado:', cart);
    }
    
    // Função global para atualizar o contador
    window.updateCartCount = function() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        let cartCount = document.querySelector('.cart-count');
        
        if (!cartCount) {
            cartCount = document.createElement('span');
            cartCount.className = 'cart-count';
            const nav = document.querySelector('nav ul');
            if (nav) nav.appendChild(cartCount);
        }
        
        cartCount.textContent = totalItems > 0 ? totalItems : '';
        cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    };
    
    // Inicialização
    initCart();
});