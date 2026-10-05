import json
import sys

payload = json.load(sys.stdin)
payload["python"] = {
    "stages": sorted(k for k in payload if k != "input"),
    "bytes": len(payload.get("input", "").encode()),
}
json.dump(payload, sys.stdout)
