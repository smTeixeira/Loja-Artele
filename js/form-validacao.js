document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const messageDiv = document.getElementById('form-message');
    
    // Validação básica
    if (name === '' || email === '' || message === '') {
        showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Por favor, insira um email válido.', 'error');
        return;
    }
    
    // Simulação de envio
    showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    this.reset();
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = text;
    messageDiv.className = type;
    
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 5000);
}