# 🌟 SIGNA - Sistema Integral de Gestión, Navegación y Asistencia

## 📋 Descripción del Proyecto

**SIGNA** es una plataforma web moderna, profesional e inclusiva que conjuga herramientas avanzadas de navegación, asistencia digital y entretenimiento educativo. Diseñada con estándares de accesibilidad WCAG 2.1 AA, ofrece una experiencia digital sin barreras para todos los usuarios.

---

## 🎯 Características Principales

### ✨ Diseño Visual Premium
- **Moderno y Futurista:** Interfaz contemporánea con gradientes, animaciones suaves y transiciones fluidas
- **Responsivo 100%:** Compatible con todos los dispositivos (móvil, tablet, desktop)
- **Modo Oscuro:** Tema alternativo para reducir fatiga visual
- **Alto Contraste:** Modo especial para usuarios con baja visión
- **Animaciones CSS3:** Transiciones elegantes en scroll, hover y carga

### 🤖 Chatbot Flotante Inteligente
- Interfaz flotante tipo burbuja con ícono animado
- Respuestas contextuales basadas en palabras clave
- Historial de conversación guardado localmente
- Indicador "escribiendo..." para UX mejorada
- Soporte 24/7
- Guía de navegación y ayuda en juegos
- Síntesis de voz (text-to-speech) integrada

### 🎮 Sistema Completo de 5 Juegos Interactivos

#### 1. **Juego de Memoria**
- Empareja cartas con emojis
- Sistema de movimientos contado
- Animaciones de volteo
- Puntaje en tiempo real
- Interfaz limpia y responsiva

#### 2. **Juego de Lógica**
- 5 problemas de razonamiento lógico
- Secuencias numéricas y alfabéticas
- Sistema de puntuación
- Progreso visible
- Feedback inmediato

#### 3. **Atención Visual**
- Busca y haz click en puntos ocultos
- Generación aleatoria de posiciones
- Contador de encontrados
- Interfaz intuitiva
- Desafío paulatino

#### 4. **Reflejos Rápidos**
- Mide tu tiempo de reacción
- 5 rondas progresivas
- Promedio de reacción calculado
- Feedback de velocidad
- Scoring basado en precisión

#### 5. **Quiz Educativo**
- 5 preguntas de conocimiento general
- Respuestas inmediatas con validación
- Puntuación porcentual
- Indicador de respuestas correctas
- Retroalimentación en tiempo real

### ♿ Sistema Avanzado de Accesibilidad
- **Panel Flotante de Control:**
  - Ajuste de tamaño de texto (75% - 150%)
  - Selector de temas (claro, oscuro, alto contraste)
  - Lector de texto integrado (text-to-speech)
  - Indicadores visuales de foco
  
- **Navegación por Teclado:**
  - Acceso a todas las funciones sin ratón
  - Tab navigation automático
  - Atajos rápidos (Alt + números)
  - Focus trapping en modales
  
- **Cumplimiento WCAG 2.1:**
  - Contraste de color adecuado
  - Etiquetas ARIA completas
  - Estructura semántica HTML5
  - Soporte para lectores de pantalla
  - Reducción de movimiento respetada

### 🛠️ Características Técnicas

**Frontend:**
- HTML5 semántico y accesible
- CSS3 con Grid, Flexbox y variables CSS
- JavaScript modular orientado a objetos
- LocalStorage para persistencia de datos
- Intersection Observer para animaciones

**Performance:**
- Carga rápida y optimizada
- Sin dependencias externas (CSS/JS puro)
- Animaciones GPU-accelerated
- Scrollbar personalizado
- Código minimalista y limpio

---

## 📁 Estructura del Proyecto

```
SIGNA/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos CSS3 completos
├── js/
│   ├── main.js            # Funcionalidad principal y eventos globales
│   ├── chatbot.js         # Sistema de chatbot inteligente
│   ├── accessibility.js   # Panel de accesibilidad avanzada
│   └── games.js           # Sistema de 5 juegos interactivos
└── assets/
    ├── icons/             # Directorio para iconos (SVG integrados)
    └── sounds/            # Directorio para sonidos opcionales
```

