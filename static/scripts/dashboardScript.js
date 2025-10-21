//Importo le animazioni
import { startPetAnimation, animazioneCibo, animazioneGioco } from '/scripts/animazioniScript.js';

//Al caricamento della pagina:
window.onload = async () => {

    //Se è presente un item nel localStorage
    if (localStorage.getItem("itemSelezionato")) {
        //Lo prendo
        const itemSelezionato = JSON.parse(localStorage.getItem("itemSelezionato"));
        const itemTipo = itemSelezionato.tipo;
        const itemId = itemSelezionato.id;
        const itemUrl = itemSelezionato.url
        //Se l'item è un cibo
        if (itemTipo === "cibo") {
            //Chiamo l'API nutri
            const aumentoStats = await fetch('/api/pet/nutri', {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_cibo: itemId }),
            });

            //Attendo la risposta
            const data = await aumentoStats.json()

            //Se positiva:
            if (aumentoStats.ok) {
                //Carico il cibo
                let ciboFrame = document.getElementById("immagineItem");
                ciboFrame.dataset.tipo = "cibo";
                ciboFrame.style.backgroundImage = `url(${itemUrl})`;
                ciboFrame.style.backgroundPosition = `0 0`;
                //Carico il pet
                const pet = JSON.parse(localStorage.getItem("pet"));
                let petFrame = document.getElementById("immaginePet");
                petFrame.dataset.tipo = "pet"
                petFrame.style.backgroundImage = `url(${pet.url})`;
                petFrame.style.backgroundPosition = `0 0`;
                //Rimuovo l'item dallo storage
                localStorage.removeItem("itemSelezionato");
                //avvio l'animazione
                await animazioneCibo();
            } else {
                //Stampo l'errore
                const divErrore = document.getElementById('message');
                divErrore.classList.add("attivo");
                divErrore.innerText = data.message;
            }
        //Se l'item è un gioco
        } else if (itemTipo === "gioco") {
            //Chiamo l'API gioca
            const aumentoStats = await fetch('/api/pet/gioca', {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_gioco: itemId })
            });

            //Attendo la risposta
            const data = await aumentoStats.json()

            //Se positiva:
            if (aumentoStats.ok) {
                //Carico il gioco
                let giocoFrame = document.getElementById("immagineItem");
                giocoFrame.dataset.tipo = "gioco";
                giocoFrame.style.backgroundImage = `url(${itemUrl})`;
                giocoFrame.style.backgroundPosition = `0 0`;
                //Carico il pet
                const pet = JSON.parse(localStorage.getItem("pet"));
                let petFrame = document.getElementById("immaginePet");
                petFrame.dataset.tipo = "pet"
                petFrame.style.backgroundImage = `url(${pet.url})`;
                petFrame.style.backgroundPosition = `0 0`;
                //Rimuovo l'item dal gioco
                localStorage.removeItem("itemSelezionato");
                //Avvio l'animazione
                await animazioneGioco();
            } else {
                //Stampo l'errore
                const divErrore = document.getElementById('message');
                divErrore.classList.add("attivo");
                divErrore.innerText = data.message;
            }
        }
    }

    //Se non c'è un item nel localStorage faccio la routine classica di decadimento
    //Chiamo l'API
    const res = await fetch('/api/pet', {
        method: 'PATCH',
        credentials: 'include'
    });

    //Attendo la risposta
    const data = await res.json();

    //Se positiva
    if (res.ok) {
        //Prendo il pet dalla risposta
        const pet = data.pet;
        //Lo carico nel localStorage solo se non c'è già
        if (!localStorage.getItem("pet")) {
            localStorage.setItem("pet", JSON.stringify({
                nome: pet.nome,
                url: pet.url_pet
            }));
        }
        //Carico il pet
        let petFrame = document.getElementById("immaginePet");
        petFrame.dataset.tipo = "pet"
        petFrame.style.backgroundImage = `url(${pet.url_pet})`;
        petFrame.style.backgroundPosition = `0 0`;
        //Avvio l'animazione
        startPetAnimation();
    } else {
        //Stampo l'errore
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message || "Errore del Server";
        console.log(divErrore);
    }
}