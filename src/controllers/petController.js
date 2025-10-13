const pool = require("../servizi/servizioDB");
const { decadimentoPet, aumentaFamePet, aumentaFelicitaPet } = require('../servizi/servizioPet');

exports.decadimento = async (req, res) => {
    const id_utente = req.user.userId;
    const conn = await pool.promise().getConnection();
    try {
        await conn.beginTransaction();
        // Recupera il pet attivo dell'utente
        const [righe] = await conn.execute("SELECT id_pet_utente, nome, url_pet, fame, felicita, tasso_di_fame, tasso_di_felicita, ultimo_cibo, ultimo_gioco, attivo FROM pet_utente INNER JOIN pets ON pet_utente.id_pet = pets.id_pet WHERE id_utente = ? AND pet_utente.attivo = 1",
            [id_utente]);
        if (righe.length === 0) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Nessun pet attivo",
                pet: null
            });
        }
        pet = righe[0];
        pet = decadimentoPet(pet);
        await conn.execute("UPDATE pet_utente SET fame = ?, felicita = ?, ultimo_cibo = ?, ultimo_gioco = ? WHERE id_pet_utente = ? AND attivo = 1",
            [pet.fame, pet.felicita, pet.ultimo_cibo, pet.ultimo_gioco, pet.id_pet_utente]);

        await conn.commit();

        return res.status(200).json({
            success: true,
            message: "Pet attivo trovato",
            pet: {
                nome: pet.nome,
                url_pet: pet.url_pet,
                attivo: pet.attivo
            }
        });

    } catch (error) {
        await conn.rollback();
        console.error("Errore durante il recupero del pet:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    } finally {
        conn.release();
    }
};

exports.stato = async (req, res) => {
    const id_utente = req.user.userId;
    try {
        const [righe] = await pool.promise().execute("SELECT fame, felicita FROM pet_utente WHERE id_utente = ? AND pet_utente.attivo = 1",
            [id_utente]);
        if (righe.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Nessun pet attivo",
                stato: null
            });
        }
        const stato = righe[0];
        return res.status(200).json({
            success: true,
            message: "Stato del pet recuperato con successo",
            stato: stato
        });
    } catch (error) {
        console.error("Errore durante il recupero dello stato del pet:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
};

exports.nutri = async (req, res) => {
    let pet;
    const id_utente = req.user.userId;
    const id_cibo = req.body.id_cibo;
    if (!id_cibo) {
        return res.status(400).json({
            success: false,
            message: "ID cibo mancante"
        });
    }

    const conn = await pool.promise().getConnection();
    try {
        await conn.beginTransaction();

        // Recupera i soldi dell'utente
        const [utente] = await conn.execute("SELECT soldi FROM utenti WHERE id_utente = ?", [id_utente]);
        if (utente.length === 0) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Utente non trovato"
            });
        }
        const soldiUtente = utente[0].soldi;

        // Recupera il costo del cibo
        const [cibi] = await conn.execute("SELECT effetto_fame, costo FROM cibi WHERE id_cibo = ?", [id_cibo]);
        if (cibi.length === 0) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Cibo non trovato"
            });
        }
        cibo = cibi[0];

        // Controlla se l'utente ha abbastanza soldi
        if (soldiUtente < cibo.costo) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Soldi insufficienti"
            });
        }
        // Deduce il costo del cibo dai soldi dell'utente
        const nuoviSoldi = soldiUtente - cibo.costo;
        await conn.execute("UPDATE utenti SET soldi = ? WHERE id_utente = ?", [nuoviSoldi, id_utente]);

        // Recupera il pet attivo dell'utente
        const [pets] = await conn.execute("SELECT id_pet_utente, fame, ultimo_cibo FROM pet_utente WHERE id_utente = ? AND pet_utente.attivo = 1",
            [id_utente]);
        if (pets.length === 0) {
            await conn.rollback();
            return res.status(200).json({
                success: true,
                message: "Nessun pet attivo",
                pet: null
            });
        }
        pet = pets[0];

        // Aumenta la fame del pet
        pet = aumentaFamePet(pet, cibo);
        await conn.execute("UPDATE pet_utente SET fame = ?, ultimo_cibo = ? WHERE id_pet_utente = ? AND attivo = 1",
            [pet.fame, pet.ultimo_cibo, pet.id_pet_utente]);

        await conn.commit();

        return res.status(200).json({
            success: true,
            message: "Pet nutrito con successo",
            url_cibo: cibo.url_cibo
        });

    } catch (error) {
        await conn.rollback();
        console.error("Errore durante la nutrizione del pet:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    } finally {
        conn.release();
    }
};

