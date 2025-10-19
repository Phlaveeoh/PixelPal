window.onload = async () => {
    // Funzione per aggiornare lo stato
    const res = await fetch('http://localhost:3000/api/pet/stato', {
        method: 'GET',
        credentials: 'include'
    });

    if (res.ok) {
        const data = await res.json();
        const stato = data.stato;
        const barre = document.querySelectorAll(".status-bar");
        barre[0].style.setProperty('--status-value', stato.fame);
        barre[1].style.setProperty('--status-value', stato.felicita);

        const pet = JSON.parse(localStorage.getItem("pet"));
        document.getElementById("nomePet").innerText = pet.nome;
    } else {
        console.log("Errore nel recupero dello stato");
    }
};