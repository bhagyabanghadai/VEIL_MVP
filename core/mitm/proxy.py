"""
VEIL Layer 0: The Smart Valve (Mitmproxy)
Role: Intercepts traffic and consults the Reflex Engine (L5).
"""
import os
import asyncio
import aiohttp
import uuid
import json
import time
from mitmproxy import http
from mitmproxy.script import concurrent
from mitmproxy.script import concurrent

# Configuration
REFLEX_ENGINE_URL = os.getenv("REFLEX_ENGINE_URL", "http://localhost:8000")
INTERNAL_TOKEN = os.getenv("INTERNAL_TOKEN", "dev-secret-token")
VERIFY_SSL = False  # Internal communication

class VeilInterceptor:
    def __init__(self):
        print(f"🛡️ VEIL L0 (The Hand) Initialized. Engine: {REFLEX_ENGINE_URL}")

    @concurrent
    async def request(self, flow: http.HTTPFlow):

        """
        Intercepts every HTTP request.
        1. Pauses the request.
        2. Sends metadata to Reflex Engine (L5).
        3. Enforces decision (ALLOW/BLOCK).
        """
        # Ignore internal traffic to the engine itself to prevent loops
        if "veil-engine" in flow.request.pretty_host or "localhost" in flow.request.pretty_host:
            return

        print(f"⏳ Intercepting: {flow.request.method} {flow.request.pretty_url}")

        # Payload for the Brain
        payload = {
            "method": flow.request.method,
            "url": flow.request.pretty_url,
            "headers": dict(flow.request.headers),
            "host": flow.request.pretty_host,
        }

        # L1 Handshake Headers
        auth_headers = {
            "X-Internal-Token": INTERNAL_TOKEN # Phase 2: Verified Injection
        }

        # L2 Intent Declaration (Phase 3: Cognitive Accountability)
        # For MVP: Proxy generates a "mock intent" since real agents aren't integrated yet
        intent_payload = {
            "goal": "proxy_forward",
            "action": f"POST /v1/assess",  # The action WE are taking to the Engine
            "justification": f"Forwarding intercepted request to {flow.request.pretty_host}",
            "risk_level": "low",
            "nonce": str(uuid.uuid4()),
            "timestamp": int(time.time())
        }
        auth_headers["X-Veil-Intent"] = json.dumps(intent_payload)

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{REFLEX_ENGINE_URL}/v1/assess",
                    json=payload,
                    headers=auth_headers,
                    timeout=2.0 
                ) as response:
                    if response.status != 200:
                        print(f"❌ Engine Error ({response.status}). Defaulting to BLOCK.")
                        self.block(flow, reason="Engine Failure")
                        return

                    decision = await response.json()
                    verdict = decision.get("verdict", "BLOCK")
                    
                    if verdict == "ALLOW":
                        print(f"✅ ALLOWED: {flow.request.pretty_url}")
                        # Traffic resumes automatically when function returns
                    else:
                        print(f"⛔ BLOCKED: {flow.request.pretty_url}")
                        self.block(flow, reason="Policy Violation")

        except Exception as e:
            print(f"🔥 Critical Failure: {e}")
            self.block(flow, reason="System Failure")

    def block(self, flow: http.HTTPFlow, reason: str):
        flow.response = http.Response.make(
            403,
            f"VEIL Security: Request Blocked ({reason})",
            {"Content-Type": "text/plain"}
        )

addons = [
    VeilInterceptor()
]
