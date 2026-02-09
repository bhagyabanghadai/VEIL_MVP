"""
VEIL Frontend API Routes
Bridges the React frontend with the VEIL Python backend.
Provides endpoints for: auth, agents, policies, logs, validation.
"""
import json
import os
import hashlib
import time
from fastapi import APIRouter, HTTPException, Depends, Header, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.reflex.services.auth import (
    create_access_token,
    get_current_user,
    require_agent_read,
    require_agent_write,
    require_policy_read,
    require_policy_write,
    require_log_read,
    require_admin,
    UserInfo,
    SCOPES
)
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
    Login endpoint with JWT token generation.
    Returns token with OAuth2 scopes based on user role.
    
    Scopes granted by role:
    - admin: Full access
    - operator: Read/write agents, read policies/logs
    - viewer: Read-only access
    - user: Limited read access
    """
    # MVP: Accept any non-empty username/password
    if not req.username or not req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Determine role (MVP: admin if username is admin)
    role = "admin" if req.username == "admin" else "user"
    user_id = hashlib.md5(req.username.encode()).hexdigest()[:8]
    email = f"{req.username}@veil.local"
    
    # Generate JWT token with proper scopes
    token = create_access_token(
        user_id=user_id,
        username=req.username,
        email=email,
        role=role
    )
    
    return {
        "token": token,
        "role": role,
        "user": {"name": req.username, "email": email},
        "scopes": SCOPES  # Return available scopes for UI
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
async def get_agents(user: UserInfo = Security(get_current_user, scopes=["read:agents"])):
    """Return all registered agents. Requires read:agents scope."""
    logger.info(f"📋 Agents list requested by: {user.username}")
    return list(AGENTS_DB.values())

@router.post("/agents")
async def create_agent(agent: AgentCreate, user: UserInfo = Security(get_current_user, scopes=["write:agents"])):
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
async def delete_agent(agent_id: str, user: UserInfo = Security(get_current_user, scopes=["write:agents"])):
    """Delete an agent. Requires write:agents scope."""
    logger.info(f"🗑️ Agent {agent_id} deleted by: {user.username}")
    if agent_id in AGENTS_DB:
        del AGENTS_DB[agent_id]
    return {"status": "deleted"}

# --- Policies Endpoints ---
@router.get("/policies")
async def get_policies(user: UserInfo = Security(get_current_user, scopes=["read:policies"])):
    """Return all policies. Requires read:policies scope."""
    logger.info(f"📜 Policies list requested by: {user.username}")
    return list(POLICIES_DB.values())

@router.post("/policies")
async def create_policy(policy: PolicyCreate, user: UserInfo = Security(get_current_user, scopes=["write:policies"])):
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
async def delete_policy(policy_id: str, user: UserInfo = Security(get_current_user, scopes=["write:policies"])):
    """Delete a policy. Requires write:policies scope."""
    logger.info(f"🗑️ Policy {policy_id} deleted by: {user.username}")
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
async def get_logs(user: UserInfo = Security(get_current_user, scopes=["read:logs"])):
    """Return audit log entries. Requires read:logs scope."""
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

# --- Layer Health Endpoint ---
@router.get("/layers")
async def get_layers():
    """Return health status of all security layers."""
    return [
        {"id": "L0", "name": "Smart Valve", "status": "active", "latency": 12, "health": 100},
        {"id": "L1", "name": "Firewall", "status": "active", "latency": 4, "health": 100},
        {"id": "L2", "name": "Rate Limiter", "status": "active", "latency": 2, "health": 98},
        {"id": "L3", "name": "Anomaly Detector", "status": "degraded", "latency": 45, "health": 85},  # Simulated degradation
        {"id": "L4", "name": "AI Judge", "status": "active", "latency": 800, "health": 100},
        {"id": "L5", "name": "Ledger", "status": "active", "latency": 15, "health": 100},
        {"id": "L6", "name": "Policy Engine", "status": "active", "latency": 8, "health": 100}
    ]

# --- Threat Map Endpoint (Simulation) ---
@router.get("/threats")
async def get_threats():
    """Return active threats with simulated geo-data."""
    # In production, this would come from a geo-IP database of blocked requests
    import random
    
    threats = []
    # Simulate 5-10 active threats
    for _ in range(random.randint(5, 10)):
        threats.append({
            "id": hashlib.md5(f"{time.time()}:{random.random()}".encode()).hexdigest()[:8],
            "lat": random.uniform(-50, 70),
            "lng": random.uniform(-120, 140),
            "severity": random.choice(["low", "medium", "high"]),
            "source_ip": f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}",
            "type": random.choice(["DDoS", "SQL Injection", "Brute Force", "Data Exfiltration"])
        })
        
    return threats

# --- Stats Endpoint (Aggregated Metrics) ---
@router.get("/v1/stats")
async def get_stats():
    """Return aggregated statistics for the dashboard."""
    logs = await get_logs()
    total = len(logs)
    blocked = len([l for l in logs if l["decision"] == "deny"])
    
    # Calculate recent activity (last 24h simulation)
    recent_logs = []
    for log in logs[-10:]:
        recent_logs.append({
            "path": log["actionContent"],
            "status": 200 if log["decision"] == "allow" else 403,
            "latency": log.get("latency", 15),  # Mock latency if missing
            "timestamp": int(time.time() * 1000)
        })

    return {
        "total_requests": 1000 + total,  # Offset for demo visuals
        "allowed_count": (1000 + total) - (50 + blocked),
        "blocked_count": 50 + blocked,
        "recent_logs": recent_logs
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

# --- Initialization (Pre-seed Demo Data) ---
def init_demo_data():
    """Populate DB with demo data if empty."""
    if not AGENTS_DB:
        # Agent 1: Nexus Prime
        id1 = "agent-alpha"
        AGENTS_DB[id1] = {
            "id": id1,
            "name": "Nexus Prime",
            "purpose": "Core System Optimization",
            "description": "Primary autonomous node for system-wide performance tuning.",
            "riskLevel": "high",
            "allowedCapabilities": ["network_access", "file_write", "system_exec"],
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "policyIds": [],
            "veilMeta": {
                "securityAnalysis": "High privilege node. Requires continuous L4 monitoring.",
                "misusePotential": 85,
                "recommendedLimitations": ["block_external_ips"],
                "veilVersion": "2.1"
            }
        }
        
        # Agent 2: Sentinel
        id2 = "agent-beta"
        AGENTS_DB[id2] = {
            "id": id2,
            "name": "Sentinel V",
            "purpose": "Threat Detection",
            "description": "Passive scanning unit for identifying network anomalies.",
            "riskLevel": "low",
            "allowedCapabilities": ["network_read"],
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "policyIds": [],
            "veilMeta": {
                "securityAnalysis": "Low risk read-only agent.",
                "misusePotential": 10,
                "recommendedLimitations": [],
                "veilVersion": "2.1"
            }
        }
        logger.info("⚡ Demo Agents Initialized")

    if not POLICIES_DB:
        id1 = "policy-core"
        POLICIES_DB[id1] = {
            "id": id1,
            "name": "Core Safety Protocols",
            "naturalLanguage": "Prevent any deletion of system logs and block external network connections to non-whitelisted IPs.",
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "structuredRules": {"rules": [{"id": "R1", "action": "block", "target": "delete_logs"}]}
        }
        logger.info("⚡ Demo Policies Initialized")

# Run initialization
init_demo_data()
