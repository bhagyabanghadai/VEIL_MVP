import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { FallingPattern } from "@/components/ui/falling-pattern";
import { cn } from "@/lib/utils";

// --- ICONS (Monochrome/Silver variants) ---
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path
            fill="#fff"
            d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.6v3h3.9c2.28-2.1 3.6-5.2 3.6-8.84z"
            fillOpacity="0.8"
        />
        <path
            fill="#888"
            d="M12.255 24c3.24 0 5.95-1.08 7.96-2.91l-3.9-3c-1.08.72-2.47 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96h-4.19v3.24c1.99 3.96 6.09 6.47 10.92 6.47z"
        />
        <path
            fill="#aaa"
            d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.47h-4.19C.465 8.24 0 10.06 0 12c0 1.94.465 3.76 1.335 5.53l4.19-3.24z"
        />
        <path
            fill="#fff"
            d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0 7.425 0 3.325 2.51 1.335 6.47l4.19 3.24c.95-2.85 3.6-4.96 6.73-4.96z"
        />
    </svg>
);

const TwitterIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
);

const GitHubIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
);

const VeilLogo = () => (
    <div className="flex items-center gap-3 mb-8 group cursor-default">
        <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white to-gray-400 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-500 ring-1 ring-white/20">
                <div className="w-6 h-6 border-2 border-white rounded-lg opacity-90 backdrop-blur-sm" />
            </div>
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full -z-10 animate-pulse-soft" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight drop-shadow-2xl">
            VEIL <span className="font-light text-white/50">OS</span>
        </span>
    </div>
);

// --- COMPONENTS ---

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
}

const FloatingInput = ({ label, icon, className, ...props }: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    return (
        <div className="relative group">
            {/* Glow effect on focus - WHITE */}
            <div
                className={cn(
                    "absolute -inset-0.5 rounded-xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 blur-sm",
                    isFocused && "opacity-100"
                )}
            />
            <div className="relative">
                <input
                    className={cn(
                        "peer w-full bg-[#030406]/80 text-white border border-white/10 rounded-xl px-4 pt-6 pb-2 text-sm",
                        "placeholder-transparent outline-none transition-all duration-300",
                        "focus:bg-black/90 shadow-inner shadow-black/50 focus:border-white/20",
                        className
                    )}
                    placeholder={label}
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => {
                        setIsFocused(false);
                        setHasValue(!!e.target.value);
                    }}
                    onChange={(e) => setHasValue(!!e.target.value)}
                    {...props}
                />

                {/* Border Bottom Glow Line - WHITE */}
                <div className={cn(
                    "absolute bottom-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent scale-x-0 transition-transform duration-500 opacity-50",
                    isFocused && "scale-x-100"
                )} />

                <label className={cn(
                    "absolute left-4 text-xs text-gray-500 transition-all duration-300 pointer-events-none",
                    (isFocused || hasValue || props.value)
                        ? "top-1.5 text-[10px] text-white/70 font-medium tracking-wider uppercase"
                        : "top-4 text-sm text-gray-500"
                )}>
                    {label}
                </label>

                {icon && (
                    <div className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 transition-colors duration-300",
                        isFocused && "text-white"
                    )}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};

interface NewLoginPageProps {
    onLoginSuccess: (token: string) => void;
    onBack?: () => void;
}

