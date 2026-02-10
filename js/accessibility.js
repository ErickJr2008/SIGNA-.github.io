/* ==========================================
   SIGNA - Accessibility Module
   Sistema completo de accesibilidad avanzada
   ========================================== */

class AccessibilityManager {
    constructor() {
        this.minFontSize = 0.75;
        this.maxFontSize = 1.5;
        this.currentFontSize = parseFloat(localStorage.getItem('textScale')) || 1;
        this.isReading = false;
        this.speechSynthesis = window.speechSynthesis;
        
        this.init();
    }
    
    init() {
        this.setupPanel();
        this.setupEventListeners();
        this.loadPreferencesFromStorage();
        this.applyStoredSettings();
        log.success('AccessibilityManager initialized');
    }
    
    // ========================
    // PANEL de ACCESIBILIDAD
    // ========================
    setupPanel() {
        this.panel = document.getElementById('accessibilityPanel');
        this.panelToggle = document.getElementById('panelToggle');
        this.panelContent = document.getElementById('panelContent');
        
        // Crear estructura del panel si no existe
        if (!this.panelContent) {
            this.createPanelContent();
        }
    }
    
    createPanelContent() {
        // El panel ya existe en HTML, solo necesitamos referencias
    }
    
    setupEventListeners() {
        // Toggle del panel
        this.panelToggle.addEventListener('click', () => {
            this.togglePanel();
        });
        
        // Botones de tamaño de texto
        document.getElementById('decreaseText').addEventListener('click', () => {
            this.changeFontSize(this.currentFontSize - 0.25);
        });
        
        document.getElementById('resetText').addEventListener('click', () => {
            this.changeFontSize(1);
        });
        
        document.getElementById('increaseText').addEventListener('click', () => {
            this.changeFontSize(this.currentFontSize + 0.25);
        });
        
        // Botones de tema
        document.getElementById('lightMode').addEventListener('click', () => {
            this.setTheme('light');
        });
        
        document.getElementById('darkModePanel').addEventListener('click', () => {
            this.setTheme('dark');
        });
        
        document.getElementById('highContrast').addEventListener('click', () => {
            this.setTheme('highContrast');
        });
        
        // Lector de texto
        document.getElementById('textToSpeech').addEventListener('click', () => {
            this.toggleTextToSpeech();
        });
        
        // Cerrar panel al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.panel.contains(e.target) && this.panelContent.classList.contains('active')) {
                this.togglePanel();
            }
        });
    }
    
    // ========================
    // MOSTRAR/OCULTAR PANEL
    // ========================
    togglePanel() {
        const isActive = this.panelContent.classList.contains('active');
        
        if (isActive) {
            this.panelContent.classList.remove('active');
            this.panelToggle.setAttribute('aria-expanded', 'false');
        } else {
            this.panelContent.classList.add('active');
            this.panelToggle.setAttribute('aria-expanded', 'true');
        }
    }
    
    // ========================
    // GESTIÓN DE TAMAÑO DE TEXTO
    // ========================
    changeFontSize(newSize) {
        // Limitar rango
        if (newSize < this.minFontSize || newSize > this.maxFontSize) {
            showNotification('Has alcanzado el límite de tamaño de texto', 'warn');
            return;
        }
        
        this.currentFontSize = parseFloat(newSize.toFixed(2));
        applyTextScale(this.currentFontSize);
        
        // Guardar en localStorage
        localStorage.setItem('textScale', this.currentFontSize);
        
        // Feedback visual
        this.showTextSizePreview();
    }
    
    showTextSizePreview() {
        const resetBtn = document.getElementById('resetText');
        resetBtn.textContent = `Reset (${Math.round(this.currentFontSize * 100)}%)`;
    }
    
    // ========================
    // GESTIÓN DE TEMAS
    // ========================
    setTheme(theme) {
        document.body.classList.remove('dark-mode', 'high-contrast');
        
        switch(theme) {
            case 'light':
                localStorage.setItem('theme', 'light');
                localStorage.setItem('darkMode', 'false');
                localStorage.setItem('highContrast', 'false');
                SIGNA.isDarkMode = false;
                SIGNA.isHighContrast = false;
                break;
                
            case 'dark':
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                localStorage.setItem('darkMode', 'true');
                localStorage.setItem('highContrast', 'false');
                SIGNA.isDarkMode = true;
                SIGNA.isHighContrast = false;
                break;
                
            case 'highContrast':
                document.body.classList.add('high-contrast');
                localStorage.setItem('theme', 'highContrast');
                localStorage.setItem('darkMode', 'false');
                localStorage.setItem('highContrast', 'true');
                SIGNA.isDarkMode = false;
                SIGNA.isHighContrast = true;
                break;
        }
        
        log.info(`Theme changed to: ${theme}`);
    }
    
    // ========================
    // TEXT TO SPEECH
    // ========================
    toggleTextToSpeech() {
        if (this.isReading) {
            this.stopTextToSpeech();
        } else {
            this.startTextToSpeech();
        }
    }
    
    startTextToSpeech() {
        // Obtener todo el texto visible en la página
        const mainContent = document.querySelector('main') || document.body;
        const text = this.extractMainText(mainContent);
        
        if (!text.trim()) {
            showNotification('No hay contenido para leer', 'warn');
            return;
        }
        
        // Crear utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Eventos
        utterance.onstart = () => {
            this.isReading = true;
            document.getElementById('textToSpeech').style.opacity = '0.6';
            document.getElementById('textToSpeech').textContent = '🔊 Leyendo...';
            this.highlightReadingContent(mainContent);
        };
        
        utterance.onend = () => {
            this.stopTextToSpeech();
        };
        
        utterance.onerror = (e) => {
            log.error('Speech synthesis error: ' + e.error);
            showNotification('Error al leer el texto', 'error');
        };
        
        // Detener lectura anterior si existe
        this.speechSynthesis.cancel();
        
        // Hablar
        this.speechSynthesis.speak(utterance);
    }
    
    stopTextToSpeech() {
        this.speechSynthesis.cancel();
        this.isReading = false;
        document.getElementById('textToSpeech').style.opacity = '1';
        document.getElementById('textToSpeech').textContent = '🔊 Lector';
        
        // Remover highlight
        document.querySelectorAll('.reading-highlight').forEach(el => {
            el.classList.remove('reading-highlight');
        });
    }
    
    extractMainText(element) {
        // Excluir elementos que no deben ser leídos
        const clone = element.cloneNode(true);
        const excludeSelectors = ['.chatbot', '.accessibility-panel', '.modal', 'nav', 'script', 'style'];
        
        excludeSelectors.forEach(selector => {
            clone.querySelectorAll(selector).forEach(el => el.remove());
        });
        
        let text = clone.innerText || clone.textContent;
        
        // Limpiar espacios en blanco excesivos
        text = text.replace(/\s+/g, ' ').trim();
        
        return text;
    }
    
    highlightReadingContent(element) {
        // Agregar clase de highlight a elementos de contenido
        element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li').forEach(el => {
            el.classList.add('reading-highlight');
        });
    }
    
    // ========================
    // GUARDAR PREFERENCIAS
    // ========================
    savePreferences() {
        const preferences = {
            textScale: this.currentFontSize,
            theme: localStorage.getItem('theme') || 'light',
            darkMode: localStorage.getItem('darkMode') === 'true',
            highContrast: localStorage.getItem('highContrast') === 'true'
        };
        
        localStorage.setItem('a11yPreferences', JSON.stringify(preferences));
    }
    
    loadPreferencesFromStorage() {
        const preferences = JSON.parse(localStorage.getItem('a11yPreferences') || '{}');
        
        if (preferences.textScale) {
            this.currentFontSize = preferences.textScale;
            applyTextScale(this.currentFontSize);
        }
        
        if (preferences.theme) {
            this.setTheme(preferences.theme);
        }
    }
    
    applyStoredSettings() {
        // Aplicar tema
        const theme = localStorage.getItem('theme') || 'light';
        if (theme !== 'light') {
            this.setTheme(theme);
        }
        
        // Mostrar escala de texto actual
        this.showTextSizePreview();
    }
}

