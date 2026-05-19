from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import interactions, agent

app = FastAPI(title="AI CRM HCP Module")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(interactions.router, prefix="/api/interactions", tags=["interactions"])
app.include_router(agent.router, prefix="/api/agent", tags=["agent"])

@app.get("/")
def root():
    return {"message": "AI CRM HCP Module Running!"}