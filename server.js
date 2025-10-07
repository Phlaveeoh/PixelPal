const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
require('dotenv').config();
const { authenticateToken } = require('./src/servizi/servizioAutenticazione');

app.use(cookieParser());
app.use(express.json());

app.use(express.static("static/public"));
app.use("private", authenticateToken, express.static("static/private"));

// Configurazione delle rotte API
const authRoutes = require('./src/routers/authRouter');
app.use('/api/auth', authRoutes);

const petRoutes = require('./src/routers/petRouter');
app.use('/api/pet', petRoutes);


// Avvia il server
// Ascolta su '0.0.0.0' per essere accessibile all'interno del container Docker
app.listen(port, '0.0.0.0', () => {
    console.log("--------------------------------------------------");
    console.log("Server attivo su http://localhost:" + port);
    console.log("Accesso frontend via /");
    console.log("--------------------------------------------------");
});
