"""
VEIL Layer 2: Intent Interface E2E Tests
Tests Schema Validation, Action Cross-Check, and Replay Protection.
"""
import pytest
import requests
import json
import uuid
import time
import os

ENGINE_URL = os.getenv("ENGINE_URL", "http://localhost:8000")
PROXY_URL = os.getenv("PROXY_URL", "http://localhost:8090")
INTERNAL_TOKEN = "dev-secret-token"

class TestL2IntentInterface:
    """
    Test Suite for Layer 2: Cognitive Accountability.
    Verifies: Schema Check, Action Cross-Check, Replay Protection.
    """

    def _create_valid_intent(self, action: str = "POST /v1/assess") -> dict:
        """Helper to create a valid intent payload."""
        return {
            "goal": "test_assessment",
            "action": action,
            "justification": "Automated E2E test",
            "risk_level": "low",
            "nonce": str(uuid.uuid4()),
            "timestamp": int(time.time())
        }

    def test_valid_intent_passes(self):
        """Verify a correctly formed intent is accepted."""
        intent = self._create_valid_intent()
        headers = {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": json.dumps(intent),
            "Content-Type": "application/json"
        }
        payload = {"method": "GET", "url": "http://test.com", "host": "test.com", "headers": {}}
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        assert response.status_code == 200, f"Valid intent rejected! Response: {response.text}"

    def test_missing_intent_blocked(self):
        """Verify requests without intent header are blocked."""
        headers = {
            "X-Internal-Token": INTERNAL_TOKEN,
            "Content-Type": "application/json"
        }
        payload = {"method": "GET", "url": "http://test.com", "host": "test.com", "headers": {}}
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        assert response.status_code == 403, f"Missing intent not blocked! Status: {response.status_code}"

    def test_invalid_json_blocked(self):
        """Verify malformed JSON in intent header is blocked."""
        headers = {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": "not-valid-json{}{",
            "Content-Type": "application/json"
        }
        payload = {"method": "GET", "url": "http://test.com", "host": "test.com", "headers": {}}
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        assert response.status_code == 403, f"Invalid JSON not blocked! Status: {response.status_code}"

    def test_action_mismatch_blocked(self):
        """Verify intent.action != actual request is blocked (Lie Detection)."""
        # Claim we're doing GET but actually POST
        intent = self._create_valid_intent(action="GET /v1/users")  # Lie!
        headers = {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": json.dumps(intent),
            "Content-Type": "application/json"
        }
        payload = {"method": "GET", "url": "http://test.com", "host": "test.com", "headers": {}}
        
        # Actual request is POST /v1/assess
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        assert response.status_code == 403, f"Action mismatch not blocked! Status: {response.status_code}"
        assert "Mismatch" in response.text

    def test_replay_attack_blocked(self):
        """Verify the same nonce cannot be used twice."""
        fixed_nonce = str(uuid.uuid4())
        
        intent1 = self._create_valid_intent()
        intent1["nonce"] = fixed_nonce
        
        headers = {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": json.dumps(intent1),
            "Content-Type": "application/json"
        }
        payload = {"method": "GET", "url": "http://test.com", "host": "test.com", "headers": {}}
        
        # First request should pass
        response1 = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        assert response1.status_code == 200, f"First request failed! Response: {response1.text}"
        
        # Second request with SAME nonce should be blocked
        response2 = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        assert response2.status_code == 403, f"Replay attack not blocked! Status: {response2.status_code}"
        assert "Replay" in response2.text

    def test_proxy_flow_with_intent(self):
        """Verify end-to-end proxy flow works with L2 enabled."""
        proxies = {"http": PROXY_URL, "https": PROXY_URL}
        try:
            response = requests.get("http://httpbin.org/get", proxies=proxies, timeout=15)
            assert response.status_code == 200, f"Proxy flow failed! Status: {response.status_code}"
        except requests.exceptions.RequestException as e:
            pytest.fail(f"Proxy connection failed: {e}")
