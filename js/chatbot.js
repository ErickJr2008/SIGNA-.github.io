/* ==========================================
   SIGNA - Chatbot Module
   Chatbot flotante inteligente con IA simple
   ========================================== */

class ChatbotManager {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.conversationHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.loadConversationHistory();
        log.success('ChatbotManager initialized');
    }
    
    // ========================
    // CONFIGURAR ELEMENTOS
    // ========================
    setupElements() {
        this.chatbotToggle = document.getElementById('chatbotToggle');
        this.chatbotWindow = document.getElementById('chatbotWindow');
        this.chatbotClose = document.getElementById('chatbotClose');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
    }
    
    setupEventListeners() {
        // Toggle chatbot
        this.chatbotToggle.addEventListener('click', () => {
            this.toggleChatbot();
        });
        
        // Cerrar chatbot
        this.chatbotClose.addEventListener('click', () => {
            this.toggleChatbot();
        });
        
        // Enviar mensaje
        this.chatSend.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Enter para enviar
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Mostrar mensaje de bienvenida cuando se abre por primera vez
        if (this.conversationHistory.length === 0) {
            setTimeout(() => {
                this.showWelcomeMessage();
            }, 500);
        }
    }
    
    // ========================
    // ABRIR/CERRAR CHATBOT
    // ========================
    toggleChatbot() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.chatbotWindow.style.display = 'flex';
            this.chatbotToggle.setAttribute('aria-expanded', 'true');
            this.chatInput.focus();
        } else {
            this.chatbotWindow.style.display = 'none';
            this.chatbotToggle.setAttribute('aria-expanded', 'false');
        }
    }
    
    // ========================
    // MOSTRAR MENSAJE DE BIENVENIDA
    // ========================
    showWelcomeMessage() {
        const welcomeMessages = [
            '👋 ¡Hola! Soy SIGNA Asistente. ¿Cómo puedo ayudarte hoy?',
            'Puedo ayudarte con:\n• Información sobre SIGNA\n• Guía de juegos\n• Preguntas sobre accesibilidad\n• Navegación de la plataforma'
        ];
        
        welcomeMessages.forEach((msg, index) => {
            setTimeout(() => {
                this.addMessage(msg, 'bot');
            }, index * 800);
        });
    }
    
    // ========================
    // ENVIAR MENSAJE
    // ========================
    sendMessage() {
        const text = this.chatInput.value.trim();
        
        if (!text) {
            return;
        }
        
        // Agregar mensaje del usuario
        this.addMessage(text, 'user');
        this.chatInput.value = '';
        
        // Mostrar indicador de escritura
        this.showTypingIndicator();
        
        // Generar respuesta después de un delay
        setTimeout(() => {
            const response = this.generateResponse(text);
            this.removeTypingIndicator();
            this.addMessage(response, 'bot');
        }, 500 + Math.random() * 1000);
    }
    
    // ========================
    // AGREGAR MENSAJE
    // ========================
    addMessage(text, sender) {
        const messageObj = {
            text,
            sender,
            timestamp: new Date().toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };
        
        this.messages.push(messageObj);
        this.conversationHistory.push(messageObj);
        
        // Guardar historial
        this.saveConversationHistory();
        
        // Crear elemento del mensaje
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        messageElement.innerHTML = `
            <div style="word-wrap: break-word; white-space: pre-wrap;">
                ${this.escapeHtml(text)}
            </div>
        `;
        
        this.chatMessages.appendChild(messageElement);
        
        // Scroll al último mensaje
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        // Anunciar para lectores de pantalla
        if (sender === 'bot') {
            FocusManager.setAriaLive(this.chatMessages, text);
        }
    }
    
    // ========================
    // INDICADOR DE ESCRITURA
    // ========================
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        this.isTyping = true;
    }
    
    removeTypingIndicator() {
        const typing = document.getElementById('typing-indicator');
        if (typing) {
            typing.remove();
        }
        this.isTyping = false;
    }
    
    // ========================
    // GENERAR RESPUESTA (IA SIMPLE)
    // ========================
    generateResponse(userInput) {
        const input = userInput.toLowerCase().trim();
        
        // BASE DE CONOCIMIENTOS
        const responses = {
            // Saludos
            saludo: {
                patterns: ['hola', 'hi', 'hey', 'buenos días', 'buenas tardes', 'buenas noches'],
                responses: [
                    '👋 ¡Hola! ¿Cómo estás? ¿En qué puedo ayudarte?',
                    '¡Hola! Bienvenido a SIGNA. ¿Qué deseas saber?'
                ]
            },
            
            // Información sobre SIGNA
            aboutSIGNA: {
                patterns: ['qué es signa', 'cuál es signa', 'información signa', 'signa es', 'signa significa'],
                responses: [
                    'SIGNA es un Sistema Integral de Gestión, Navegación y Asistencia. Una plataforma web moderna que combina juegos educativos, chatbot inteligente y accesibilidad avanzada para todos.',
                    'SIGNA ofrece una experiencia digital inclusiva con juegos interactivos, herramientas de accesibilidad y asistencia 24/7. ¿Quieres explorar algo específico?'
                ]
            },
            
            // Juegos
            games: {
                patterns: ['juegos', 'jugar', 'quiero jugar', 'juego', 'qué juegos', 'cuáles son los juegos', 'cómo se juega'],
                responses: [
                    '🎮 Tenemos 5 juegos increíbles:\n1. Memoria - Encuentra pares\n2. Lógica - Resuelve secuencias\n3. Atención Visual - Identifica diferencias\n4. Reflejos - Reacciona rápido\n5. Quiz Educativo - Aprende jugando\n\n¿Cuál quieres jugar?',
                    'Puedes acceder a los juegos desde la sección "Juegos Interactivos". Cada uno tiene desafíos diferentes. ¿Tienes alguna pregunta sobre alguno en particular?'
                ]
            },
            
            // Accesibilidad
            accessibility: {
                patterns: ['accesibilidad', 'accesible', 'contraste', 'tamaño texto', 'modo oscuro', 'lector', 'ayuda', 'necesito'],
                responses: [
                    '♿ SIGNA tiene un panel flotante de accesibilidad con:\n• Ajuste de tamaño de texto\n• Modo oscuro\n• Alto contraste\n• Lector de texto\n• Navegación por teclado\n\n¿Necesitas ayuda con alguna de estas funciones?',
                    'El panel de accesibilidad está en la esquina inferior izquierda (ícono de accesibilidad). Puedes personalizar completamente tu experiencia basándote en tus necesidades.'
                ]
            },
            
            // Navegación
            navigation: {
                patterns: ['navegación', 'navegar', 'dónde', 'cómo llego', 'cómo acceder', 'encontrar', 'buscar'],
                responses: [
                    '📍 La plataforma está organizada en secciones:\n• Inicio - Landing principal\n• ¿Qué es? - Información\n• Servicios - Características\n• Juegos - Experiencias interactivas\n• Accesibilidad - Herramientas\n• Contacto - Formulario\n\n¿Hacia dónde quieres ir?',
                    'Usa el menú superior para navegar entre secciones. También puedes usar los botones de atajos de teclado (Alt + números) para acceso rápido.'
                ]
            },
            
            // Contacto
            contact: {
                patterns: ['contacto', 'contactar', 'empresa', 'equipo', 'correo', 'email', 'teléfono'],
                responses: [
                    '📧 Puedes contactar mediante:\n• El formulario de contacto en la sección "Contacto"\n• Este chatbot (estoy aquí para ayudarte)\n• Respuesta garantizada en 24 horas\n\n¿Hay algo específico que desees comunicar?',
                    '¡Me encanta ayudar! Si necesitas contacto oficial, usa el formulario al final de la página y te responderemos pronto.'
                ]
            },
            
            // Ayuda general
            help: {
                patterns: ['ayuda', 'help', 'necesito ayuda', 'no entiendo', 'cómo', 'explica'],
                responses: [
                    '🆘 Estoy aquí para ayudarte. Puedo asistirte con:\n• Información sobre SIGNA\n• Guía para usar los juegos\n• Explicación de funciones\n• Preguntas de accesibilidad\n\n¿Qué necesitas específicamente?',
                    '¿En qué área necesitas ayuda? Puedo asistirte con juegos, accesibilidad, navegación o información general.'
                ]
            },
            
            // Memoria del usuario
            remember: {
                patterns: ['recuerdas', 'anterior', 'antes dijiste', 'lo que dijiste'],
                responses: [
                    'Tengo tu histórico de conversación guardado en el navegador. Puedo ver nuestras charlas anteriores, pero cada sesión nueva comienza fresca. ¿Qué pregunta tenías?',
                    'Sí, recuerdo nuestras conversaciones durante esta sesión. ¿Hay algo que quieras retomar?'
                ]
            },
            
            // Despedida
            goodbye: {
                patterns: ['adiós', 'bye', 'chao', 'hasta luego', 'nos vemos', 'hasta pronto'],
                responses: [
                    '👋 ¡Hasta luego! Espero haber sido útil. Vuelve cuando necesites. ¡Disfruta SIGNA!',
                    '¡Gracias por visitarme! Estoy aquí cuando me necesites. ¡A disfrutar!'
                ]
            },
            
            // Agradecimiento
            thanks: {
                patterns: ['gracias', 'thank you', 'thanks', 'muchas gracias'],
                responses: [
                    '¡De nada! Es un placer ayudarte. ¿Hay algo más que desees saber?',
                    '¡Para eso estoy! ¿Hay algo más en lo que pueda asistirte?'
                ]
            }
        };
        
        // Buscar coincidencias
        for (const [category, data] of Object.entries(responses)) {
            for (const pattern of data.patterns) {
                if (input.includes(pattern)) {
                    return this.getRandomResponse(data.responses);
                }
            }
        }
        
        // Respuesta por defecto
        const defaultResponses = [
            '🤔 Interesante pregunta. Aunque no estoy completamente seguro sobre eso, puedo ayudarte con información sobre SIGNA, juegos o accesibilidad. ¿Hay algo de eso que te interese?',
            '📚 No tengo respuesta específica para eso, pero puedes:\n• Explorar la plataforma\n• Consultar el formulario de contacto\n• Preguntarme sobre juegos u otros temas\n\n¿Qué te interesa?',
            'Esa es una buena pregunta, pero quizás no sea mi especialidad. ¿Hay algo sobre SIGNA, los juegos o la accesibilidad que pueda aclarar?'
        ];
        
        return this.getRandomResponse(defaultResponses);
    }
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // ========================
    // GUARDAR/CARGAR HISTORIAL
    // ========================
    saveConversationHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(this.conversationHistory));
    }
    
    loadConversationHistory() {
        // Mostrar últimos 10 mensajes del historial
        this.conversationHistory.slice(-10).forEach(msg => {
            this.addMessage(msg.text, msg.sender);
        });
    }
    
    clearHistory() {
        this.conversationHistory = [];
        this.messages = [];
        this.chatMessages.innerHTML = '';
        localStorage.removeItem('chatHistory');
        this.showWelcomeMessage();
    }
    
    // ========================
    // UTILIDADES
    // ========================
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ========================
// INICIALIZAR CHATBOT
// ========================
let chatbotManager;

document.addEventListener('DOMContentLoaded', () => {
    chatbotManager = new ChatbotManager();
    
    // Exportar para acceso global
    window.chatbotManager = chatbotManager;
});

// Función global para abrir chat
window.openChat = function() {
    if (chatbotManager && !chatbotManager.isOpen) {
        chatbotManager.toggleChatbot();
    }
};

// Exportar clase
window.ChatbotManager = ChatbotManager;
