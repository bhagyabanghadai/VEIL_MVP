"use client";

import * as React from "react";
import { useState, useId, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SecurityBackground } from "@/components/landing/SecurityBackground";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- TYPEWRITER ---
export interface TypewriterProps {
    text: string | string[];
    speed?: number;
    cursor?: string;
    loop?: boolean;
    deleteSpeed?: number;
    delay?: number;
    className?: string;
}

export function Typewriter({
    text,
    speed = 100,
    cursor = "|",
    loop = false,
    deleteSpeed = 50,
    delay = 1500,
    className,
}: TypewriterProps) {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [textArrayIndex, setTextArrayIndex] = useState(0);

    const textArray = Array.isArray(text) ? text : [text];
    const currentText = textArray[textArrayIndex] || "";

    useEffect(() => {
        if (!currentText) return;

        const timeout = setTimeout(
            () => {
                if (!isDeleting) {
                    if (currentIndex < currentText.length) {
                        setDisplayText((prev) => prev + currentText[currentIndex]);
                        setCurrentIndex((prev) => prev + 1);
                    } else if (loop) {
                        setTimeout(() => setIsDeleting(true), delay);
                    }
                } else {
                    if (displayText.length > 0) {
                        setDisplayText((prev) => prev.slice(0, -1));
                    } else {
                        setIsDeleting(false);
                        setCurrentIndex(0);
                        setTextArrayIndex((prev) => (prev + 1) % textArray.length);
                    }
                }
            },
            isDeleting ? deleteSpeed : speed,
        );

        return () => clearTimeout(timeout);
    }, [
        currentIndex,
        isDeleting,
        currentText,
        loop,
        speed,
        deleteSpeed,
        delay,
        displayText,
        text,
    ]);

    return (
        <span className={className}>
            {displayText}
            <span className="animate-pulse text-[#00f0ff]">{cursor}</span>
        </span>
    );
}

// --- UI COMPONENTS ---
const labelVariants = cva(
    "text-[10px] uppercase tracking-widest text-white/50 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-mono"
);

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
    />
));
Label.displayName = LabelPrimitive.Root.displayName;

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 uppercase tracking-wider font-mono",
    {
        variants: {
            variant: {
                default: "bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90 shadow-[0_0_20px_rgba(0,240,255,0.3)]",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-white/20 bg-white/5 hover:bg-white/10 hover:text-[#00f0ff] text-white/70",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-[#00f0ff]/80 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-12 rounded-md px-8",
                icon: "h-8 w-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    }
);
Button.displayName = "Button";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 py-3 text-sm text-white shadow-sm transition-all placeholder:text-white/20 focus-visible:border-[#00f0ff]/50 focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 font-mono",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, label, ...props }, ref) => {
        const id = useId();
        const [showPassword, setShowPassword] = useState(false);
        const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
        return (
            <div className="grid w-full items-center gap-2">
                {label && <Label htmlFor={id}>{label}</Label>}
                <div className="relative">
                    <Input id={id} type={showPassword ? "text" : "password"} className={cn("pe-10", className)} ref={ref} {...props} />
                    <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-white/40 transition-colors hover:text-[#00f0ff] focus-visible:text-[#00f0ff] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? (<EyeOff className="size-4" aria-hidden="true" />) : (<Eye className="size-4" aria-hidden="true" />)}
                    </button>
                </div>
            </div>
        );
    }
);
PasswordInput.displayName = "PasswordInput";

// --- FORMS ---

function SignInForm({ onSuccess }: { onSuccess?: (token: string) => void }) {
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        // Simulate auth
        setTimeout(() => {
            setLoading(false);
            if (onSuccess) onSuccess("demo-token");
        }, 1500);
    };

    return (
        <form onSubmit={handleSignIn} autoComplete="on" className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                    <ShieldCheck className="w-6 h-6 text-[#00f0ff]" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">System Access</h1>
                <p className="text-balance text-xs text-white/40 font-mono uppercase tracking-widest">Identify to proceed</p>
            </div>
            <div className="grid gap-4">
                <div className="grid gap-2"><Label htmlFor="email">Identity String</Label><Input id="email" name="email" type="email" placeholder="agent@veil.network" required autoComplete="email" /></div>
                <PasswordInput name="password" label="Security Key" required autoComplete="current-password" placeholder="••••••••" />
                <Button type="submit" className="mt-4" disabled={loading}>
                    {loading ? "AUTHENTICATING..." : "INITIALIZE UPLINK"}
                </Button>
            </div>
        </form>
    );
}

function SignUpForm() {
    const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); console.log("UI: Sign Up form submitted"); };
    return (
        <form onSubmit={handleSignUp} autoComplete="on" className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                    <Lock className="w-6 h-6 text-[#00f0ff]" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">New Commission</h1>
                <p className="text-balance text-xs text-white/40 font-mono uppercase tracking-widest">Register new agent ID</p>
            </div>
            <div className="grid gap-4">
                <div className="grid gap-1"><Label htmlFor="name">Agent Call Sign</Label><Input id="name" name="name" type="text" placeholder="Designation X" required autoComplete="name" /></div>
                <div className="grid gap-2"><Label htmlFor="email">Comm Link</Label><Input id="email" name="email" type="email" placeholder="secure@veil.network" required autoComplete="email" /></div>
                <PasswordInput name="password" label="Security Key" required autoComplete="new-password" placeholder="Create key" />
                <Button type="submit" variant="default" className="mt-4">REQUEST CLEARANCE</Button>
            </div>
        </form>
    );
}

