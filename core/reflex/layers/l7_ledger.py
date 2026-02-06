"""
VEIL Layer 7 Middleware: The Historian
Role: Capture Request/Response Lifecycle and Record to Immutable Ledger.
"""
import time
import json
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.background import BackgroundTask
from ..services.ledger import LedgerService

class L7LedgerMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.ledger = LedgerService()

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # 1. Capture Identity & Intent (Available from previous layers)
        # Note: We are the OUTERMOST layer, so we see the request *before* L1/L2/L3 process it fully,
        # BUT we want to log the *Decision*. 
        # Actually, if we are outermost, we wrap the call_next. The response will contain the result.
        
        response = await call_next(request)
        
        # 2. Extract Outcomes (Post-Process)
        process_time = time.time() - start_time
        
        # Extract verdict from response headers or body if possible?
        # For blocked requests, status code is 403/503.
        # Identity/Intent data might be in request state if L1/L2 put it there.
        # For MVP, we log what we can see from the surface.
        
        event_data = {
            "path": request.url.path,
            "method": request.method,
            "client_ip": request.client.host,
            "status_code": response.status_code,
            "latency_ms": round(process_time * 1000, 2),
            "layers_passed": "ALL" if response.status_code == 200 else "BLOCKED",
            # We ideally want the Intent ID or Risk Level, but without request.state access it's hard.
            # We can try to parse the header again for logging purposes.
            "intent_header_present": bool(request.headers.get("X-Veil-Intent"))
        }

        # 3. Async Write to Ledger (Don't block response)
        # We append a background task to the response
        response.background = BackgroundTask(self.ledger.sign_and_record, event_data)
        
        return response
