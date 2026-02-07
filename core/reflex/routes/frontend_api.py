"""
VEIL Frontend API Routes
Bridges the React frontend with the VEIL Python backend.
Provides endpoints for: auth, agents, policies, logs, validation.
"""
import json
import os
import hashlib
import time
from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging

logger = logging.getLogger("veil.api.frontend")

router = APIRouter(prefix="/api", tags=["Frontend API"])

# --- In-Memory Storage (MVP - Replace with DB for production) ---
AGENTS_DB: Dict[str, dict] = {}
POLICIES_DB: Dict[str, dict] = {}
LOGS_DB: List[dict] = []

# --- Models ---
class LoginRequest(BaseModel):
    username: str
    password: str

class AgentCreate(BaseModel):
    name: str
    purpose: str
    description: str = ""
    riskLevel: str = "low"
    allowedCapabilities: List[str] = []

class PolicyCreate(BaseModel):
    id: Optional[str] = None
    name: str
    naturalLanguage: str
    structuredRules: Optional[dict] = None

class ValidateRequest(BaseModel):
    agentId: str
    actionContent: str
    actionType: str = "text"
    mimeType: Optional[str] = None
    policies: List[dict] = []
    useThinking: bool = False

# --- Auth Endpoints ---
@router.post("/auth/login")
async def login(req: LoginRequest):
    """
    Simple login endpoint for MVP.
    In production, use proper OAuth2/JWT with password hashing.
    """
    # MVP: Accept any non-empty username/password
    if not req.username or not req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate a simple token (NOT for production!)
    token = hashlib.sha256(f"{req.username}:{time.time()}".encode()).hexdigest()[:32]
    
    return {
        "token": token,
        "role": "admin" if req.username == "admin" else "user",
        "user": {"name": req.username, "email": f"{req.username}@veil.local"}
    }

@router.post("/auth/register")
async def register(name: str = "", email: str = "", password: str = ""):
    token = hashlib.sha256(f"{email}:{time.time()}".encode()).hexdigest()[:32]
    return {
        "token": token,
        "user": {"name": name, "email": email}
    }

# --- Agents Endpoints ---
@router.get("/agents")
async def get_agents():
    """Return all registered agents."""
    return list(AGENTS_DB.values())

@router.post("/agents")
async def create_agent(agent: AgentCreate):
    """Register a new agent."""
    agent_id = f"agent-{hashlib.md5(agent.name.encode()).hexdigest()[:8]}"
    new_agent = {
        "id": agent_id,
        "name": agent.name,
        "purpose": agent.purpose,
        "description": agent.description,
        "riskLevel": agent.riskLevel,
        "allowedCapabilities": agent.allowedCapabilities,
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "policyIds": [],
        "veilMeta": {
            "securityAnalysis": "Pending VEIL analysis...",
            "misusePotential": 50,
            "recommendedLimitations": [],
            "veilVersion": "8.0-Python"
        }
    }
    AGENTS_DB[agent_id] = new_agent
    logger.info(f"✅ Agent registered: {agent.name}")
    return new_agent

@router.delete("/agents/{agent_id}")
async def delete_agent(agent_id: str):
    if agent_id in AGENTS_DB:
        del AGENTS_DB[agent_id]
    return {"status": "deleted"}

# --- Policies Endpoints ---
@router.get("/policies")
async def get_policies():
    """Return all policies."""
    return list(POLICIES_DB.values())

@router.post("/policies")
async def create_policy(policy: PolicyCreate):
    """Create a new policy."""
    policy_id = policy.id or f"policy-{hashlib.md5(policy.name.encode()).hexdigest()[:8]}"
    new_policy = {
        "id": policy_id,
        "name": policy.name,
        "naturalLanguage": policy.naturalLanguage,
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "structuredRules": policy.structuredRules or {"rules": []}
    }
    POLICIES_DB[policy_id] = new_policy
    logger.info(f"✅ Policy created: {policy.name}")
    return new_policy