---

## 🚀 Instalación y Uso

### Opción 1: Usar con Servidor Local (Recomendado)

```bash
# Navegar al directorio
cd CHATBOT_SIGNA

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (si tienes http-server instalado)
npx http-server
```

Luego abre en el navegador: `http://localhost:8000`

### Opción 2: Abrir Directamente

Simplemente abre el archivo `index.html` en tu navegador web moderno.

---

## 💻 Technologías Utilizadas

| Tecnología | Uso |
|-----------|-----|
| **HTML5** | Estructura semántica y accesible |
| **CSS3** | Grid, Flexbox, Variables CSS, Animaciones |
| **JavaScript ES6+** | Lógica modular orientada a objetos |
| **LocalStorage API** | Persistencia de preferencias y historial |
| **Speech Synthesis API** | Lector de texto integrado |
| **Intersection Observer** | Animaciones de scroll eficientes |
| **Web Speech API** | Lector de textos |

---

## 🎨 Paleta de Colores

```css
/* Primarios */
--primary: #667eea (Violeta Principal)
--secondary: #764ba2 (Violeta Secundario)
--accent: #f093fb (Rosa Neón)

/* Neutrals */
--dark: #1a1a2e
--light: #ffffff
--gray-series: #f8f9ff a #6b7485

/* Modos */
Dark Mode: Tema oscuro profesional
High Contrast: Contraste máximo para baja visión
```

---

## ⌨️ Controles de Teclado

| Atajo | Función |
|-------|---------|
| **Alt + 1** | Ir a Inicio |
| **Alt + 2** | Ir a ¿Qué es? |
| **Alt + 3** | Ir a Juegos |
| **Alt + 4** | Ir a Contacto |
| **Tab** | Navegar entre elementos |
| **Enter** | Activar botones/links |
| **Esc** | Cerrar modales y paneles |
| **Space** | Activar botones |

---

## 📊 Archivos y Líneas de Código

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| `index.html` | ~530 | Estructura HTML5 completa |
| `css/style.css` | ~1200 | Estilos CSS3 avanzados |
| `js/main.js` | ~350 | Funcionalidad principal |
| `js/chatbot.js` | ~400 | Sistema de chatbot |
| `js/accessibility.js` | ~340 | Panel de accesibilidad |
| `js/games.js` | ~650 | 5 juegos completos |
| **Total** | **~3,500** | **Código 100% vanilla** |

---

## 🔧 Explicación de Módulos JavaScript

### main.js
Maneja:
- Inicialización de la aplicación
- Navbar responsivo y sticky
- Navegación suave y smooth scroll
- Botón "volver arriba"
- Scroll spy para navbar activo
- Modo oscuro desde navbar
- Formulario de contacto
- Eventos globales y utilidades

**Clases/Funciones principales:**
- `SIGNA` - Objeto global de configuración
- `initializeApp()` - Inicialización completa
- `setupEventListeners()` - Configurar event listeners
- `setupScrollAnimations()` - Animaciones de scroll

### accessibility.js
Maneja:
- Panel flotante de accesibilidad
- Ajuste de tamaño de texto
- Selector de temas (claro/oscuro/contraste)
- Lector de texto integrado
- Focus management
- Skip links
- ARIA attributes

**Clases principales:**
- `AccessibilityManager` - Gestor principal
- `FocusManager` - Gestión de enfoque
- `setupSkipLinks()` - Crear skip links

### chatbot.js
Maneja:
- Chatbot flotante inteligente
- Base de conocimientos (NLP simple)
- Historial de conversación
- Indicador de escritura
- Respuestas contextuales
- Integración de síntesis de voz
- Persistencia en localStorage

