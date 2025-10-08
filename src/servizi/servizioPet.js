function aggiornaStatoPet(pet) {
    const ORA_MS = 1000 * 60 * 60; // Millisecondi in un'ora
    const now = Date.now();

    let ultimoCibo = new Date(pet.ultimo_cibo).getTime();
    let ultimoGioco = new Date(pet.ultimo_gioco).getTime();

    const tassoFame = pet.tasso_di_fame;
    const tassoFelicita = pet.tasso_di_felicita;

    // Calcolo ore intere trascorse dall'ultimo cibo/gioco
    const oreDaUltimoCibo = Math.floor((now - ultimoCibo) / ORA_MS);
    const oreDaUltimoGioco = Math.floor((now - ultimoGioco) / ORA_MS);

    let nuovaFame = pet.fame;
    let nuovaFelicita = pet.felicita;

    // Decremento solo se è passata almeno un'ora
    if (oreDaUltimoCibo >= 1) {
        nuovaFame = Math.max(nuovaFame - oreDaUltimoCibo * tassoFame, 0);
        ultimoCibo += oreDaUltimoCibo * ORA_MS; // aggiorno timestamp solo per le ore effettive trascorse
    }

    if (oreDaUltimoGioco >= 1) {
        nuovaFelicita = Math.max(nuovaFelicita - oreDaUltimoGioco * tassoFelicita, 0);
        ultimoGioco += oreDaUltimoGioco * ORA_MS; // idem
    }

    return {
        ...pet,
        fame: nuovaFame,
        felicita: nuovaFelicita,
        ultimo_cibo: new Date(ultimoCibo),
        ultimo_gioco: new Date(ultimoGioco)
    };
}

module.exports = { aggiornaStatoPet };