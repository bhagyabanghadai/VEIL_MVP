"""
VEIL Full Stack Security Audit (L0-L3)
Adversarial Testing: Attempt to Break Every Layer.
"""
import pytest
import requests
import json
import uuid
import time
import os

ENGINE_URL = os.getenv("ENGINE_URL", "http://localhost:8000")
PROXY_URL = os.getenv("PROXY_URL", "http://localhost:8090")
INTERNAL_TOKEN = "dev-secret-token-CHANGE-IN-PROD"


# ============================================================================
# Layer 0: The Smart Valve (Proxy Bypass Attacks)
# ============================================================================
class TestL0SmartValve:
    """Attack the Proxy layer."""

    def test_direct_engine_access_without_proxy(self):
        """
        ATTACK: Bypass proxy and hit Engine directly.
        EXPECTED: Should be blocked by L1 (Identity) since no valid container IP.
        """
        # This tests if someone can skip the proxy and talk to Engine directly
        headers = {"Content-Type": "application/json"}
        payload = {"method": "GET", "url": "http://evil.com", "host": "evil.com", "headers": {}}
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        # Without any L1 headers, should be blocked
        assert response.status_code == 403, f"Direct access not blocked! Got {response.status_code}"

    def test_proxy_forwards_to_engine(self):
        """
        NORMAL: Proxy should forward to Engine correctly.
        """
        proxies = {"http": PROXY_URL}
        try:
            response = requests.get("http://httpbin.org/get", proxies=proxies, timeout=15)
            assert response.status_code == 200
        except requests.exceptions.RequestException as e:
            pytest.fail(f"Proxy failed: {e}")


# ============================================================================
# Layer 1: Identity (Token & Container Hash Attacks)
# ============================================================================
class TestL1IdentityAttacks:
    """Attack Identity verification."""

    def test_missing_token(self):
        """
        ATTACK: Request without X-Internal-Token.
        EXPECTED: 403 Forbidden.
        """
        headers = {"Content-Type": "application/json"}
        payload = {"method": "GET", "url": "http://test.com", "host": "test.com", "headers": {}}
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        assert response.status_code == 403
        assert "Unauthorized" in response.text or "Identity" in response.text

    def test_invalid_token(self):
        """
        ATTACK: Send wrong token.
        EXPECTED: 403 Forbidden.
        """
        headers = {
            "X-Internal-Token": "FAKE-TOKEN-ATTACK",
            "Content-Type": "application/json"
        }
        payload = {"method": "GET", "url": "http://test.com", "host": "test.com", "headers": {}}
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        assert response.status_code == 403

    def test_empty_token(self):
        """
        ATTACK: Send empty token.
        EXPECTED: 403 Forbidden.
        """
        headers = {
            "X-Internal-Token": "",
            "Content-Type": "application/json"
        }
        payload = {"method": "GET", "url": "http://test.com", "host": "test.com", "headers": {}}
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        assert response.status_code == 403


# ============================================================================
# Layer 2: Intent (Schema & Replay Attacks)
# ============================================================================
class TestL2IntentAttacks:
    """Attack Intent validation."""

    def _valid_headers(self, intent: dict) -> dict:
        return {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": json.dumps(intent),
            "Content-Type": "application/json"
        }

    def _valid_payload(self) -> dict:
        return {"method": "GET", "url": "http://test.com", "host": "test.com", "headers": {}}

    def _valid_intent(self, **overrides) -> dict:
        intent = {
            "goal": "test",
            "action": "POST /v1/assess",
            "justification": "Security Audit",
            "risk_level": "low",
            "nonce": str(uuid.uuid4()),
            "timestamp": int(time.time())
        }
        intent.update(overrides)
        return intent

    def test_missing_intent_header(self):
        """
        ATTACK: Request without X-Veil-Intent.
        EXPECTED: 403 (Missing Intent).
        """
        headers = {
            "X-Internal-Token": INTERNAL_TOKEN,
            "Content-Type": "application/json"
        }
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=self._valid_payload(), headers=headers, timeout=5)
        assert response.status_code == 403
        assert "Missing Intent" in response.text

    def test_malformed_json_intent(self):
        """
        ATTACK: Send broken JSON in intent header.
        EXPECTED: 403 (Invalid JSON).
        """
        headers = {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": "NOT{VALID}JSON",
            "Content-Type": "application/json"
        }
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=self._valid_payload(), headers=headers, timeout=5)
        assert response.status_code == 403
        assert "Invalid" in response.text or "JSON" in response.text

    def test_missing_required_fields(self):
        """
        ATTACK: Intent missing 'goal' field.
        EXPECTED: 403 (Schema Error).
        """
        incomplete_intent = {"action": "POST /v1/assess", "nonce": str(uuid.uuid4())}
        headers = self._valid_headers(incomplete_intent)
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=self._valid_payload(), headers=headers, timeout=5)
        assert response.status_code == 403
        assert "Schema" in response.text or "Error" in response.text

    def test_action_mismatch_lie(self):
        """
        ATTACK: Claim action is 'GET /users' but send POST to /v1/assess.
        EXPECTED: 403 (Intent-Action Mismatch).
        """
        lying_intent = self._valid_intent(action="GET /users")  # LIE!
        headers = self._valid_headers(lying_intent)
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=self._valid_payload(), headers=headers, timeout=5)
        assert response.status_code == 403
        assert "Mismatch" in response.text

    def test_replay_attack_same_nonce(self):
        """
        ATTACK: Use the same nonce twice.
        EXPECTED: First request passes, second is BLOCKED.
        """
        fixed_nonce = str(uuid.uuid4())
        intent = self._valid_intent(nonce=fixed_nonce)
        headers = self._valid_headers(intent)
        
        # First request
        r1 = requests.post(f"{ENGINE_URL}/v1/assess", json=self._valid_payload(), headers=headers, timeout=5)
        assert r1.status_code == 200, f"First request failed: {r1.text}"
        
        # Replay attack
        r2 = requests.post(f"{ENGINE_URL}/v1/assess", json=self._valid_payload(), headers=headers, timeout=5)
        assert r2.status_code == 403, f"Replay not blocked! {r2.status_code}"
        assert "Replay" in r2.text

    def test_extra_fields_forbidden(self):
        """
        ATTACK: Add unexpected field to intent (injection attempt).
        EXPECTED: 403 (Schema forbids extra fields).
        """
        injected_intent = self._valid_intent(evil_field="MALICIOUS_DATA")
        headers = self._valid_headers(injected_intent)
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=self._valid_payload(), headers=headers, timeout=5)
        assert response.status_code == 403


