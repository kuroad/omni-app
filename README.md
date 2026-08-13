# 🌌 Omni-App (Honkai: Star Rail Encyclopedia)

Omni-App is a modern, fast, and interactive web-based encyclopedia for Honkai: Star Rail. It features a beautiful glassmorphism UI, a comprehensive database of game entities, and interactive dynamic stat calculators.

![Omni-App Showcase](https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/sign/BgSign3.png)

## ✨ Features

- **Comprehensive Database**: Browse Characters, Light Cones, Relics, and Simulated Universe Archives.
- **Dynamic Stat Calculators**: Interactive level sliders that mathematically calculate Base Stats, Ascension stats, and Relic sub-stats based on real game formulas.
- **Text Tag Parser**: Automatically processes Mihomo's raw game data tags (`#1[i]`, `%`) into readable tooltips and percentages.
- **Glassmorphism UI**: Stunning, premium dark-mode interface built with Tailwind CSS.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, TanStack Query.
- **Backend**: FastAPI (Python), Prisma ORM.
- **Database**: PostgreSQL (containerized with Docker).
- **Data Source**: Automatically seeded from [StarRailRes](https://github.com/Mar-7th/StarRailRes).

---

## 🚀 Quick Start Guide

Follow these steps to run the project locally on your machine.

### 1. Prerequisites
- Docker & Docker Compose
- Node.js (v18+)
- Python (3.10+)

### 2. Start the Database
The project uses a local PostgreSQL database via Docker.
```bash
docker-compose up -d
```

### 3. Setup Backend & Seed Database
The database needs to be populated with the latest game data.
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

pip install -r requirements.txt

# Run the Prisma migration (if needed)
prisma db push

# Run the seed script to fetch data from StarRailRes
python seed.py

# Start the FastAPI server
uvicorn routers.encyclopedia:router --reload --port 8000
```
*(Note: If you are running the full backend via a main app file, adjust the uvicorn command accordingly. Currently, the API is exposed on port 8000).*

### 4. Start the Frontend
In a new terminal window, start the Next.js development server:
```bash
cd frontend
npm install
npm run dev
```

### 5. Open the App
Navigate to [http://localhost:3000/encyclopedia](http://localhost:3000/encyclopedia) in your browser!

---

## 🗺️ Roadmap
- 🎲 **Relic RNG Simulator**: Simulate relic sub-stat upgrades.
- 📈 **Resource Planner**: Calculate materials needed for maxing characters.
- ⚔️ **Damage Calculator**: Real-time damage projection using defense and resistance formulas.
- 🔗 **HSR-Optimizer Integration**: Import JSON scanner files for relic evaluation.

## 🤝 Acknowledgments
Data and assets are sourced from [Mar-7th/StarRailRes](https://github.com/Mar-7th/StarRailRes). This project is not affiliated with HoYoverse.
