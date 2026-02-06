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
                // Removed 'industrial' font to ensure clean confident typography
            },
            colors: {
                // "Glass Fortress" Palette
                veil: {
                    bg: '#0a0a0a', // Tech Black (Look Cycle Base)
                    sub: '#080A12',
                    card: '#0F111A',
                    border: '#1E2330',

                    // The "Trust" Accents
                    accent: {
                        DEFAULT: '#3B82F6',
                        hover: '#2563EB',
                        dim: 'rgba(59, 130, 246, 0.05)',
                        glow: 'rgba(59, 130, 246, 0.5)',
                    },
                    // LOOK CYCLE / MONDRIAN TOKENS
                    mondrian: {
                        red: '#e30613',
                        yellow: '#ffc20e',
                        blue: '#009fe3',
                        white: '#ffffff',
                    },
                    secondary: {
                        DEFAULT: '#8B5CF6',
                        dim: 'rgba(139, 92, 246, 0.1)',
                    },

                    // State Colors (Clean)
                    success: '#10B981',
                    alert: '#EF4444',

                    text: {
                        primary: '#FFFFFF', // Pure White
                        secondary: '#94A3B8', // Smooth Liquid Metal Grey
                        muted: '#475569', // Deep Grey
                    }
                }
            },
            backgroundImage: {
                'void-gradient': 'linear-gradient(180deg, #020408 0%, #0F111A 100%)',
                'glass-shine': 'linear-gradient(120deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
                'glow-mesh': 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
            },
            animation: {
                'float': 'float 8s ease-in-out infinite',
                'pulse-soft': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                }
            }
        },
    },
    plugins: [],
}
