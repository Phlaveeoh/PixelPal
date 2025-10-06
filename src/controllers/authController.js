const jwt = require("jsonwebtoken");
const pool = require("../servizi/servizioDB");
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT id_utente, username, password FROM utenti WHERE username = ?";

    try {
        const [righe] = await pool.promise().execute(query, [username]);
        const user = righe[0];

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Credenziali non valide"
            });
        }

        const passwordCorretta = await bcrypt.compare(password, user.password);
        if (!passwordCorretta) {
            return res.status(401).json({
                success: false,
                message: "Credenziali non valide"
            });
        }

        const payload = {
            userId: user.id_utente,
            userName: user.username,
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: "1h"
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
            sameSite: "Strict"
        });

        return res.status(200).json({
            success: true,
            message: "Login riuscito"
        });
    }
    catch (error) {
        console.error("Errore durante il login:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
    finally {
        pool.release();
    }
};

exports.register = async (req, res) => {
    const { username, password, confermaPassword } = req.body;
    if (password !== confermaPassword) {
        return res.status(400).json({
            success: false,
            message: "Le password non corrispondono"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO utenti (username, password) VALUES (?, ?)";

    try {

        const [righe] = await pool.promise().execute("SELECT id_utente FROM utenti WHERE username = ?", [username]);
        if (righe.length !== 0) {
            return res.status(409).json({
                success: false,
                message: "Username già in uso"
            });
        }

        const [result] = await pool.promise().execute(query, [username, hashedPassword]);
        const payload = {
            userId: result.insertId,
            userName: username,
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: "1h"
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
            sameSite: "Strict"
        });
        return res.status(201).json({
            success: true,
            message: "Registrazione avvenuta con successo"
        });
    }
    catch (error) {
        console.error("Errore durante la registrazione:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
    finally {
        pool.release();
    }
};

exports.logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
    });
    res.status(204).send();
};