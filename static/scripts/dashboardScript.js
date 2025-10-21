import { startPetAnimation, animazioneCibo, animazioneGioco } from '/scripts/animazioniScript.js';

window.onload = async () => {

    if (localStorage.getItem("itemSelezionato")) {
        const itemSelezionato = JSON.parse(localStorage.getItem("itemSelezionato"));
        const itemTipo = itemSelezionato.tipo;
        const itemId = itemSelezionato.id;
        const itemUrl = itemSelezionato.url
        if (itemTipo === "cibo") {
            const aumentoStats = await fetch('/api/pet/nutri', {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_cibo: itemId }),
            });

            const data = await aumentoStats.json()

            if (aumentoStats.ok) {
                let ciboFrame = document.getElementById("immagineItem");
                ciboFrame.dataset.tipo = "cibo";
                ciboFrame.style.backgroundImage = `url(${itemUrl})`;
                ciboFrame.style.backgroundPosition = `0 0`;
                const pet = JSON.parse(localStorage.getItem("pet"));
                let petFrame = document.getElementById("immaginePet");
                petFrame.dataset.tipo = "pet"
                petFrame.style.backgroundImage = `url(${pet.url})`;
                petFrame.style.backgroundPosition = `0 0`;
                localStorage.removeItem("itemSelezionato");
                await animazioneCibo();
            } else {
                const divErrore = document.getElementById('message');
                divErrore.classList.add("attivo");
                divErrore.innerText = data.message;
            }

        } else if (itemTipo === "gioco") {
            const aumentoStats = await fetch('/api/pet/gioca', {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_gioco: itemId })
            });

            const data = await aumentoStats.json()

            if (aumentoStats.ok) {
                let giocoFrame = document.getElementById("immagineItem");
                giocoFrame.dataset.tipo = "gioco";
                giocoFrame.style.backgroundImage = `url(${itemUrl})`;
                giocoFrame.style.backgroundPosition = `0 0`;

                const pet = JSON.parse(localStorage.getItem("pet"));
                let petFrame = document.getElementById("immaginePet");
                petFrame.dataset.tipo = "pet"
                petFrame.style.backgroundImage = `url(${pet.url})`;
                petFrame.style.backgroundPosition = `0 0`;
                localStorage.removeItem("itemSelezionato");
                await animazioneGioco();
            } else {
                const divErrore = document.getElementById('message');
                divErrore.classList.add("attivo");
                divErrore.innerText = data.message;
            }
        }
    }

    const res = await fetch('/api/pet', {
        method: 'PATCH',
        credentials: 'include'
    });

    const data = await res.json();

    if (res.ok) {
        const pet = data.pet;
        if (!localStorage.getItem("pet")) {
            localStorage.setItem("pet", JSON.stringify({
                nome: pet.nome,
                url: pet.url_pet
            }));
        }
        let petFrame = document.getElementById("immaginePet");
        petFrame.dataset.tipo = "pet"
        petFrame.style.backgroundImage = `url(${pet.url_pet})`;
        petFrame.style.backgroundPosition = `0 0`;
        startPetAnimation();
    } else {
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message || "Errore del Server";
        console.log(divErrore);
    }
}