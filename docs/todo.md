# VEIL Implementation Tasks

- [ ] Layer 0: Infrastructure Setup (Envoy & Docker)
  - Create `envoy.yaml` to intercept traffic on port 10000.
  - Create `docker-compose.yaml` with Envoy, Redis, and Postgres.
  - Verify sidecar traffic interception.

- [ ] Layer 1: Runtime Identity Service
  - Implement `RuntimeIdentityService.java` (Mock initially).
  - Verify local process identity logic.

- [ ] Layer 3: Deterministic Rule Engine
  - Implement `DeterministicRuleEngine.java` for hard policy checks.
  - Add test cases for blocked paths (e.g. `/admin`).

- [ ] Layer 5: Traffic Light Service
  - Implement logic coordinating Identity -> Rules -> Judges.
  - Return aggregated RiskLevel (GREEN/YELLOW/RED).

- [ ] Integration: Veil Security Filter
  - Inject `TrafficLightService` into `VeilSecurityFilter`.
  - Enforce risk checks on incoming requests.
