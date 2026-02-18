from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "FastAPI App"
    debug: bool = False
    
    # JWT Configuration
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Database Configuration
    DATABASE_URL: str = "sqlite:///./app2.db"
    
    # AI Service Configuration
    provider: str = "ollama"
    ollama_base_url: str = "http://localhost:11434"
    model_name: str = "llama3:8b"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()

if not settings.SECRET_KEY:
    raise RuntimeError("SECRET_KEY is missing. Set SECRET_KEY in backend/.env")
