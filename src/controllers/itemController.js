//Import necessari
const pool = require("../servizi/servizioDB");

//Handler per recuperare gli item di un certo tipo (cibo o gioco)
exports.getItems = async (req, res) => {

    const userId = req.user.userId; //Prendo l'ID dell'utente dal token decodificato
    const tipo = req.query.tipo; //Prendo il tipo di item dalla query string

    let tabella;
    //Determino la tabella da cui recuperare gli item
    if (tipo === "cibo") {
        tabella = "cibi"; //Tabella cibi
    } else if (tipo === "gioco") {
        tabella = "giochi"; //Tabella giochi
    } else {
        //Se il tipo non è valido ritorno un errore
        return res.status(400).json({
            success: false,
            message: "Tipo di item non valido"
        });
    }

    try {
        //Recupero tutti gli item dalla tabella corretta
        const [items] = await pool.promise().execute(
            `SELECT * FROM ?`,
            [tabella]
        );
        //Recupero il saldo dell'utente
        const [users] = await pool.promise().execute(
            `SELECT soldi FROM utenti WHERE id_utente = ?`,
            [userId]
        );

        //Invio risposta positiva con item e soldi dell'utente
        return res.status(200).json({
            success: true,
            message: `items recuperati con successo`,
            soldi: users[0].soldi,
            items
        });
    } catch (error) {
        //Se catturo un errore durante la procedura loggo e mando risposta negativa
        console.error(`Errore durante il recupero dei ${tipo}:`, error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
};