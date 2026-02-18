from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ml_service import ml_service

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str

@router.post("/analyze")
def analyze(request: AnalyzeRequest):
    try:
        result = ml_service.analyze(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
