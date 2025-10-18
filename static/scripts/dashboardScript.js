import { startPetAnimation } from '/scripts/animazioniScript.js';

window.onload = async () => {

    if (localStorage.getItem("itemSelezionato")) {
        const itemSelezionato = JSON.parse(localStorage.getItem("itemSelezionato"));
        const itemTipo = itemSelezionato.tipo;
        const itemId = itemSelezionato.id;
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
                //ANIMAZIONE CIBO
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
                //ANIMAZIONE Gioco
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
        localStorage.setItem("nomePet", pet.nome);
        let petFrame = document.getElementById("immaginePet");
        petFrame.dataset.tipo = "pet"
        petFrame.style.backgroundImage = `url(${pet.url_pet})`;
        petFrame.style.backgroundPosition = `${-0 * 32}px 0`;
        startPetAnimation();
    }
}