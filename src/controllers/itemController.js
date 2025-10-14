const pool = require("../servizi/servizioDB");

exports.getItems = async (req, res) => {
    const userId = req.user.userId;
    const tipo = req.query.tipo;
    let tabella;

    if (tipo === "cibo") {
        tabella = "cibi";
    } else if (tipo === "gioco") {
        tabella = "giochi";
    } else {
        return res.status(400).json({
            success: false,
            message: "Tipo di item non valido"
        });
    }

    try {
        const [items] = await pool.promise().execute(`SELECT * FROM ${tabella}`);
        const [users] = await pool.promise().execute(`SELECT soldi FROM utenti WHERE id_utente = ?`, [userId]);
        return res.status(200).json({
            success: true,
            message: `items recuperati con successo`,
            soldi: users[0].soldi,
            items
        });
    } catch (error) {
        console.error(`Errore durante il recupero dei ${tipo}:`, error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
};