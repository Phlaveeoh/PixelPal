# Utilizza l'immagine ufficiale di Node.js (versione 20, basata su Alpine per essere leggera)
FROM node:20-alpine

# Imposta la cartella di lavoro all'interno del container
WORKDIR /app

# Copia solo i file del gestore pacchetti (package.json e package-lock.json)
# Eseguire l'installazione qui sfrutta la cache di Docker
COPY package*.json ./

# Installa tutte le dipendenze (express, mysql, ecc.)
RUN npm install

# Copia tutto il codice rimanente del tuo progetto (server.js, HTML, CSS, JS)
COPY . .

# Espone la porta del server Node.js
EXPOSE 3000

# Definisce il comando che verrà eseguito all'avvio del container
# (Assicurati che il tuo package.json abbia uno script "start" che esegua il server)
CMD [ "npm", "start" ]