# ============================================================================
# Layer 3: Policy Engine (Rego Bypass Attacks)
# ============================================================================
class TestL3PolicyAttacks:
    """Attack Policy Engine (OPA)."""

    def _valid_headers(self, intent: dict) -> dict:
        return {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": json.dumps(intent),
            "Content-Type": "application/json"
        }

    def _valid_payload(self) -> dict:
        return {"method": "GET", "url": "http://test.com", "host": "test.com", "headers": {}}

    def _valid_intent(self, **overrides) -> dict:
        intent = {
            "goal": "test",
            "action": "POST /v1/assess",
            "justification": "Security Audit",
            "risk_level": "low",
            "nonce": str(uuid.uuid4()),
            "timestamp": int(time.time())
        }
        intent.update(overrides)
        return intent

    def test_high_risk_blocked(self):
        """
        ATTACK: Try to pass with high risk.
        EXPECTED: 403 (Policy Violation).
        """
        intent = self._valid_intent(risk_level="high")
        headers = self._valid_headers(intent)
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=self._valid_payload(), headers=headers, timeout=5)
        assert response.status_code == 403
        assert "Policy" in response.text

    def test_case_sensitivity_bypass(self):
        """
        ATTACK: Try 'HIGH' instead of 'high' to bypass.
        EXPECTED: 403 or Schema Error.
        """
        intent = self._valid_intent(risk_level="HIGH")  # Case manipulation
        headers = self._valid_headers(intent)
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=self._valid_payload(), headers=headers, timeout=5)
        # Should fail schema validation (Pydantic enum is strict)
        assert response.status_code == 403

    def test_unknown_risk_level(self):
        """
        ATTACK: Use undefined risk level 'critical'.
        EXPECTED: 403 (Schema Error).
        """
        intent = self._valid_intent(risk_level="critical")
        headers = self._valid_headers(intent)
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=self._valid_payload(), headers=headers, timeout=5)
        assert response.status_code == 403


# ============================================================================
# Layer 4: Semantic Judge (Context & LLM Attacks)
# ============================================================================
class TestL4JudgeAttacks:
    """Attack The Wise One (L4 Judge)."""

    def _valid_headers(self, intent: dict) -> dict:
        return {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": json.dumps(intent),
            "Content-Type": "application/json"
        }

    def _valid_intent(self, **overrides) -> dict:
        intent = {
            "goal": "test_judge",
            "action": "POST /v1/assess",
            "justification": "Low risk check",
            "risk_level": "low",
            "nonce": str(uuid.uuid4()),
            "timestamp": int(time.time())
        }
        intent.update(overrides)
        return intent

    def test_l4_fast_path_allowed(self):
        """
        NORMAL: Low risk should skip judge and be allowed.
        """
        intent = self._valid_intent(risk_level="low", justification="Routine fast path")
        headers = self._valid_headers(intent)
        payload = {
            "method": "POST", "url": "http://api.com/refund", "host": "api.com", "headers": {},
            "body": "anything"
        }
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        assert response.status_code == 200

    def test_l4_medium_risk_valid(self):
        """
        NORMAL: Medium Risk with VALID justification should pass Judge.
        (Requires Ollama to be running)
        """
        intent = self._valid_intent(risk_level="medium", justification="Refund for user 123 double charge")
        headers = self._valid_headers(intent)
        payload = {
            "method": "POST", "url": "http://api.com/refund", "host": "api.com", "headers": {},
            "body": "User 123 double charged on invoice #555"
        }
        
        # Timeout extended for LLM inference (first run slow)
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=20)
        assert response.status_code == 200

    def test_l4_medium_risk_hallucination_blocked(self):
        """
        ATTACK: Medium Risk with CONTRADICTORY payload (Hallucination/Lie).
        Judge should catch that payload does not match justification.
        """
        intent = self._valid_intent(risk_level="medium", justification="Refund for user 123")
        headers = self._valid_headers(intent)
        # Payload is maliciously doing something else
        payload = {
            "method": "POST", "url": "http://api.com/db", "host": "api.com", "headers": {},
            "body": "DROP TABLE users;"
        }
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=20)
        
        # If model is loaded and working, this should be 403.
        # If model fails open (MVP behavior on error), it might be 200.
        # We assert 403 to verify security. If it fails, we know Judge isn't working/strict enough.
        if response.status_code == 200:
            pytest.fail("Judge allowed blatant lie! (Or fail-open triggered)")
        assert response.status_code == 403
        assert "Judge" in response.text

