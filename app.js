const etapas = [
    { c: 'fondo-amanecer', m: 'Haberte conocido fue lo mejor que me ha pasado este año, y espero que el tiempo q pasamos juntos nunca se acabe <3' },
    { c: 'fondo-dia', m: 'Cada uno de mis días se vueven los mejores con solo un mensaje tuyo, y verte me enamora cada día más y me alegra el alma <3' },
    { c: 'fondo-atardecer', m: 'Asi como los tulipanes lilas embellecen un jardin, tu embelleces todo mi mundo <3' },
    { c: 'fondo-noche', m: 'Amo ver tus ojos, porque brillan como estrellas cada día mas brillantes, y cada que los miro me hipnotizan, me enamoran y hacen que el haberte conocido fuera lo mejor de mi vida <3' }
];
let idx = 0;

const escena = document.getElementById('escena');
const sobre = document.getElementById('sobre');
const mensaje = document.getElementById('mensaje');
const btnAbrir = document.getElementById('btn-abrir');

// Bandera para saber si los tulipanes ya están dibujados
let tulipanesDibujados = false;

function actualizar() {
    sobre.classList.remove('abierto');
    escena.className = 'pantalla ' + etapas[idx].c;
    mensaje.innerText = etapas[idx].m;
    
    // --- Control de dibujo de Tulipanes (DIBUJO ÚNICO) ---
    if (etapas[idx].c === 'fondo-atardecer') {
        if (!tulipanesDibujados && canvasTulipanes.width > 0) {
            // Un pequeño delay para asegurar que el canvas cargó bien tras el resize
            setTimeout(dibujarGranRamoDeTulipanes, 50); 
            tulipanesDibujados = true;
        }
    } else {
        // Borrar tulipanes y resetear bandera si cambiamos de fondo
        ctxT.clearRect(0, 0, canvasTulipanes.width, canvasTulipanes.height);
        tulipanesDibujados = false;
    }
}

btnAbrir.onclick = () => sobre.classList.toggle('abierto');

function cambiar(n) {
    idx = (idx + n + etapas.length) % etapas.length;
    actualizar();
}

// --- CANVAS DE ESTRELLAS FUGACES (NOCHE) ---
const canvasNoche = document.getElementById('canvas-noche');
const ctxN = canvasNoche.getContext('2d');

function resizeCanvasNoche() {
    canvasNoche.width = window.innerWidth;
    canvasNoche.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvasNoche);
resizeCanvasNoche();

class EstrellaFugaz {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvasNoche.width * 0.7;
        this.y = Math.random() * canvasNoche.height * 0.4;
        this.vx = Math.random() * 4 + 2; 
        this.vy = Math.random() * 4 + 2;
        this.len = Math.random() * 80 + 40;
        this.op = 1;
    }
    draw() {
        ctxN.beginPath();
        const gradiente = ctxN.createLinearGradient(this.x, this.y, this.x - this.len, this.y - this.len);
        gradiente.addColorStop(0, `rgba(255, 255, 255, ${this.op})`);
        gradiente.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctxN.strokeStyle = gradiente;
        ctxN.lineWidth = 2;
        ctxN.moveTo(this.x, this.y);
        ctxN.lineTo(this.x - this.len, this.y - this.len);
        ctxN.stroke();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.op -= 0.01;
        if (this.y > canvasNoche.height || this.x > canvasNoche.width || this.op <= 0) this.reset();
    }
}
const estrellas = Array.from({ length: 4 }, () => new EstrellaFugaz());

// --- CANVAS DE CORAZONES (AMANECER Y DIA) ---
const canvasCorazones = document.getElementById('canvas-corazones');
const ctxC = canvasCorazones.getContext('2d');

function resizeCanvasCorazones() {
    canvasCorazones.width = window.innerWidth;
    canvasCorazones.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvasCorazones);
resizeCanvasCorazones();

class Corazon {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvasCorazones.width;
        this.y = -20;
        this.size = Math.random() * 15 + 10;
        this.speed = Math.random() * 2 + 1;
        this.wind = (Math.random() - 0.5) * 1;
        this.op = Math.random() * 0.5 + 0.5;
    }
    draw() {
        let color = `rgba(255, 105, 180, ${this.op})`; 
        if (escena.classList.contains('fondo-dia')) {
            color = `rgba(255, 255, 255, ${this.op})`; 
        }
        ctxC.fillStyle = color;
        ctxC.font = `${this.size}px serif`;
        ctxC.fillText('❤', this.x, this.y);
    }
    update() {
        this.y += this.speed;
        this.x += this.wind;
        if (this.y > canvasCorazones.height) this.reset();
    }
}
const corazones = Array.from({ length: 20 }, () => new Corazon());

