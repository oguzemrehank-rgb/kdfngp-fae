// Auth JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (registerUser(name, email, password)) {
                alert('Kayıt başarılı! Giriş yapabilirsiniz.');
                window.location.href = 'giris.html';
            } else {
                alert('Bu e-posta zaten kayıtlı.');
            }
        });
    }
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (loginUser(email, password)) {
                window.location.href = 'index.html';
            } else {
                alert('Geçersiz e-posta veya şifre.');
            }
        });
    }
    
    // Profile page
    if (window.location.pathname.includes('hesabim.html')) {
        loadProfile();
        
        document.getElementById('edit-profile-btn').addEventListener('click', function() {
            const newName = prompt('Yeni isim:', document.getElementById('profile-name').textContent);
            if (newName) {
                updateProfile({ name: newName });
                loadProfile();
            }
        });
        
        document.getElementById('delete-account-btn').addEventListener('click', function() {
            if (confirm('Hesabınızı silmek istediğinizden emin misiniz?')) {
                deleteAccount();
                window.location.href = 'index.html';
            }
        });
    }
});

function registerUser(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(user => user.email === email)) {
        return false;
    }
    users.push({ name, email, password, description: '' });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

function updateProfile(updates) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
    }
}

function deleteAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.filter(user => user.email !== currentUser.email);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.removeItem('currentUser');
}

function loadProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('profile-name').textContent = currentUser.name;
        document.getElementById('profile-email').textContent = currentUser.email;
        document.getElementById('profile-description').textContent = currentUser.description || 'Açıklama yok';
    }
}