exports.gioca = async (req, res) => {
    let pet;
    const id_utente = req.user.userId;
    const id_gioco = req.body.id_gioco;
    if (!id_gioco) {
        return res.status(400).json({
            success: false,
            message: "ID gioco mancante"
        });
    }

    const conn = await pool.promise().getConnection();
    try {
        await conn.beginTransaction();

        // Recupera i soldi dell'utente
        const [utente] = await conn.execute("SELECT soldi FROM utenti WHERE id_utente = ?", [id_utente]);
        if (utente.length === 0) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Utente non trovato"
            });
        }
        const soldiUtente = utente[0].soldi;

        // Recupera il costo del gioco
        const [giochi] = await conn.execute("SELECT effetto_felicita, costo FROM giochi WHERE id_gioco = ?", [id_gioco]);
        if (giochi.length === 0) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Gioco non trovato"
            });
        }
        gioco = giochi[0];

        // Controlla se l'utente ha abbastanza soldi
        if (soldiUtente < gioco.costo) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Soldi insufficienti"
            });
        }
        // Deduce il costo del gioco dai soldi dell'utente
        const nuoviSoldi = soldiUtente - gioco.costo;
        await conn.execute("UPDATE utenti SET soldi = ? WHERE id_utente = ?", [nuoviSoldi, id_utente]);

        // Recupera il pet attivo dell'utente
        const [pets] = await conn.execute("SELECT id_pet_utente, felicita, ultimo_gioco FROM pet_utente WHERE id_utente = ? AND pet_utente.attivo = 1",
            [id_utente]);
        if (pets.length === 0) {
            await conn.rollback();
            return res.status(200).json({
                success: true,
                message: "Nessun pet attivo",
                pet: null
            });
        }
        pet = pets[0];

        // Aumenta la felicità del pet
        pet = aumentaFelicitaPet(pet, gioco);
        await conn.execute("UPDATE pet_utente SET felicita = ?, ultimo_gioco = ? WHERE id_pet_utente = ? AND attivo = 1",
            [pet.felicita, pet.ultimo_gioco, pet.id_pet_utente]);

        await conn.commit();

        return res.status(200).json({
            success: true,
            message: "Il pet ha giocato con successo",
            url_gioco: gioco.url_gioco
        });

    } catch (error) {
        await conn.rollback();
        console.error("Errore durante il gioco del pet:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    } finally {
        conn.release();
    }
};

exports.adotta = async (req, res) => {
    const id_utente = req.user.userId;
    const conn = await pool.promise().getConnection();
    try {
        await conn.beginTransaction();

        // Controlla se l'utente ha già un pet attivo
        const [petsAttivi] = await conn.execute(
            "SELECT COUNT(*) AS count FROM pet_utente WHERE id_utente = ? AND attivo = 1",
            [id_utente]
        );

        if (petsAttivi[0].count > 0) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Hai già un pet attivo"
            });
        }

        // Se non ha un pet attivo, seleziona un pet casuale dalla tabella pets
        const [righe] = await conn.execute("SELECT id_pet, nome, fame_base, felicita_base, url_pet FROM pets");

        pet_casuale = righe[Math.floor(Math.random() * righe.length)];

        const [result] = await conn.execute("INSERT INTO pet_utente (id_utente, id_pet, fame, felicita, attivo) VALUES (?, ?, ?, ?, 1)",
            [id_utente, pet_casuale.id_pet, pet_casuale.fame_base, pet_casuale.felicita_base]);

        if (result.affectedRows !== 1) {
            throw new Error("Inserimento non riuscito");
        }

        await conn.commit();

        return res.status(200).json({
            success: true,
            message: "Hai adottato un nuovo pet!",
            pet: pet_casuale
        });
    } catch (error) {
        await conn.rollback();
        console.error("Errore durante l'adozione del pet:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    } finally {
        conn.release();
    }
};