const pool = require("../servizi/servizioDB");
const { aggiornaStatoPet } = require('../servizi/servizioPet');

exports.petDashboard = async (req, res) => {
    id_utente = req.user.userId;
    const conn = await pool.promise().getConnection();
    try {
        // Recupera il pet attivo dell'utente
        const [righe] = await conn.execute("SELECT * FROM pet_utente INNER JOIN pets ON pet_utente.id_pet = pets.id_pet WHERE id_utente = ? AND pet_utente.attivo = 1",
            [id_utente]);
        if (righe.length === 0) {
            await conn.rollback();
            return res.status(200).json({
                success: true,
                message: "Nessun pet attivo",
                pet: null
            });
        }
        pet = righe[0];
        pet = aggiornaStatoPet(pet);
        await conn.execute("UPDATE pet_utente SET fame = ?, felicita = ?, ultimo_cibo = ?, ultimo_gioco = ? WHERE id_pet_utente = ? AND attivo = 1",
            [pet.fame, pet.felicita, pet.ultimo_cibo, pet.ultimo_gioco, pet.id_pet_utente]);

        await conn.commit();

        return res.status(200).json({
            success: true,
            message: "Pet attivo trovato",
            pet: pet
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

exports.stato = async (req, res) => { };

exports.nutri = async (req, res) => { };

exports.gioca = async (req, res) => { };

exports.adotta = async (req, res) => {
    id_utente = req.user.userId;
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