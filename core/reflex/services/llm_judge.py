"""
VEIL Layer 4 Service: Semantic Flash Judge
Role: Assessing entailment between Justification and Payload.
Features:
- Verdict Caching (Redis)
- JSON Mode (Ollama)
- Semantic Entailment
- Pre-LLM Attack Detection (Deterministic)
- Fail-Closed (Security First)
"""
import hashlib
import json
import logging
import os
import re
import aiohttp
from typing import Tuple, Optional
from .nonce_service import NonceService  # Re-using for Redis connection access if needed, or creating new

# Direct Redis access for caching (we could reuse NonceService client but cleaner to have dedicated)
import redis.asyncio as redis

logger = logging.getLogger("veil.l4.judge")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://veil-ollama:11434/api/generate")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")

# Deterministic Attack Patterns (Pre-LLM Check)
ATTACK_PATTERNS = [
    r"DROP\s+TABLE",
    r"DELETE\s+FROM",
    r"TRUNCATE\s+TABLE",
    r"ALTER\s+TABLE",
    r"INSERT\s+INTO.*VALUES",
    r"UPDATE\s+.*SET",
    r"exec\s*\(",
    r"eval\s*\(",
    r"<script>",
    r"javascript:",
    r"rm\s+-rf",
    r"curl\s+.*\|.*sh",
    r"wget\s+.*\|.*sh",
]
ATTACK_REGEX = re.compile("|".join(ATTACK_PATTERNS), re.IGNORECASE)

class LLMJudge:
    def __init__(self):
        self.redis = redis.from_url(REDIS_URL, decode_responses=True)

    async def _get_cache(self, key: str) -> Optional[dict]:
        try:
            data = await self.redis.get(key)
            return json.loads(data) if data else None
        except Exception as e:
            logger.warning(f"⚠️ L4: Cache Read Error: {e}")
            return None

    async def _set_cache(self, key: str, value: dict, ttl: int = 3600):
        try:
            await self.redis.setex(key, ttl, json.dumps(value))
        except Exception as e:
            logger.warning(f"⚠️ L4: Cache Write Error: {e}")

    def _pre_check_attack(self, payload_summary: str) -> Optional[str]:
        """
        Deterministic pre-LLM check for obvious attack patterns.
        Returns attack type if detected, None otherwise.
        """
        match = ATTACK_REGEX.search(payload_summary)
        if match:
            return f"Dangerous pattern detected: {match.group()}"
        return None

    async def evaluate(self, justification: str, payload_summary: str) -> Tuple[bool, float, str]:
        """
        Returns: (is_allowed, confidence, reason)
        """
        # 0. Pre-LLM Attack Detection (Deterministic, Fast)
        attack_reason = self._pre_check_attack(payload_summary)
        if attack_reason:
            logger.warning(f"🚨 L4: Pre-Check BLOCK: {attack_reason}")
            return False, 1.0, f"Pre-Check Block: {attack_reason}"

        # 1. Check Cache
        # Create a deterministic hash of the input pair
        input_str = f"{justification}|{payload_summary}"
        cache_key = f"veil:l4:judge:{hashlib.sha256(input_str.encode()).hexdigest()}"
        
        cached = await self._get_cache(cache_key)
        if cached:
            logger.info(f"⚡ L4: Cache Hit! Verdict={cached['verdict']}")
            return cached['verdict'], cached['confidence'], cached['reason']

        # 2. Construct Prompt
        prompt = f"""
        You are a security judge.
        JUSTIFICATION: "{justification}"
        EVIDENCE: "{payload_summary}"
        QUESTION: Does the EVIDENCE support the JUSTIFICATION?
        Respond valid JSON: {{ "verdict": boolean, "confidence": float, "reason": string }}
        """

        # 3. Call Ollama (The Brain)
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": "llama3.2:1b",
                    "prompt": prompt,
                    "format": "json",
                    "stream": False
                }
                async with session.post(OLLAMA_URL, json=payload, timeout=5.0) as resp:
                    if resp.status != 200:
                        logger.error(f"🔥 L4: Ollama Error {resp.status}. FAIL-CLOSED.")
                        return False, 0.0, "Judge Unavailable (Fail-Closed)"
                    
                    data = await resp.json()
                    response_text = data.get("response", "{}")
                    
                    # Parse JSON response
                    try:
                        decision = json.loads(response_text)
                        verdict = decision.get("verdict", False)
                        confidence = decision.get("confidence", 0.0)
                        reason = decision.get("reason", "Unknown")
                        
                        # Skeptical Default: If confidence < 0.7, override to BLOCK
                        if verdict and confidence < 0.7:
                            logger.warning(f"⚠️ L4: Low Confidence ({confidence}). Skeptical Override → BLOCK")
                            verdict = False
                            reason = f"Skeptical Override: Confidence too low ({confidence})"
                        
                        # 4. Update Cache
                        await self._set_cache(cache_key, {
                            "verdict": verdict,
                            "confidence": confidence,
                            "reason": reason
                        })
                        
                        logger.info(f"🧠 L4: Judge Verdict: {verdict} ({confidence})")
                        return verdict, confidence, reason

                    except json.JSONDecodeError:
                        logger.error(f"⚠️ L4: Invalid JSON from Judge: {response_text}. FAIL-CLOSED.")
                        return False, 0.0, "Invalid Judge Output (Fail-Closed)"

        except Exception as e:
            logger.error(f"🔥 L4: Judge Exception: {e}. FAIL-CLOSED.")
            return False, 0.0, f"Judge Error (Fail-Closed): {str(e)[:50]}"


