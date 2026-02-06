# VEIL: Python Architecture Migration Plan (v4.0 - Full Proof)

**Date:** 2026-02-05
**Status:** APPROVED
**Context:** Migration to Python/FastAPI with "Full Proof" Security Hardening.

## 1. Executive Summary

This architecture redesigns VEIL as a **Python-Native Security Mesh**. It implements a **Zero Trust** philosophy where every component is untrusted and verified. It combines the "Reflex" speed layer with the "Brain" cognitive layer, hardened against the **STRIDE** threat model.

**Core Philosophy:**
*   **The Hand (Mitmproxy):** A scriptable, transparency-preserving proxy that physically intercepts traffic.
*   **The Nervous System (FastAPI):** An async decision engine that processes requests, consults the Brain, and enforces policy.
*   **The Brain (Gemini 1.5):** The cognitive layer for judgment and synthesis.

## 2. Technology Stack (Python-First)

| Component | Role | Technology | Version | Justification |
| :--- | :--- | :--- | :--- | :--- |
| **Edge Proxy** | **The Smart Valve** (Layer 0) | **Mitmproxy** | 10.x | Native Python scripting for interception. Replaces Envoy sidecar complexity with pure Python logic. |
| **Reflex Engine** | **The Speed Layer** (Layers 1-5) | **FastAPI** | 0.109+ | High-performance (ASGI), native Pydantic validation, and excellent async support for non-blocking I/O. |
| **Task Queue** | **Async Offloading** (Layer 7+) | **ARQ + Redis** | 0.25+ | Simpler and faster than Celery for async job processing (e.g., Ledger sealing, Brain synthesis) in FastAPI. |
| **Policy Engine** | **Deterministic Rules** (Layer 3) | **OPA (Open Policy Agent)** | Latest | Industry standard. Decouples "Business Rules" (Rego) from application logic. |
| **Intelligence** | **The Brain** (Layer 4) | **Google GenAI SDK** | 0.4.x | Native, First-Class access to Gemini 1.5 Flash (Reflex) and Pro (Brain). |
| **Memory** | **Vector Store** | **Pgvector (PostgreSQL)** | 15+ | Stores embeddings of audit logs for semantic search and "Recalling" past threats. |
| **Resilience** | **Circuit Breakers** | **Tenacity / PyBreaker** | 1.x | Protects against Gemini API outages. Implements Fallback logic (Fail Open vs Fail Closed). |
| **Security** | **Internal Auth** | **JWT / Shared Secret** | - | Secures the link between Mitmproxy and Reflex Engine to prevent internal spoofing. |

## 3. The 7-Layer Stack (Re-Mapped)

| Layer | Name | Python Implementation | Resilience Pattern |
| :--- | :--- | :--- | :--- |
| **L0** | **Interception** | **Mitmproxy Script**: Inline high-performance request extraction. | **Fail-Open Switch** (If Engine dies, do we block or pass?) |
| **L1** | **Identity** | **FastAPI Middleware**: Validates `Authorization` / mTLS. | Cache-Aside (Redis) |
| **L2** | **Handshake** | **Redis + Pydantic**: Anti-Replay Nonce check. | Redis AOF Persistence |
| **L3** | **Policy** | **OPA Python Client**: Deterministic Rego rules. | Local Sidecar Cache (No WAN) |
| **L4** | **Council** | **Gemini 1.5 Flash**: Async parallel judgments. | **Circuit Breaker** (Mock Fallback on Timeout) |
| **L5** | **Traffic** | **FastAPI Logic**: Aggregates verdicts. | Default Deny |
| **L6** | **Gate** | **Mitmproxy Enforcer**: Rejection logic. | - |
| **L7** | **Ledger** | **ARQ**: Async log sealing. | Dead Letter Queue (DLQ) |

## 4. Component Interaction Flow

1.  **Agent Action**: An AI Agent tries to `POST /stripe/charge`.
2.  **L0 Capture (Mitmproxy)**:
    *   Intercepts request.
    *   Extracts metadata (Body, Headers, Path).
    *   **Async Call** -> `POST http://veil-engine:8000/v1/assess` (The Reflex Engine).
