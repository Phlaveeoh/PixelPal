//Al caricamento della pagina:
window.onload = async () => {
    //Chiamo l'API
    const res = await fetch('/api/pet/stato', {
        method: 'GET',
        credentials: 'include'
    });

    //Attendo la risposta
    const data = await res.json();

    //Se positiva:
    if (res.ok) {
        //Carico la barra e calcolo il giusto riempimento
        const stato = data.stato;
        const barre = document.querySelectorAll(".status-bar");
        const riempimenti = document.querySelectorAll(".status-fill");
        barre[0].style.setProperty('--status-value', stato.fame);
        barre[1].style.setProperty('--status-value', stato.felicita);

        //Coloro le barre in base al loro valore
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

        //Stampo a schermo il nome del pet
        const pet = JSON.parse(localStorage.getItem("pet"));
        document.getElementById("nomePet").innerText = pet.nome;
    } else {
        //Stampo l'errore
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message;
    }
};