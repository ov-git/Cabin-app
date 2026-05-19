# Frontend

## Vaatimukset

- Node.js (suositus: uusin LTS-versio)
- npm (tulee Node.js:n mukana)

---

## Node.js asennus

1. Mene osoitteeseen: https://nodejs.org  
2. Lataa **LTS (Long Term Support)** -versio  
3. Asenna ohjelma normaalisti (Next -> Next -> Finish)  

(Voisit myös vaihtoehtoisesti käyttää asennukseen nvm:ää, joka on pidemmän aikavälin suositus. nvm = node version management. nvm:n asennus vaatii pikkuisen ekstraa aluksi.)

```bash
cd frontend
npm install
npm run dev
```
Avaa selain osoitteessa 

http://localhost:5173

# Backend

## Vaatimukset

- Java 25
- Maven
- Docker

```bash
docker compose up --build
```

Endpoint dokumentaatio: http://localhost:8080/swagger-ui/index.html

Tietokanta konsoli (Adminer): http://localhost:8081
- Käyttäjä: user
- Salasana: password
