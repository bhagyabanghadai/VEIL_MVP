"""
VEIL Configuration
Loads environment variables with Pydantic validation.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    ENV: str = "dev"
    INTERNAL_TOKEN: str = "dev-secret-token" # Default for dev, override in prod. Phase 2: Verified.
    AUTHORIZED_PROXY_HASH: str = "sha256:54930c87ec0ee025a42dd2bb80d04de0ef4e571b34e2d51cd93be501c7b8e020" # mitmproxy:10.2.0
    REDIS_URL: str = "redis://redis:6379"

    class Config:
        env_file = ".env"
        extra = "ignore" # Prevent crash on unknown env vars (e.g. REFLEX_ENGINE_URL)

@lru_cache()
def get_settings():
    return Settings()
