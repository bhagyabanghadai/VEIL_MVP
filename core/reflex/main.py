from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import uvicorn
from contextlib import asynccontextmanager

from .config import get_settings
from .layers.l1_identity import L1IdentityMiddleware
from .layers.l2_intent import L2IntentMiddleware
from .layers.l3_policy import L3PolicyMiddleware

settings = get_settings()

app = FastAPI(title="VEIL Reflex Engine", version="4.0.0")

# Apply Layer 3: Policy Engine (Wraps L1/L2? No, runs AFTER them but BEFORE app)
# Wait, Starlette Middleware wraps from OUTSIDE IN.
# Dispatch Flow: M3(M2(M1(App))) -> Request hits M3 -> M2 -> M1 -> App
# We want: L1 (Identity) -> L2 (Intent) -> L3 (Policy) -> App
# So L1 must be OUTERMOST.
# Stack order in add_middleware (LIFO):
# 1. add(L3) -> App wrapped by L3
# 2. add(L2) -> (L3(App)) wrapped by L2 -> L2(L3(App))
# 3. add(L1) -> (L2(L3(App))) wrapped by L1 -> L1(L2(L3(App)))
# Correct Order of code lines: Add L3, then L2, then L1.

# Apply Layer 3: Policy Engine (Inner - runs after L2)
app.add_middleware(L3PolicyMiddleware)  # Phase 4: The Judge

# Apply Layer 2: Intent Middleware (Middle)
app.add_middleware(L2IntentMiddleware)  # Phase 3: Cognitive Accountability

# Apply Layer 1: Identity Middleware (Outermost - runs first)
app.add_middleware(L1IdentityMiddleware)  # Phase 2: Security Gate Enabled

print(f"🧠 Reflex Engine Online. Env: {settings.ENV}")


class AssessmentRequest(BaseModel):
    method: str
    url: str
    host: str
    headers: dict

class AssessmentResponse(BaseModel):
    verdict: str
    reason: str = "Default Policy"

@app.get("/health")
async def health_check():
    return {"status": "active", "layer": "L5"}

@app.post("/v1/assess", response_model=AssessmentResponse)
async def assess_request(assessment: AssessmentRequest):
    """
    L5 Traffic Controller Logic (Phase 1 Stub)
    Current Logic: ALLOW everything suitable for connectivity testing.
    """
    print(f"🧠 Processing Request: {assessment.method} {assessment.host}")
    
    # Phase 1: Simple Connectivity Check
    return {
        "verdict": "ALLOW",
        "reason": "Phase 1 Stub - All Systems Go"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
