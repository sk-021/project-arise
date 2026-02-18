from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from routes.health import router as health_router
from routes.analyze import router as analyze_router
from routes.resume import router as resume_router
from routes.projects import router as projects_router
from routes.linkedin import router as linkedin_router
from routes.auth import router as auth_router
from routes.history import router as history_router
from settings import settings
from rate_limiter import limiter
from logger import logger
import time

# Import models to ensure they are registered
from models import user
from models.user import User
from models.history import AIHistory

from database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name, debug=settings.debug)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        process_time = time.time() - start_time

        logger.info(
            f"{request.method} {request.url.path} "
            f"Status: {response.status_code} "
            f"Time: {process_time:.4f}s"
        )
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            f"{request.method} {request.url.path} "
            f"Status: 500 "
            f"Time: {process_time:.4f}s "
            f"Error: {str(e)}"
        )
        raise

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limit exception handler
@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Slow down."}
    )

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception handler called: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

# Set limiter in app state
app.state.limiter = limiter

app.include_router(auth_router)
app.include_router(history_router)
app.include_router(health_router)
app.include_router(analyze_router)
app.include_router(resume_router)
app.include_router(projects_router)
app.include_router(linkedin_router)
