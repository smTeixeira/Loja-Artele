document.addEventListener('DOMContentLoaded', function() {
    //  Menu Mobile 
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    function setupMobileMenu() {
        menuToggle?.addEventListener('click', function() {
            navMenu?.classList.toggle('show');
            
            // Acessibilidade: atualiza atributo aria-expanded
            const isExpanded = navMenu?.classList.contains('show');
            menuToggle?.setAttribute('aria-expanded', isExpanded);
        });
    }

    //  Carrossel 
    const carousel = {
        element: document.querySelector('.carousel-inner'),
        items: document.querySelectorAll('.carousel-item'),
        prevBtn: document.querySelector('.prev'),
        nextBtn: document.querySelector('.next'),
        currentIndex: 0,
        interval: null,
        
        init: function() {
            this.totalItems = this.items.length;
            this.setupControls();
            this.startAutoRotation();
        },
        
        update: function() {
            this.element.style.transform = `translateX(-${this.currentIndex * 100}%)`;
            
            // Acessibilidade: atualiza índices para leitores de tela
            this.items.forEach((item, index) => {
                item.setAttribute('aria-hidden', index !== this.currentIndex);
            });
        },
        
        navigate: function(direction) {
            if (direction === 'prev') {
                this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.totalItems - 1;
            } else {
                this.currentIndex = (this.currentIndex < this.totalItems - 1) ? this.currentIndex + 1 : 0;
            }
            this.update();
            this.resetAutoRotation();
        },
        
        setupControls: function() {
            this.prevBtn?.addEventListener('click', () => this.navigate('prev'));
            this.nextBtn?.addEventListener('click', () => this.navigate('next'));
            
            // Teclado: suporte a navegação por setas
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.navigate('prev');
                if (e.key === 'ArrowRight') this.navigate('next');
            });
        },
        
        startAutoRotation: function() {
            this.interval = setInterval(() => {
                this.navigate('next');
            }, 5000);
        },
        
        resetAutoRotation: function() {
            clearInterval(this.interval);
            this.startAutoRotation();
        }
    };

    //  Efeitos de Produto 
    function setupProductHoverEffects() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                this.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            });
            
            // Acessibilidade: foco pelo teclado
            card.addEventListener('focusin', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            });
            
            card.addEventListener('focusout', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            });
        });
    }

    //  Botão Adicionar ao Carrinho 
    function setupAddToCartButtons() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = this.getAttribute('data-id') || '';
                const productName = this.getAttribute('data-product') || 'Produto sem nome';
                const productPrice = parseFloat(this.getAttribute('data-price')) || 0;
                const productImage = this.getAttribute('data-image') || 'default-image.jpg';
                
                addToCart({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                });
                
                showAddToCartFeedback(this);
            });
        });
    }
    
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => item.productName === product.name);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    
    function showAddToCartFeedback(button) {
        const originalText = button.textContent;
        const originalBgColor = button.style.backgroundColor;
        
        button.textContent = '✔ Adicionado';
        button.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalBgColor;
        }, 2000);
    }

    //  Inicialização 
    function init() {
        setupMobileMenu();
        carousel.init();
        setupProductHoverEffects();
        setupAddToCartButtons();
        updateCartCount();
    }

    init();
});

// Função global para atualizar contador do carrinho
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    let cartCount = document.querySelector('.cart-count');
    
    if (!cartCount && totalItems > 0) {
        cartCount = document.createElement('span');
        cartCount.className = 'cart-count';
        const nav = document.querySelector('nav ul');
        if (nav) nav.appendChild(cartCount);
    }
    
    if (cartCount) {
        cartCount.textContent = totalItems > 0 ? totalItems : '';
        cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}