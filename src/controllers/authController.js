//Import necessari
const jwt = require("jsonwebtoken");
const pool = require("../servizi/servizioDB");
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;

//Handler del login
exports.login = async (req, res) => {
    //Prendo i parametri dal body e costruisco la query al db
    const { username, password } = req.body;
    const query = "SELECT id_utente, username, password FROM utenti WHERE username = ?";

    try {
        //Provo ad eseguire la query
        const [righe] = await pool.promise().execute(query, [username]);
        const user = righe[0];

        //Se non restituisce nulla significa che quell'utente non esiste
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Credenziali non valide"
            });
        }

        //Valido la password con quella inserita nel db
        const passwordCorretta = await bcrypt.compare(password, user.password);
        if (!passwordCorretta) {
            return res.status(401).json({
                success: false,
                message: "Credenziali non valide"
            });
        }

        //Creo il payload del token JWT
        const payload = {
            userId: user.id_utente,
            userName: user.username,
        };

        //Creo il token
        const token = jwt.sign(payload, JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: "1h"
        });

        //Invio il token al client
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
            sameSite: "Strict"
        });

        //Invio risposta positiva
        return res.status(200).json({
            success: true,
            message: "Login riuscito"
        });
    }
    catch (error) {
        //Se catturo un errore durante la procedura loggo e mando risposta negativa
        console.error("Errore durante il login:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
};

//Handle della registrazione
exports.register = async (req, res) => {
    //Prendo parametri dal body e costruisco la connessione
    const { username, password } = req.body;
    const conn = await pool.promise().getConnection();

    try {
        //Avvio la transazione
        await conn.beginTransaction();
        //Query per vedere se l'username è disponibile
        const [righe] = await conn.execute("SELECT id_utente FROM utenti WHERE username = ?", [username]);
        //Se non disponibile mando errore
        if (righe.length !== 0) {
            await conn.rollback();
            return res.status(409).json({
                success: false,
                message: "Username già in uso"
            });
        }

        //Creo l'hash della password e faccio la insert nel database
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await conn.execute("INSERT INTO utenti (username, password) VALUES (?, ?)", [username, hashedPassword]);

        //Commit delle modifiche
        await conn.commit();

        //Creo il payload del token
        const payload = {
            userId: result.insertId,
            userName: username,
        };

        //Creo il token JWT
        const token = jwt.sign(payload, JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: "1h"
        });

        //Invio il cookie al client
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
            sameSite: "Strict"
        });

        //Invio risposta positiva
        return res.status(201).json({
            success: true,
            message: "Registrazione avvenuta con successo"
        });
    }
    catch (error) {
        //Se catturo un errore durante la procedura loggo e mando risposta negativa
        await conn.rollback();
        console.error("Errore durante la registrazione:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
    finally {
        //Rilascio la connessione alla fine di tutto
        conn.release();
    }
};

//Handler del logout
exports.logout = async (req, res) => {
    //Semplicemente rimuovo il cookie dal client
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
    });
    res.status(204).send();
};