3.  **Reflex Engine (FastAPI)**:
    *   **L1/L2**: Checks Cache/Redis for fast-fail.
    *   **L3**: Checks OPA rules.
    *   **L4**: If ambiguous, calls Gemini Flash (parallelized).
    *   **L5**: Computes Final Verdict.
    *   **Response**: Returns `{ "verdict": "ALLOW", "audit_id": "abc-123" }`.
4.  **Enforcement (Mitmproxy)**:
    *   If `ALLOW`: Replays the request to the real destination.
    *   If `BLOCK`: Returns `403 Forbidden` to the Agent.
5.  **Post-Process (ARQ)**:
    *   Reflex Engine pushes the event to Redis Queue.
    *   **Brain Service** picks up the log -> Embeds it (Gemini) -> Stores in Pgvector (L7).

## 5. Directory Structure (Proposed)

```text
/veil-python
  /core
    /mitm          # The Hand
      - proxy.py   # Mitmproxy intercept script
    /reflex        # The Nervous System (FastAPI)
      - main.py
      - config.py
      /layers
        - l1_identity.py
        - l2_handshake.py
        - l3_policy.py    # OPA Client
        - l4_council.py   # Gemini Client
        - l5_traffic.py
      /models      # Pydantic Schemas
  /brain           # The Mind (Background Workers)
    - worker.py    # ARQ Worker entrypoint
    /synthesis     # Long-running analysis tasks
  /infra
    - docker-compose.yml
    - pyproject.toml # UV or Poetry
```

## 6. Threat Model & Security Hardening (STRIDE)

| Threat | Vulnerability | "Full Proof" Mitigation |
| :--- | :--- | :--- |
| **Spoofing** | Use of fake Mitmproxy to bypass checks. | **Mutual Authentication (mTLS)** or **HMAC-SHA256** checks between Proxy and Engine. |
| **Tampering** | Modifying Audit Logs to hide attacks. | **Merkle Tree Hashing**: Every log entry includes the hash of the previous entry. Chained to a public blockchain or locked S3 bucket. |
| **Repudiation** | "I didn't authorize that transfer." | **Non-Repudiation Signatures**: Critical decisions are digitally signed by the Engine's private key. |
| **Info Disclosure** | LLM Logs leaking PII (Keys/Names). | **Desensitization Pipe**: Regex/NLP Redaction *before* sending to Gemini or DB. |
| **DoS** | Overwhelming the Gemini API or Engine. | **Token Bucket Rate Limiting** (L0) + **Circuit Breakers** (Reflex) + **Fail-Safe Mode** (Block All on Overload). |
| **Elevation** | Agent escalating from "Reader" to "Admin". | **Scope Enforcement (L3)**: OPA policies are immutable and loaded from a read-only volume. |

## 7. Migration Advantages & Architect Recommendations

### Top Advantages
1.  **Unified Async Language**: Entire stack is Python `asyncio`. Debugging is unified.
2.  **AI Native**: First-class support for Gemini tools, function calling, and structured output (JSON mode).
3.  **Simplicity**: Mitmproxy is significantly easier to script for complex logic (e.g., "Inject header if body contains X") than Envoy Filters (Lua/Wasm).

### Architect's "Full Proof" Configuration
*   **Secure Link**: The Engine binds only to `localhost` or a secure Docker network. It rejects all traffic without a valid `X-Internal-Token`.
*   **Optimistic vs Pessimistic**: Configurable modes.
    *   *High Security*: **Fail Closed** (If Gemini down, BLOCK everything).
    *   *High Availability*: **Fail Open** (If Gemini down, ALLOW known patterns, only BLOCK anomalies).
*   **Resilience**: Reflex Engine runs multiple workers behind Nginx/Traefik. Redis Cluster ensures session availability.

---
*Generated by Antigravity Agent Architecture Skill + Threat Modeling Expert*
