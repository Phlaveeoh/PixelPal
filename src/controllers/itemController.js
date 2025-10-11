const pool = require("../servizi/servizioDB");

exports.getCibi = async (req, res) => {
    try {
        const [cibi] = await pool.promise().execute("SELECT * FROM cibi");
        return res.status(200).json({
            success: true,
            message: "Cibi recuperati con successo",
            cibi: cibi
        });
    } catch (error) {
        console.error("Errore durante il recupero dei cibi:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
};

exports.getGiochi = async (req, res) => {
    try {
        const [giochi] = await pool.promise().execute("SELECT * FROM giochi");
        return res.status(200).json({
            success: true,
            message: "Giochi recuperati con successo",
            giochi: giochi
        });
    } catch (error) {
        console.error("Errore durante il recupero dei giochi:", error);
        return res.status(500).json({
            success: false,
            message: "Errore del server"
        });
    }
};