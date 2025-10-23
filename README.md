# PixelPal

*Virtual pet ispirato ai Tamagotchi vintage*

PixelPal è una webapp sviluppata con **Node.js ed Express** che simula il funzionamento dei classici Tamagotchi.  
L'utente, dopo aver creato l'account sul sito potrà adottare un pet casuale e prendersene cura.

## Requisiti

### Esecuzione locale

Per avviare il progetto senza container è necessario avere installati:
- [Node.js](https://nodejs.org/en) (versione ≥ 20)
- [MySQL](https://www.mysql.com/) (versione ≥ 8)

### Esecuzione containerizzata

In alternativa, il progetto può essere eseguito tramite Docker.
In questo caso è sufficiente avere installato:
- Docker
- Docker Compose

## Configurazione iniziale ed avvio

Quando viene configurato il progetto per la prima volta è necessario avere alcune accortezze per assicurarsi il corretto funzionamento della webapp una volta scaricato il materiale necessario.

Prima di tutto va clonata la repository nel proprio computer:  
    
    git clone https://github.com/Phlaveeoh/PixelPal.git

Oppure scarica lo zip da <https://github.com/Phlaveeoh/PixelPal>.

In seguito, nella root del progetto va creato un file `.env` contenente le variabili d'ambiente della webapp.  
Di seguito un template di come deve essere strutturato il file:

    #Porta del server Node.js
    PORT=3000

    #Credenziali del database MySQL
    DB_HOST=[indirizzo del db]
    DB_USER=[user]
    DB_PASSWORD=[password]
    DB_NAME=pixelpal_db

    #Chiave segreta per la generazione dei token JWT
    JWT_SECRET=[La propria chiave]

> **Nota:** se intendi avviare la webapp tramite Docker, imposta `DB_HOST=db` (il nome del container MySQL nel `docker-compose.yml`).

Ora la procedura cambierà in base a come si vuole lanciare l'applicazione.

### Avvio Locale

Se si intende avviare l'applicazione in locale occorre prima creare e configurare il database.

Accedi alla shell di MySQL e scrivi:

    CREATE DATABASE pixelpal_db;
    SHOW DATABASES;
    USE pixelpal_db;

A questo punto crea un utente con tutti i permessi per accedere al database:
    
    CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
    GRANT ALL PRIVILEGES ON pixelpal_db.* TO 'user'@'localhost';
    FLUSH PRIVILEGES;

> **NOTA:** i valori `user` e `password` devono essere gli stessi messi nel file `.env`.

Fatto ciò crea le tabelle ed inserisci i dati minimi nel db per far funzionare l'applicazione.
La struttura del db e gli insert possono essere trovati in [`docs/db`](docs/db/) con il nome: [`createTable.sql`](docs/db/createTable.sql) ed [`insert.sql`](docs/db/insert.sql).

Una volta configurato il db è necessario eseguire i seguenti comandi per far partire la webapp:

    npm install
    npm start

La webapp sarà raggiungibile su http://localhost:3000.

### Avvio containerizzato

Per lanciare l'applicazione usando Docker vanno sempre fatte delle piccole accortezze sulla configurazione del db:

Modifica opportunamente la sezione del docker [`docker-compose.yml`](docker-compose.yml) e cambia l'utente del container db con quello messo nel file `.env`.

    db:  
        image: mysql:8.0  
        ports:  
            - "3306:3306"
        environment:  
            MYSQL_DATABASE: 'pixelpal_db'  
            MYSQL_USER: 'user'  
            MYSQL_PASSWORD: 'password'  
            MYSQL_ROOT_PASSWORD: 'rootpassword'   
        volumes:  
            - db-data:/var/lib/mysql  
        restart: always

> **NOTA:** l'utente `root` rimane comunque accessibile con `rootpassword`

Una volta fatte le opportune modifiche avvia il servizio usando il comando:
    
    docker-compose up --build

La webapp sarà raggiungibile su http://localhost:3000.

> **NOTA:** al primo avvio occorre collegarsi al db ed eseguire le CREATE TABLE e gli insert minimali come per l'avvio in locale!  
> Questi file possono essere trovati in [`docs/db`](docs/db/) con il nome: [`createTable.sql`](docs/db/createTable.sql) ed [`insert.sql`](docs/db/insert.sql).

## Utilizzo della webapp

L'esperienza cerca di essere il più fedele possibile a quella dei tamagotchi vintage pur con molte meno feature.  

Una volta creato l'account e fatto l'accesso bisognerà adottare un nuovo pet, per farlo basta cliccare in alto a destra sull'icona dell'utente, cliccare nella tab pet e premere il pulsante "Adotta un nuovo pet".  

Una volta fatto ciò si avrà il proprio pet e si potrà giocare con lui.

- Pulsante stato:
  - Reindirizza alla pagina per controllare le statistiche del pet
- Pulsante cibo:
  - Reindirizza al negozio dei pasti
- Pulsante gioca:
  - Reindirizza al negozio dei giochi

> **NOTA:** Ancora non c'è modo di guadagnare monete, usale con cautela
