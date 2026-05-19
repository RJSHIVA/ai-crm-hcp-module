from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import AgentMessage
from agent.graph import run_agent

router = APIRouter()

@router.post("/chat")
async def chat_with_agent(message: AgentMessage, db: Session = Depends(get_db)):
    try:
        response = await run_agent(
            message.message,
            message.conversation_history,
            db
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))