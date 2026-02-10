/* ==========================================
   SIGNA - Games Module
   Sistema completo de juegos interactivos
   ========================================== */

class GameManager {
    constructor() {
        this.currentGame = null;
        this.modal = document.getElementById('gameModal');
        this.container = document.getElementById('gameContainer');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        log.success('GameManager initialized');
    }
    
    setupEventListeners() {
        // Close modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeGame();
            }
        });
        
        // Close modal al hacer click fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeGame();
            }
        });
    }
    
    // ========================
    // INICIAR JUEGO
    // ========================
    async startGame(gameName) {
        this.container.innerHTML = '<div style="text-align: center; padding: 2rem;"><p>Cargando juego...</p></div>';
        this.modal.classList.add('active');
        
        await wait(200);
        
        switch(gameName) {
            case 'memory':
                this.currentGame = new MemoryGame();
                break;
            case 'logic':
                this.currentGame = new LogicGame();
                break;
            case 'attention':
                this.currentGame = new AttentionGame();
                break;
            case 'reflexes':
                this.currentGame = new ReflexGame();
                break;
            case 'quiz':
                this.currentGame = new QuizGame();
                break;
            default:
                log.error('Unknown game: ' + gameName);
                return;
        }
        
        this.currentGame.render(this.container);
        log.info('Game started: ' + gameName);
    }
    
    closeGame() {
        if (this.currentGame) {
            this.currentGame.cleanup();
            this.currentGame = null;
        }
        
        this.modal.classList.remove('active');
        this.container.innerHTML = '';
    }
}

