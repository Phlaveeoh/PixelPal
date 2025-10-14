let larghezzaFrame = 32;

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
        console.log(pet);
        let petFrame = document.getElementById("immaginePet");
        petFrame.style.backgroundImage = `url(${pet.url_pet})`;
        petFrame.style.backgroundPosition = `${-0 * larghezzaFrame}px 0`;

        //SOLUZIONE TEMPORANEA DA METTERE IN UN FILE A PARTE DOVE GESTIRE LE ANIMAZIONI ED IL MOVIMENTO
        const area = document.getElementById("areaPet");

        let x = 0;
        let y = 0;

        function muovi(dx, dy) {
            const maxX = area.clientWidth - 32;
            const maxY = area.clientHeight - 32;

            x = Math.max(0, Math.min(maxX, x + dx));
            y = Math.max(0, Math.min(maxY, y + dy));

            petFrame.style.left = `${x}px`;
            petFrame.style.top = `${y}px`;
        }

        // esempio: movimento automatico
        setInterval(() => {
            const dx = (Math.random() - 0.5) * 20;
            const dy = (Math.random() - 0.5) * 20;
            muovi(dx, dy);
        }, 50);

    }
}