function caricaItems(items, tipo, soldi) {

    const ul = document.getElementById("itemList");
    ul.innerHTML = "";

    items.forEach(item => {
        let itemUrl, itemId;

        if (tipo === "cibo") {
            itemUrl = item.url_cibo;
            itemId = item.id_cibo;
        } else if (tipo === "gioco") {
            itemUrl = item.url_gioco;
            itemId = item.id_gioco;
        }

        const li = document.createElement("li");

        li.innerHTML = `<img src="${itemUrl}" alt="${item.nome}"><br>
                        <span>${item.nome} - Costo: ${item.costo}</span>`;
        li.dataset.id = itemId;
        li.dataset.tipo = tipo;

        if (soldi >= item.costo) {
            li.className = "itemAcquistabile";
        } else {
            li.className = "itemNonAcquistabile";
        }

        ul.appendChild(li);
    });

    ul.addEventListener("click", e => {
        const target = e.target.closest(".itemAcquistabile");
        if (!target) return;
        localStorage.setItem("itemSelezionato", JSON.stringify({
            id: target.dataset.id,
            tipo: target.dataset.tipo
        }));
        window.location.href = "dashboard.html";
    });
}

window.onload = async () => {
    const tipo = new URLSearchParams(window.location.search).get('tipo');
    console.log(tipo);
    const res = await fetch(`http://localhost:3000/api/item?tipo=${tipo}`, {
        method: 'GET',
        credentials: 'include'
    });
    if (res.ok) {
        const data = await res.json();
        const items = data.items;
        caricaItems(items, tipo, data.soldi);
        document.getElementById("soldi").textContent = `${data.soldi}`;
    } else {
        console.log("Errore nel recupero degli items");
    }
};