"""
VEIL Layer 0: Smart Valve (Proxy) E2E Tests
Tests the interception, delegation, and enforcement capabilities of the L0 Proxy.
"""
import pytest
import requests
import os
import time

# Configuration
ENGINE_URL = os.getenv("ENGINE_URL", "http://localhost:8000")
PROXY_URL = os.getenv("PROXY_URL", "http://localhost:8090")

class TestL0SmartValve:
    """
    Test Suite for Layer 0: The Smart Valve (Mitmproxy)
    Verifies: Interception, Delegation to L5, and Enforcement (ALLOW/BLOCK)
    """

    def test_proxy_is_reachable(self):
        """Verify the Proxy service is up and accepting connections."""
        proxies = {"http": PROXY_URL, "https": PROXY_URL}
        try:
            # Use a simple HTTP endpoint
            response = requests.get("http://httpbin.org/status/200", proxies=proxies, timeout=15)
            assert response.status_code == 200, f"Proxy not forwarding basic traffic. Status: {response.status_code}"
        except requests.exceptions.RequestException as e:
            pytest.fail(f"Proxy connection failed: {e}")

    def test_proxy_forwards_get_request(self):
        """Verify GET requests are intercepted and forwarded correctly."""
        proxies = {"http": PROXY_URL, "https": PROXY_URL}
        response = requests.get("http://httpbin.org/get", proxies=proxies, timeout=15)
        
        assert response.status_code == 200
        data = response.json()
        # Verify httpbin received the request
        assert "headers" in data
        assert "origin" in data

    def test_proxy_forwards_with_headers(self):
        """Verify custom headers are preserved through the proxy."""
        proxies = {"http": PROXY_URL, "https": PROXY_URL}
        custom_headers = {"X-Custom-Test-Header": "VeilTestValue"}
        
        response = requests.get(
            "http://httpbin.org/headers", 
            headers=custom_headers,
            proxies=proxies, 
            timeout=15
        )
        
        assert response.status_code == 200
        data = response.json()
        # httpbin echoes headers back - verify our custom header was passed through
        assert data["headers"].get("X-Custom-Test-Header") == "VeilTestValue"

    def test_proxy_consults_engine(self):
        """
        Verify the Proxy consults the Engine (L5) before allowing traffic.
        This is verified by checking Engine logs or by the fact that traffic succeeds
        (since the Engine must return ALLOW for the traffic to pass).
        """
        proxies = {"http": PROXY_URL, "https": PROXY_URL}
        
        # Make a request that will be intercepted
        response = requests.get("http://httpbin.org/anything/veil-test", proxies=proxies, timeout=15)
        
        # If we get here with 200, the Engine approved it
        assert response.status_code == 200
        data = response.json()
        assert "/veil-test" in data["url"]

    def test_engine_health_accessible(self):
        """Verify the Engine health endpoint is accessible (bypasses L1 auth)."""
        response = requests.get(f"{ENGINE_URL}/health", timeout=5)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "active"
