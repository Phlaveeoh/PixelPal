CREATE TABLE utenti(  
    id_utente int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    username VARCHAR(255) NOT NULL UNIQUE COMMENT 'Username',
    password VARCHAR(255) NOT NULL COMMENT 'Password hash',
    nome VARCHAR(255),
    cognome VARCHAR(255),
    soldi int NOT NULL DEFAULT 100
);
CREATE TABLE pets(
    id_pet int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    nome VARCHAR(255) NOT NULL COMMENT 'Nome del pet',
    fame_base int NOT NULL COMMENT 'Fame base del pet',
    felicita_base int NOT NULL COMMENT 'Felicità base del pet',
    tasso_di_fame int NOT NULL COMMENT 'Tasso di calo della fame',
    tasso_di_felicita int NOT NULL COMMENT 'Tasso di calo della felicità',
    url_pet VARCHAR(255) NOT NULL DEFAULT 'immagini/pets/defaultPet.png'
);
CREATE TABLE pet_utente(
    id_pet_utente int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    id_utente int NOT NULL COMMENT 'Foreign Key di utenti',
    id_pet int NOT NULL COMMENT 'Foreign Key di pets',
    fame int NOT NULL COMMENT 'Fame attuale del pet',
    felicita int NOT NULL COMMENT 'Felicità attuale del pet',
    ultimo_cibo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_gioco TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attivo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_utente) REFERENCES utenti(id_utente) ON DELETE CASCADE,
    FOREIGN KEY (id_pet) REFERENCES pets(id_pet) ON DELETE CASCADE
);
CREATE TABLE cibi(
    id_cibo int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    nome VARCHAR(255) NOT NULL,
    effetto_fame int NOT NULL COMMENT 'Quantità di fame ripristinata',
    costo int NOT NULL,
    url_cibo VARCHAR(255) NOT NULL DEFAULT 'immagini/cibi/defaultCibo.png'
);
CREATE TABLE giochi(
    id_gioco int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    nome VARCHAR(255) NOT NULL,
    effetto_felicita int NOT NULL COMMENT 'Quantità di felicità ripristinata',
    costo int NOT NULL,
    url_gioco VARCHAR(255) NOT NULL DEFAULT 'immagini/giochi/defaultGioco.png'
);