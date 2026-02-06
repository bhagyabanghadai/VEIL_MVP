"""
VEIL Layer 1: Identity
Role: Middleware to validate the internal handshake between Proxy and Engine.
"""
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from ..config import get_settings

class L1IdentityMiddleware(BaseHTTPMiddleware):
    # Paths that bypass Identity checks (public routes)
    BYPASS_PATHS = ["/health", "/dashboard", "/api/v1/stats", "/api/v1/health"]

    async def dispatch(self, request: Request, call_next):
        # Allow whitelisted paths without token
        if any(request.url.path.startswith(p) for p in self.BYPASS_PATHS):
            return await call_next(request)

        # 1. Extract Token
        token = request.headers.get("X-Internal-Token")
        
        # 2. Validate Token (Legacy L1.5)
        settings = get_settings()
        if not token or token != settings.INTERNAL_TOKEN:
             # L1.5 Rejection: Simple Auth Failed
            return await self._reject(403, "Reflex L1: Unauthorized Handshake")

        # 3. Validate Runtime Identity (True L1)
        # Verify the container image hash matches the authorized proxy
        from ..utils.docker_inspector import DockerInspector
        inspector = DockerInspector()
        client_ip = request.client.host
        
        container_hash = inspector.get_container_identity(client_ip)
        
        # Dev mode bypass: Allow UNKNOWN (host/test client) in dev
        if container_hash == "UNKNOWN" and settings.ENV == "dev":
            # Allow in dev with warning (for testing)
            pass
        elif container_hash != settings.AUTHORIZED_PROXY_HASH:
             # True L1 Rejection: Supply Chain Integrity Failed
            return await self._reject(403, f"Reflex L1: Runtime Identity Mismatch (Target: {container_hash})")

        # 4. Proceed to next layer
        response = await call_next(request)
        return response

    async def _reject(self, status_code: int, detail: str):
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=status_code,
            content={"verdict": "BLOCK", "reason": detail}
        )
