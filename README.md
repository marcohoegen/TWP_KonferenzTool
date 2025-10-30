# 🧠 Confeed — Self-hosted Konferenz-Feedback-Plattform

> **Ernst-Abbe-Hochschule Jena — Modul: Technisch-wirtschaftliches Projekt**  
> **Teamgröße:** 8 Studierende (4 Entwickler)

---

## 🚀 Projektbeschreibung

**Confeed** ist eine self-hosted Webanwendung zur Durchführung und Auswertung von Teilnehmerfeedback bei mehrtägigen Konferenzen.  
Teilnehmende können nach jedem Vortrag eine **individuelle Bewertung** abgeben.  
Am Ende einer Veranstaltung werden die Ergebnisse aggregiert, um herauszufinden, **welcher Vortragende am besten bewertet wurde**.

Ziel des Projekts ist es, eine **vollständig eigenständig betreibbare Anwendung** zu schaffen, die datenschutzkonform und leicht zu deployen ist.

---

## 🧩 Technologie-Stack

| Ebene | Technologie |
|-------|--------------|
| **Frontend** | [React](https://react.dev/) + [Vite](https://vitejs.dev/) (TypeScript) |
| **Backend** | [NestJS](https://nestjs.com/) (TypeScript, REST API) |
| **Datenbank** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Containerisierung** | [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) |

---

## 🏗️ Architekturübersicht

```

┌─────────────────────────────┐
│         Frontend (Vite)     │
│  React + TypeScript         │
│  ↳ Läuft auf Port :5173     │
└──────────────┬──────────────┘
               │ REST API
┌──────────────▼──────────────┐
│       Backend (NestJS)      │
│  ↳ Läuft auf Port :3000     │
│  ↳ Verbindet sich zu DB     │
└──────────────┬──────────────┘
               │ Prisma ORM
┌──────────────▼──────────────┐
│     PostgreSQL Database     │
│  ↳ Port :5432               │
│  ↳ Persistente Datenhaltung │
└─────────────────────────────┘

````

Das gesamte System läuft containerisiert über Docker und ist somit plattformunabhängig einsetzbar.

---

## ⚙️ Setup & Installation (Docker-first)

### 1. Repository klonen

```bash
git clone https://github.com/marcohoegen/TWP_KonferenzTool.git
````

### 2. `.env`-Datei anlegen

Erstelle im Projektverzeichnis eine `.env`:
- Kopiere ".env.example" und füge es im gleichen Ordner wieder ein
- Benenne die Datei in ".env" um

### 3. Docker-Container starten

```bash
docker-compose up --build
```

### 4. Prisma-Schema anlegen
- bei erstmaligen Starten (und bei Änderungen des Datenmodells) muss das Prisma-Schema in die DB geladen werden

```bash
docker exec -it nest-backend npx prisma migrate deploy
```

Nach dem erfolgreichen Build ist die Anwendung unter folgenden Adressen erreichbar:

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend (API):** [http://localhost:3000](http://localhost:3000)
* **PostgreSQL:** läuft intern im Docker-Netzwerk auf Port `5432`

---

## 🧠 Entwicklungs-Workflow

### 🧩 Neues Backend-Modul erstellen

```bash
nest generate resource <name>
```
Es werden folgende resourcen erstellt:
- Entity
- Data-Transfer-Object (Dto)
- Module
- Service
- Controller mit CRUD-Endpoints

### 🗄️ Prisma: Datenbankschema anpassen

Passe das Prisma-Schema in `backend/prisma/schema.prisma` an und führe anschließend aus:

```bash
npx prisma migrate dev --name <migration-name>
```

### 🔁 Änderungen übernehmen

Sowohl das Backend, als auch das Frontend unterstützen Hot-Reload. 
Die Zuverlässigkeit dessen ist nicht zu 100% gegeben, daher ist folgendes bei untypischen Verhalten ratsam:
```bash
docker-compose down
docker-compose up --build
```
