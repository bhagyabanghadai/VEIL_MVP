export const PROMPT_AGENT_REGISTRATION_ANALYSIS = `
Input: \${AGENT_JSON}

Output we expect from Gemini: risk analysis, suggested capabilities, short passport summary.
`;

export const PROMPT_POLICY_TRANSLATION = `
Input: \${NATURAL_LANGUAGE_POLICY}

Output: structured rules object and concise description.
`;

export const PROMPT_ACTION_EVALUATION = `
Input:
Agent: \${AGENT_JSON}
Action: \${ACTION_JSON}
Policies: \${POLICY_JSON}

Output: decision, riskScore, reasons, suggested signature seed.
`;

export const PROMPT_MISBEHAVIOR_ANALYSIS = `
Input:
Agent: \${AGENT_JSON}
Recent Actions: \${RECENT_ACTIONS_JSON}
Current Action: \${CURRENT_ACTION_JSON}

Output: misbehaviorScore, drift explanation, flags.
`;

export const PROMPT_IMAGE_ACTION_ANALYSIS = `
Input: description/handle of an uploaded image (screenshot), agent, policies.
Image Handle: \${IMAGE_HANDLE}

Output: risks, suspected operations in image, policy violations.
`;

// Models to be used later
export const MODELS = {
  COMPLEX: 'gemini-3-pro-preview',
  FAST: 'gemini-2.5-flash',
  VISION: 'gemini-3-pro-preview', // Using 3-pro for high quality image analysis
};