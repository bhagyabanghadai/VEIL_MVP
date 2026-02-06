
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VaporizeTextCycle from './ui/vapour-text-effect';

interface InteractiveLogoProps {
    interactive?: boolean;
}

const InteractiveLogo: React.FC<InteractiveLogoProps> = ({ interactive = true }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const playSound = () => {
        const chime = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
        chime.volume = 0.15;
        chime.play().catch(() => { });
    };

    const handleInteraction = () => {
        if (!interactive) return;
        if (!isExpanded) playSound();
        setIsExpanded(!isExpanded);
    };

    return (
        <div
            className={`flex items-center gap-6 group ${interactive ? 'cursor-pointer' : ''}`}
            onMouseEnter={() => { if (interactive) { if (!isExpanded) playSound(); setIsExpanded(true); } }}
            onMouseLeave={() => { if (interactive) setIsExpanded(false); }}
            onClick={handleInteraction}
        >
            {/* Professional Minimalist "Ascension V" Logo */}
            <div className="relative w-12 h-12 flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                    {/* The Parallel Tech Lines - Left Wing */}
                    <path d="M4 10 L24 44" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
                    <path d="M10 14 L24 38" stroke="white" strokeWidth="1.5" strokeLinecap="square" opacity="0.6" />
                    <path d="M16 18 L24 32" stroke="white" strokeWidth="1.5" strokeLinecap="square" opacity="0.4" />

                    {/* The Parallel Tech Lines - Right Wing */}
                    <path d="M44 10 L24 44" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
                    <path d="M38 14 L24 38" stroke="white" strokeWidth="1.5" strokeLinecap="square" opacity="0.6" />
                    <path d="M32 18 L24 32" stroke="white" strokeWidth="1.5" strokeLinecap="square" opacity="0.4" />

                    {/* The Core Diamond - Verified Identity */}
                    <motion.rect
                        x="22" y="8" width="4" height="4"
                        fill="#34d399"
                        transform="rotate(45 24 10)"
                        className="drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Connecting Horizon Line (Subtle) */}
                    <motion.path
                        d="M24 44 L24 14"
                        stroke="#34d399"
                        strokeWidth="1"
                        strokeDasharray="2 4"
                        opacity="0.3"
                    />
                </svg>
            </div>

            <div className="flex flex-col relative h-16 justify-center ml-5">
                {/* Brand Name Container - Wide enough for "VERIFIED" at large sizes */}
                <div className="relative h-full flex items-center justify-start w-[350px]">
                    <VaporizeTextCycle
                        texts={["VEIL", "VERIFIED", "ETHEREAL", "IDENTITY", "LEDGER"]}
                        font={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "42px",
                            fontWeight: 800
                        }}
                        color="rgb(255, 255, 255)"
                        animation={{
                            vaporizeDuration: 1.5,
                            fadeInDuration: 0.5,
                            waitDuration: 2.0
                        }}
                        alignment="left"
                    />
                </div>
            </div>
        </div>
    );
};

export default InteractiveLogo;