function AuthFormContainer({ isSignIn, onToggle, onSuccess }: { isSignIn: boolean; onToggle: () => void; onSuccess?: (token: string) => void }) {
    return (
        <div className="mx-auto grid w-[350px] gap-2 z-10 relative">
            {isSignIn ? <SignInForm onSuccess={onSuccess} /> : <SignUpForm />}
            <div className="text-center text-xs mt-6">
                <span className="text-white/40">{isSignIn ? "No clearance?" : "Active agent?"}{" "}</span>
                <Button variant="link" className="pl-1 h-auto p-0" onClick={onToggle}>
                    {isSignIn ? "Request Access" : "Input Credentials"}
                </Button>
            </div>

            <div className="relative text-center text-[10px] mt-6 after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-white/10">
                <span className="relative z-10 bg-[#000000] px-2 text-white/20 uppercase tracking-widest font-mono">Or authenticate via</span>
            </div>

            <Button variant="outline" type="button" className="mt-4" onClick={() => console.log("UI: SSO Clicked")}>
                <svg className="mr-2 h-4 w-4 opacity-50" viewBox="0 0 24 24"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.04-1.133 8.16-3.293 2.147-2.147 2.813-5.28 2.813-7.907 0-.773-.08-1.427-.2-1.88h-10.773z" /></svg>
                SSO PROXY
            </Button>
        </div>
    )
}

interface AuthContentProps {
    quote?: {
        text: string;
        author: string;
    }
}

interface AuthUIProps {
    onLoginSuccess?: (token: string) => void;
}

export function AuthUI({ onLoginSuccess }: AuthUIProps) {
    const [isSignIn, setIsSignIn] = useState(true);
    const toggleForm = () => setIsSignIn((prev) => !prev);

    const currentContent = {
        quote: {
            text: isSignIn ? "System Integrity Verified. Welcome back, Agent." : "The Veil protects those who serve. Join the network.",
            author: "VEIL Protocol v2.4"
        }
    };

    return (
        <div className="w-full min-h-screen md:grid md:grid-cols-2 bg-black text-white selection:bg-[#00f0ff] selection:text-black overflow-hidden font-sans">
            <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

            {/* LEFT PANEL: FORM */}
            <div className="flex h-screen items-center justify-center p-6 md:p-12 relative overflow-hidden z-20 bg-black">
                {/* Subtle grid background for the form side too */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

                <AuthFormContainer isSignIn={isSignIn} onToggle={toggleForm} onSuccess={onLoginSuccess} />
            </div>

            {/* RIGHT PANEL: IMMERSIVE BACKGROUND */}
            <div className="hidden md:block relative bg-[#030712] overflow-hidden border-l border-white/10">

                {/* THE VEIL SECURITY BACKGROUND */}
                <div className="absolute inset-0 opacity-50 brightness-75">
                    <SecurityBackground />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />

                {/* Quote / Typewriter */}
                <div className="relative z-10 flex h-full flex-col items-center justify-end p-12 pb-24">
                    <blockquote className="space-y-4 text-center max-w-lg">
                        <p className="text-xl md:text-2xl font-light tracking-tight text-white leading-relaxed">
                            “<Typewriter
                                key={currentContent.quote.text}
                                text={currentContent.quote.text}
                                speed={40}
                                cursor="_"
                                className="text-[#00f0ff] font-mono"
                            />”
                        </p>
                        <cite className="block text-xs font-mono uppercase tracking-[0.2em] text-white/30 not-italic">
                            — {currentContent.quote.author}
                        </cite>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}
