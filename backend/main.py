from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prisma import Prisma
from routers import user, encyclopedia

app = FastAPI(title="Omni-App Backend")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(encyclopedia.router)

prisma = Prisma()

@app.on_event("startup")
async def startup():
    try:
        await prisma.connect()
    except Exception as e:
        print(f"Warning: Could not connect to database on startup: {e}")

@app.on_event("shutdown")
async def shutdown():
    if prisma.is_connected():
        await prisma.disconnect()

@app.get("/api/ping")
async def ping():
    return {"message": "pong", "service": "FastAPI", "status": "ok"}
