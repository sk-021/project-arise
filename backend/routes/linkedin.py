from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from services.ai_service import generate_linkedin_post
from auth import get_current_user, get_db
from models.user import User
from models.history import AIHistory
from rate_limiter import limiter

router = APIRouter(prefix="/linkedin")

class LinkedInGenerateRequest(BaseModel):
    topic: str
    tone: str

@router.get("/")
def get_linkedin():
    return {"message": "LinkedIn endpoint"}

@router.post("/generate")
@limiter.limit("5/minute")
def generate_linkedin_route(
    linkedin_request: LinkedInGenerateRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.credits is not None and current_user.credits <= 0:
        raise HTTPException(status_code=403, detail="No credits remaining")

    # Check free tier limit
    if current_user.tier == "free" and current_user.request_count >= 50:
        raise HTTPException(status_code=429, detail="Free tier limit reached. Upgrade to continue.")
    
    try:
        response = generate_linkedin_post(linkedin_request.topic, linkedin_request.tone)

        history_entry = AIHistory(
            user_email=current_user.email,
            feature_type="linkedin",
            input_text=str({"topic": linkedin_request.topic, "tone": linkedin_request.tone}),
            output_text=str(response),
        )
        db.add(history_entry)
        # Track usage
        current_user.request_count += 1
        current_user.total_requests += 1
        if current_user.credits is not None:
            current_user.credits -= 1
        db.commit()
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
