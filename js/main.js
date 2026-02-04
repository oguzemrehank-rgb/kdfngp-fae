/* ==========================================
   KODE - Main JavaScript
   ========================================== */

// Aktif navigasyon linkini işaretle
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
    setupFaqToggle();
    setupUserSystem();
});

// Aktif sayfa linkini vurgula
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Basit karşılaştırma - tam URL yerine dosya adı kontrol et
        if (currentPath.includes(href) || 
            (href === 'index.html' && currentPath.endsWith('/')) ||
            (href === '/' && currentPath.endsWith('/'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// SSS açılır/kapanır özelliği
function setupFaqToggle() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isOpen = faqItem.classList.contains('open');
            
            // Tüm FAQ öğelerini kapat
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
            });
            
            // Tıklanan öğeyi aç (kapalıysa)
            if (!isOpen) {
                faqItem.classList.add('open');
            }
        });
    });
}

// Kullanıcı sistemi
function setupUserSystem() {
    const userMenu = document.getElementById('user-menu');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    if (!userMenu) return;
    
    // Giriş durumu kontrolü
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        // Giriş yapmış
        userMenu.innerHTML = `
            <span>Merhaba, ${currentUser.name}</span>
            <button id="account-btn">Hesabım</button>
            <button id="logout-btn">Çıkış</button>
        `;
        
        document.getElementById('account-btn').addEventListener('click', () => {
            window.location.href = 'hesabim.html';
        });
        
        document.getElementById('logout-btn').addEventListener('click', () => {
            logout();
        });
    } else {
        // Giriş yapmamış
        loginBtn.addEventListener('click', () => {
            window.location.href = 'giris.html';
        });
        
        registerBtn.addEventListener('click', () => {
            window.location.href = 'kaydol.html';
        });
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

// Form gönderimi (uyarı göster)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Mesajınız alındı. Bu form veri saklamaz. İletişim için e-mail kullanınız.');
        contactForm.reset();
    });
}
