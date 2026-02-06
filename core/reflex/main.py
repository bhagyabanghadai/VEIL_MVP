from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import uvicorn
from contextlib import asynccontextmanager

from .config import get_settings
from .layers.l1_identity import L1IdentityMiddleware

settings = get_settings()

app = FastAPI(title="VEIL Reflex Engine", version="4.0.0")

# Apply Layer 1: Identity Middleware
# Apply Layer 1: Identity Middleware
# app.add_middleware(L1IdentityMiddleware)  # CAUTION: Disabled for Phase 1 Connectivity Test

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
