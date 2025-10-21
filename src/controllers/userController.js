//Import necessari
const pool = require("../servizi/servizioDB");
const bcrypt = require('bcryptjs');

//Handler per recuperare le informazioni dell'utente loggato
exports.getInfo = async (req, res) => {
    const userId = req.user.userId;

    try {
        //Recupero i dati dell'utente dal database
        const [rows] = await pool.promise().execute(
            "SELECT * FROM utenti WHERE id_utente = ?",
            [userId]
        );

        //Se non esiste l'utente ritorno errore
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Utente non trovato"
            });
        }

        const utente = rows[0];

        //Ritorno le informazioni dell'utente
        return res.status(200).json({
            success: true,
            message: "Informazioni utente recuperate con successo",
            utente: {
                username: utente.username,
                nome: utente.nome,
                cognome: utente.cognome,
                soldi: utente.soldi
            }
        });

    } catch (error) {
        //Se catturo un errore durante la procedura loggo e mando risposta negativa
        console.error("Errore nel recupero delle informazioni utente:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
};

//Handler per aggiornare nome e cognome dell'utente
exports.aggiornaInfo = async (req, res) => {
    const userId = req.user.userId;
    const { nome, cognome } = req.body;

    try {
        //Aggiorna i dati nel database
        const [result] = await pool.promise().execute(
            "UPDATE utenti SET nome = ?, cognome = ? WHERE id_utente = ?",
            [nome, cognome, userId]
        );

        //Se nessuna riga è stata aggiornata, utente non trovato
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Utente non trovato"
            });
        }

        //Ritorno No Content
        return res.status(204).send();

    } catch (error) {
        //Se catturo un errore durante la procedura loggo e mando risposta negativa
        console.error("Errore nell'aggiornamento delle informazioni utente:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
};

//Handler per cambiare la password dell'utente
exports.cambiaPassword = async (req, res) => {
    const userId = req.user.userId;
    const { vecchiaPassword, nuovaPassword } = req.body;
    const conn = await pool.promise().getConnection();

    try {
        await conn.beginTransaction();

        //Recupero la password attuale dell'utente
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

        //Verifico la vecchia password
        const passwordCorretta = await bcrypt.compare(vecchiaPassword, utente.password);
        if (!passwordCorretta) {
            await conn.rollback();
            return res.status(401).json({
                success: false,
                message: "Vecchia password non corretta"
            });
        }

        //Faccio hash della nuova password e aggiornamento nel database
        const hashedNuovaPassword = await bcrypt.hash(nuovaPassword, 10);
        await conn.execute(
            "UPDATE utenti SET password = ? WHERE id_utente = ?",
            [hashedNuovaPassword, userId]
        );

        await conn.commit();

        //Rimuovo il token dal client per forzare un nuovo login
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });

        //Ritorno No Content
        return res.status(204).send();

    } catch (error) {
        //Se catturo un errore durante la procedura loggo e mando risposta negativa
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

//Handler per eliminare l'utente dal db
exports.eliminaUtente = async (req, res) => {
    const userId = req.user.userId;
    const { password } = req.body;
    const conn = await pool.promise().getConnection();

    try {
        await conn.beginTransaction();

        //Recupero la password attuale dell'utente
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

        //Verifico la password inserita
        const passwordCorretta = await bcrypt.compare(password, utente.password);
        if (!passwordCorretta) {
            await conn.rollback();
            return res.status(401).json({
                success: false,
                message: "Password non corretta"
            });
        }

        //Elimino l'utente dal database
        await conn.execute("DELETE FROM utenti WHERE id_utente = ?", [userId]);

        await conn.commit();

        //Rimuovo il token dal client
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });

        //Ritorno No Content
        return res.status(204).send();

    } catch (error) {
        //Se catturo un errore durante la procedura loggo e mando risposta negativa
        await conn.rollback();
        console.error("Errore nell'eliminazione dell'utente:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    } finally {
        conn.release();
    }
};