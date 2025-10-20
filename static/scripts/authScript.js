document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('registerForm').addEventListener('submit', handleRegister);

async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });

    const data = await res.json();

    if (res.ok) {
        window.location.href = '/private/dashboard.html';
    } else {
        document.getElementById('message').innerText = data.message;
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confermaPassword = document.getElementById('registerConfermaPassword').value;

    if (password !== confermaPassword) {
        document.getElementById('message').innerText = 'Le password non corrispondono';
        return;
    }

    const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });

    const data = await res.json();

    if (res.ok) {
        window.location.href = '/private/dashboard.html';
    } else {
        document.getElementById('message').innerText = data.message;
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