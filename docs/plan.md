# VEIL 7-Layer Sentinel Implementation Plan

## Goal Description
Implement the complete 7-Layer enforcement stack for VEIL, transforming it from a "Foundation" MVP to a functional "Living Identity Firewall". 
**Architecture Alignment**: As per `Master_Architecture_v2.1.md`, VEIL (Reflexes) acts as a **Sidecar** living next to the Agent.
This plan establishes the "Reflex" layer (Java Sidecar) and the "Traffic Controller" logic.

## Technology Stack [CONFIRMED]
- **Core Backend**: `Java 17`, `Spring Boot 3.x`
- **Sidecar/Proxy**: `Envoy Proxy` (v1.28+), `Docker Compose`
- **Data & State**: `Redis` (Hot Cache/Nonces), `PostgreSQL` (Ledger/Cold Storage)
- **Intelligence**: `Google Gemini 1.5 Flash` (via Java SDK/REST)
- **Security**: `Java Security` (SHA-256), `Twilio/Auth0` (JWT - Optional), `OPA` (Policy - mocked initially)

## Required Agent Skills
The following agent skills will be enabled and utilized during development:
- **`java-pro`**: Primary for Backend Core. Implementing robust Spring Boot 3.x services, TrafficController logic, and advanced Java 17 features.
- **`backend-architect`**: Primary for Infrastructure. Designing the Envoy sidecar interplay, Docker orchestration, and system decoupling.
- **`backend-security-coder`**: Primary for Safety. Writing secure implementations for Policy Engine (Layer 3), Runtime Identity (Layer 1), and Ledger (Layer 7).
- **`ai-engineer`**: Primary for Intelligence. Implementing the CouncilService (Layer 4) and its integration with Gemini models.
- **`tdd-orchestrator` / `unit-testing-test-generate`**: Establishing the quality gate with JUnit 5 tests and Red-Green-Refactor workflows.

## Workflow & Process [CRITICAL]
> [!IMPORTANT]
> **Version Control Protocol**: Every change must be committed and pushed to GitHub immediately upon successful verification.
> A "change" is defined as a completed implementation step (e.g., "Implemented TrafficLightService").
> **Commit Message Standard**: `feat(veil): [Layer X] Description of component added`

## User Review Required
> [!IMPORTANT]
> **Sidecar Deployment**: The `docker-compose.yaml` will configure VEIL and the Mock Agent to run on the same network, simulating the Sidecar pattern.
> **Layer 1 (Identity)**: Will be mocked initially (`MockRuntimeIdentityService`) as real Container PIN/Hash verification requires OS-level privileges.

## Proposed Changes

### Infrastructure [NEW]
#### [NEW] [envoy.yaml](file:///f:/Startup_Projects/VEIL/envoy.yaml)
- **Layer 0 (Smart Valve)**: Configured to intercept traffic on port 10000 and forward to proper VEIL/Sidecar ports.
- Simulates the `iptables` interception described in architecture.

#### [NEW] [docker-compose.yaml](file:///f:/Startup_Projects/VEIL/docker-compose.yaml)
- Orchestrates the **Sidecar Pattern**:
    - `veil-reflex` (Spring Boot Sidecar)
    - `mock-agent` (The protected entity)
    - `envoy` (Traffic Inteceptor)
    - `redis` / `postgres` (Shared State)

### Backend Core [NEW & MODIFY]

#### [NEW] [RuntimeIdentityService.java](file:///f:/Startup_Projects/VEIL/backend/src/main/java/com/veil/services/identity/RuntimeIdentityService.java)
- **Layer 1**: Verifies the identity of the local process.

#### [NEW] [DeterministicRuleEngine.java](file:///f:/Startup_Projects/VEIL/backend/src/main/java/com/veil/services/policy/DeterministicRuleEngine.java)
- **Layer 3**: Implements hard policy checks (e.g., "No GET /admin").

#### [NEW] [CouncilService.java](file:///f:/Startup_Projects/VEIL/backend/src/main/java/com/veil/services/council/CouncilService.java)
- **Layer 4**: Interface for Context/Safety/Policy judges.
- MVP: Uses Gemini Flash (or mock) to simulate judgment.

#### [NEW] [TrafficLightService.java](file:///f:/Startup_Projects/VEIL/backend/src/main/java/com/veil/services/traffic/TrafficLightService.java)
- **Layer 5 (Traffic Controller)**: The central brain of the Reflex.
- Coordinates: Identity -> Rules -> Judges -> Decision.
- Returns `RiskLevel` (GREEN/YELLOW/RED).

#### [NEW] [ExecutionGateService.java](file:///f:/Startup_Projects/VEIL/backend/src/main/java/com/veil/services/gate/ExecutionGateService.java)
- **Layer 6**: Executes the actual downstream request if Green/Yellow.
- Scans response for PII.

#### [NEW] [VerifiableLedgerService.java](file:///f:/Startup_Projects/VEIL/backend/src/main/java/com/veil/services/ledger/VerifiableLedgerService.java)
- **Layer 7**: Hashes and logs the final transaction to the immutable ledger.

#### [MODIFY] [VeilSecurityFilter.java](file:///f:/Startup_Projects/VEIL/backend/src/main/java/com/veil/security/VeilSecurityFilter.java)
- **Integration Point**: 
    - Inject `TrafficLightService`.
    - Hand off request to TrafficLightService for full 7-layer check.

## Verification Plan

### Automated Tests
- **Unit Logic**: `TrafficLightServiceTest` (Mocking judges/rules).
- **Integration**: `FullStackSidecarTest` to verify Layer 0 -> 7 flow.

### Manual Verification
1.  **Sidecar Routing**: `curl localhost:10000` -> Hits Envoy -> Hits VEIL Reflex.
2.  **Attack Simulation**: Send a payload with "Ignore previous instructions" -> Layer 4 (Safety Judge) should block (Red Light).
