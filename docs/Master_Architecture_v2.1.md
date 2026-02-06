# VEIL: The Master Architecture Document (v2.1)

## 1. Executive Summary
**VEIL (Verified Ethereal Identity Ledger)** is a "Living Identity Firewall" designed to govern Autonomous AI Agents. It replaces static API gateways with a biological "Immune System" architecture that splits security into **Reflexes (Local/Fast)** and **Brain (Cloud/Intelligence)**.

**The Goal:** Prevent "Rogue Agent" scenarios (e.g., Prompt Injection leading to data exfiltration) by enforcing a cryptographic identity and context-aware policy on every single packet.

---

## 2. The Core Philosophy: "Brain vs. Reflexes"
To balance sub-millisecond latency with Deep Reasoning security, VEIL uses a split-brain architecture:

| Component | Role | Technology | Latency |
| :--- | :--- | :--- | :--- |
| **The Reflexes** (Body) | **Fast Enforcement**. Deterministic blocking of packets based on rules, identity, and lightweight AI judgments. Lives next to the agent. | Java 17, Envoy, Redis, TinyML | < 5ms |
| **The Brain** (Mind) | **Deep Intelligence**. Analyzes forensics, hallucinates attacks (Red Teaming), and synthesizes new policies. | Google Gemini 3.0 Pro, Cloud | ~Seconds |
| **The Face** (Interface) | **Holographic SOC**. A "Minority Report" style dashboard for human officers to visualize the fleet's Trust Scores. | React 19, Three.js, WebGL | Real-time |

---

## 3. The 7-Layer Enforcement Stack (The Reflexes)
Every outgoing packet from an AI Agent must pass through this inescapable funnel.

### 🔥 Layer 0: The Smart Valve (Interception)
*   **Technology:** **Envoy Proxy (Sidecar)**.
*   **Mechanism:** The Agent runs in a container. `iptables` rules force all traffic to `localhost:8080` (VEIL).
*   **Goal:** Inescapable network capture. Agent cannot bypass it.

### 🆔 Layer 1: Runtime Identity
*   **Technology:** SHA-256 Container Hashing (Java Backend).
*   **Mechanism:** VEIL checks the Process ID (PID) and verifies the container's binary hash has not been tampered with.
*   **Goal:** Prevent "Supply Chain Attacks" where a hacker replaces the python script.

### 🤝 Layer 2: The Handshake (Anti-Replay)
*   **Technology:** **Redis (Atomic Check-and-Set)** + **JWT**.
*   **Mechanism:** Agent sends `Intent + Nonce`. VEIL checks Redis to ensure Nonce is unique (Anti-Replay).
*   **Outcome:** Issues a **60-second Ephemeral JWT**.
*   **Status:** *Completed.*

### 📜 Layer 3: Deterministic Policy
*   **Technology:** **OPA (Open Policy Agent)** / Java Rule Engine.
*   **Mechanism:** Hard binary rules.
    *   *Rule:* "No refunds > $500."
    *   *Rule:* "DevOps Bot cannot access /payroll."
*   **Goal:** Instant rejection of obvious violations.

### ⚖️ Layer 4: The Council of Judges (Flash Judges)
*   **Technology:** **Mixture of Experts (Local SLMs / Gemini Nano)**.
*   **Mechanism:** Three lightweight AI models vote on "Fuzzy" risks.
    1.  **Context Judge:** "Does this match the Agent's Purpose?"
    2.  **Safety Judge:** "Is there a Prompt Injection?"
    3.  **Policy Judge:** "Is this compliant?"
*   **Consensus:** Unanimous = Safe. Split = Escalate to Brain.

### 🚦 Layer 5: Adaptive Policy Routing (Traffic Lights)
*   **Technology:** Java Routing Logic.
*   **Lane 1 (🟢 Green):** Read-only (GET). Bypass Council. Fast.
*   **Lane 2 (🟡 Yellow):** Low-risk writes. Execute + Async Audit.
*   **Lane 3 (🔴 Red):** High-stakes (Money/Delete). **HOLD** -> Convene Council.

### 🚪 Layer 6: Execution Gate
*   **Technology:** Envoy / Java HttpClient.
*   **Mechanism:** If approved, VEIL proxies the request to the real world (e.g., Stripe API).
*   **Response Filter:** VEIL also scans the *response* for PII leaks before giving it back to the Agent.

### ⛓️ Layer 7: Verifiable Ledger
*   **Technology:** Merkle Tree / Immutable Log.
*   **Mechanism:** Every decision is cryptographically hashed and chained.
*   **Goal:** Mathematical proof of what happened for insurance/forensics.

---

## 4. The Intelligence Plane (The Brain)
**Powered by Google Gemini 3.0 Pro**

1.  **Policy Synthesis (Shadow Mode):** Reads raw logs -> Writes OPA Rules. ("I see the agents are doing X safely, let's make it a rule.")
2.  **Forensic Analysis (Liability Mode):** Explains *why* a block happened in plain English for the dashboard.
3.  **Reflex Training:** Generates adversarial prompts to test and fine-tune the Layer 4 judges.

---

## 5. Technical Implementation Roadmap

### Phase 1: Foundation (Completed)
*   ✅ Spring Boot 3.x Backend (Java 17).
*   ✅ Redis & Postgres Infrastructure.
*   ✅ **Layer 2 Handshake:** Nonce Registry, JWT, Scope Inheritance.

### Phase 2: The Traffic Controller (Next)
*   **Task:** Implement **`TrafficLightService.java`**.
*   **Logic:** Route requests based on HTTP Method/Risk Profile (Green/Yellow/Red).
*   **Goal:** Enable "Fast Path" vs. "Blocked Path."

### Phase 3: The Council of Judges
*   **Task:** Implement **`CouncilService.java`**.
*   **Logic:** Interface for multiple "Judges" (Context/Safety/Policy).
*   **Simulated Start:** Use Gemini Flash API to represent the local judges for the MVP.

### Phase 4: The Brain Connection
*   **Task:** **`GeminiService.java`**.
*   **Logic:** Integration with Google GenAI SDK.
*   **Feature:** "Supreme Court" escalation for split votes.

### Phase 5: The Holographic Frontend (Integration)
*   **Task:** Connect React 19 Frontend to Java Backend.
*   **Feature:** Real-time visualization of the "Traffic Light" logic (Green/Red packets moving in 3D).

---

## 6. Directory Structure (Target)

```
/backend
  /src/main/java/com/veil
    /security      -> VeilSecurityFilter (The Gate)
    /services
       /traffic    -> TrafficLightService (Layer 5)
       /council    -> CouncilService (Layer 4)
       /brain      -> GeminiService (The Cloud Link)
       /identity   -> NonceService (Layer 2)
    /model         -> Agent, Passport, Policy
    /controllers   -> AuthController, ValidationController
```
