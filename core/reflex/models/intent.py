"""
VEIL Layer 2: Intent Data Models
Defines the schema for Agent Intent declarations.
"""
from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional
import time

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class IntentPayload(BaseModel):
    """
    The Intent Contract.
    Every Agent request MUST accompany this declaration of purpose.
    """
    goal: str = Field(..., description="High-level objective (e.g., 'refund_customer').")
    action: str = Field(..., description="Expected HTTP action (e.g., 'POST /v1/refunds').")
    justification: str = Field(..., description="Why is this action being taken?")
    risk_level: RiskLevel = Field(default=RiskLevel.LOW, description="Self-assessed risk level.")
    nonce: str = Field(..., description="Unique UUID to prevent replay attacks.")
    timestamp: Optional[int] = Field(default_factory=lambda: int(time.time()), description="Request timestamp (epoch).")

    class Config:
        extra = "forbid"  # Strict: No extra fields allowed
