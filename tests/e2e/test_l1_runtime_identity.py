import pytest
import requests
import os

# Configuration
ENGINE_URL = os.getenv("ENGINE_URL", "http://localhost:8000")
PROXY_URL = os.getenv("PROXY_URL", "http://localhost:8090")
INTERNAL_TOKEN = "dev-secret-token-CHANGE-IN-PROD"

class TestL1RuntimeIdentity:
    def test_authorized_proxy_flow(self):
        """
        Verify that requests via the Authorized Proxy (which has the correct Hash)
        are ALLOWED.
        """
        proxies = {
            "http": PROXY_URL,
            "https": PROXY_URL,
        }
        try:
            # httpbin or google - just need a successful traversal
            response = requests.get("http://httpbin.org/get", proxies=proxies, timeout=10)
            assert response.status_code == 200, f"Authorized Proxy blocked! Status: {response.status_code}"
        except requests.exceptions.RequestException as e:
            pytest.fail(f"Proxy connection failed: {e}")

    # Note: To test the NEGATIVE case (Rogue Container), we would need to spin up a 
    # second container with a different image ID and try to CURL the engine.
    # For this MVP suite, verifying the Positive (Strict) case is the primary goal.
    # If the hash check was broken (e.g. returning UNKNOWN), this test would fail.
