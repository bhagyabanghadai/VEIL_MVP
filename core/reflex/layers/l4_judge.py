"""
VEIL Layer 4: Semantic Flash Judge (The Wise One)
Role: Contextual Understanding using LLMs.
Path Logic:
- Low Risk -> Fast Path (Skip Judge).
- Medium Risk -> Judge (Check Cache -> Call LLM).
- Verdict -> If Confidence < 0.7 -> BLOCK.
"""
import json
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from ..services.llm_judge import LLMJudge

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("veil.l4.judge")

class L4JudgeMiddleware(BaseHTTPMiddleware):
    # Paths that bypass Judge (public routes)
    BYPASS_PATHS = ["/health", "/docs", "/openapi.json", "/dashboard", "/api/v1/stats", "/api/v1/health", "/api/auth", "/api/agents", "/api/policies", "/api/logs", "/api/validate", "/api/insights"]

    def __init__(self, app):
        super().__init__(app)
        self.judge = LLMJudge()

    async def dispatch(self, request: Request, call_next):
        # Bypass for whitelisted paths
        if any(request.url.path.startswith(p) for p in self.BYPASS_PATHS):
            return await call_next(request)

        # 1. Extract Intent and Payload Context
        # Note: L2 validated header format. L3 optionally buffered body.
        # Ideally, we should access the request state or headers passed down.
        # For MVP, we re-parse header. Body access relies on L3's stream restoration.
        
        intent_header = request.headers.get("X-Veil-Intent", "{}")
        try:
            intent = json.loads(intent_header)
        except:
            # Should have been blocked by L2, but fail safe.
            return await call_next(request)

        risk_level = intent.get("risk_level", "low")
        justification = intent.get("justification", "")
        
        # 2. Fast Path: Low Risk
        if risk_level == "low":
            logger.info("🟢 L4: Fast Path (Low Risk) - Skipping Judge.")
            return await call_next(request)

        # 3. Medium Path: Invoke Judge
        # We need payload summary. For MVP, we'll try to read body if available.
        # Warning: Reading body here must be safe (L3 buffered it).
        payload_summary = "No Payload"
        try:
            body_bytes = await request.body()            
            # Restore stream again for L5?
            # If we read it, we consume it. L3 restored it once. If we consume it again, we must restore it again.
            async def receive():
                return {"type": "http.request", "body": body_bytes, "more_body": False}
            request._receive = receive
            
            if body_bytes:
                payload_summary = body_bytes.decode('utf-8')[:500] # Limit context size
        except Exception as e:
            logger.warning(f"⚠️ L4: Could not read payload: {e}")

        logger.info(f"🤔 L4: Invoking Judge for '{justification}'...")
        
        is_allowed, confidence, reason = await self.judge.evaluate(justification, payload_summary)

        if is_allowed and confidence >= 0.7:
             logger.info(f"✅ L4: Judge Approved. ({confidence})")
             return await call_next(request)
        else:
             logger.warning(f"⛔ L4: Judge Skeptical! Verdict={is_allowed}, Conf={confidence}, Reason='{reason}'")
             return await self._reject(403, f"Reflex L4: Judge Denied - {reason}")

    async def _reject(self, status_code: int, detail: str):
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=status_code,
            content={"verdict": "BLOCK", "reason": detail}
        )
