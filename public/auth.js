const API_URL = 'http://localhost:5000/api';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const tabs = document.querySelectorAll('.auth-tab');
const forms = document.querySelectorAll('.auth-form');

// Tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active form
        forms.forEach(f => f.classList.remove('active'));
        document.getElementById(tabName + 'Form').classList.add('active');
    });
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao fazer login');
        }
        
        // Save token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        window.location.href = '/dashboard.html';
    } catch (error) {
        document.getElementById('loginError').textContent = error.message;
    }
});

// Register
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao registrar');
        }
        
        // Save token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        window.location.href = '/dashboard.html';
    } catch (error) {
        document.getElementById('registerError').textContent = error.message;
    }
});

// Check if already logged in
if (localStorage.getItem('token')) {
    window.location.href = '/dashboard.html';
}