"""
VEIL Configuration
Loads environment variables with Pydantic validation.

SECURITY NOTE: 
- INTERNAL_TOKEN MUST be set via .env or environment variable in production.
- Default value only exists for local development.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    ENV: str = "dev"
    # SECURITY: Override this in production! Use .env file or environment variable.
    INTERNAL_TOKEN: str = "dev-secret-token-CHANGE-IN-PROD"
    AUTHORIZED_PROXY_HASH: str = "sha256:54930c87ec0ee025a42dd2bb80d04de0ef4e571b34e2d51cd93be501c7b8e020" # mitmproxy:10.2.0
    REDIS_URL: str = "redis://redis:6379"

    class Config:
        env_file = ".env"
        extra = "ignore" # Prevent crash on unknown env vars (e.g. REFLEX_ENGINE_URL)

@lru_cache()
def get_settings():
    settings = Settings()
    # Production safety check
    if settings.ENV == "prod" and "CHANGE-IN-PROD" in settings.INTERNAL_TOKEN:
        raise ValueError("🔥 CRITICAL: INTERNAL_TOKEN must be set in production! Use .env file.")
    return settings

