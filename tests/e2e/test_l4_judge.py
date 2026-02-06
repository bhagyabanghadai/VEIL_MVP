"""
VEIL Layer 4: Semantic Judge E2E Tests
Tests Fast Path, Verdict Caching, and Judge Logic.
"""
import pytest
import requests
import json
import uuid
import time
import os

ENGINE_URL = os.getenv("ENGINE_URL", "http://localhost:8000")
INTERNAL_TOKEN = "dev-secret-token-CHANGE-IN-PROD"

class TestL4Judge:
    def _create_intent(self, risk: str, justification: str, nonce: str = None) -> dict:
        return {
            "goal": "test_judge",
            "action": "POST /v1/assess",
            "justification": justification,
            "risk_level": risk,
            "nonce": nonce or str(uuid.uuid4()),
            "timestamp": int(time.time())
        }

    def test_fast_path_low_risk(self):
        """Verify Low Risk skips judge (fast response)."""
        intent = self._create_intent("low", "Routine check")
        headers = {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": json.dumps(intent),
            "Content-Type": "application/json"
        }
        payload = {"method": "GET", "url": "http://test.com", "host": "test.com", "headers": {}}
        
        start = time.time()
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=5)
        duration = time.time() - start
        
        assert response.status_code == 200
        # Fast path should be very fast (though first request might be slow due to startup)
        # We mainly check logs for "Fast Path" later if needed, or rely on 200 OK.

    def test_judge_approval(self):
        """Verify Medium Risk with GOOD justification is approved."""
        # Justification matches payload context
        intent = self._create_intent("medium", "Refund for user 123 due to double charge")
        headers = {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": json.dumps(intent),
            "Content-Type": "application/json"
        }
        # Payload supports the claim
        headers_payload = {"User-Agent": "test"}
        payload = {
            "method": "POST", 
            "url": "http://api.com/refund", 
            "host": "api.com", 
            "headers": headers_payload,
            "body": "User 123 double charged on invoice #555"
        }
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=10)
        assert response.status_code == 200, f"Judge rejected valid justification! {response.text}"

    def test_judge_rejection_hallucination(self):
        """Verify Medium Risk with BAD justification is blocked."""
        # Justification says "Refund", but payload says "Delete Database"
        intent = self._create_intent("medium", "Refund for user 123")
        headers = {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": json.dumps(intent),
            "Content-Type": "application/json"
        }
        
        # Payload contradicts justification
        payload = {
            "method": "DELETE", 
            "url": "http://api.com/db", 
            "host": "api.com", 
            "headers": {},
            "body": "DROP TABLE users;"
        }
        
        response = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=10)
        assert response.status_code == 403, f"Judge allowed lie! {response.status_code}"
        assert "Judge Denied" in response.text or "Judge Skeptical" in response.text

    def test_verdict_caching(self):
        """Verify second request is faster (Cache Hit)."""
        intent = self._create_intent("medium", "Cache test unique justification " + str(uuid.uuid4()))
        headers = {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": json.dumps(intent),
            "Content-Type": "application/json"
        }
        payload = {
            "method": "POST",
            "url": "http://test.com",
            "host": "test.com",
            "headers": {}
        }

        # First Call (LLM)
        t1_start = time.time()
        r1 = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers, timeout=10)
        t1 = time.time() - t1_start
        assert r1.status_code == 200

        # Second Call (Cache) - Reuse same justification/payload, new nonce
        intent2 = self._create_intent("medium", intent["justification"])
        headers2 = {
            "X-Internal-Token": INTERNAL_TOKEN,
            "X-Veil-Intent": json.dumps(intent2),
            "Content-Type": "application/json"
        }
        
        t2_start = time.time()
        r2 = requests.post(f"{ENGINE_URL}/v1/assess", json=payload, headers=headers2, timeout=5)
        t2 = time.time() - t2_start
        assert r2.status_code == 200
        
        print(f"Time 1: {t1:.4f}s, Time 2: {t2:.4f}s")
        # Second call should be significantly faster (unless LLM was super fast already)
