import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

// TYPOGRAPHY - Massive impactful text
const FONT_MANIFESTO = "font-black tracking-[-0.04em] uppercase leading-[0.85]";

// Static decorative elements (no animation = better performance)
const StaticGrid = () => (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        {/* Corner accents only - removes animated lines */}
        <div className="absolute top-6 left-6 w-20 h-20 border-l border-t border-white/30" />
        <div className="absolute top-6 right-6 w-20 h-20 border-r border-t border-white/30" />
        <div className="absolute bottom-6 left-6 w-20 h-20 border-l border-b border-white/30" />
        <div className="absolute bottom-6 right-6 w-20 h-20 border-r border-b border-white/30" />

        {/* Static center crosshair */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
    </div>
);

// Word component with scroll-linked highlighting (optimized)
const ScrollWord = React.memo(({
    children,
    scrollProgress,
    range,
    className = ""
}: {
    children: React.ReactNode;
    scrollProgress: any;
    range: [number, number];
    className?: string;
}) => {
    const opacity = useTransform(scrollProgress, range, [0.15, 1]);

    return (
        <motion.span
            style={{ opacity }}
            className={cn("inline-block will-change-opacity", className)}
        >
            {children}
        </motion.span>
    );
});

ScrollWord.displayName = 'ScrollWord';

export const HybridBladeSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.7", "end 0.3"]
    });

    // Memoized words array to prevent recreation
    const words = useMemo(() => [
        { text: "WE", range: [0, 0.15] as [number, number], style: "" },
        { text: "DO", range: [0.05, 0.18] as [number, number], style: "" },
        { text: "NOT", range: [0.10, 0.22] as [number, number], style: "" },
        { text: "TRUST.", range: [0.15, 0.30] as [number, number], style: "text-white/50" },
        { text: "WE", range: [0.25, 0.40] as [number, number], style: "" },
        { text: "VERIFY.", range: [0.32, 0.50] as [number, number], style: "text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]" },
        { text: "EVERY", range: [0.42, 0.58] as [number, number], style: "" },
        { text: "AGENT.", range: [0.50, 0.65] as [number, number], style: "text-[#0066FF] drop-shadow-[0_0_20px_rgba(0,102,255,0.5)]" },
        { text: "EVERY", range: [0.58, 0.73] as [number, number], style: "" },
        { text: "PACKET.", range: [0.65, 0.80] as [number, number], style: "text-[#e30613] drop-shadow-[0_0_20px_rgba(227,6,19,0.5)]" },
        { text: "EVERY", range: [0.72, 0.87] as [number, number], style: "" },
        { text: "TIME.", range: [0.80, 1.0] as [number, number], style: "drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" },
    ], []);

    const lines = useMemo(() => [
        [0, 1, 2, 3],
        [4, 5],
        [6, 7],
        [8, 9],
        [10, 11],
    ], []);

    return (
        <section
            ref={containerRef}
            className="relative bg-[#030712] -mt-1"
        >
            {/* Simple gradient backgrounds (GPU accelerated) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.06)_0%,transparent_60%)]" />
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat pointer-events-none" />

            <StaticGrid />

            <div className="min-h-[80vh] flex items-center justify-center py-20 md:py-28">
                <div className="text-center z-10 px-4 max-w-[95vw]">
                    {lines.map((lineIndices, lineIdx) => (
                        <div
                            key={lineIdx}
                            className={cn(
                                "text-[11vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] text-white",
                                FONT_MANIFESTO
                            )}
                        >
                            {lineIndices.map((wordIdx, i) => (
                                <React.Fragment key={wordIdx}>
                                    <ScrollWord
                                        scrollProgress={scrollYProgress}
                                        range={words[wordIdx].range}
                                        className={words[wordIdx].style}
                                    >
                                        {words[wordIdx].text}
                                    </ScrollWord>
                                    {i < lineIndices.length - 1 && " "}
                                </React.Fragment>
                            ))}
                        </div>
                    ))}

                    {/* Static tagline (no animation) */}
                    <p className="mt-10 text-xs sm:text-sm font-mono tracking-[0.2em] text-white/30 uppercase">
                        Zero Trust Security for Autonomous Agents
                    </p>
                </div>
            </div>
        </section>
    );
};
