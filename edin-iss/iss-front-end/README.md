# ISS Aplikacija

## Pokretanje projekta

Otvori terminal u root folderu `c:\edin-iss` i pokreni:

```bash
npm start
```

Ova komanda automatski pokreće **i backend i frontend** istovremeno.

- Frontend: [http://localhost:3001](http://localhost:3001)
- Backend API: [http://localhost:3000](http://localhost:3000)

---

## Prva instalacija (samo jednom)

Ako pokrećeš projekat prvi put, instaliraj sve zavisnosti:

```bash
npm run setup
```

Ova komanda instalira sve pakete za root, backend i frontend, i generiše Prisma klijenta.

---

## Skripte

| Komanda | Opis |
|---|---|
| `npm start` | Pokreće backend i frontend zajedno |
| `npm run setup` | Instalacija svih zavisnosti + Prisma generate (samo jednom) |
| `npm run install:all` | Instalacija svih zavisnosti |
| `npm run prisma:generate` | Generisanje Prisma klijenta |
