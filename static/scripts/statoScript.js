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
        const riempimenti = document.querySelectorAll(".status-fill");
        barre[0].style.setProperty('--status-value', stato.fame);
        barre[1].style.setProperty('--status-value', stato.felicita);

        if (stato.fame <= 10) {
            riempimenti[0].style.backgroundColor = 'red';
        } else if (stato.fame <= 50) {
            riempimenti[0].style.backgroundColor = 'yellow';
        } else {
            riempimenti[0].style.backgroundColor = 'green';
        }

        if (stato.felicita <= 10) {
            riempimenti[1].style.backgroundColor = 'red';
        } else if (stato.felicita <= 50) {
            riempimenti[1].style.backgroundColor = 'yellow';
        } else {
            riempimenti[1].style.backgroundColor = 'green';
        }

        const pet = JSON.parse(localStorage.getItem("pet"));
        document.getElementById("nomePet").innerText = pet.nome;
    } else {
        console.log("Errore nel recupero dello stato");
    }
};