const pool = require("../servizi/servizioDB");
const bcrypt = require('bcryptjs');

exports.getInfo = async (req, res) => {
    const userId = req.user.userId;
    try {
        const [rows] = await pool.promise().execute("SELECT * FROM utenti WHERE id_utente = ?", [userId]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Utente non trovato"
            });
        }
        utente = rows[0];
        return res.status(200).json({
            success: true,
            message: "Informazioni utente recuperate con successo",
            utente: {
                nome: utente.nome,
                cognome: utente.cognome,
                soldi: utente.soldi
            }
        });
    }
    catch (error) {
        console.error("Errore nel recupero delle informazioni utente:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
};

exports.aggiornaInfo = async (req, res) => {
    const userId = req.user.userId;
    const { nome, cognome } = req.body;
    try {
        const [result] = await pool.promise().execute(
            "UPDATE utenti SET nome = ?, cognome = ? WHERE id_utente = ?",
            [nome, cognome, userId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Utente non trovato"
            });
        }
        return res.status(204).send();
    }
    catch (error) {
        console.error("Errore nell'aggiornamento delle informazioni utente:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
};

exports.cambiaPassword = async (req, res) => {
    const userId = req.user.userId;
    const { vecchiaPassword, nuovaPassword } = req.body;
    const conn = await pool.promise().getConnection();
    try {
        await conn.beginTransaction();
        const [rows] = await conn.execute(
            "SELECT password FROM utenti WHERE id_utente = ?",
            [userId]
        );

        if (rows.length === 0) {
            conn.rollback();
            return res.status(404).json({
                success: false,
                message: "Utente non trovato"
            });
        }

        const utente = rows[0];
        const passwordCorretta = await bcrypt.compare(vecchiaPassword, utente.password);

        if (!passwordCorretta) {
            await conn.rollback();
            return res.status(401).json({
                success: false,
                message: "Vecchia password non corretta"
            });
        }

        const hashedNuovaPassword = await bcrypt.hash(nuovaPassword, 10);
        await conn.execute(
            "UPDATE utenti SET password = ? WHERE id_utente = ?",
            [hashedNuovaPassword, userId]
        );

        await conn.commit();

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });
        return res.status(204).send();
    }
    catch (error) {
        await conn.rollback();
        console.error("Errore nel cambio della password:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    } finally {
        conn.release();
    }
};

exports.eliminaUtente = async (req, res) => {
    const userId = req.user.userId;
    const { password } = req.body;
    const conn = await pool.promise().getConnection();

    try {
        await conn.beginTransaction();

        const [rows] = await conn.execute(
            "SELECT password FROM utenti WHERE id_utente = ?",
            [userId]
        );
        if (rows.length === 0) {
            await conn.rollback();
            return res.status(404).json({
                success: false,
                message: "Utente non trovato"
            });
        }
        const utente = rows[0];
        const passwordCorretta = await bcrypt.compare(password, utente.password);
        if (!passwordCorretta) {
            await conn.rollback();
            return res.status(401).json({
                success: false,
                message: "Password non corretta"
            });
        }

        await conn.execute("DELETE FROM utenti WHERE id_utente = ?", [userId]);

        await conn.commit();

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });
        res.status(204).send();
    }
    catch (error) {
        await conn.rollback();
        console.error("Errore nell'eliminazione dell'utente:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
    finally {
        conn.release();
    }
};