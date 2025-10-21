//Prendo dal DOM i due form e li lego al loro handler
document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('registerForm').addEventListener('submit', handleRegister);

//Handler per il login
async function handleLogin(event) {
    event.preventDefault(); //Blocco il comportamento default del form

    //Prendo i parametri inseriti dall'utente
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    //Invio la richiesta all'API
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });

    //Attendo la risposta
    const data = await res.json();

    if (res.ok) {
        //Se positiva reindirizzo alla dashboard
        window.location.href = '/private/dashboard.html';
    } else {
        //Stampo l'errore
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message;
    }
}

//Handler della registrazione
async function handleRegister(event) {
    event.preventDefault(); //Blocco il comportamento default del form

    //Prendo i parametri inseriti dall'utente
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confermaPassword = document.getElementById('registerConfermaPassword').value;

    //Se le due password non coincidono lo scrivo
    if (password !== confermaPassword) {
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = "Le due password non corrispondono";
        return;
    }

    //Invio la richiesta all'API
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });

    //Attendo la risposta
    const data = await res.json();

    if (res.ok) {
        //Se positiva reindirizzo alla dashboard
        window.location.href = '/private/dashboard.html';
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

//Ad ogni tab-button assegno un event listener, quando si verifica l'evento la tab corrispondente al bottone diventa attiva
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');

        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});