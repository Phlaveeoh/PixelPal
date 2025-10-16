const area = document.getElementById("areaPet");
const petFrame = document.getElementById("immaginePet");
const speed = 4;
let x, y, vx;

// Funzione di setup iniziale
function initPetAnimation() {
    x = (area.clientWidth / 2) - 32;
    y = area.clientHeight - 128;
    vx = 0;

    petFrame.style.left = `${x}px`;
    petFrame.style.top = `${y}px`;
}

function scegliDestinazioneCasuale() {
    const maxX = area.clientWidth - 64;

    const destinazioneX = Math.random() * maxX;

    petFrame.style.left = `${destinazioneX}px`;

    x = destinazioneX;
}

// --- Funzione di Avvio Esportata ---
export function startPetAnimation() {
    initPetAnimation();
    setInterval(scegliDestinazioneCasuale, 2000);
}