// ========================
// CLASE BASE PARA JUEGOS
// ========================
class BaseGame {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.level = 1;
        this.maxScore = 0;
        this.lives = 3;
        this.timeLeft = 0;
        this.gameActive = true;
    }
    
    render(container) {
        // Será implementado en subclases
    }
    
    cleanup() {
        this.gameActive = false;
        // Limpiar timers
        clearInterval(this.timer);
    }
    
    addScore(points) {
        this.score += points;
        if (this.score > this.maxScore) {
            this.maxScore = this.score;
        }
        this.updateScore();
    }
    
    updateScore() {
        const scoreEl = document.getElementById('game-score');
        if (scoreEl) {
            scoreEl.textContent = this.score;
        }
    }
    
    gameOver(won = false) {
        this.gameActive = false;
        const message = won ? `¡Ganaste! Puntuación: ${this.score}` : `Juego terminado. Puntuación: ${this.score}`;
        this.showGameOverScreen(message, won);
    }
    
    showGameOverScreen(message, won) {
        const container = document.getElementById('gameContainer');
        if (!container) return;
        
        const screen = document.createElement('div');
        screen.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 1rem;
            z-index: 100;
            animation: fadeIn 0.3s ease;
        `;
        
        screen.innerHTML = `
            <div style="text-align: center; color: white;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem;">${won ? '🎉' : '😅'}</h2>
                <p style="font-size: 1.5rem; margin-bottom: 2rem;">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Volver a Jugar</button>
            </div>
        `;
        
        // Hacer el contenedor relativo para que el overlay funcione
        const gameElement = container.querySelector('div');
        if (gameElement) {
            gameElement.style.position = 'relative';
            gameElement.appendChild(screen);
        }
    }
}

// ========================
// JUEGO 1: MEMORIA
// ========================
class MemoryGame extends BaseGame {
    constructor() {
        super('memory');
        this.cards = [];
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        this.maxMoves = 16;
    }
    
    render(container) {
        this.container = container;
        this.initializeDeck();
        
        container.innerHTML = `
            <div style="max-width: 500px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2rem; align-items: center;">
                    <div>
                        <h2 style="margin: 0; color: var(--primary);">🎮 Juego de Memoria</h2>
                        <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">Encuentra los pares</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 0;">Movimientos: <strong id="game-moves">0</strong></p>
                        <p style="margin: 0.5rem 0 0 0;">Encontrados: <strong id="game-matched">0</strong>/8</p>
                    </div>
                </div>
                <div class="memory-game" id="memory-grid"></div>
            </div>
        `;
        
        this.renderCards();
    }
    
    initializeDeck() {
        const emojis = ['🌟', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎬'];
        this.cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    }
    
    renderCards() {
        const grid = document.getElementById('memory-grid');
        grid.innerHTML = '';
        
        this.cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            card.textContent = this.matched.includes(index) ? emoji : '?';
            
            if (this.matched.includes(index)) {
                card.classList.add('flipped');
            }
            
            card.addEventListener('click', () => this.flipCard(index, card));
            grid.appendChild(card);
        });
    }
    
    flipCard(index, element) {
        if (!this.gameActive || this.flipped.includes(index) || this.matched.includes(index)) {
            return;
        }
        
        this.flipped.push(index);
        element.textContent = element.dataset.emoji;
        element.classList.add('flipped');
        
        if (this.flipped.length === 2) {
            this.moves++;
            document.getElementById('game-moves').textContent = this.moves;
            
            this.checkMatch();
        }
    }
    
    checkMatch() {
        const [first, second] = this.flipped;
        const firstEmoji = this.cards[first];
        const secondEmoji = this.cards[second];
        
        if (firstEmoji === secondEmoji) {
            this.matched.push(first, second);
            document.getElementById('game-matched').textContent = this.matched.length / 2;
            this.flipped = [];
            this.addScore(10);
            
            if (this.matched.length === this.cards.length) {
                setTimeout(() => this.gameOver(true), 500);
            }
        } else {
            setTimeout(() => {
                this.flipped.forEach(idx => {
                    const card = document.querySelector(`.memory-card[data-index="${idx}"]`);
                    if (card && !this.matched.includes(idx)) {
                        card.textContent = '?';
                        card.classList.remove('flipped');
                    }
                });
                this.flipped = [];
            }, 1000);
        }
    }
}

// ========================
// JUEGO 2: LÓGICA
// ========================
class LogicGame extends BaseGame {
    constructor() {
        super('logic');
        this.currentProblem = 0;
        this.correctAnswers = 0;
        this.problems = [
            {
                question: '¿Cuál es el siguiente número? 2, 4, 6, 8, ?',
                options: [10, 12, 14],
                correct: 0
            },
            {
                question: '¿Completa la secuencia: A, C, E, G, ?',
                options: ['I', 'H', 'J'],
                correct: 0
            },
            {
                question: '¿Cuál número no pertenece? 5, 10, 15, 20, 23',
                options: [20, 23, 15],
                correct: 1
            },
            {
                question: '¿Cuál es el patrón? 1, 1, 2, 3, 5, 8, ?',
                options: [13, 12, 11],
                correct: 0
            },
            {
                question: '¿Qué letra sigue? B, D, F, H, ?',
                options: ['J', 'I', 'K'],
                correct: 0
            }
        ];
    }
    
    render(container) {
        container.innerHTML = `
            <div style="max-width: 600px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2rem;">
                    <h2 style="margin: 0;">🧩 Juego de Lógica</h2>
                    <div style="text-align: right;">
                        <p style="margin: 0;">Progreso: <strong id="game-progress">1</strong>/5</p>
                        <p style="margin: 0.5rem 0 0 0;">Correctas: <strong id="game-correct">0</strong></p>
                    </div>
                </div>
                <div id="logic-game"></div>
            </div>
        `;
        
        this.showProblem();
    }
    
    showProblem() {
        const gameDiv = document.getElementById('logic-game');
        const problem = this.problems[this.currentProblem];
        
        gameDiv.innerHTML = `
            <div class="logic-game">
                <div class="quiz-question">
                    <h4>${problem.question}</h4>
                    <div class="options-grid">
                        ${problem.options.map((opt, idx) => `
                            <button class="option-btn logic-option" data-index="${idx}">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.logic-option').forEach((btn, idx) => {
            btn.addEventListener('click', () => this.selectAnswer(idx));
        });
    }
    
    selectAnswer(selectedIdx) {
        const problem = this.problems[this.currentProblem];
        const buttons = document.querySelectorAll('.logic-option');
        
        // Deshabilitar todos los botones
        buttons.forEach(btn => btn.disabled = true);
        
        if (selectedIdx === problem.correct) {
            this.correctAnswers++;
            this.addScore(20);
            buttons[selectedIdx].classList.add('correct');
            showNotification('✅ ¡Correcto!', 'success');
        } else {
            buttons[selectedIdx].classList.add('incorrect');
            buttons[problem.correct].classList.add('correct');
            showNotification('❌ Incorrecto. Intenta otra vez.', 'error');
        }
        
        document.getElementById('game-correct').textContent = this.correctAnswers;
        
        this.currentProblem++;
        
        if (this.currentProblem < this.problems.length) {
            setTimeout(() => {
                document.getElementById('game-progress').textContent = this.currentProblem + 1;
                this.showProblem();
            }, 1000);
        } else {
            setTimeout(() => this.gameOver(true), 500);
        }
    }
}

// ========================
// JUEGO 3: ATENCIÓN VISUAL
// ========================
class AttentionGame extends BaseGame {
    constructor() {
        super('attention');
        this.spots = [];
        this.foundSpots = [];
        this.totalSpots = 5;
    }
    
    render(container) {
        container.innerHTML = `
            <div style="max-width: 600px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2rem;">
                    <h2 style="margin: 0;">👁️ Atención Visual</h2>
                    <p style="margin: 0;">Encontrados: <strong id="game-found">0</strong>/${this.totalSpots}</p>
                </div>
                <div class="game-image" id="attention-game">
                    <p style="color: white; margin: 0; line-height: 300px;">Busca y haz click en los puntos verdes</p>
                </div>
                <p style="text-align: center; color: var(--text-secondary);">Haz click en los círculos que encuentres</p>
            </div>
        `;
        
        this.generateSpots();
    }
    
    generateSpots() {
        const gameEl = document.getElementById('attention-game');
        gameEl.innerHTML = '<p style="color: white; margin: 0; line-height: 300px; position: relative;">Busca y haz click en los puntos verdes</p>';
        
        const rect = gameEl.getBoundingClientRect();
        
        this.spots = [];
        
        for (let i = 0; i < this.totalSpots; i++) {
            const x = Math.random() * (rect.width - 60);
            const y = Math.random() * (rect.height - 60);
            
            const spot = document.createElement('div');
            spot.className = 'game-spot';
            spot.style.position = 'absolute';
            spot.style.left = x + 'px';
            spot.style.top = y + 'px';
            spot.style.width = '40px';
            spot.style.height = '40px';
            spot.style.backgroundColor = '#4ade80';
            spot.style.border = '3px solid white';
            spot.style.borderRadius = '50%';
            spot.style.cursor = 'pointer';
            spot.style.transition = 'all 0.2s ease';
            spot.dataset.index = i;
            
            spot.addEventListener('click', (e) => {
                e.stopPropagation();
                this.findSpot(i, spot);
            });
            
            spot.addEventListener('mouseover', () => {
                spot.style.backgroundColor = '#22c55e';
                spot.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.8)';
            });
            
            spot.addEventListener('mouseout', () => {
                if (!spot.classList.contains('found')) {
                    spot.style.backgroundColor = '#4ade80';
                    spot.style.boxShadow = 'none';
                }
            });
            
            gameEl.appendChild(spot);
            this.spots.push({ element: spot, index: i });
        }
    }
    
    findSpot(index, element) {
        if (this.foundSpots.includes(index)) return;
        
        this.foundSpots.push(index);
        element.classList.add('found');
        element.style.backgroundColor = '#22c55e';
        element.style.opacity = '0.7';
        this.addScore(20);
        
        document.getElementById('game-found').textContent = this.foundSpots.length;
        
        if (this.foundSpots.length === this.totalSpots) {
            setTimeout(() => this.gameOver(true), 300);
        }
    }
}

// ========================
// JUEGO 4: REFLEJOS
// ========================
class ReflexGame extends BaseGame {
    constructor() {
        super('reflexes');
        this.reactionTimes = [];
        this.rounds = 5;
        this.currentRound = 0;
    }
    
    render(container) {
        container.innerHTML = `
            <div style="max-width: 500px; margin: 0 auto; text-align: center;">
                <h2 style="margin: 0 0 1rem 0;">⚡ Reflejos</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">El botón cambiará de color. ¡Haz click lo más rápido posible!</p>
                <div class="reflex-game">
                    <button class="reflex-button waiting" id="reflex-button">Preparándose...</button>
                    <div style="margin-top: 2rem;">
                        <p>Ronda: <strong id="game-round">1</strong>/5</p>
                        <p>Tiempo promedio: <strong id="game-avg-time">--ms</strong></p>
                    </div>
                </div>
            </div>
        `;
        
        this.startRound();
    }
    
    startRound() {
        if (!this.gameActive) return;
        
        const button = document.getElementById('reflex-button');
        if (!button) return;
        
        button.classList.remove('active');
        button.classList.add('waiting');
        button.textContent = 'Espera...';
        button.disabled = true;
        
        const delay = 1000 + Math.random() * 4000;
        
        setTimeout(() => {
            if (!this.gameActive) return;
            
            const startTime = Date.now();
            button.classList.remove('waiting');
            button.classList.add('active');
            button.textContent = '¡AHORA!';
            button.disabled = false;
            
            let clicked = false;
            
            const clickHandler = () => {
                if (clicked) return;
                clicked = true;
                
                const reactionTime = Date.now() - startTime;
                this.reactionTimes.push(reactionTime);
                button.removeEventListener('click', clickHandler);
                this.displayReactionTime(reactionTime);
            };
            
            button.addEventListener('click', clickHandler);
            
            // Timeout de 10 segundos si no hace clic
            setTimeout(() => {
                if (!clicked && this.gameActive) {
                    showNotification('⏱️ Tiempo limite alcanzado', 'error');
                    button.removeEventListener('click', clickHandler);
                    this.currentRound++;
                    document.getElementById('game-round').textContent = this.currentRound;
                    
                    if (this.currentRound < this.rounds) {
                        setTimeout(() => this.startRound(), 1000);
                    } else {
                        const avgTime = this.reactionTimes.reduce((a, b) => a + b) / this.reactionTimes.length;
                        document.getElementById('game-avg-time').textContent = Math.round(avgTime) + 'ms';
                        setTimeout(() => this.gameOver(true), 500);
                    }
                }
            }, 10000);
        }, delay);
    }
    
    displayReactionTime(time) {
        this.currentRound++;
        showNotification(`⏱️ Tiempo: ${time}ms`, 'info');
        this.addScore(Math.max(0, 100 - Math.min(time / 10, 100)));
        
        document.getElementById('game-round').textContent = this.currentRound;
        
        if (this.currentRound < this.rounds) {
            setTimeout(() => this.startRound(), 2000);
        } else {
            const avgTime = this.reactionTimes.reduce((a, b) => a + b) / this.reactionTimes.length;
            document.getElementById('game-avg-time').textContent = Math.round(avgTime) + 'ms';
            setTimeout(() => this.gameOver(true), 500);
        }
    }
}

// ========================
// JUEGO 5: QUIZ EDUCATIVO
// ========================
class QuizGame extends BaseGame {
    constructor() {
        super('quiz');
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.questions = [
            {
                question: '¿Cuál es la capital de Francia?',
                options: ['París', 'Lyon', 'Marsella'],
                correct: 0
            },
            {
                question: '¿Cuál es el planeta más grande del sistema solar?',
                options: ['Saturno', 'Júpiter', 'Neptuno'],
                correct: 1
            },
            {
                question: '¿En qué año se inventó el teléfono?',
                options: ['1876', '1895', '1850'],
                correct: 0
            },
            {
                question: '¿Cuál es el río más largo de América del Sur?',
                options: ['Orinoco', 'Amazonas', 'Paraná'],
                correct: 1
            },
            {
                question: '¿Cuántos continentes hay en la Tierra?',
                options: ['6', '7', '8'],
                correct: 1
            }
        ];
    }
    
    render(container) {
        container.innerHTML = `
            <div style="max-width: 600px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2rem;">
                    <h2 style="margin: 0;">📚 Quiz Educativo</h2>
                    <div style="text-align: right;">
                        <p style="margin: 0;">Pregunta: <strong id="game-question-num">1</strong>/5</p>
                        <p style="margin: 0.5rem 0 0 0;">Correctas: <strong id="game-correct-quiz">0</strong></p>
                    </div>
                </div>
                <div id="quiz-container"></div>
            </div>
        `;
        
        this.showQuestion();
    }
    
    showQuestion() {
        const container = document.getElementById('quiz-container');
        const question = this.questions[this.currentQuestion];
        
        container.innerHTML = `
            <div class="quiz-game">
                <div class="quiz-question">
                    <h4>${question.question}</h4>
                    <div class="quiz-options">
                        ${question.options.map((opt, idx) => `
                            <button class="quiz-option quiz-btn" data-index="${idx}">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.quiz-btn').forEach((btn, idx) => {
            btn.addEventListener('click', () => this.answerQuestion(idx));
        });
    }
    
    answerQuestion(selectedIdx) {
        const question = this.questions[this.currentQuestion];
        const options = document.querySelectorAll('.quiz-btn');
        
        options.forEach((opt, idx) => {
            opt.disabled = true;
            if (idx === question.correct) {
                opt.classList.add('correct');
            } else if (idx === selectedIdx && selectedIdx !== question.correct) {
                opt.classList.add('incorrect');
            }
        });
        
        if (selectedIdx === question.correct) {
            this.correctAnswers++;
            this.addScore(25);
            showNotification('✅ ¡Correcto!', 'success');
        } else {
            showNotification('❌ Respuesta incorrecta', 'error');
        }
        
        document.getElementById('game-correct-quiz').textContent = this.correctAnswers;
        
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            setTimeout(() => {
                document.getElementById('game-question-num').textContent = this.currentQuestion + 1;
                this.showQuestion();
            }, 1500);
        } else {
            setTimeout(() => {
                const percentage = (this.correctAnswers / this.questions.length) * 100;
                const message = `¡Quiz Terminado!\nRespuestas correctas: ${this.correctAnswers}/5\nPuntuación: ${Math.round(percentage)}%`;
                this.gameOver(true);
            }, 1000);
        }
    }
}

// ========================
// INICIALIZAR GAME MANAGER
// ========================
let gameManager;

document.addEventListener('DOMContentLoaded', () => {
    gameManager = new GameManager();
    
    // Exportar al contexto global
    window.gameManager = gameManager;
    window.logicGame = null;
    window.quizGame = null;
});

// Funciones globales para iniciar juegos
window.startGame = function(gameName) {
    gameManager.startGame(gameName);
    
    // Asignar referencias de juego para callbacks
    setTimeout(() => {
        if (gameManager.currentGame instanceof LogicGame) {
            window.logicGame = gameManager.currentGame;
        } else if (gameManager.currentGame instanceof QuizGame) {
            window.quizGame = gameManager.currentGame;
        }
    }, 100);
};

window.closeGame = function() {
    gameManager.closeGame();
};

// Exportar clases
window.BaseGame = BaseGame;
window.MemoryGame = MemoryGame;
window.LogicGame = LogicGame;
window.AttentionGame = AttentionGame;
window.ReflexGame = ReflexGame;
window.QuizGame = QuizGame;
