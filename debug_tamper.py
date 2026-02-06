import shutil
import json
import logging
import hashlib
from scripts.verify_ledger import verify_ledger

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("veil.forensics")

def debug():
    # 1. Copy
    shutil.copy("veil.ledger.jsonl", "veil.ledger.debug.jsonl")
    
    # 2. Tamper
    with open("veil.ledger.debug.jsonl", "r") as f:
        lines = f.readlines()
    
    print(f"Original Lines: {len(lines)}")
    if len(lines) < 2:
        print("Not enough lines!")
        return

    # Modify second to last
    idx = -2
    entry = json.loads(lines[idx])
    print(f"Original Timestamp: {entry['timestamp']}")
    entry["timestamp"] = 1234567890
    lines[idx] = json.dumps(entry) + "\n"
    print(f"Tampered Timestamp: {entry['timestamp']}")
    
    # Calc expected hash of tampered entry
    expected_hash = hashlib.sha256(json.dumps(entry, sort_keys=True).encode()).hexdigest()
    print(f"Tampered Entry Hash Should Be: {expected_hash}")
    
    # Check next entry's prev_hash
    next_entry = json.loads(lines[idx+1])
    print(f"Next Entry Prev Hash Claim: {next_entry['prev_hash']}")
    
    if expected_hash != next_entry['prev_hash']:
        print("Confirmed: Hash Mismatch Exists in file!")
    else:
        print("WTF: Hash matches? Impossible if content changed.")

    with open("veil.ledger.debug.jsonl", "w") as f:
        f.writelines(lines)
        
    print("Running verify_ledger...")
    result = verify_ledger("veil.ledger.debug.jsonl")
    print(f"Verify Result: {result}")

if __name__ == "__main__":
    debug()
