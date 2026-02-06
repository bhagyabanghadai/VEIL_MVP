import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, Shield } from 'lucide-react';

interface ProfileDropdownProps {
    onLogout: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-300 ${isOpen
                        ? 'bg-[#00f0ff]/10 border-[#00f0ff]/50 text-white'
                        : 'bg-transparent border-transparent text-white/70 hover:text-white hover:bg-white/5'
                    }`}
            >
                <div className="w-8 h-8 rounded bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 relative overflow-hidden">
                    <User size={16} className="relative z-10" />
                    {/* Scanner effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00f0ff]/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div className="hidden md:flex flex-col items-start gap-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#00f0ff]">Operative</span>
                    <div className="h-0.5 w-12 bg-white/20 rounded-full" />
                </div>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-[#00f0ff]/20 flex items-center justify-center border border-[#00f0ff]/50">
                                    <Shield size={14} className="text-[#00f0ff]" />
                                </div>
                                <div>
                                    <div className="text-white text-sm font-bold">Commander</div>
                                    <div className="text-white/40 text-[10px] font-mono tracking-wider">LEVEL 5 CLEARANCE</div>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 space-y-1">
                            <Link
                                to="/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors group"
                            >
                                <Settings size={16} className="group-hover:text-[#00f0ff] transition-colors" />
                                <span>System Configuration</span>
                            </Link>

                            <div className="h-px bg-white/10 mx-2 my-1" />

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onLogout();
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors group text-left"
                            >
                                <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                                <span>Terminate Session</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
