"""
Rate limiting configuration for the application.
"""
from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from settings import settings
import jwt

def get_user_id_from_jwt(request: Request) -> str:
    """Extract user email from JWT token for per-user rate limiting"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return get_remote_address(request)  # Fallback to IP if no token
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_email = payload.get("sub")
        return user_email if user_email else get_remote_address(request)
    except:
        return get_remote_address(request)  # Fallback to IP if token invalid

# Create limiter instance
limiter = Limiter(key_func=get_user_id_from_jwt)
