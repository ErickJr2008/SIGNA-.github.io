# 🚀 Guía Rápida de Desarrollo - SIGNA

## ⚡ Inicio Rápido

### 1. Requisitos
- Navegador moderne (Chrome, Firefox, Safari, Edge)
- Editor de código (VS Code recomendado)
- Python 3 o Node.js (para servidor local)

### 2. Ejecutar la Plataforma

#### Opción A: Python
```bash
cd CHATBOT_SIGNA
python -m http.server 8000
# Abre: http://localhost:8000
```

#### Opción B: Node.js
```bash
cd CHATBOT_SIGNA
npx http-server
```

#### Opción C: VS Code
```bash
# Instala la extensión "Live Server"
# Click derecho en index.html → "Open with Live Server"
```

---

## 📝 Editar Componentes

### Cambiar Colores Primarios
Archivo: `css/style.css` (líneas 1-30)
```css
:root {
    --primary: #667eea;      /* Cambiar a tu color */
    --secondary: #764ba2;
    --accent: #f093fb;
}
```

### Agregar Nueva Sección
1. Agregar en `index.html`
2. Crear estilos en `css/style.css`
3. Agregar funcionalidad en `js/main.js`

### Personalizar Chatbot
Archivo: `js/chatbot.js` (línea ~90)
```javascript
const responses = {
    tuCategoria: {
        patterns: ['palabra1', 'palabra2'],
        responses: ['Respuesta 1', 'Respuesta 2']
    }
};
```

### Agregar Nuevo Juego
1. Crear clase en `js/games.js`:
```javascript
class MiJuego extends BaseGame {
    constructor() {
        super('minombre');
    }
    
    render(container) {
        // Tu código
    }
}
```

2. Agregar botón en `index.html`
3. Registrar en `GameManager`

---

## 🔧 Variables CSS Disponibles

```css
/* Colores */
--primary: #667eea
--secondary: #764ba2
--accent: #f093fb
--dark: #1a1a2e
--light: #ffffff

/* Espaciado */
--spacing-xs: 0.5rem
--spacing-sm: 1rem
--spacing-md: 1.5rem
--spacing-lg: 2rem
--spacing-xl: 3rem
--spacing-xxl: 4rem

/* Border Radius */
--radius-sm: 0.5rem
--radius-md: 1rem
--radius-lg: 1.5rem
--radius-full: 50%

/* Sombras */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08)
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12)
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.16)
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.2)

/* Transiciones */
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--transition-fast: all 0.15s...
--transition-slow: all 0.5s...
```

---

## 🎮 API de Juegos

### Iniciar Juego
```javascript
// Llamar desde HTML
window.startGame('memory');
window.startGame('logic');
window.startGame('attention');
window.startGame('reflexes');
window.startGame('quiz');
```

### Cerrar Juego
```javascript
window.closeGame();
```

---

## ♿ API de Accesibilidad

### Cambiar Tamaño de Texto
```javascript
applyTextScale(1.25); // 125% del tamaño
```

### Cambiar Tema
```javascript
// Modo oscuro
document.body.classList.add('dark-mode');

// Alto contraste
document.body.classList.add('high-contrast');
```

### Anuncio para Lectores de Pantalla
```javascript
FocusManager.setAriaLive(element, 'Mensaje aquí', 'polite');
```

---

## 🤖 API del Chatbot

### Abrir Chatbot
```javascript
window.openChat();
```

### Agregar Mensaje
```javascript
chatbotManager.addMessage('Hola usuario', 'bot');
chatbotManager.addMessage('Hola botbot', 'user');
```

### Limpiar Historial
```javascript
chatbotManager.clearHistory();
```

---

## 📊 LocalStorage

### Preferencias Guardadas
```javascript
// Accesibilidad
localStorage.getItem('textScale')        // Escala de texto
localStorage.getItem('darkMode')        // Modo oscuro
localStorage.getItem('highContrast')    // Alto contraste
localStorage.getItem('theme')           // Tema actual

// Chat
localStorage.getItem('chatHistory')     // Historial de chat

// Contacto
localStorage.getItem('contactMessages') // Mensajes de contacto
```

### Limpiar Todo
```javascript
localStorage.clear();
// ⚠️ Esto borra todos los datos guardados
```

---

## 🐛 Debugging

### Console Logs
```javascript
log.info('Mensaje informativo');
log.success('Operación exitosa');
log.warn('Advertencia');
log.error('Error encontrado');
log.debug('Información de debug');
```

### Verificar Estado Global
```javascript
console.log(SIGNA);
```

---

## 📱 Testing Responsive

### Chrome DevTools
1. Abre DevTools (F12)
2. Click en icono de dispositivo (Ctrl+Shift+M)
3. Selecciona diferentes dispositivos

### Tamaños Clave
- Mobile: 480px
- Tablet: 768px
- Desktop: 1024px+

---

## ⚡ Performance Tips

1. **Minimizar reflows:**
   - Evita cambios DOM repetitivos en loops
   - Usa classList en lugar de style.cssText

2. **Optimizar animaciones:**
   - Usa `transform` y `opacity`
   - Evita `top`, `left`, `width` en animaciones

3. **Lazy loading:**
   - Las imágenes ya cargan bajo demanda
   - Usa Intersection Observer para contenido pesado

---

## 🔄 Ciclo de Desarrollo

```
1. Haz cambios en archivos
2. Guarda (Ctrl+S)
3. Recarga navegador (F5)
4. Verifica en DevTools (F12)
5. Prueba en múltiples dispositivos
6. Verifica accesibilidad (Tab, lector)
7. Commit a repositorio
```

---

## 📦 Estructura de Datos

### Config Global (SIGNA)
```javascript
{
    isDarkMode: boolean,
    isHighContrast: boolean,
    textScale: number,
    isMobile: boolean
}
```

### Mensaje de Chat
```javascript
{
    text: string,
    sender: 'user' | 'bot',
    timestamp: string
}
```

### Objeto de Juego
```javascript
{
    name: string,
    score: number,
    level: number,
    gameActive: boolean
}
```

---

## 🎨 Agregar Estilos Personalizados

### Inline Styles (Rápido)
```javascript
element.style.cssText = `
    background: var(--primary);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
`;
```

### Clases CSS (Recomendado)
```html
<div class="mi-clase"></div>
```
```css
.mi-clase {
    background: var(--primary);
    padding: var(--spacing-lg);
}
```

---

## 📚 Recursos Útiles

- [MDN Web Docs](https://developer.mozilla.org)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [JavaScript ES6](https://javascript.info)

---

## ✅ Checklist de QA

- [ ] ¿Carga rápido?
- [ ] ¿Responsive en móvil?
- [ ] ¿Teclado funciona?
- [ ] ¿Modo oscuro?
- [ ] ¿Chatbot abierto/cierra?
- [ ] ¿Juegos funcionan?
- [ ] ¿Accesibilidad ok?
- [ ] ¿No hay errores en consola?
- [ ] ¿Formulario de contacto envía?
- [ ] ¿Se guardan preferencias?

---

## 🚀 Deploy (Próximamente)

- **GitHub Pages**: Gratis, perfecto para portfolios
- **Netlify**: Deployment automático desde Git
- **Vercel**: Optimización automática
- **AWS S3**: Almacenamiento en la nube

---

**¡Happy Coding! 🎉**
