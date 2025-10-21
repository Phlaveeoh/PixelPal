//Import necessari
const pool = require("../servizi/servizioDB");
const { decadimentoPet, aumentaFamePet, aumentaFelicitaPet } = require('../servizi/servizioPet');

//Handler per applicare il decadimento automatico al pet attivo dell'utente
exports.decadimento = async (req, res) => {
    const id_utente = req.user.userId;
    const conn = await pool.promise().getConnection();

    try {
        await conn.beginTransaction();

        //Recupera il pet attivo dell'utente
        const [righe] = await conn.execute(
            "SELECT id_pet_utente, nome, url_pet, fame, felicita, tasso_di_fame, tasso_di_felicita, ultimo_cibo, ultimo_gioco, attivo " +
            "FROM pet_utente INNER JOIN pets ON pet_utente.id_pet = pets.id_pet WHERE id_utente = ? AND pet_utente.attivo = 1",
            [id_utente]
        );

        //Se non c'è nessun pet attivo ritorna errore
        if (righe.length === 0) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Nessun pet attivo",
                pet: null
            });
        }

        //Applico il decadimento al pet
        pet = decadimentoPet(righe[0]);

        //Aggiorno i valori del pet nel database
        await conn.execute(
            "UPDATE pet_utente SET fame = ?, felicita = ?, ultimo_cibo = ?, ultimo_gioco = ? WHERE id_pet_utente = ? AND attivo = 1",
            [pet.fame, pet.felicita, pet.ultimo_cibo, pet.ultimo_gioco, pet.id_pet_utente]
        );

        await conn.commit();

        //Ritorno il pet aggiornato
        return res.status(200).json({
            success: true,
            message: "Pet attivo trovato",
            pet: {
                nome: pet.nome,
                url: pet.url_pet,
                attivo: pet.attivo
            }
        });

    } catch (error) {
        //Se catturo un errore durante la procedura loggo e mando risposta negativa
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

//Handler per recuperare lo stato (fame e felicità) del pet attivo
exports.stato = async (req, res) => {
    const id_utente = req.user.userId;

    try {
        //Recupero i parametri
        const [righe] = await pool.promise().execute(
            "SELECT fame, felicita FROM pet_utente WHERE id_utente = ? AND attivo = 1",
            [id_utente]
        );

        //Se nessun pet attivo restituisco l'errore
        if (righe.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Nessun pet attivo",
                stato: null
            });
        }

        //Ritorno lo stato del pet
        return res.status(200).json({
            success: true,
            message: "Stato del pet recuperato con successo",
            stato: righe[0]
        });

    } catch (error) {
        console.error("Errore durante il recupero dello stato del pet:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
};

//Handler per nutrire il pet attivo con un certo cibo
exports.nutri = async (req, res) => {
    const id_utente = req.user.userId;
    const id_cibo = req.body.id_cibo;

    //Controllo che l'ID del cibo sia fornito
    if (!id_cibo) {
        return res.status(400).json({
            success: false,
            message: "ID cibo mancante"
        });
    }

    const conn = await pool.promise().getConnection();
    try {
        await conn.beginTransaction();

        //Recupero i soldi dell'utente
        const [utente] = await conn.execute("SELECT soldi FROM utenti WHERE id_utente = ?", [id_utente]);
        if (utente.length === 0) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Utente non trovato"
            });
        }
        const soldiUtente = utente[0].soldi;

        //Recupero il costo e effetto del cibo
        const [cibi] = await conn.execute("SELECT effetto_fame, costo, url_cibo FROM cibi WHERE id_cibo = ?", [id_cibo]);
        if (cibi.length === 0) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Cibo non trovato"
            });
        }
        const cibo = cibi[0];

        //Controllo se l'utente ha abbastanza soldi
        if (soldiUtente < cibo.costo) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Soldi insufficienti"
            });
        }

        //Aggiorno soldi dell'utente
        await conn.execute("UPDATE utenti SET soldi = ? WHERE id_utente = ?", [soldiUtente - cibo.costo, id_utente]);

        //Recupero il pet attivo
        const [pets] = await conn.execute(
            "SELECT id_pet_utente, fame, ultimo_cibo FROM pet_utente WHERE id_utente = ? AND attivo = 1",
            [id_utente]
        );
        if (pets.length === 0) {
            await conn.rollback();
            return res.status(200).json({
                success: true,
                message: "Nessun pet attivo",
                pet: null
            });
        }
        let pet = pets[0];

        //Applico aumento della fame
        pet = aumentaFamePet(pet, cibo);

        //Aggiorno il pet nel database
        await conn.execute(
            "UPDATE pet_utente SET fame = ?, ultimo_cibo = ? WHERE id_pet_utente = ? AND attivo = 1",
            [pet.fame, pet.ultimo_cibo, pet.id_pet_utente]
        );

        await conn.commit();

        //Ritorno conferma e URL del cibo
        return res.status(200).json({
            success: true,
            message: "Pet nutrito con successo",
            url_cibo: cibo.url_cibo
        });

    } catch (error) {
        //Se catturo un errore durante la procedura loggo e mando risposta negativa
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

//Handler per far giocare il pet con un certo gioco
exports.gioca = async (req, res) => {
    const id_utente = req.user.userId;
    const id_gioco = req.body.id_gioco;

    //Controllo che l'ID del gioco sia fornito
    if (!id_gioco) {
        return res.status(400).json({
            success: false,
            message: "ID gioco mancante"
        });
    }

    const conn = await pool.promise().getConnection();
    try {
        await conn.beginTransaction();

        //Recupero i soldi dell'utente
        const [utente] = await conn.execute("SELECT soldi FROM utenti WHERE id_utente = ?", [id_utente]);
        if (utente.length === 0) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Utente non trovato"
            });
        }
        const soldiUtente = utente[0].soldi;

        //Recupero il costo e effetto del gioco
        const [giochi] = await conn.execute("SELECT effetto_felicita, costo, url_gioco FROM giochi WHERE id_gioco = ?", [id_gioco]);
        if (giochi.length === 0) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Gioco non trovato"
            });
        }
        const gioco = giochi[0];

        //Controllo se l'utente ha abbastanza soldi
        if (soldiUtente < gioco.costo) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Soldi insufficienti"
            });
        }

        //Aggiorno soldi dell'utente
        await conn.execute("UPDATE utenti SET soldi = ? WHERE id_utente = ?", [soldiUtente - gioco.costo, id_utente]);

        //Recupero il pet attivo
        const [pets] = await conn.execute(
            "SELECT id_pet_utente, felicita, ultimo_gioco FROM pet_utente WHERE id_utente = ? AND attivo = 1",
            [id_utente]
        );
        if (pets.length === 0) {
            await conn.rollback();
            return res.status(200).json({
                success: true,
                message: "Nessun pet attivo",
                pet: null
            });
        }
        let pet = pets[0];

        //Applico aumento della felicità
        pet = aumentaFelicitaPet(pet, gioco);

        //Aggiorno il pet nel database
        await conn.execute(
            "UPDATE pet_utente SET felicita = ?, ultimo_gioco = ? WHERE id_pet_utente = ? AND attivo = 1",
            [pet.felicita, pet.ultimo_gioco, pet.id_pet_utente]
        );

        await conn.commit();

        //Ritorno conferma e URL del gioco
        return res.status(200).json({
            success: true,
            message: "Il pet ha giocato con successo",
            url_gioco: gioco.url_gioco
        });

    } catch (error) {
        //Se catturo un errore durante la procedura loggo e mando risposta negativa
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

//Handler per adottare un nuovo pet casuale
exports.adotta = async (req, res) => {
    const id_utente = req.user.userId;
    const conn = await pool.promise().getConnection();

    try {
        await conn.beginTransaction();

        //Controllo se l'utente ha già un pet attivo
        const [petsAttivi] = await conn.execute(
            "SELECT COUNT(*) AS count FROM pet_utente WHERE id_utente = ? AND attivo = 1",
            [id_utente]
        );

        if (petsAttivi[0].count > 0) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Hai gia' un pet attivo"
            });
        }

        //Recupero tutti i pet disponibili e ne seleziono uno casuale
        const [righe] = await conn.execute("SELECT id_pet, nome, fame_base, felicita_base, url_pet FROM pets");
        const pet_casuale = righe[Math.floor(Math.random() * righe.length)];

        //Inserisco il pet scelto come attivo per l'utente
        const [result] = await conn.execute(
            "INSERT INTO pet_utente (id_utente, id_pet, fame, felicita, attivo) VALUES (?, ?, ?, ?, 1)",
            [id_utente, pet_casuale.id_pet, pet_casuale.fame_base, pet_casuale.felicita_base]
        );

        if (result.affectedRows !== 1) {
            throw new Error("Inserimento non riuscito");
        }

        await conn.commit();

        //Ritorno il pet adottato
        return res.status(200).json({
            success: true,
            message: "Hai adottato un nuovo pet!",
            pet: pet_casuale
        });

    } catch (error) {
        //Se catturo un errore durante la procedura loggo e mando risposta negativa
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

//Handler per liberare il pet attivo dell'utente
exports.libera = async (req, res) => {
    const id_utente = req.user.userId;
    const conn = await pool.promise().getConnection();

    try {
        await conn.beginTransaction();

        //Controllo se l'utente ha un pet attivo
        const [petsAttivi] = await conn.execute(
            "SELECT id_pet_utente FROM pet_utente WHERE id_utente = ? AND attivo = 1;",
            [id_utente]
        );

        if (petsAttivi.length === 0) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Non hai nessun pet attivo"
            });
        }

        //Aggiorno il pet impostandolo come non attivo
        await conn.execute(
            "UPDATE pet_utente SET attivo = 0 WHERE id_utente = ? AND attivo = 1",
            [id_utente]
        );

        await conn.commit();

        //Ritorno conferma
        return res.status(200).json({
            success: true,
            message: "Pet liberato con successo"
        });

    } catch (error) {
        //Se catturo un errore durante la procedura loggo e mando risposta negativa
        await conn.rollback();
        console.error("Errore nella liberazione del pet", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    } finally {
        conn.release();
    }
};