# ============================================================================
# Layer 7: Ledger Forensics (Tamper & Injection)
# ============================================================================
class TestL7LedgerAttacks:
    """Attack The Historian (L7 Ledger)."""

    def test_log_injection_attempt(self):
        """
        ATTACK: Try to inject newlines to break JSONL format.
        EXPECTED: System should escape it or handle it safely.
        """
        # LedgerService uses json.dumps, which escapes newlines automatically.
        headers = {"X-Internal-Token": INTERNAL_TOKEN, "Content-Type": "application/json"}
        # Justification with newline
        intent = {
            "goal": "test", "action": "POST /v1/assess", 
            "justification": "Line1\nLine2", 
            "risk_level": "low", "nonce": str(uuid.uuid4()), "timestamp": int(time.time())
        }
        headers["X-Veil-Intent"] = json.dumps(intent)
        payload = {"method": "GET", "url": "http://test.com", "host": "test.com", "headers": {}}
        
        # This request will be logged
        r = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        
        # Wait for log
        time.sleep(1)
        
        # Check Ledger for corruption
        with open("veil.ledger.jsonl", "r") as f:
            lines = f.readlines()
            
        last_line = lines[-1]
        try:
            entry = json.loads(last_line)
            # Justification might be deeper in "data" -> headers -> X-Veil-Intent string...
            # But the key is: Did json.loads work? 
            # If injection succeeded, this line would be broken JSON or split into two lines.
        except json.JSONDecodeError:
            pytest.fail("Log Injection Successful! Ledger file corrupted.")
            
        # Verify line count is consistent (1 request = 1 line)
        # (This is hard to assert exactly without clean state, but JSON validity is key)

    def test_tamper_detection(self):
        """
        FORENSIC: Simulating a hacker manually editing the log.
        Verifier tool should catch BROKEN CHAIN.
        """
        # 1. Create a "Backup" of current ledger
        import shutil
        target_file = "veil.ledger.tampered.jsonl"
        shutil.copy("veil.ledger.jsonl", target_file)
        
        # 2. Tamper: Break the chain explicitly by modifying a hash
        with open(target_file, "r") as f:
            lines = f.readlines()
        
        if len(lines) < 2:
            # Need at least Genesis + 1 entry to test linking
            pytest.skip("Not enough log entries to test tampering")
            
        # Modify the LAST entry's "prev_hash" to look like garbage
        last_index = -1
        victim_entry = json.loads(lines[last_index])
        victim_entry["prev_hash"] = "DEADBEEF" * 8 # Obvious fake hash
        lines[last_index] = json.dumps(victim_entry) + "\n"
        
        with open(target_file, "w") as f:
            f.writelines(lines)
            
        # 3. Run Forensic Tool via Subprocess (Simulating CLI usage)
        import subprocess
        import sys
        
        # We expect it to FAIL (Exit Code 1)
        # Note: We use sys.executable to ensure we use the same python env
        result = subprocess.run(
            [sys.executable, "scripts/verify_ledger.py", target_file],
            capture_output=True, 
            text=True
        )
        
        if result.returncode == 0:
            pytest.fail(f"Forensic Tool succceded (Exit 0) on tampered file! Output: {result.stdout}")
            
        assert "VERIFICATION FAILED" in result.stderr or "VERIFICATION FAILED" in result.stdout


class TestCrossLayerAttacks:
    """Attacks that span multiple layers."""

    def test_valid_full_flow(self):
        """
        BASELINE: Valid request through all layers.
        """
        intent = {
            "goal": "test_full_flow",
            "action": "POST /v1/assess",
            "justification": "E2E Validation",
            "risk_level": "low",
            "nonce": str(uuid.uuid4()),
            "timestamp": int(time.time())
        }
        headers = {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": json.dumps(intent),
            "Content-Type": "application/json"
        }
        payload = {"method": "GET", "url": "http://valid.com", "host": "valid.com", "headers": {}}
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        assert response.status_code == 200
