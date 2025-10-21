const express = require("express");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const { authenticateToken } = require('./src/servizi/servizioAutenticazione');

const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(express.json());

app.use(express.static("static/public"));
app.use("/scripts", express.static("static/scripts"));
app.use("/stylesheets", express.static("static/stylesheets"));
app.use("/immagini", express.static("static/immagini"));
app.use("/fonts", express.static("static/fonts"))
app.use("/private", authenticateToken, express.static("static/private"));

// Configurazione delle rotte API
const authRouter = require('./src/routers/authRouter');
app.use('/api/auth', authRouter);

const petRouter = require('./src/routers/petRouter');
app.use('/api/pet', petRouter);

const userRouter = require('./src/routers/userRouter');
app.use('/api/user', userRouter);

const itemRouter = require('./src/routers/itemRouter');
app.use('/api/item', itemRouter);


// Avvia il server
// Ascolta su '0.0.0.0' per essere accessibile all'interno del container Docker
app.listen(port, '0.0.0.0', () => {
    console.log("Server attivo su http://localhost:" + port);
});
