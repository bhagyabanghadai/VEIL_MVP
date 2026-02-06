
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);


// --- TYPE DEFINITIONS ---

export interface Testimonial {
    avatarSrc: string;
    name: string;
    handle: string;
    text: string;
}

interface SignInPageProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    heroImageSrc?: string;
    rightPanelContent?: React.ReactNode; // Added to support custom component
    testimonials?: Testimonial[];
    onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
    onGoogleSignIn?: () => void;
    onResetPassword?: () => void;
    onCreateAccount?: () => void;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
    // Retaining project colors (Blue/Cyan) but matching the snippet's structural classes exactly
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors focus-within:border-blue-400/70 focus-within:bg-blue-500/10 group">
        {children}
    </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial, delay: string }) => (
    <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-5 w-64 shadow-2xl`}>
        <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl ring-1 ring-white/10" alt="avatar" />
        <div className="text-sm leading-snug">
            <p className="flex items-center gap-1 font-medium text-white">{testimonial.name}</p>
            <p className="text-gray-400 text-xs">{testimonial.handle}</p>
            <p className="mt-2 text-gray-300 text-xs leading-relaxed">{testimonial.text}</p>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
    title = <span className="font-light text-white tracking-tighter">Welcome</span>,
    description = "Access your account and continue your journey with us",
    heroImageSrc,
    rightPanelContent,
    testimonials = [],
    onSignIn,
    onGoogleSignIn,
    onResetPassword,
    onCreateAccount,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row font-sans w-[100dvw] bg-black text-white overflow-hidden">
            {/* Left column: sign-in form */}
            <section className="flex-1 flex items-center justify-center p-8 bg-black z-10">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight tracking-tight">{title}</h1>
                            <p className="animate-element animate-delay-200 text-gray-400">{description}</p>
                        </div>

                        <form className="space-y-5" onSubmit={onSignIn}>
                            <div className="animate-element animate-delay-300 space-y-1">
                                <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                                <GlassInputWrapper>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-gray-600"
                                    />
                                </GlassInputWrapper>
                            </div>

                            <div className="animate-element animate-delay-400 space-y-1">
                                <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                                <GlassInputWrapper>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white placeholder:text-gray-600"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center p-2">
                                            {showPassword ? <EyeOff className="w-5 h-5 text-gray-400 hover:text-white transition-colors" /> : <Eye className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />}
                                        </button>
                                    </div>
                                </GlassInputWrapper>
                            </div>

                            <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" name="rememberMe" className="custom-checkbox text-blue-500 rounded-sm border-gray-600 group-hover:border-blue-500 transition-colors" />
                                    <span className="text-gray-400 group-hover:text-white transition-colors">Keep me signed in</span>
                                </label>
                                <a href="#" onClick={(e) => { e.preventDefault(); onResetPassword?.(); }} className="text-blue-400 hover:text-blue-300 transition-colors text-sm">Reset password</a>
                            </div>

                            <button type="submit" className="animate-element animate-delay-600 w-full rounded-2xl bg-blue-600 hover:bg-blue-500 py-4 font-medium text-white transition-all duration-300">
                                Sign In
                            </button>
                        </form>

                        <div className="animate-element animate-delay-700 relative flex items-center justify-center my-2">
                            <span className="w-full border-t border-gray-800"></span>
                            <span className="px-4 text-sm text-gray-500 bg-black absolute">Or continue with</span>
                        </div>

                        <button onClick={onGoogleSignIn} className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-gray-800 rounded-2xl py-4 hover:bg-gray-900 transition-all duration-300 group">
                            <GoogleIcon />
                            <span className="text-gray-400 group-hover:text-white transition-colors">Continue with Google</span>
                        </button>

                        <p className="animate-element animate-delay-900 text-center text-sm text-gray-500 mt-2">
                            New to our platform? <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="text-blue-400 hover:text-blue-300 transition-colors font-medium ml-1">Create Account</a>
                        </p>
                    </div>
                </div>
            </section>

            {/* Right column: Image/Content + Testimonials */}
            {/* Reverting to the Floating Card layout from the snippet (p-4 + rounded-3xl) */}
            <section className="hidden md:block flex-1 relative p-4 bg-black">
                <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl overflow-hidden border border-white/10 bg-[#0a0c10]">
                    {rightPanelContent ? rightPanelContent : heroImageSrc && (
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${heroImageSrc})` }}
                        />
                    )}

                    {/* Gradient Overlay for Text Readability if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Testimonials positioned on top of the card content */}
                {testimonials.length > 0 && (
                    <div className="absolute bottom-12 left-0 right-0 z-10 flex gap-6 px-12 justify-center w-full pointer-events-none">
                        <div className="pointer-events-auto"><TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" /></div>
                        {testimonials[1] && <div className="hidden xl:flex transform translate-y-8 pointer-events-auto"><TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" /></div>}
                        {testimonials[2] && <div className="hidden 2xl:flex transform translate-y-16 pointer-events-auto"><TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" /></div>}
                    </div>
                )}
            </section>
        </div>
    );
};