@router.delete("/policies/{policy_id}")
async def delete_policy(policy_id: str):
    if policy_id in POLICIES_DB:
        del POLICIES_DB[policy_id]
    return {"status": "deleted"}

@router.post("/policies/convert")
async def convert_policy(data: dict):
    """Convert natural language to structured rules (MVP stub)."""
    natural_language = data.get("naturalLanguage", "")
    
    # MVP: Return basic structure
    return {
        "rules": [
            {
                "rule_id": f"R-{hashlib.md5(natural_language.encode()).hexdigest()[:6]}",
                "description": natural_language[:100],
                "severity": "medium"
            }
        ]
    }

# --- Logs Endpoints ---
@router.get("/logs")
async def get_logs():
    """Return audit log entries."""
    # Read from VEIL ledger file if available
    ledger_file = os.getenv("LEDGER_FILE", "veil.ledger.jsonl")
    logs = []
    
    try:
        with open(ledger_file, "r") as f:
            for line in f:
                try:
                    entry = json.loads(line)
                    if entry.get("event") == "GENESIS":
                        continue
                    
                    data = entry.get("data", {})
                    logs.append({
                        "id": f"log-{entry.get('timestamp', 0)}",
                        "agentId": "system",
                        "actionType": data.get("method", "UNKNOWN"),
                        "actionContent": data.get("path", "/"),
                        "decision": "allow" if data.get("status_code") == 200 else "deny",
                        "riskScore": 0 if data.get("status_code") == 200 else 75,
                        "reasons": [data.get("layers_passed", "")],
                        "resolution": "NONE",
                        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.localtime(entry.get("timestamp", 0)))
                    })
                except:
                    continue
    except FileNotFoundError:
        pass
    
    return logs[-100:]  # Return last 100 entries

@router.patch("/logs/{log_id}/resolve")
async def resolve_log(log_id: str, data: dict):
    """Resolve a log entry."""
    return {
        "id": log_id,
        "resolution": data.get("resolution", "REVIEWED"),
        "notes": data.get("notes", ""),
        "resolver": data.get("resolver", "Admin")
    }

# --- Insights Endpoint ---
@router.get("/insights")
async def get_insights():
    """Return system insights summary."""
    return {
        "summary": "VEIL System operating normally. 7 security layers active.",
        "riskTrend": "stable",
        "criticalAlerts": []
    }

# --- Validation Endpoint (Core VEIL Integration) ---
@router.post("/validate")
async def validate_action(req: ValidateRequest):
    """
    Core VEIL validation endpoint.
    This bridges the frontend to the internal VEIL layers (L1-L4).
    """
    from core.reflex.services.llm_judge import LLMJudge
    
    # Determine risk level from agent risk
    risk_score = 50  # Default medium
    decision = "allow"
    reasons = []
    
    # Check for obvious attacks (Pre-LLM)
    judge = LLMJudge()
    attack_check = judge._pre_check_attack(req.actionContent)
    
    if attack_check:
        decision = "deny"
        risk_score = 95
        reasons.append(f"Pre-Check Block: {attack_check}")
    else:
        # Simple keyword-based risk assessment for MVP
        high_risk_keywords = ["delete", "drop", "password", "credential", "bank"]
        content_lower = req.actionContent.lower()
        
        for keyword in high_risk_keywords:
            if keyword in content_lower:
                risk_score += 20
                reasons.append(f"Contains risk keyword: {keyword}")
        
        if risk_score >= 80:
            decision = "flagged"
        elif risk_score >= 100:
            decision = "deny"
    
    # Add applied policies
    applied_policies = [p.get("name", "Unknown") for p in req.policies]
    
    return {
        "decision": decision,
        "riskScore": min(risk_score, 100),
        "misbehaviorScore": risk_score // 2,
        "appliedPolicies": applied_policies,
        "reasons": reasons if reasons else ["Standard evaluation complete"],
        "signature": hashlib.sha256(f"{req.agentId}:{req.actionContent}".encode()).hexdigest()[:16],
        "usedThinking": req.useThinking
    }
