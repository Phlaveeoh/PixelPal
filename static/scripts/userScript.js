//Prendo gli elementi cliccabili e gli assegno gli handler
document.getElementById('update-btn').addEventListener('click', handleUpdateInfo);
document.getElementById('logout-btn').addEventListener('click', handleLogout);
document.getElementById('confirm-delete').addEventListener('click', handleDeleteUser);
document.getElementById('passwordForm').addEventListener('submit', handleCambiaPassword);
document.getElementById('adotta-btn').addEventListener('click', handleAdozione);
document.getElementById('libera-btn').addEventListener('click', handleLiberazione);

//Handler per aggiornare le info dell'utente
async function handleUpdateInfo() {
    //Prendo i valori dal form
    const nome = document.getElementById('nome').value;
    const cognome = document.getElementById('cognome').value;

    //Chiamo l'API
    const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cognome }),
        credentials: 'include'
    });

    //Se ok:
    if (res.ok) {
        //Ricarico la pagina
        location.reload();
    } else {
        //Stampo l'errore
        const data = await res.json();
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message;
    }
}

//Handler per il logout
async function handleLogout() {
    //Chiamo l'API
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    //Se ok:
    if (res.ok) {
        //Ricarico la pagina, ha lo stesso effetto di reindirizzare al login.html senza il token
        location.reload();
    } else {
        //Stampo l'errore
        const data = await res.json();
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message;
    }
}

//Handle per eliminare un utente
async function handleDeleteUser() {
    //Prendo la passwords
    const password = document.getElementById('confermaPassword').value;
    if (!password) {
        return;
    }

    //Chiamo l'API
    const res = await fetch('/api/user/elimina', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });

    //Se ok:
    if (res.ok) {
        //Ricarico la pagina, ha lo stesso effetto di reindirizzare al login.html senza il token
        location.reload();
    } else {
        //Stampo l'errore
        const data = await res.json();
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message;
    }
}

//Handle per cambiare password
async function handleCambiaPassword(event) {
    event.preventDefault();

    //Prendo i parametri dal form
    const passwordAttuale = document.getElementById('passwordAttuale').value;
    const passwordNuova = document.getElementById('passwordNuova').value;
    const confermaPasswordNuova = document.getElementById('confermaPasswordNuova').value;

    //Se password coincidono
    if (passwordNuova === confermaPasswordNuova) {
        //Chiamo l'API
        const res = await fetch('/api/user/cambiaPassword', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ vecchiaPassword: passwordAttuale, nuovaPassword: passwordNuova }),
        });

        if (res.ok) {
            //Ricarico la pagina, ha lo stesso effetto di reindirizzare al login.html senza il token
            location.reload();
        } else {
            //Stampo l'errore
            const data = await res.json();
            const divErrore = document.getElementById('message');
            divErrore.classList.add("attivo");
            divErrore.innerText = data.message;
        }
    } else {
        //Stampo errore
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = "Le due nuove password devono coincidere!";
    }
}

//Handle per adottare un nuovo pet
async function handleAdozione() {
    //Chiamo l'API
    const res = await fetch('/api/pet/adotta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    //Attendo la risposta
    const data = await res.json();

    //Se ok:
    if (res.ok) {
        //Reindirizzo alla dashboard
        window.location.href = '/private/dashboard.html';
    } else {
        //Stampo l'errore
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message;
    }
}

//Handle per liberare un pet
async function handleLiberazione() {
    //Chiamo l'API
    const res = await fetch('/api/pet/libera', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    //Attendo la risposta
    const data = await res.json();

    //Se ok:
    if (res.ok) {
        //Pulisco il localStorage
        localStorage.clear();
        //Reindirizzo alla dashboard
        window.location.href = '/private/dashboard.html';
    } else {
        //Stampo l'errore
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message;
    }
}

//Al caricamento della pagina:
window.onload = async () => {

    //Chiamo l'API
    const res = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include'
    });

    //Attendo la risposta
    const data = await res.json();

    //Se ok:
    if (res.ok) {
        //Carico i dati dell'utente nel form
        const utente = data.utente;
        document.getElementById("username").value = utente.username;
        document.getElementById("nome").value = utente.nome;
        document.getElementById("cognome").value = utente.cognome;
    } else {
        //Stampo l'errore
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message;
    }
}

// Gestione dei tab
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');

        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});


//Gestione del popup
const deleteBtn = document.getElementById('delete-btn');
const popup = document.getElementById('delete-popup');
const cancelDelete = document.getElementById('cancel-delete');

deleteBtn.addEventListener('click', () => {
    popup.classList.remove('hidden');
});

cancelDelete.addEventListener('click', () => {
    popup.classList.add('hidden');
});