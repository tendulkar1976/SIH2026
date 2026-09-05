from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import events, incidents, alerts, websockets, auth, analytics, map, dashboard, registry, recordings
from app.database.core import Base, engine
from app.database.deps import get_db
import app.models.events
import app.models.incidents
import app.models.alerts
import app.models.users
import app.models.registry
import app.models.recordings
from app.auth.security import get_password_hash
from app.config import CORS_ORIGINS

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Urban Intelligence Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.database.seed import seed_database

@app.on_event("startup")
def startup_event():
    # Setup demo users and seed initial records if empty
    db = next(get_db())
    try:
        seed_database(db)
    finally:
        db.close()

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(map.router, prefix="/api/map", tags=["Map"])
app.include_router(events.router)
app.include_router(incidents.router)
app.include_router(alerts.router)
app.include_router(websockets.router)
app.include_router(registry.router)
app.include_router(recordings.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
