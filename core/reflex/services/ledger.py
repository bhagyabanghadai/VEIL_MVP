"""
VEIL Layer 7 Service: Verifiable Action Ledger
Role: Immutable Forensic Logging using Signed Merkle Chains.
Crypto: Ed25519 (Signatures), SHA256 (Chaining).
"""
import os
import json
import time
import hashlib
import base64
import logging
from typing import Dict, Any
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization

logger = logging.getLogger("veil.l7.ledger")

LEDGER_FILE = os.getenv("LEDGER_FILE", "veil.ledger.jsonl")

class LedgerService:
    def __init__(self):
        self.file_path = LEDGER_FILE
        self._private_key = None
        self._public_key = None
        self._last_hash = self._init_ledger()
        self._load_or_generate_keys()

    def _init_ledger(self) -> str:
        """Initialize ledger file if missing and return the last hash."""
        if not os.path.exists(self.file_path):
            # Genesis Block
            genesis = {
                "event": "GENESIS",
                "timestamp": int(time.time()),
                "prev_hash": "0" * 64,
                "signature": "GENESIS",
                "meta": {"version": "v1.0"}
            }
            with open(self.file_path, "a") as f:
                f.write(json.dumps(genesis) + "\n")
            return self._hash_entry(genesis)
        
        # Read last line to get last hash
        try:
            with open(self.file_path, "r") as f:
                # Efficiently read last line? For MVP, just read all is fine or seek.
                lines = f.readlines()
                if not lines:
                    return "0" * 64
                last_line = lines[-1]
                last_entry = json.loads(last_line)
                return self._hash_entry(last_entry)
        except Exception as e:
            logger.error(f"Failed to read ledger: {e}")
            return "0" * 64

    def _load_or_generate_keys(self):
        """
        Load signing keys. For MVP, we generate ephemeral keys on startup.
        In PROD, these should be loaded from a secure vault.
        """
        # Checks if key exists in env (mock vault)
        # For this demo, we generate a fresh keypair to ensure signing works.
        # Ideally we persist this.
        self._private_key = ed25519.Ed25519PrivateKey.generate()
        self._public_key = self._private_key.public_key()
        
        # Log Public Key for verification
        pub_bytes = self._public_key.public_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PublicFormat.Raw
        )
        logger.info(f"🔑 L7: Inspector Public Key: {base64.b64encode(pub_bytes).decode()}")

    def _hash_entry(self, entry: Dict[str, Any]) -> str:
        # Canonical JSON string for hashing (exclude signature/hash fields if self-referencing, 
        # but here we hash the WHOLE stored entry to form the link for the NEXT entry)
        encoded = json.dumps(entry, sort_keys=True).encode()
        return hashlib.sha256(encoded).hexdigest()

    def sign_and_record(self, event_data: Dict[str, Any]):
        """
        1. Link to prev_hash.
        2. Sign (prev_hash + data).
        3. Append to log.
        """
        timestamp = int(time.time())
        prev_hash = self._last_hash
        
        # Construct the payload to sign
        # We sign the CONTENT, not the full partial entry, to ensure integrity of data + link + time
        payload_to_sign = f"{prev_hash}|{json.dumps(event_data, sort_keys=True)}|{timestamp}".encode()
        
        signature = self._private_key.sign(payload_to_sign)
        signature_b64 = base64.b64encode(signature).decode()

        # Construct Log Entry
        entry = {
            "timestamp": timestamp,
            "data": event_data,
            "prev_hash": prev_hash,
            "signature": signature_b64,
            "verification_data": "prev_hash|data_json|timestamp" # Hint for verifier
        }
        
        # Atomic Append (OS level atomic write for short lines usually, locking for robust)
        try:
            with open(self.file_path, "a") as f:
                f.write(json.dumps(entry) + "\n")
            
            # Update in-memory hash tip
            self._last_hash = self._hash_entry(entry)
            logger.info("📜 L7: Event Recorded & Signed.")
        except Exception as e:
            logger.error(f"🔥 L7: Write Failed: {e}")
