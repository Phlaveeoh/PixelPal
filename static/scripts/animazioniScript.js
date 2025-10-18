const area = document.getElementById("areaPet");
const petFrame = document.getElementById("immaginePet");
const speed = 4;
let x, y, vx;

const larghezzaFrame = 64; // La larghezza di un singolo frame in pixel
const nFrames = 17;  // Il numero totale di frame
function initPetAnimation() {
    x = (area.clientWidth / 2) - 32;
    y = (area.clientHeight - 64) * 0.9;
    vx = 0;

    petFrame.style.left = `${x}px`;
    petFrame.style.top = `${y}px`;
}

function scegliDestinazioneCasuale() {
    const maxX = area.clientWidth - 64;

    const destinazioneX = Math.random() * maxX;

    petFrame.style.left = `${destinazioneX}px`;

    x = destinazioneX;

    cambiaFrameCasuale();
}

function cambiaFrameCasuale() {
    const frameIndex = Math.floor(Math.random() * nFrames);
    const backgroundX = -(frameIndex * larghezzaFrame);
    petFrame.style.backgroundPositionX = `${backgroundX}px`;
}

// --- Funzione di Avvio Esportata ---
export function startPetAnimation() {
    initPetAnimation();
    setInterval(scegliDestinazioneCasuale, 2000);
}