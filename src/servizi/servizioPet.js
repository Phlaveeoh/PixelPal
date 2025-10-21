//Blocco di funzioni utili per gestire il pet

//Funzione che dato un pet calcola la fame e la felicità aggiornata secondo i timestamp dell'ultima volta che è stato curato
function decadimentoPet(pet) {
    const ORA_MS = 1000 * 60 * 60; // Millisecondi in un'ora
    const now = Date.now(); //Prendo l'ora attuale per capire quanto è passato dall'ultima cura

    //Prendo i timestamp
    let ultimoCibo = new Date(pet.ultimo_cibo).getTime();
    let ultimoGioco = new Date(pet.ultimo_gioco).getTime();

    //Velocità di decadimento delle stats del pet
    const tassoFame = pet.tasso_di_fame;
    const tassoFelicita = pet.tasso_di_felicita;

    //Calcolo ore intere trascorse dall'ultimo cibo/gioco
    const oreDaUltimoCibo = Math.floor((now - ultimoCibo) / ORA_MS);
    const oreDaUltimoGioco = Math.floor((now - ultimoGioco) / ORA_MS);

    let nuovaFame = pet.fame;
    let nuovaFelicita = pet.felicita;

    //Decremento solo se è passata almeno un'ora
    if (oreDaUltimoCibo >= 1) {
        nuovaFame = Math.max(nuovaFame - oreDaUltimoCibo * tassoFame, 0); //La nuova fame non può scendere sotto lo zero
        ultimoCibo += oreDaUltimoCibo * ORA_MS; //Aggiorno timestamp solo per le ore effettive trascorse
    }

    if (oreDaUltimoGioco >= 1) {
        nuovaFelicita = Math.max(nuovaFelicita - oreDaUltimoGioco * tassoFelicita, 0); //Stesso discorso della fame
        ultimoGioco += oreDaUltimoGioco * ORA_MS;
    }

    //Restituisco il pet aggiornato
    //Per evitare che le barre calino a picco ogni volta che si controlla aggiorno i timestamp
    return {
        ...pet,
        fame: nuovaFame,
        felicita: nuovaFelicita,
        ultimo_cibo: new Date(ultimoCibo),
        ultimo_gioco: new Date(ultimoGioco)
    };
};

//Funzione che aumenta la barra della fame di un pet dato un certo cibo
function aumentaFamePet(pet, cibo) {
    const effetto_fame = cibo.effetto_fame; //Quanto aumenta il cibo
    //Restituisco pet aggiornato
    return {
        ...pet,
        fame: Math.min(pet.fame + effetto_fame, 100),
        ultimo_cibo: new Date()
    };
};

//Funzione che aumenta la barra della fame di un pet dato un certo gioco
function aumentaFelicitaPet(pet, gioco) {
    const effetto_felicita = gioco.effetto_felicita; //Quanto aumenta il gioco
    //Restituisco pet aggiornato
    return {
        ...pet,
        felicita: Math.min(pet.felicita + effetto_felicita, 100),
        ultimo_gioco: new Date()
    };
};

module.exports = { decadimentoPet, aumentaFamePet, aumentaFelicitaPet };