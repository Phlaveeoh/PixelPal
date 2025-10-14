window.onload = async () => {
    // Funzione per aggiornare lo stato
    const res = await fetch('http://localhost:3000/api/pet/stato', {
        method: 'GET',
        credentials: 'include'
    });

    if (res.ok) {
        const data = await res.json();
        const stato = data.stato;
        document.getElementById("fame").innerText = stato.fame;
        document.getElementById("felicita").innerText = stato.felicita;
    } else {
        console.log("Errore nel recupero dello stato");
    }
};