// ========================
// FUNCIONES DE ACCESIBILIDAD ADICIONALES
// ========================

// Focus management
class FocusManager {
    static trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    static setAriaLive(element, message, level = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', level);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        element.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }
}

// Skip links para navegación por teclado
function setupSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #667eea;
        color: white;
        padding: 8px;
        z-index: 100;
        text-decoration: none;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ========================
// INICIALIZAR
// ========================
let accessibilityManager;

document.addEventListener('DOMContentLoaded', () => {
    accessibilityManager = new AccessibilityManager();
    setupSkipLinks();
    FocusManager.trapFocus(document.body);
    
    // Agregar atributos ARIA faltantes
    document.querySelectorAll('button').forEach(btn => {
        if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) {
            btn.setAttribute('aria-label', 'Button');
        }
    });
    
    // Asegurar que los inputs tienen labels
    document.querySelectorAll('input:not([aria-label]):not([id])').forEach(input => {
        input.setAttribute('aria-label', input.placeholder || 'Input field');
    });
    
    log.success('Accessibility features fully loaded');
});

// Estilos para elementos de accesibilidad
const accessibilityStyles = document.createElement('style');
accessibilityStyles.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
    
    .reading-highlight {
        background-color: rgba(102, 126, 234, 0.2);
        padding: 2px 4px;
    }
    
    .skip-link:focus {
        top: 0 !important;
    }
    
    /* Indicadores de foco mejorados */
    *:focus-visible {
        outline: 3px solid var(--primary);
        outline-offset: 2px;
    }
    
    /* Animación de lectura */
    @keyframes read-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
`;
document.head.appendChild(accessibilityStyles);

// Exportar para uso global
window.AccessibilityManager = AccessibilityManager;
window.FocusManager = FocusManager;
