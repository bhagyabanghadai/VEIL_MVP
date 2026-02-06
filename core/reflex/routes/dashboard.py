"""
VEIL Dashboard API: Stats Endpoint
Serves real-time metrics from the Ledger.
"""
import json
import os
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/api/v1", tags=["Dashboard"])

LEDGER_FILE = os.getenv("LEDGER_FILE", "veil.ledger.jsonl")

class StatsResponse(BaseModel):
    total_requests: int
    allowed_count: int
    blocked_count: int
    recent_logs: List[Dict[str, Any]]

@router.get("/stats", response_model=StatsResponse)
async def get_stats():
    """
    Read ledger and compute live stats.
    """
    total = 0
    allowed = 0
    blocked = 0
    recent = []
    
    try:
        with open(LEDGER_FILE, "r") as f:
            lines = f.readlines()
            
        for line in lines:
            try:
                entry = json.loads(line)
                # Skip Genesis
                if entry.get("event") == "GENESIS":
                    continue
                    
                total += 1
                data = entry.get("data", {})
                status = data.get("status_code", 0)
                
                if status == 200:
                    allowed += 1
                elif status in [403, 503]:
                    blocked += 1
                    
            except json.JSONDecodeError:
                continue
                
        # Get last 10 entries (excluding Genesis)
        for line in reversed(lines[-11:]):
            try:
                entry = json.loads(line)
                if entry.get("event") != "GENESIS":
                    recent.append({
                        "timestamp": entry.get("timestamp"),
                        "path": entry.get("data", {}).get("path", "N/A"),
                        "status": entry.get("data", {}).get("status_code", 0),
                        "latency": entry.get("data", {}).get("latency_ms", 0)
                    })
                    if len(recent) >= 10:
                        break
            except:
                continue
                
    except FileNotFoundError:
        pass
        
    return StatsResponse(
        total_requests=total,
        allowed_count=allowed,
        blocked_count=blocked,
        recent_logs=recent
    )

@router.get("/health")
async def dashboard_health():
    return {"status": "ok", "component": "dashboard_api"}
