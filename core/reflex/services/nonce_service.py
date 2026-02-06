"""
VEIL Layer 2: Nonce Service (Anti-Replay Protection)
Uses Redis to track used nonces and prevent replay attacks.
"""
import redis
import logging
from ..config import get_settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("veil.l2.nonce")

class NonceService:
    """
    Atomic Nonce Tracking.
    If a nonce has been seen before within the TTL, the request is a replay.
    """
    def __init__(self):
        settings = get_settings()
        try:
            self.client = redis.from_url(settings.REDIS_URL)
            self.client.ping()
            logger.info("🔐 Nonce Service Connected to Redis.")
        except redis.ConnectionError as e:
            logger.error(f"❌ Redis connection failed: {e}")
            self.client = None

    def check_and_set(self, nonce: str, ttl_seconds: int = 300) -> bool:
        """
        Check if nonce is fresh. If yes, mark it as used.
        
        Returns:
            True: Nonce is NEW (Safe to proceed).
            False: Nonce is REUSED (Replay Attack!).
        """
        if not self.client:
            logger.warning("⚠️ Redis unavailable. Allowing by default (Fail-Open for dev).")
            return True  # Fail-open in dev; change to False in prod
        
        key = f"veil:nonce:{nonce}"
        
        # SETNX: Set if Not eXists (atomic)
        was_set = self.client.setnx(key, "1")
        
        if was_set:
            # First time seeing this nonce
            self.client.expire(key, ttl_seconds)
            logger.info(f"✅ Nonce {nonce[:8]}... is FRESH.")
            return True
        else:
            # Replay detected!
            logger.warning(f"🚨 REPLAY DETECTED! Nonce {nonce[:8]}... already used.")
            return False
