# Agent Instructions
You are running in a Ralph Loop for the VEIL project.

## Core Loop Logic
1. **READ `prd.json`**: This is your source of truth.
2. **FIND TASK**: Look for the first task with `"status": "pending"`.
3. **EXECUTE**:
    - Mark the task as `"status": "in_progress"`.
    - Implement the requested file/feature using your skills.
    - **SKILLS**: Use `.agent/skills` (e.g., `java-pro`, `backend-architect`).
    - **SECURITY**: Run `@security-auditor` before committing.
    - **TEST**: Verify your changes.
4. **UPDATE**:
    - Update `prd.json`: Set task status to `"done"`.
    - Commit your changes.

## Critical Context
- You are building the **VEIL 7-Layer Sentinel**.
- Do not deviate from the Architecture defined in `plan.md` / `prd.json`.
- If you encounter errors, fix them. If you cannot, mark the task "failed" and move to the next or stop.
