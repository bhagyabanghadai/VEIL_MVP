import docker
from functools import lru_cache
import logging

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("veil.l1.inspector")

class DockerInspector:
    def __init__(self):
        try:
            self.client = docker.from_env()
            logger.info("🕵️ Docker Inspector Connected.")
        except Exception as e:
            logger.error(f"❌ Failed to connect to Docker Socket: {e}")
            self.client = None

    @lru_cache(maxsize=128)
    def get_container_identity(self, ip_address: str) -> str:
        """
        Runtime Identity Lookup:
        Given an IP (from the request), find the container and return its Image Hash.
        Cached for performance (TTL handled by LRU implicit eviction or manual wrapper if needed, 
        but LRU is fine for MVP as IPs don't churn fast).
        """
        if not self.client:
            return "UNKNOWN"

        try:
            # Linear scan is okay for MVP (few containers)
            # In prod, we'd query by network endpoint if possible
            containers = self.client.containers.list()
            for container in containers:
                # Inspect networks
                networks = container.attrs['NetworkSettings']['Networks']
                for net_name, net_data in networks.items():
                    if net_data['IPAddress'] == ip_address:
                        image_sha = container.image.id
                        logger.info(f"✅ Verified IP {ip_address} -> Container {container.name} ({image_sha})")
                        return image_sha
            
            logger.warning(f"⚠️ No container found for IP {ip_address}")
            return "UNKNOWN"

        except Exception as e:
            logger.error(f"🔥 Inspection Failed: {e}")
            return "ERROR"
