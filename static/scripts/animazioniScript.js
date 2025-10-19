const area = document.getElementById("areaPet");
const petFrame = document.getElementById("immaginePet");
const itemFrame = document.getElementById("immagineItem")
let xPet, yPet, vxPet;
let xItem, yItem;

const nFrames = 17;

function initPetAnimation() {
    const larghezzaFrame = petFrame.clientWidth;
    xPet = (area.clientWidth / 2) - (larghezzaFrame / 2);
    yPet = (area.clientHeight - larghezzaFrame) * 0.9;
    vxPet = 0;

    petFrame.style.left = `${xPet}px`;
    petFrame.style.top = `${yPet}px`;
}

function scegliDestinazioneCasuale() {
    const maxX = area.clientWidth - 64;
    const destinazioneX = Math.random() * maxX;
    petFrame.style.left = `${destinazioneX}px`;
    xPet = destinazioneX;
    cambiaFrameCasuale();
}

function cambiaFrameCasuale() {
    const larghezzaFrame = petFrame.clientWidth;
    const frameAttuale = Math.floor(Math.random() * nFrames);
    petFrame.style.backgroundPositionX = `${-(frameAttuale * larghezzaFrame)}px`;
}

export function startPetAnimation() {
    initPetAnimation();
    setInterval(scegliDestinazioneCasuale, 2000);
}

export async function animazioneCibo() {
    const larghezzaFrame = petFrame.clientWidth;
    //Posiziono il pet
    xPet = (area.clientWidth / 2) - (larghezzaFrame / 2);
    yPet = (area.clientHeight - larghezzaFrame) * 0.9;
    petFrame.style.left = `${xPet}px`;
    petFrame.style.top = `${yPet}px`;

    //Faccio scendere il cibo
    xItem = (area.clientWidth / 2) - (area.clientWidth * 0.3);
    yItem = -larghezzaFrame;
    const yItemFinale = area.clientHeight * 0.9;
    itemFrame.style.left = `${xItem}px`;
    itemFrame.style.top = `${yItem}px`;
    itemFrame.style.display = "block";
    itemFrame.style.transition = "transform 2s ease-in";

    //Attendo la discesa del cibo
    await new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                itemFrame.style.transform = `translateY(${yItemFinale}px)`;
            });
        });
        itemFrame.addEventListener("transitionend", resolve, { once: true });
    });

    //Frame utilizzati durante la mangiata
    const petFrames = [5, 6];
    const itemFrames = [0, 1, 2, 3];
    const durataFrame = 500;

    await new Promise(resolve => {
        let ciclo = 0;
        const cicliTotali = itemFrames.length * 2; //8 passaggi totali

        const animazione = setInterval(() => {
            const petFrameAttuale = petFrames[ciclo % 2]; //Alterna tra il frame 5 e 6
            petFrame.style.backgroundPosition = `${-petFrameAttuale * larghezzaFrame}px 0`;

            //Ogni due cicli di animazione il cibo viene ridotto di un morso
            if (ciclo % 2 === 0 && ciclo / 2 < itemFrames.length) {
                const itemFrameIndex = itemFrames[ciclo / 2];
                itemFrame.style.backgroundPosition = `${-itemFrameIndex * larghezzaFrame}px 0`;
            }

            ciclo++;
            //Se il ciclo è finito termino l'intervallo
            if (ciclo >= cicliTotali) {
                itemFrame.style.display = "none"
                clearInterval(animazione);
                resolve();
            }
        }, durataFrame);
    });
}

export async function animazioneGioco() {
    const larghezzaFrame = petFrame.clientWidth;
    //Posiziono il pet
    xPet = (area.clientWidth / 2) - (larghezzaFrame / 2);
    yPet = (area.clientHeight - larghezzaFrame) * 0.9;
    petFrame.style.left = `${xPet}px`;
    petFrame.style.top = `${yPet}px`;

    //Faccio scendere il gioco
    xItem = (area.clientWidth / 2) - (area.clientWidth * 0.3);
    yItem = -larghezzaFrame;
    let yItemFinale = area.clientHeight * 0.9;
    itemFrame.style.left = `${xItem}px`;
    itemFrame.style.top = `${yItem}px`;
    itemFrame.style.display = "block";
    itemFrame.style.transition = "transform 2s ease-in";

    //Attendo la discesa del gioco
    await new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                itemFrame.style.transform = `translateY(${yItemFinale}px)`;
            });
        });
        itemFrame.addEventListener("transitionend", resolve, { once: true });
    });

    //Faccio oscillare il pet e l'item
    itemFrame.style.transition = "transform 100ms linear";

    await new Promise(resolve => {
        let ciclo = 0;
        const durataFrame = 300;
        const cicli = 6;

        const animazione = setInterval(() => {
            let offsetItem = 0;
            let offsetPet = 0;

            if (ciclo % 2 === 0) {
                offsetItem = 10;
                offsetPet = -5;
            } else {
                offsetItem = -10;
                offsetPet = 5
            }

            itemFrame.style.transform = `translate(${offsetItem}px, ${yItemFinale}px)`;
            petFrame.style.top = `${yPet + offsetPet}px`;
            ciclo++;

            if (ciclo > cicli) {
                yItemFinale = -larghezzaFrame;
                itemFrame.style.transition = "transform 2s ease-in";
                clearInterval(animazione);
                resolve();
            }
        }, durataFrame);
    });

    //rimuovo il gioco dall'area
    await new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                itemFrame.style.transform = `translateY(${yItemFinale}px)`;
            });
        });
        itemFrame.addEventListener("transitionend", resolve, { once: true });
    });
}