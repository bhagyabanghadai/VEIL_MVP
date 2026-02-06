"""
VEIL Forensic Tool: Ledger Verifier
Usage: python scripts/verify_ledger.py [ledger_file]
"""
import sys
import json
import hashlib
import base64
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("veil.forensics")

def verify_ledger(file_path):
    logger.info(f"🔍 Starting Forensic Analysis of: {file_path}")
    
    try:
        with open(file_path, "r") as f:
            lines = f.readlines()
    except FileNotFoundError:
        logger.error("❌ Ledger file not found.")
        return False

    if not lines:
        logger.warning("⚠️ Ledger is empty.")
        return True

    # 1. Chain Verification
    logger.info(f"🔗 Verifying Hash Chain ({len(lines)} entries)...")
    
    # Genesis check
    first_entry = json.loads(lines[0])
    current_hash = hashlib.sha256(json.dumps(first_entry, sort_keys=True).encode()).hexdigest()
    
    errors = 0
    
    for i in range(1, len(lines)):
        line_num = i + 1
        try:
            entry = json.loads(lines[i])
            prev_hash_claimed = entry.get("prev_hash")
            
            # CHECK 1: Hash Continuity
            if prev_hash_claimed != current_hash:
                logger.error(f"🚨 BROKEN CHAIN @ Line {line_num}")
                logger.error(f"   Expected Prev: {current_hash}")
                logger.error(f"   Claimed Prev:  {prev_hash_claimed}")
                errors += 1
            
            # Update hash for next iteration
            current_hash = hashlib.sha256(json.dumps(entry, sort_keys=True).encode()).hexdigest()
            
        except Exception as e:
            logger.error(f"❌ MALFORMED ENTRY @ Line {line_num}: {e}")
            errors += 1

    if errors == 0:
        logger.info("✅ INTEGRITY CONFIRMED. No tampering detected.")
        return True
    else:
        logger.error(f"🛑 VERIFICATION FAILED. Found {errors} integrity violations.")
        return False

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "veil.ledger.jsonl"
    success = verify_ledger(path)
    sys.exit(0 if success else 1)
