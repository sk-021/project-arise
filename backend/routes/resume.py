from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from services.ai_service import analyze_resume
from auth import get_current_user, get_db
from models.user import User
from models.history import AIHistory
from rate_limiter import limiter

router = APIRouter(prefix="/resume")

class ResumeAnalyzeRequest(BaseModel):
    resume_text: str

@router.get("/")
def get_resume():
    return {"message": "Resume endpoint"}

@router.post("/analyze")
@limiter.limit("5/minute")
def analyze_resume_route(
    resume_request: ResumeAnalyzeRequest,
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
        response = analyze_resume(resume_request.resume_text)

        history_entry = AIHistory(
            user_email=current_user.email,
            feature_type="resume",
            input_text=resume_request.resume_text,
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
