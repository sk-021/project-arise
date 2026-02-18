import json
import logging
import requests
from typing import Dict, Any
from fastapi import HTTPException
from settings import settings

logger = logging.getLogger(__name__)

def call_llm(system_prompt: str, user_prompt: str) -> Dict[str, Any]:
    if settings.provider != "ollama":
        error_msg = "Only Ollama provider enabled in this build."
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)
    
    url = f"{settings.ollama_base_url}/api/chat"
    
    data = {
        "model": settings.model_name,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "stream": False,
        "options": {
            "temperature": 0.3,
            "top_p": 0.9
        }
    }
    
    try:
        response = requests.post(url, json=data, timeout=60)
        
        logger.info(f"Ollama status: {response.status_code}")
        
        if response.status_code != 200:
            error_msg = f"Ollama error: {response.text}"
            logger.error(error_msg)
            raise HTTPException(status_code=500, detail=error_msg)
        
        try:
            data = response.json()
        except json.JSONDecodeError:
            error_msg = "Ollama returned invalid JSON"
            logger.error(error_msg)
            raise HTTPException(status_code=500, detail=error_msg)
        
        content = data.get("message", {}).get("content")
        if not content:
            error_msg = "Ollama returned empty response"
            logger.error(error_msg)
            raise HTTPException(status_code=500, detail=error_msg)
        
        try:
            structured_output = json.loads(content)
        except json.JSONDecodeError:
            error_msg = "LLM returned invalid JSON format"
            logger.error(error_msg)
            raise HTTPException(status_code=500, detail=error_msg)
        
        return structured_output
    
    except requests.exceptions.Timeout:
        error_msg = "Ollama request timed out."
        logger.error(error_msg)
        raise HTTPException(status_code=408, detail=error_msg)
    except requests.exceptions.ConnectionError:
        error_msg = "Cannot connect to Ollama. Ensure Ollama is running."
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)
    except requests.exceptions.RequestException as e:
        error_msg = f"API request failed: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

def analyze_resume(resume_text: str) -> Dict[str, Any]:
    system_prompt = "You are a strict technical recruiter. Score resumes realistically (0-100). Penalize weak resumes heavily. Reward quantified impact and technical skills. Return ONLY valid JSON. Do NOT use markdown. Do NOT add explanation. Do NOT add text outside JSON."
    user_prompt = f"""
    Analyze this resume and respond with JSON in this exact format:
    {{
      "score": number,
      "strengths": [],
      "weaknesses": [],
      "suggestions": []
    }}
    
    Resume: {resume_text}
    """
    
    return call_llm(system_prompt, user_prompt)

def enhance_bullet(bullet: str) -> Dict[str, Any]:
    system_prompt = "You are an expert resume writer. Rewrite bullets to be strong, action-oriented, and concise. Create impact versions with quantification. Do NOT invent metrics, percentages, or impact numbers. Only improve wording. If no measurable data is provided, do not fabricate it. Return ONLY valid JSON. Do NOT use markdown. Do NOT add explanation. Do NOT add text outside JSON."
    user_prompt = f"""
    Rewrite this bullet point and respond with JSON in this exact format:
    {{
      "original": "...",
      "enhanced": "...",
      "impact_version": "..."
    }}
    
    Original: {bullet}
    """
    
    return call_llm(system_prompt, user_prompt)

def generate_linkedin_post(topic: str, tone: str) -> Dict[str, Any]:
    system_prompt = "You are a LinkedIn content expert. Create strong hooks, 6-10 line bodies, and engaging CTAs. Tone can be professional, confident, or storytelling. Return ONLY valid JSON. Do NOT use markdown. Do NOT add explanation. Do NOT add text outside JSON."
    user_prompt = f"""
    Generate a LinkedIn post about "{topic}" with a "{tone}" tone and respond with JSON in this exact format:
    {{
      "hook": "...",
      "body": "...",
      "cta": "..."
    }}
    
    Topic: {topic}
    Tone: {tone}
    """
    
    return call_llm(system_prompt, user_prompt)

class AIService:
    def analyze_resume(self, resume_text: str):
        return analyze_resume(resume_text)

    def enhance_bullet(self, bullet: str):
        return enhance_bullet(bullet)

    def generate_linkedin_post(self, topic: str, tone: str):
        return generate_linkedin_post(topic, tone)

    def analyze_projects(self, data):
        return {"analysis": "Mock projects analysis"}

    def analyze_linkedin(self, data):
        return {"analysis": "Mock LinkedIn analysis"}

ai_service = AIService()
