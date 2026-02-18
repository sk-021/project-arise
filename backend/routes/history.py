from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user, get_db
from models.history import AIHistory
from models.user import User

router = APIRouter(prefix="/history")

@router.get("/")
def get_user_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = (
        db.query(AIHistory)
        .filter(AIHistory.user_email == current_user.email)
        .order_by(AIHistory.created_at.desc())
        .all()
    )
    return [
        {
            "id": r.id,
            "user_email": r.user_email,
            "feature_type": r.feature_type,
            "input_text": r.input_text,
            "output_text": r.output_text,
            "created_at": r.created_at,
        }
        for r in records
    ]