// --- MODIFICADO: CANVAS DE RAMO DE 8 TULIPANES REALES (DIBUJO ÚNICO) ---
const canvasTulipanes = document.getElementById('canvas-tulipanes');
const ctxT = canvasTulipanes.getContext('2d');

function resizeCanvasTulipanes() {
    canvasTulipanes.width = window.innerWidth;
    canvasTulipanes.height = window.innerHeight;
    // Si la ventana cambia y estamos en atardecer, redibujar el ramo quietito
    if (escena.classList.contains('fondo-atardecer')) {
        dibujarGranRamoDeTulipanes();
    }
}
window.addEventListener('resize', resizeCanvasTulipanes);
resizeCanvasTulipanes();

// Función auxiliar para dibujar UN TULIPÁN REAL (FORMA DE COPA CERRADA)
function dibujarUnTulipanReal(x, y, scale, tilt = 0) {
    ctxT.save();
    ctxT.translate(x, y);
    ctxT.scale(scale, scale);
    ctxT.rotate(tilt);

    // TALLO
    ctxT.beginPath();
    ctxT.moveTo(0, 0);
    ctxT.lineTo(0, 220);
    ctxT.strokeStyle = '#2e7d32';
    ctxT.lineWidth = 5;
    ctxT.lineCap = 'round';
    ctxT.stroke();

    // === FLOR LILA 🌷 ===
    ctxT.beginPath();

    ctxT.moveTo(0, 0);

    // lado izquierdo
    ctxT.bezierCurveTo(-20, -10, -30, -40, -15, -70);

    // punta izquierda
    ctxT.bezierCurveTo(-10, -85, -5, -85, 0, -70);

    // punta derecha
    ctxT.bezierCurveTo(5, -85, 10, -85, 15, -70);

    // lado derecho
    ctxT.bezierCurveTo(30, -40, 20, -10, 0, 0);

    ctxT.closePath();

    // 🎨 COLOR LILA BASE
    ctxT.fillStyle = '#c084d4';
    ctxT.fill();

    // ✨ BORDE SUTIL (clave para separar flores)
    ctxT.strokeStyle = 'rgba(90, 40, 120, 0.35)';
    ctxT.lineWidth = 1.5;
    ctxT.stroke();

    // 🌗 SOMBRA SUAVE INTERNA (da volumen sin deformar)
    ctxT.beginPath();
    ctxT.moveTo(0, -5);
    ctxT.bezierCurveTo(-3, -30, -3, -55, 0, -75);
    ctxT.strokeStyle = 'rgba(60, 20, 90, 0.25)';
    ctxT.lineWidth = 1;
    ctxT.stroke();

    ctxT.beginPath();
    ctxT.moveTo(0, -5);
    ctxT.bezierCurveTo(3, -30, 3, -55, 0, -75);
    ctxT.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctxT.lineWidth = 1;
    ctxT.stroke();

    ctxT.restore();
}

// Función para dibujar UNA HOJA DETALLADA que nace de la base
function dibujarHojaRamo(x, y, scale, tilt = 0, reverse = false) {
    ctxT.save();
    ctxT.translate(x, y);
    ctxT.scale(scale, scale);
    ctxT.rotate(tilt);
    if (reverse) ctxT.scale(-1, 1);

    // Hoja corta pegada al tallo
    ctxT.beginPath();
    ctxT.moveTo(0, 0);
    ctxT.quadraticCurveTo(-15, -40, 0, -80);
    ctxT.quadraticCurveTo(10, -40, 0, 0);
    ctxT.closePath();

    ctxT.fillStyle = '#4caf50';
    ctxT.fill();

    // nervadura sutil
    ctxT.beginPath();
    ctxT.moveTo(0, 0);
    ctxT.lineTo(0, -75);
    ctxT.strokeStyle = 'rgba(0,0,0,0.15)';
    ctxT.lineWidth = 1;
    ctxT.stroke();

    ctxT.restore();
}

