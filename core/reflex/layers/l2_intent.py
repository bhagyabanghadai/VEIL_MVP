"""
VEIL Layer 2: Intent Interface Middleware
Role: Enforce Cognitive Accountability - Agent must declare "why" before "what".
"""
import json
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from pydantic import ValidationError

from ..models.intent import IntentPayload
from ..services.nonce_service import NonceService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("veil.l2.intent")

class L2IntentMiddleware(BaseHTTPMiddleware):
    """
    The Handshake Gate.
    Validates:
    1. Schema: Is the intent JSON valid?
    2. Cross-Check: Does intent.action match the actual request?
    3. Replay: Is the nonce unique?
    """
    def __init__(self, app):
        super().__init__(app)
        self.nonce_service = NonceService()

    async def dispatch(self, request: Request, call_next):
        # Bypass for health checks and internal endpoints
        if request.url.path in ["/health", "/docs", "/openapi.json"]:
            return await call_next(request)

        # 1. Extract Intent Header
        intent_header = request.headers.get("X-Veil-Intent")
        
        if not intent_header:
            logger.warning("⚠️ L2: Missing Intent Header.")
            return await self._reject(403, "Reflex L2: Missing Intent Declaration")

        # 2. Parse and Validate Schema
        try:
            intent_data = json.loads(intent_header)
            intent = IntentPayload(**intent_data)
        except json.JSONDecodeError as e:
            logger.warning(f"⚠️ L2: Invalid JSON in Intent Header: {e}")
            return await self._reject(403, "Reflex L2: Invalid Intent JSON")
        except ValidationError as e:
            logger.warning(f"⚠️ L2: Schema Validation Failed: {e}")
            return await self._reject(403, f"Reflex L2: Intent Schema Error - {e.errors()}")

        # 3. Cross-Check: Does intent.action match the actual request?
        actual_action = f"{request.method} {request.url.path}"
        
        if intent.action != actual_action:
            logger.warning(f"🚨 L2: ACTION MISMATCH! Claimed='{intent.action}', Actual='{actual_action}'")
            return await self._reject(403, f"Reflex L2: Intent-Action Mismatch (Claimed: {intent.action}, Actual: {actual_action})")

        # 4. Replay Check
        if not self.nonce_service.check_and_set(intent.nonce):
            logger.warning(f"🚨 L2: REPLAY ATTACK DETECTED! Nonce={intent.nonce[:8]}...")
            return await self._reject(403, "Reflex L2: Replay Attack Detected (Nonce Already Used)")

        # All checks passed!
        logger.info(f"✅ L2: Intent Verified. Goal='{intent.goal}', Risk='{intent.risk_level.value}'")
        
        # Proceed to next layer
        response = await call_next(request)
        return response

    async def _reject(self, status_code: int, detail: str):
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=status_code,
            content={"verdict": "BLOCK", "reason": detail}
        )
