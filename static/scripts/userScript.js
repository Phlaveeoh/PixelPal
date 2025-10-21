document.getElementById('update-btn').addEventListener('click', handleUpdateInfo);
document.getElementById('logout-btn').addEventListener('click', handleLogout);
document.getElementById('delete-btn').addEventListener('click', handleDeleteUser);
document.getElementById('passwordForm').addEventListener('submit', handleCambiaPassword);
document.getElementById('adotta-btn').addEventListener('click', handleAdozione);
document.getElementById('libera-btn').addEventListener('click', handleLiberazione);

async function handleUpdateInfo() {
    const nome = document.getElementById('nome').value;
    const cognome = document.getElementById('cognome').value;

    const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cognome }),
        credentials: 'include'
    });

    if (res.ok) {
        location.reload();
    } else {
        const data = await res.json();
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message;
    }
}

async function handleLogout() {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    if (res.ok) {
        location.reload();
    } else {
        const data = await res.json();
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message;
    }
}

async function handleDeleteUser() {
}

async function handleCambiaPassword(event) {
    event.preventDefault();

    const passwordAttuale = document.getElementById('passwordAttuale').value;
    const passwordNuova = document.getElementById('passwordNuova').value;
    const confermaPasswordNuova = document.getElementById('confermaPasswordNuova').value;
    if (passwordNuova === confermaPasswordNuova) {
        const res = await fetch('/api/user/cambiaPassword', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ vecchiaPassword: passwordAttuale, nuovaPassword: passwordNuova }),
        });

        const data = await res.json();

        if (res.ok) {
            location.reload();
        } else {
            const divErrore = document.getElementById('message');
            divErrore.classList.add("attivo");
            divErrore.innerText = data.message;
        }
    } else {
        document.getElementById("message").innerText = "Le due nuove password devono essere le stesse!";
    }
}

async function handleAdozione() {
    const res = await fetch('/api/pet/adotta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    const data = await res.json();

    if (res.ok) {
        window.location.href = '/private/dashboard.html';
    } else {
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message;
    }
}

async function handleLiberazione() {
    const res = await fetch('/api/pet/libera', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    if (res.ok) {
        localStorage.clear();
        window.location.href = '/private/dashboard.html';
    } else {
        const data = await res.json();
        document.getElementById("message").innerText = data.message;
    }
}

window.onload = async () => {
    const res = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include'
    });

    const data = await res.json();

    if (res.ok) {
        const utente = data.utente;
        document.getElementById("username").value = utente.username;
        document.getElementById("nome").value = utente.nome;
        document.getElementById("cognome").value = utente.cognome;
    } else {
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
const confirmDelete = document.getElementById('confirm-delete');

deleteBtn.addEventListener('click', () => {
    popup.classList.remove('hidden');
});

cancelDelete.addEventListener('click', () => {
    popup.classList.add('hidden');
});

confirmDelete.addEventListener('click', async () => {
    const password = document.getElementById('confermaPassword').value;
    if (!password) {
        return;
    }

    const res = await fetch('/api/user/elimina', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });

    if (res.ok) {
        location.reload();
    } else {
        const data = await res.json();
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message;
    }
});