// Función para dibujar EL GRAN RAMO DE 8 TULIPANES REALES ACOMODADOS
function dibujarGranRamoDeTulipanes() {
    ctxT.clearRect(0, 0, canvasTulipanes.width, canvasTulipanes.height);
    
    const xCentral = canvasTulipanes.width / 2;
    // Base alta para que el ramo suba imponente hacia el sobre
    const yBaseRamo = canvasTulipanes.height - 180; 

    // 1. DIBUJAR HOJAS DE FONDO (Primero, para que estén detrás)
    dibujarHojaRamo(xCentral - 90, yBaseRamo + 150, 1.5, -0.6); 
    dibujarHojaRamo(xCentral + 90, yBaseRamo + 150, 1.5, 0.6, true); 
    dibujarHojaRamo(xCentral - 40, yBaseRamo + 200, 1.2, -0.3); 
    dibujarHojaRamo(xCentral + 40, yBaseRamo + 200, 1.2, 0.3, true); 
    dibujarHojaRamo(xCentral, yBaseRamo + 250, 1.0, 0); // Hoja central trasera

    // 2. DIBUJAR LOS 8 TULIPANES REALES ACOMODADOS (en forma de ramo)
    const configTulipanes = [
        {dx: -100, dy: 65, s: 1.15, t: -0.45}, // Muy Izq, bajo
        {dx: -70,  dy: 35, s: 1.25, t: -0.3},  // Izq, medio
        {dx: -35,  dy: 15, s: 1.35, t: -0.12}, // Centro Izq, alto
        {dx: 0,    dy: 0,  s: 1.6,  t: 0},     // Centro Principal, el imponente
        {dx: 35,   dy: 15, s: 1.35, t: 0.12},  // Centro Der, alto
        {dx: 70,   dy: 35, s: 1.25, t: 0.3},   // Der, medio
        {dx: 100,  dy: 65, s: 1.15, t: 0.45},  // Muy Der, bajo
        {dx: 15,   dy: 45, s: 1.2,  t: 0.1}    // Relleno trasero der
    ];

    configTulipanes.forEach(config => {
        dibujarUnTulipanReal(xCentral + config.dx, yBaseRamo + config.dy, config.s, config.t);
    });
    
    // 3. DIBUJAR HOJAS DELANTERAS (Al final, para que cubran los tallos)
    dibujarHojaRamo(xCentral - 60, yBaseRamo + 230, 1.1, -0.15); // Delantera izq
    dibujarHojaRamo(xCentral + 60, yBaseRamo + 230, 1.1, 0.15, true); // Delantera der
    
    // 4. Cinta que ata el ramo
    ctxT.beginPath();
    ctxT.moveTo(xCentral - 65, yBaseRamo + 190);
    ctxT.bezierCurveTo(xCentral, yBaseRamo + 220, xCentral, yBaseRamo + 160, xCentral + 65, yBaseRamo + 190);
    ctxT.strokeStyle = '#af7ac5'; // Lila medio
    ctxT.lineWidth = 16; // Cinta ancha
    ctxT.lineCap = 'round';
    ctxT.stroke();
    // Nudo central
    ctxT.beginPath();
    ctxT.ellipse(xCentral, yBaseRamo + 195, 18, 12, 0, 0, Math.PI * 2);
    ctxT.fillStyle = '#8e44ad'; 
    ctxT.fill();
}

// --- ANIMACIÓN PRINCIPAL (SIN TULIPANES) ---
function animarTodo() {
    // Estrellas en la noche
    if (escena.classList.contains('fondo-noche')) {
        ctxN.clearRect(0, 0, canvasNoche.width, canvasNoche.height);
        estrellas.forEach(e => { e.update(); e.draw(); });
    } else {
        ctxN.clearRect(0, 0, canvasNoche.width, canvasNoche.height);
    }

    // Corazones en AMANECER o DIA
    if (escena.classList.contains('fondo-amanecer') || escena.classList.contains('fondo-dia')) {
        ctxC.clearRect(0, 0, canvasCorazones.width, canvasCorazones.height);
        corazones.forEach(c => { c.update(); c.draw(); });
    } else {
        ctxC.clearRect(0, 0, canvasCorazones.width, canvasCorazones.height);
    }

    requestAnimationFrame(animarTodo);
}

// Iniciar animación y la primera carga
animarTodo();
actualizar();