package veil

import future.keywords.if
import future.keywords.in

default allow = false

# Rule 1: Allow System Health Checks
allow if {
    input.method == "GET"
    input.path == "/health"
}

# Rule 2: Allow Access to Engine Assessment (with constraints)
allow if {
    input.method == "POST"
    input.path == "/v1/assess"
    not is_high_risk
}

# Helper: Check Risk Level from Intent
is_high_risk if {
    input.intent.risk_level == "high"
}

# Helper: Check for Critical Resources (Future Example)
is_critical_resource if {
    startswith(input.path, "/admin")
}

# Explicit Deny for Critical Resources if High Risk (Defense in Depth)
deny if {
    is_critical_resource
    is_high_risk
}
