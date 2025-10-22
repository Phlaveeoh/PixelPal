//Funzione per costruire dinamicamente la lista di item
function caricaItems(items, tipo, soldi) {
    //Prendo la itemList
    const ul = document.getElementById("itemList");
    //La svuoto
    ul.innerHTML = "";

    //Per ogni item ottenuto dalla richiesta
    items.forEach(item => {

        //Stabilisco il nome degli attributi in base al tipo di item (Serve per interagire con l'API e le animazioni)
        let itemUrl, itemId;

        if (tipo === "cibo") {
            itemUrl = item.url_cibo;
            itemId = item.id_cibo;
        } else if (tipo === "gioco") {
            itemUrl = item.url_gioco;
            itemId = item.id_gioco;
        }

        //Creo un list item
        const li = document.createElement("li");

        //Assegno i dati al list item
        li.dataset.id = itemId;
        li.dataset.tipo = tipo;
        li.dataset.url = itemUrl;

        //Carico l'immagine dell'item
        const divOggetto = document.createElement("div");
        divOggetto.className = "sprite";
        divOggetto.style.backgroundImage = `url(${itemUrl})`;
        divOggetto.style.backgroundPosition = `${-0 * 32}px 0`;
        divOggetto.dataset.tipo = tipo

        //Creo e configura lo Span con le informazioni
        const spanTesto = document.createElement("span");
        spanTesto.textContent = `${item.nome} - Costo: ${item.costo}`;

        //Assemblo il list item
        li.appendChild(divOggetto);
        li.appendChild(document.createElement("br"));
        li.appendChild(spanTesto);

        //Se l'utente ha abbastanza soldi per acquistarlo gli assegno la classe acquistabile
        if (soldi >= item.costo) {
            li.className = "itemAcquistabile";
        } else {
            li.className = "itemNonAcquistabile";
        }

        //Lo appendo alla fine della lista
        ul.appendChild(li);
    });

    //Se clicchi sull'item list:
    ul.addEventListener("click", e => {
        //Prendo l'item acquistabile più vicino al cursore al momento del click
        const target = e.target.closest(".itemAcquistabile");
        if (!target) return;
        //Carico i dati dell'item nel localStorage per permettere la chiamata dell'API nella dashboard
        localStorage.setItem("itemSelezionato", JSON.stringify({
            id: target.dataset.id,
            tipo: target.dataset.tipo,
            url: target.dataset.url
        }));
        //Reindirizzo alla dashboard
        window.location.href = "dashboard.html";
    });
}

//Al caricamento della pagina:
window.onload = async () => {
    //Chiamo l'API in base al tipo di item messo nei parametri del GET
    const tipo = new URLSearchParams(window.location.search).get('tipo');
    const res = await fetch(`/api/item?tipo=${tipo}`, {
        method: 'GET',
        credentials: 'include'
    });

    //Attendo i dati
    const data = await res.json();

    //Se risposta positiva:
    if (res.ok) {
        console.log(data);
        //Carico la lista di item ed i soldi dell'utente
        const items = data.items;
        caricaItems(items, tipo, data.soldi);
        document.getElementById("soldi").textContent = `${data.soldi}`;
    } else {
        //Stampo l'errore
        const divErrore = document.getElementById('message');
        divErrore.classList.add("attivo");
        divErrore.innerText = data.message;
    }
};