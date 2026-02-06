import pytest
import requests
import os

# Configuration
ENGINE_URL = os.getenv("ENGINE_URL", "http://localhost:8000")
PROXY_URL = os.getenv("PROXY_URL", "http://localhost:8090")
INTERNAL_TOKEN = "dev-secret-token-CHANGE-IN-PROD"

class TestL1Identity:
    def test_l0_proxy_connection(self):
        """Verify Proxy is reachable and forwards traffic when authorized."""
        proxies = {
            "http": PROXY_URL,
            "https": PROXY_URL,
        }
        try:
            # We use httpbin.org to verify the request goes through
            response = requests.get("http://httpbin.org/get", proxies=proxies, timeout=10)
            assert response.status_code == 200, f"Proxy failed to forward request. Status: {response.status_code}"
        except requests.exceptions.RequestException as e:
            pytest.fail(f"Proxy connection failed: {e}")

    def test_l5_direct_access_denied_without_token(self):
        """Verify Engine blocks direct requests without the internal token."""
        endpoint = f"{ENGINE_URL}/v1/assess"
        payload = {
            "method": "GET",
            "url": "http://malicious.com",
            "headers": {},
            "host": "malicious.com"
        }
        
        response = requests.post(endpoint, json=payload)
        
        # Expect 403 Forbidden (or JSON with BLOCK verdict if middleware returns 200 with block payload - but we implemented 403 rejection)
        # Checking implementation of L1IdentityMiddleware: return await self._reject(403, ...)
        
        assert response.status_code == 403, f"Engine should block request without token. Got: {response.status_code}"
        json_resp = response.json()
        assert json_resp["verdict"] == "BLOCK"
        assert "Unauthorized" in json_resp["reason"]

    def test_l5_direct_access_allowed_with_token(self):
        """Verify Engine allows direct requests with the valid internal token."""
        endpoint = f"{ENGINE_URL}/v1/assess"
        headers = {
            "X-Internal-Token": INTERNAL_TOKEN
        }
        payload = {
            "method": "GET",
            "url": "http://safe.com",
            "headers": {},
            "host": "safe.com"
        }
        
        response = requests.post(endpoint, json=payload, headers=headers)
        
        assert response.status_code == 200, f"Engine should allow request with token. Got: {response.status_code}"
        json_resp = response.json()
        assert json_resp["verdict"] == "ALLOW"
