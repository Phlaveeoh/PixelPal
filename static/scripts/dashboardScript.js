import { startPetAnimation, animazioneCibo, animazioneGioco } from '/scripts/animazioniScript.js';

window.onload = async () => {

    if (localStorage.getItem("itemSelezionato")) {
        const itemSelezionato = JSON.parse(localStorage.getItem("itemSelezionato"));
        const itemTipo = itemSelezionato.tipo;
        const itemId = itemSelezionato.id;
        const itemUrl = itemSelezionato.url
        if (itemTipo === "cibo") {
            const aumentoStats = await fetch('http://localhost:3000/api/pet/nutri', {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_cibo: itemId }),
            });
            if (aumentoStats.ok) {
                const data = await aumentoStats.json()
                console.log(data.message);
                console.log(itemUrl);
                let ciboFrame = document.getElementById("immagineItem");
                ciboFrame.dataset.tipo = "cibo";
                ciboFrame.style.backgroundImage = `url(${itemUrl})`;
                ciboFrame.style.backgroundPosition = `0 0`;

                const pet = JSON.parse(localStorage.getItem("pet"));
                let petFrame = document.getElementById("immaginePet");
                petFrame.dataset.tipo = "pet"
                petFrame.style.backgroundImage = `url(${pet.url})`;
                petFrame.style.backgroundPosition = `0 0`;

                await animazioneCibo();
            }
        } else if (itemTipo === "gioco") {
            const aumentoStats = await fetch('http://localhost:3000/api/pet/gioca', {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_gioco: itemId })
            });
            if (aumentoStats.ok) {
                const data = await aumentoStats.json()
                console.log(data.message);
                let giocoFrame = document.getElementById("immagineItem");
                giocoFrame.dataset.tipo = "gioco";
                giocoFrame.style.backgroundImage = `url(${itemUrl})`;
                giocoFrame.style.backgroundPosition = `0 0`;

                const pet = JSON.parse(localStorage.getItem("pet"));
                let petFrame = document.getElementById("immaginePet");
                petFrame.dataset.tipo = "pet"
                petFrame.style.backgroundImage = `url(${pet.url})`;
                petFrame.style.backgroundPosition = `0 0`;

                await animazioneGioco();
            }
        }
    }
    localStorage.removeItem("itemSelezionato");

    const res = await fetch('http://localhost:3000/api/pet', {
        method: 'PATCH',
        credentials: 'include'
    });

    if (res.ok) {
        const data = await res.json();
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
    }
}