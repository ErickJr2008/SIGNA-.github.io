/* ==========================================
   SIGNA - Main JavaScript
   Funcionalidad Principal y Eventos globales
   ========================================== */

// ========================
// OBJETO GLOBAL CONFIG
// ========================
const SIGNA = {
    isDarkMode: localStorage.getItem('darkMode') === 'true',
    isHighContrast: localStorage.getItem('highContrast') === 'true',
    textScale: parseFloat(localStorage.getItem('textScale')) || 1,
    isMobile: window.innerWidth <= 768,
};

// ========================
// INICIALIZACIÓN
// ========================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadUserPreferences();
    setupEventListeners();
    setupScrollAnimations();
});

window.addEventListener('resize', () => {
    SIGNA.isMobile = window.innerWidth <= 768;
});

// ========================
// INICIALIZAR APLICACIÓN
// ========================
function initializeApp() {
    console.log('🚀 SIGNA initialized successfully');
    applyUserPreferences();
    initializeNavbar();
    initializeBackToTop();
    initializeScrollSpy();
    prefersReducedMotion();
}

// ========================
// PREFERENCIAS DE USUARIO
// ========================
function loadUserPreferences() {
    // Cargar modo oscuro
    if (SIGNA.isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Cargar alto contraste
    if (SIGNA.isHighContrast) {
        document.body.classList.add('high-contrast');
    }
    
    // Aplicar escala de texto
    applyTextScale(SIGNA.textScale);
}

function applyUserPreferences() {
    // Sin cambios adicionales - se aplican en loadUserPreferences
}

function applyTextScale(scale) {
    document.documentElement.style.fontSize = (16 * scale) + 'px';
    SIGNA.textScale = scale;
    localStorage.setItem('textScale', scale);
}

// ========================
// NAVBAR RESPONSIVA
// ========================
function initializeNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // Toggle menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });
    
    // Cerrar menu al hacer click en un link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', false);
        });
    });
    
    // Cerrar menu al hacer scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop !== lastScrollTop) {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', false);
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    // Efecto de navbar con fondo
    updateNavbarStyle();
    window.addEventListener('scroll', updateNavbarStyle);
}

function updateNavbarStyle() {
    const navbar = document.getElementById('navbar');
    if (window.pageYOffset > 50) {
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    }
}

// ========================
// BOTÓN VOLVER ARRIBA
// ========================
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================
// SCROLL SPY
// ========================
function initializeScrollSpy() {
    const sections = document.querySelectorAll('[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// ========================
// ANIMACIONES DE SCROLL
// ========================
function setupScrollAnimations() {
    // Simple Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Animar elementos con data-aos
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        if (el.dataset.aosDelay) {
            el.style.transitionDelay = el.dataset.aosDelay;
        }
        observer.observe(el);
    });
}

// ========================
// EVENT LISTENERS GENERALES
// ========================
function setupEventListeners() {
    // Dark mode button en navbar
    const darkModeBtn = document.getElementById('darkModeBtn');
    darkModeBtn.addEventListener('click', toggleDarkMode);
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Keyboard navigation
    setupKeyboardNavigation();
}

// ========================
// MODO OSCURO
// ========================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    SIGNA.isDarkMode = !SIGNA.isDarkMode;
    localStorage.setItem('darkMode', SIGNA.isDarkMode);
}

// ========================
// FORMULARIO DE CONTACTO
// ========================
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toLocaleString()
    };
    
    // Guardar en localStorage
    const existingData = JSON.parse(localStorage.getItem('contactMessages')) || [];
    existingData.push(formData);
    localStorage.setItem('contactMessages', JSON.stringify(existingData));
    
    // Mostrar confirmación
    showNotification('¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.', 'success');
    
    // Limpiar formulario
    document.getElementById('contactForm').reset();
}

// ========================
// NOTIFICACIONES
// ========================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="padding: 16px; border-radius: 8px; background: ${type === 'success' ? '#48bb78' : '#667eea'}; color: white; box-shadow: var(--shadow-lg); position: fixed; top: 100px; left: 50%; transform: translateX(-50%); z-index: 2000; animation: slideInUp 0.3s ease;">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ========================
// NAVEGACIÓN POR TECLADO
// ========================
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Tecla ESC para cerrar modales y paneles
        if (e.key === 'Escape') {
            closeGame();
            
            const chatbotWindow = document.getElementById('chatbotWindow');
            if (chatbotWindow.style.display !== 'none') {
                document.getElementById('chatbotToggle').click();
            }
            
            const panelContent = document.getElementById('panelContent');
            if (panelContent.classList.contains('active')) {
                document.getElementById('panelToggle').click();
            }
        }
        
        // Acceso rápido con Alt+Números
        if (e.altKey) {
            if (e.key === '1') scrollToSection('inicio');
            if (e.key === '2') scrollToSection('que-es');
            if (e.key === '3') scrollToSection('juegos');
            if (e.key === '4') scrollToSection('contacto');
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ========================
// ANIMACIÓN REDUCE MOTION
// ========================
function prefersReducedMotion() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        document.documentElement.style.setProperty('--transition', 'none');
        document.documentElement.style.setProperty('--transition-fast', 'none');
        document.documentElement.style.setProperty('--transition-slow', 'none');
    }
}

// ========================
// UTILITY FUNCTIONS
// ========================

// Ejecutar función cuando está en viewport
function whenInViewport(element, callback) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback();
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(element);
}

// Formatear números
function formatNumber(num) {
    return num.toLocaleString();
}

// Generar ID único
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Esperar en ms (para animaciones)
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================
// LOGGING UTIL
// ========================
const log = {
    info: (msg) => console.log('ℹ️', msg),
    success: (msg) => console.log('✅', msg),
    warn: (msg) => console.warn('⚠️', msg),
    error: (msg) => console.error('❌', msg),
    debug: (msg) => console.debug('🔍', msg)
};

// Exportar funciones globales para uso en otros scripts
window.SIGNA = SIGNA;
window.log = log;
window.showNotification = showNotification;
window.toggleDarkMode = toggleDarkMode;
window.scrollToSection = scrollToSection;
window.applyTextScale = applyTextScale;
window.generateId = generateId;
window.wait = wait;
window.whenInViewport = whenInViewport;
window.formatNumber = formatNumber;
