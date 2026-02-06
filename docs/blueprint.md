---
project: VEIL (Verified Ethereal Identity Ledger)
version: 1.1 (Security Patched)
status: Phase 1 (Validated)
---

# VEIL SYSTEM ARCHITECTURE BLUEPRINT (v1.1)

## 1. Patched Handshake Protocol (Anti-Replay)
- **Centralized Nonce Ledger:** All nonces must be validated against a global Redis-backed `Nonce-Registry` with a 1-second TTL.
- **Atomic 'Check-and-Set':** The system must use an atomic operation to ensure a nonce is invalidated the microsecond it is first seen.



## 2. Session Management (The 60-Second Rule)
- **Short-Lived JWTs:** Handshake proof generates an ephemeral token with a **60-second `exp` (expiry)**.
- **Revocation List:** Implements a 'Kill-Switch' API. If an agent's Trust Score drops below 20, all active `jti` (JWT IDs) are blacklisted instantly.

## 3. Scope Inheritance (Context-Aware Permissions)
- **Intersection Logic:** When Agent A calls Agent B, the effective scope is calculated as: `Scope(A) ∩ Scope(B)`.
- **Header Propagation:** All intra-agent calls must carry the `X-VEIL-Original-Caller-Identity` header to prevent proxy-based privilege escalation.



## 4. Tech Stack (Confirmed)
- **Core:** Java 17 (Spring Boot 3.x).
- **Security:** `java.security` for RSA/ED25519 signature verification.
- **Storage:** PostgreSQL (Registry) + Redis (Nonces/JWT Blacklist).