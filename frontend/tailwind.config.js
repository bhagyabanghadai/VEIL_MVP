/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', '"Roboto"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
                main: ['Inter', 'sans-serif'],
            },
            colors: {
                // --- NIGHTFALL PALETTE ---
                // Rich black theme inspired by CrowdStrike, Datadog Security
                nightfall: {
                    base: '#0f0f14',       // Main background (rich black)
                    panel: '#181824',      // Card/Panel backgrounds  
                    elevated: '#1f1f2e',   // Hover states, inputs
                    border: '#2a2a3c',     // All borders
                },
                // Semantic tokens
                veil: {
                    // Backgrounds
                    bg: '#0f0f14',
                    sub: '#181824',
                    panel: '#181824',
                    border: '#2a2a3c',

                    // Text
                    'text-primary': '#e8e8ee',
                    'text-secondary': '#a1a1aa',
                    'text-muted': '#5a5a6a',

                    // Status colors (vibrant but not oversaturated)
                    accent: '#3b82f6',     // Blue-500 - Primary actions
                    trust: '#22c55e',      // Green-500 - Trust/"secure" 
                    alert: '#ef4444',      // Red-500 - Critical alerts
                    warning: '#f59e0b',    // Amber-500 - Caution/warning
                    success: '#10b981',    // Emerald-500 - Success
                    info: '#06b6d4',       // Cyan-500 - Info indicators

                    // Dim versions for backgrounds
                    'trust-dim': 'rgba(34, 197, 94, 0.1)',
                    'alert-dim': 'rgba(239, 68, 68, 0.1)',
                    'audit-dim': 'rgba(245, 158, 11, 0.1)',
                    audit: '#f59e0b',
                }
            },
            backgroundImage: {
                'nightfall-gradient': 'linear-gradient(180deg, #181824 0%, #0f0f14 100%)',
                'grid-subtle': 'linear-gradient(to right, rgba(42,42,60,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(42,42,60,0.3) 1px, transparent 1px)',
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                'md': '0.375rem',
                'lg': '0.5rem',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: 0, transform: 'translateY(4px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                }
            }
        },
    },
    plugins: [],
}
