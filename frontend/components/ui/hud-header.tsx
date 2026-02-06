import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import InteractiveLogo from "@/components/InteractiveLogo";

export const HUDHeader = ({ onStart }: { onStart: () => void }) => {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5"
        >
            <div className="flex items-center gap-2 scale-50 origin-left -ml-2">
                <InteractiveLogo />
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-veil-text-secondary">
                <Link to="/platform" className="hover:text-white transition-colors">Platform</Link>
                <Link to="/docs" className="hover:text-white transition-colors">Developers</Link>
                <Link to="/protocol" className="hover:text-white transition-colors">Security</Link>
                <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
            </nav>

            <button
                onClick={onStart}
                className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all hover:border-veil-accent/30 hover:text-veil-accent"
            >
                Initialize
            </button>
        </motion.header>
    );
};
