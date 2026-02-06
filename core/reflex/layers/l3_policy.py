"""
VEIL Layer 3: Policy Enforcement (The Bailiff)
Role: Enforce deterministic OPA rules with "Fail-Closed" safety.
Features:
- Stream Buffering (Deep Inspection)
- Connection Fail-Closed
- Binary Verdict Enforcement
"""
import json
import logging
import aiohttp
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.concurrency import iterate_in_threadpool
import os

OPA_URL = os.getenv("OPA_URL", "http://veil-opa:8181/v1/data/veil/allow")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("veil.l3.policy")

class L3PolicyMiddleware(BaseHTTPMiddleware):
    # Paths that bypass Policy Engine (public routes)
    BYPASS_PATHS = ["/health", "/docs", "/openapi.json", "/dashboard", "/api/v1/stats", "/api/v1/health"]

    async def dispatch(self, request: Request, call_next):
        # Bypass for whitelisted paths
        if any(request.url.path.startswith(p) for p in self.BYPASS_PATHS):
            return await call_next(request)

        # 1. Deep Context Inspection (Body Buffering)
        # We must read the body for OPA, but also keep it for the App.
        # FastAPI/Starlette consumes the stream on read. We use specific technique to restore it.
        try:
            body_bytes = await request.body()
            
            # Re-seed the request body iterator for downstream layers (Core Engine)
            async def receive():
                return {"type": "http.request", "body": body_bytes, "more_body": False}
            request._receive = receive
            
            # Parse body for OPA if it's JSON
            payload = {}
            if body_bytes:
                try:
                    payload = json.loads(body_bytes)
                except:
                    payload = {"raw_size": len(body_bytes)} # Send size if not JSON

        except Exception as e:
            logger.error(f"⚠️ L3: Body Read Error: {e}")
            payload = {}

        # 2. Construct Policy Input
        # Get Intent from Header (L2 should have validated it exists, but strict check here)
        intent_header = request.headers.get("X-Veil-Intent", "{}")
        try:
            intent = json.loads(intent_header)
        except:
            intent = {}

        opa_input = {
            "input": {
                "method": request.method,
                "path": request.url.path,
                "intent": intent,
                "payload": payload,
                "client_ip": request.client.host
            }
        }

        # 3. Query OPA (The Judge)
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(OPA_URL, json=opa_input, timeout=0.5) as response:
                    if response.status != 200:
                        logger.error(f"🔥 L3: OPA Error {response.status}. FAIL-CLOSED.")
                        return await self._reject(503, "Reflex L3: Policy Engine Unavailable")
                    
                    decision = await response.json()
                    # OPA Return format: { "result": true/false }
                    allowed = decision.get("result", False)

                    if not allowed:
                        logger.warning(f"⛔ L3: POLICY VIOLATION. Path={request.url.path}, Risk={intent.get('risk_level')}")
                        return await self._reject(403, "Reflex L3: Policy Violation (Rego Deny)")

        except Exception as e:
             logger.error(f"🔥 L3: OPA Unreachable: {e}. FAIL-CLOSED.")
             return await self._reject(503, "Reflex L3: Policy Engine Unreachable")

        # 4. Proceed (Verdict: Allowed)
        logger.info(f"✅ L3: Policy Passed.")
        response = await call_next(request)
        return response

    async def _reject(self, status_code: int, detail: str):
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=status_code,
            content={"verdict": "BLOCK", "reason": detail}
        )