**Clases principales:**
- `ChatbotManager` - Sistema completo del chatbot
- Métodos: `sendMessage()`, `generateResponse()`, `addMessage()`

### games.js
Contiene:
- 5 juegos completamente funcionales
- Sistema de puntaje global
- Animaciones y efectos visuales
- Historial de mejores puntuaciones

**Clases principales:**
- `GameManager` - Gestor de juegos
- `BaseGame` - Clase base para todos los juegos
- `MemoryGame` - Juego de memoria
- `LogicGame` - Juego de lógica
- `AttentionGame` - Atención visual
- `ReflexGame` - Juego de reflejos
- `QuizGame` - Quiz educativo

---

## 🎓 Características Educativas

- ✅ Juegos basados en el aprendizaje
- ✅ Retroalimentación inmediata
- ✅ Mensajes motivacionales
- ✅ Sistema de puntaje y progreso
- ✅ Inclusión de usuarios con discapacidades
- ✅ Interfaz intuitiva y fácil de usar
- ✅ Contenido accesible para todas las edades

---

## 🌐 Compatibilidad

| Navegador | Soporte | Nota |
|-----------|---------|------|
| **Chrome/Edge** | ✅ Total | Recomendado |
| **Firefox** | ✅ Total | Perfecto |
| **Safari** | ✅ Total | iOS 13+ |
| **Opera** | ✅ Total | Completo |
| **IE 11** | ⚠️ Limitado | No recomendado |

---

## 💾 Almacenamiento Local

La plataforma almacena automáticamente:
- Preferencias de accesibilidad (tema, tamaño de texto)
- Historial de conversación del chatbot
- Mejor puntuación por juego
- Historial de contacto

---

## 🔐 Privacidad y Datos

- ✅ Todos los datos se almacenan localmente
- ✅ Sin conexión a servidores externos
- ✅ Sin rastreo de usuarios
- ✅ GDPR compatible
- ✅ Privacidad total del usuario

---

## 🚀 Mejoras Futuras

- [ ] Backend Node.js/Express para persistencia en servidor
- [ ] Base de datos MongoDB para múltiples usuarios
- [ ] Autenticación y perfiles de usuario
- [ ] Más juegos interactivos
- [ ] API REST para integración
- [ ] Certificados y badges de logros
- [ ] Análisis de progreso detallado
- [ ] Sonidos y música ambiental
- [ ] Gamificación avanzada
- [ ] Sistema de puntos y recompensas

---

## 💡 Consejos de Uso

1. **Para Usuarios con Baja Visión:**
   - Usa el panel de accesibilidad
   - Selecciona "Alto Contraste"
   - Aumenta el tamaño de texto
   - Usa el lector integrado

2. **Para Usuarios de Teclado:**
   - Usa Tab para navegar
   - Alt + números para atajos
   - Enter para activar elementos
   - Esc para cerrar paneles

3. **Para Máximo Rendimiento:**
   - Usa navegadores modernos
   - Cierra otras pestañas pesadas
   - Habilita JavaScript
   - Permite acceso al micrófono para lector

---

## 📞 Soporte y Contacto

Usa el formulario de contacto en la plataforma o el chatbot flotante para:
- Reportar problemas
- Sugerir nuevas características
- Solicitar ayuda técnica
- Proporcionar feedback

---

## 📄 Licencia

Este proyecto es de código abierto y educativo.
Libre para uso personal y educativo.

---

## 🏆 Conclusión

SIGNA es una prueba de concepto completa de una **plataforma web profesional, moderna e inclusiva** que demuestra:

✅ Diseño UX/UI avanzado  
✅ Desarrollo full-stack frontend  
✅ Accesibilidad WCAG 2.1  
✅ Código modular y escalable  
✅ Experiencia de usuario óptima  
✅ Juegos educativos funcionales  
✅ Sistema de chatbot inteligente  

**¡Listo para usar, personalizar y expandir!**

---

**Desarrollado con dedicación a la inclusión digital** 🌟