export const NewLoginPage: React.FC<NewLoginPageProps> = ({ onLoginSuccess, onBack }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Import dynamically to avoid circular dependencies if any
            const { loginUser } = await import('../../services/scaffoldService');
            const result = await loginUser(username, password);
            onLoginSuccess(result.token);
        } catch (err: any) {
            console.error("Login failed:", err);
            // Fallback for "Demo" credentials (optional, or just fail)
            if (username === 'admin' && password === 'admin') {
                // Keep the backdoor for emergency demo access if backend acts up
                console.warn("Using fallback demo login");
                onLoginSuccess("demo-token-fallback");
            } else {
                setError(err.message || "Authentication failed. Check backend.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = () => {
        onLoginSuccess("google-token-mock");
    };

    return (
        <div
            className="relative h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center font-sans selection:bg-white/20"
            onMouseMove={(e) => {
                const spotlight = document.getElementById('cursor-spotlight');
                if (spotlight) {
                    const x = e.clientX;
                    const y = e.clientY;
                    // WHITE spotlight
                    spotlight.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.08), transparent 40%)`;
                }
            }}
        >

            {/* === AMBIENT BACKGROUND === */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mb-20 md:mb-0">
                {/* Deep Gradient Base */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1a1a1a,transparent,transparent)] opacity-40" />

                {/* Layer 1: Slow heavy rain (Base) - WHITE */}
                <div className="absolute inset-0 opacity-20 mix-blend-screen">
                    <FallingPattern
                        color="#ffffff"
                        backgroundColor="transparent"
                        duration={25}
                        className="rotate-180 scale-125"
                    />
                </div>

                {/* Layer 2: Fast torrential accent - WHITE/SILVER */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                    <FallingPattern
                        color="#e5e5e5"
                        backgroundColor="transparent"
                        duration={15}
                        className="rotate-180 scale-150 translate-x-10"
                    />
                </div>

                {/* Interactive Spotlight Overlay (Controlled via JS specific to mouse) */}
                <div
                    id="cursor-spotlight"
                    className="fixed inset-0 pointer-events-none z-10"
                    style={{ background: 'radial-gradient(600px circle at 50% 50%, rgba(255,255,255,0.1), transparent 40%)' }}
                />

                {/* Vignette */}
                <div className="absolute inset-0 bg-transparent ring-1 ring-inset ring-white/5 opacity-50"
                    style={{ boxShadow: 'inset 0 0 150px #000' }}
                />
            </div>

            {/* === GLASS CONTAINER === */}
            <div
                className="relative z-20 w-full max-w-[400px] px-6 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-5"
            >
                <div className="
                relative overflow-hidden
                bg-black/40 backdrop-blur-md
                border border-white/10
                rounded-3xl
                shadow-[0_40px_100px_-15px_rgba(0,0,0,0.8)]
                p-8
                flex flex-col items-center
                group
            ">
                    {/* Top Specular Shine - WHITE */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-700" />

                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all duration-300 group/back"
                        title="Go Back"
                    >
                        <ArrowRight className="w-5 h-5 rotate-180 group-hover/back:-translate-x-1 transition-transform text-white/50 group-hover/back:text-white" />
                    </button>

                    {/* LOGO & HEADING */}
                    <div className="mt-2 mb-8 scale-100 hover:scale-105 transition-transform duration-500">
                        <VeilLogo />
                    </div>

                    <div className="text-center mb-8 space-y-2">
                        <h2 className="text-2xl font-bold text-white tracking-tight">System Access</h2>
                        <p className="text-sm text-gray-500 font-light">
                            Identify yourself to the network.
                        </p>
                    </div>

                    {/* SOCIAL & SSO */}
                    <div className="w-full space-y-3 mb-6">
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full group/btn relative overflow-hidden flex items-center justify-center gap-3 py-2.5 bg-white text-black rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium text-sm border border-transparent hover:scale-[1.01]"
                        >
                            <GoogleIcon />
                            <span>Continue with Google</span>
                        </button>

                        <div className="flex gap-3">
                            <button className="flex-1 group/btn relative overflow-hidden flex items-center justify-center py-2.5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                <TwitterIcon />
                            </button>
                            <button className="flex-1 group/btn relative overflow-hidden flex items-center justify-center py-2.5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                <GitHubIcon />
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full mb-6 py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] tracking-widest uppercase font-medium">
                            <span className="px-3 bg-black/40 text-gray-500">Or continue with email</span>
                        </div>
                    </div>

                    {/* LOGIN FORM */}
                    <form onSubmit={handleSubmit} className="w-full space-y-4 relative z-10">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-xs text-center">
                                {error}
                            </div>
                        )}
                        <div>
                            <FloatingInput
                                label="Username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <FloatingInput
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-white focus:outline-none transition-colors">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                }
                            />
                            <div className="flex justify-end pt-2">
                                <a href="#" className="text-[11px] text-gray-500 hover:text-white transition-colors">Forgot password?</a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                            w-full mt-4 py-3.5 rounded-xl relative overflow-hidden group/submit
                            bg-white text-black
                            hover:bg-gray-200
                            font-semibold tracking-wide text-sm
                            shadow-[0_0_20px_rgba(255,255,255,0.1)]
                            hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]
                            disabled:opacity-70 disabled:cursor-not-allowed
                            transform active:scale-[0.98]
                            transition-all duration-300
                            flex items-center justify-center gap-2
                        "
                        >

                            {isSubmitting ? (
                                <div
                                    className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"
                                />
                            ) : (
                                <span className="flex items-center gap-2 relative z-10">
                                    Authenticate
                                    <ArrowRight size={16} className="opacity-80 group-hover/submit:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-[10px] text-center text-gray-600 font-mono tracking-wide leading-relaxed">
                        PROTECTED BY VEIL<br />
                        SYSTEM ID: <span className="text-gray-500">V-8829-X</span> • <a href="#" className="hover:text-white transition-colors">LEGAL</a>
                    </p>
                </div>

                {/* Ambient Ground Reflection - WHITE */}
                <div
                    className="absolute -bottom-10 left-10 right-10 h-20 bg-white/5 blur-[60px] rounded-[100%] pointer-events-none"
                />
            </div>
        </div>
    );
};
