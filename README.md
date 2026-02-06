# VEIL (Verified Ethereal Identity Ledger)

**VEIL** is a production-grade **Security Middleware & Trust Layer** designed to govern Autonomous AI Agents. Operating as a deterministic firewall between LLMs and sensitive backend systems, it prevents "rogue agent" scenarios through real-time policy enforcement, identity profiling, and deep reasoning analysis.

> Powered by **Google Gemini 3.0 Pro** and **Gemini 2.5**, utilizing **Deep Reasoning (Thinking Models)** to detect sophisticated prompt injection attacks that standard models miss.

---

### Project Structure

- **`/backend`**: Java Spring Boot Security Kernel (The Reflex).
- **`/frontend`**: React/Vite Dashboard (The Holographic SOC).
- **`/envoy.yaml`**: Envoy Proxy Configuration (The Sidecar).
- **`/docs`**: Architectural Blueprints and specifications.
- **`/scripts`**: Utility scripts for maintenance.

---

## 🎯 The Core Problem

As AI agents become autonomous—executing code, spending money, and accessing files—they introduce massive risk. A simple "ignore previous instructions" prompt injection can turn a helpful support bot into a data exfiltration tool. **VEIL solves this by wrapping every agent in a cryptographically-verifiable identity and a strict policy firewall.**

---

## 🏗️ Hybrid Architecture

The system operates as a unified platform combining a high-fidelity "Holographic" SOC interface with a robust enterprise backend.

| Component | Technology Stack |
| :--- | :--- |
| **Frontend (SOC)** | **React 19**, **Vite**, **TypeScript**, **Three.js** (@react-three/fiber), **Framer Motion**, **Tailwind CSS** |
| **Backend (Core)** | **Java 17**, **Spring Boot 3.2.3**, Spring Security, H2 Database (File Mode), Spring Data JPA |
| **AI Intelligence** | **Google GenAI SDK** (Gemini 3.0 Pro, Gemini 2.5 Flash), Google Search Grounding |

---

## 🚀 Key Enterprise Features

### 1. 🛡️ Identity & Risk Profiling
- **Passport Issuance**: Agents are analyzed upon creation; the system assigns a customized **Misuse Potential Score (0-100)**.
- **Trust Integrity Gauge**: Real-time visualization of fleet status ("Trusted", "Under Watch", "Compromised").

### 2. 🧠 Deep Reasoning Security (System 2)
- **Thinking Budget**: Allocates token budgets (e.g., 2048 tokens) for the firewall to *silently reason* about threats before decision-making.
- **Injection Defense**: Detects multi-shot jailbreaks and encoded payloads that bypass faster "System 1" checks.

### 3. 🧪 Simulation & Scenario Mode
- **Built-in War Games**: Includes a fully interactive **Simulation Mode** to demonstrate security handling of various attack vectors.
- **Scenarios**:
    - *Safe*: Routine FAQ queries (Allowed).
    - *Borderline*: Unprivileged file access attempts (Flagged).
    - *Unsafe*: Financial fraud execution (Blocked).

### 4. 👁️ Holographic SOC Interface
- **Immersive UI**: Features a cinematic, "Glassmorphism" design with 3D background elements (Neural Networks, Splines).
- **Dark Mode Native**: Optimized for low-light Security Operations Centers.

### 5. ⚖️ Human-in-the-Loop (HITL)
- **Intervention Console**: Review "Suspicious" actions.
- **Manual Override**: Admins can `Override & Allow` or `Confirm Block` actions based on the AI's reasoning trace.

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 17
- Maven

### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```
*The backend API will initialize on `localhost:8080` and spin up the H2 database.*

### 2. Start the Frontend (SOC)
```bash
cd frontend
npm install
npm run dev
```
*Access the dashboard at `localhost:5173`.*

---

## 🛠️ Usage Guide

1.  **Issue Identity**: Create a new Agent Profile (e.g., "DevOps-Bot").
2.  **Define Rules**: Create a policy (e.g., *"Do not allow access to AWS keys"*).
3.  **Bind Policy**: Attach the policy to the agent.
4.  **Simulate Attack**: Use the **Terminal** or **Demo Mode** to try and trick the agent.
5.  **Audit**: Review the cryptographic logs in the **Audit Ledger**.

---

*Verified Ethereal Identity Ledger (VEIL) v0.1.0-alpha*
