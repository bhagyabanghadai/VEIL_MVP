'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Fingerprint, Globe } from 'lucide-react';
import { SecurityBackground } from '@/components/landing/SecurityBackground';

interface LoginFormProps {
    onSubmit: (email: string, password: string, remember: boolean) => void;
    onBack?: () => void;
}

interface FormInputProps {
    icon: React.ReactNode;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

interface SocialButtonProps {
    icon: React.ReactNode;
    name: string;
}

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
    id: string;
}

// FormInput Component
const FormInput: React.FC<FormInputProps> = ({ icon, type, placeholder, value, onChange, required }) => {
    return (
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#00f0ff] transition-colors">
                {icon}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00f0ff]/50 focus:bg-[#00f0ff]/5 transition-all font-mono text-sm"
            />
        </div>
    );
};

// SocialButton Component
const SocialButton: React.FC<SocialButtonProps> = ({ icon }) => {
    return (
        <button className="flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] hover:border-[#00f0ff]/30 transition-all">
            {icon}
        </button>
    );
};

// ToggleSwitch Component
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, id }) => {
    return (
        <div className="relative inline-block w-10 h-5 cursor-pointer">
            <input
                type="checkbox"
                id={id}
                className="sr-only"
                checked={checked}
                onChange={onChange}
            />
            <div className={`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-[#00f0ff]/20 border border-[#00f0ff]/50' : 'bg-white/10 border border-white/10'}`}>
                <div className={`absolute left-0.5 top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 ease-in-out ${checked ? 'transform translate-x-5 bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]' : 'opacity-50'}`} />
            </div>
        </div>
    );
};

// Main LoginForm Component
export const VeilGamingLogin: React.FC<LoginFormProps> = ({ onSubmit, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSuccess(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        onSubmit(email, password, remember);
        setIsSubmitting(false);
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-[#030712]">

            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <SecurityBackground />
                <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-[2px]" />
            </div>

            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 z-50 text-xs font-mono text-white/40 hover:text-[#00f0ff] uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                    <span className="text-lg">←</span> Abort Sequence
                </button>
            )}

            {/* Login Card */}
            <div className="relative z-20 w-full max-w-md p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">

                {/* Header */}
                <div className="mb-8 text-center relative">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00f0ff]/5 border border-[#00f0ff]/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                        <ShieldCheck className="w-8 h-8 text-[#00f0ff]" />
                    </div>

                    <h2 className="text-3xl font-bold mb-2 relative inline-block">
                        <span className="text-white tracking-tight font-display">VEIL PROTOCOL</span>
                    </h2>

                    <p className="text-white/40 flex flex-col items-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-[0.2em]">Secure Uplink v2.4</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FormInput
                        icon={<Mail size={18} />}
                        type="email"
                        placeholder="Agent Identity"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="relative">
                        <FormInput
                            icon={<Lock size={18} />}
                            type={showPassword ? "text" : "password"}
                            placeholder="Security Key"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#00f0ff] focus:outline-none transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                            <ToggleSwitch
                                checked={remember}
                                onChange={() => setRemember(!remember)}
                                id="remember-me"
                            />
                            <label
                                htmlFor="remember-me"
                                className="text-xs font-mono uppercase tracking-wider text-white/60 cursor-pointer hover:text-white transition-colors"
                            >
                                Persist Session
                            </label>
                        </div>
                        <a href="#" className="text-xs font-mono uppercase tracking-wider text-[#00f0ff]/60 hover:text-[#00f0ff] transition-colors">
                            Lost Key?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest text-xs transition-all duration-300 ease-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none
                            ${isSuccess
                                ? 'bg-green-500 text-black shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                                : 'bg-[#00f0ff] text-black hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                            }`}
                    >
                        {isSubmitting ? 'Verifying Credentials...' : isSuccess ? 'Access Granted' : 'Initialize Uplink'}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative flex items-center justify-center mb-6">
                        <div className="border-t border-white/10 absolute w-full"></div>
                        <div className="bg-black/50 backdrop-blur-md px-4 relative text-white/30 text-[10px] font-mono uppercase tracking-widest">
                            Simulate Connection Via
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <SocialButton icon={<Globe size={18} />} name="Global" />
                        <SocialButton icon={<Fingerprint size={18} />} name="Bio" />
                        <SocialButton icon={<ShieldCheck size={18} />} name="Proxy" />
                    </div>
                </div>

                <p className="mt-8 text-center text-[10px] text-white/20 font-mono uppercase tracking-widest">
                    Unauthorized access is a Class A Felony.<br />
                    <span className="text-[#00f0ff]/40">VEIL SYSTEMS INC.</span>
                </p>
            </div>

            <footer className="absolute bottom-4 left-0 right-0 text-center text-white/10 text-[10px] font-mono z-20 pointer-events-none">
                SYSTEM ID: 8992-X-ALPHA // CONNECTED
            </footer>
        </div>
    );
};
