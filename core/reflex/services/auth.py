"""
VEIL Authentication Service
Implements FastAPI Security() patterns with OAuth2 and JWT.
Based on Context7 FastAPI best practices.
"""
import os
import time
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Security, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, SecurityScopes
from pydantic import BaseModel
import logging

logger = logging.getLogger("veil.auth")

# Security scheme for OpenAPI docs
security_scheme = HTTPBearer(
    scheme_name="JWT",
    description="VEIL API authentication using JWT Bearer tokens"
)

# --- Configuration ---
SECRET_KEY = os.getenv("VEIL_SECRET_KEY", "veil-dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- OAuth2 Scopes ---
SCOPES = {
    "read:agents": "Read agent data",
    "write:agents": "Create, update, delete agents", 
    "read:policies": "Read security policies",
    "write:policies": "Create, update, delete policies",
    "read:logs": "Read audit logs",
    "admin": "Full administrative access"
}

# Role to scopes mapping
ROLE_SCOPES = {
    "admin": list(SCOPES.keys()),
    "operator": ["read:agents", "write:agents", "read:policies", "read:logs"],
    "viewer": ["read:agents", "read:policies", "read:logs"],
    "user": ["read:agents", "read:logs"]
}


class TokenData(BaseModel):
    """JWT Token payload structure."""
    user_id: str
    username: str
    email: str
    role: str
    scopes: list[str] = []
    exp: Optional[float] = None


class UserInfo(BaseModel):
    """User information returned from token validation."""
    user_id: str
    username: str
    email: str
    role: str
    scopes: list[str]


def create_access_token(
    user_id: str,
    username: str,
    email: str,
    role: str = "user",
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token with scopes based on user role.
    
    For MVP: Using a simple hash-based approach.
    In production: Use proper JWT library (python-jose or PyJWT).
    """
    # Get scopes for the user's role
    scopes = ROLE_SCOPES.get(role, ROLE_SCOPES["user"])
    
    # Calculate expiration
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    
    # Create token payload
    payload = {
        "user_id": user_id,
        "username": username,
        "email": email,
        "role": role,
        "scopes": scopes,
        "exp": expire.timestamp()
    }
    
    # For MVP: Simple encoded token (in production, use proper JWT signing)
    import json
    import base64
    payload_str = json.dumps(payload)
    signature = hashlib.sha256(f"{payload_str}:{SECRET_KEY}".encode()).hexdigest()[:16]
    token = base64.b64encode(f"{payload_str}|{signature}".encode()).decode()
    
    logger.info(f"🔐 Token created for user: {username} with role: {role}")
    return token


def decode_token(token: str) -> TokenData:
    """
    Decode and validate JWT token.
    
    Raises HTTPException if token is invalid or expired.
    """
    import json
    import base64
    
    try:
        decoded = base64.b64decode(token.encode()).decode()
        payload_str, signature = decoded.rsplit("|", 1)
        
        # Verify signature
        expected_sig = hashlib.sha256(f"{payload_str}:{SECRET_KEY}".encode()).hexdigest()[:16]
        if signature != expected_sig:
            raise ValueError("Invalid signature")
        
        payload = json.loads(payload_str)
        
        # Check expiration
        if payload.get("exp", 0) < time.time():
            raise ValueError("Token expired")
        
        return TokenData(**payload)
        
    except Exception as e:
        logger.warning(f"❌ Token decode failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    security_scopes: SecurityScopes,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme)
) -> UserInfo:
    """
    FastAPI Security() dependency for validating JWT and checking scopes.
    
    Usage in endpoints:
        @app.get("/agents")
        async def get_agents(user: UserInfo = Security(get_current_user, scopes=["read:agents"])):
            ...
    """
    # Build authenticate header based on required scopes
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    
    # Decode and validate token
    token_data = decode_token(credentials.credentials)
    
    # Verify required scopes
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            logger.warning(f"⛔ Scope denied: {scope} for user {token_data.username}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Not enough permissions. Required: {scope}",
                headers={"WWW-Authenticate": authenticate_value},
            )
    
    return UserInfo(
        user_id=token_data.user_id,
        username=token_data.username,
        email=token_data.email,
        role=token_data.role,
        scopes=token_data.scopes
    )


# --- Convenience Dependencies ---

async def require_admin(
    user: UserInfo = Security(get_current_user, scopes=["admin"])
) -> UserInfo:
    """Require admin role for endpoint access."""
    return user


async def require_agent_read(
    user: UserInfo = Security(get_current_user, scopes=["read:agents"])
) -> UserInfo:
    """Require read:agents scope."""
    return user


async def require_agent_write(
    user: UserInfo = Security(get_current_user, scopes=["write:agents"])
) -> UserInfo:
    """Require write:agents scope."""
    return user


async def require_policy_read(
    user: UserInfo = Security(get_current_user, scopes=["read:policies"])
) -> UserInfo:
    """Require read:policies scope."""
    return user


async def require_policy_write(
    user: UserInfo = Security(get_current_user, scopes=["write:policies"])
) -> UserInfo:
    """Require write:policies scope."""
    return user


async def require_log_read(
    user: UserInfo = Security(get_current_user, scopes=["read:logs"])
) -> UserInfo:
    """Require read:logs scope."""
    return user
