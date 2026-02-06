import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const SPECS = [
    { label: "THREAT DETECTION", value: "99.9%", unit: "ACCURACY", color: "text-veil-mondrian-red", numericValue: 99.9 },
    { label: "RESPONSE TIME", value: "<50ms", unit: "LATENCY", color: "text-veil-mondrian-yellow", numericValue: 50 },
    { label: "AGENTS PROTECTED", value: "10K+", unit: "ACTIVE", color: "text-veil-mondrian-blue", numericValue: null },
    { label: "UPTIME", value: "99.99%", unit: "SLA", color: "text-white", numericValue: 99.99 }
];

// Animated number counter hook
const useCountAnimation = (end: number, duration: number = 1500) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (!hasAnimated) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, hasAnimated]);

    return { count, startAnimation: () => setHasAnimated(true) };
};

export const TechSpecGrid = () => {
    return (
        <section className="bg-veil-bg py-24 border-t border-white/5 relative z-10">
            <div className="max-w-screen-xl mx-auto px-6">

                <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-8">
                    <h3 className="text-4xl font-bold tracking-tighter text-white">SECURITY METRICS</h3>
                    <div className="font-mono text-sm text-white/50 tracking-widest uppercase">VEIL Platform / Live Stats</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
                    {SPECS.map((spec, i) => (
                        <AnimatedSpecCard spec={spec} index={i} />
                    ))}
                </div>

                <div className="mt-8 flex justify-between text-[10px] font-mono text-white/30 tracking-widest uppercase">
                    <span>Security Operations</span>
                    <span>Real-Time Monitoring</span>
                </div>
            </div>
        </section>
    );
};

const AnimatedSpecCard = ({ spec, index }: { spec: typeof SPECS[0], index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { count, startAnimation } = useCountAnimation(spec.numericValue || 0, 1500);

    useEffect(() => {
        if (isInView) {
            startAnimation();
        }
    }, [isInView, startAnimation]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, rotateY: -15 }}
            animate={isInView ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: -15 }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
            className="bg-veil-bg p-8 flex flex-col justify-between group h-64 hover:bg-white/5 transition-colors duration-500 relative overflow-hidden"
        >
            {/* Scanline effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-full animate-scan" />
            </div>

            <div className="flex justify-between items-start relative z-10">
                <span className="font-mono text-xs text-white/40 tracking-wider text-[10px] border border-white/10 px-1.5 py-0.5 rounded-sm">
                    DAT.0{index + 1}
                </span>
                {/* Pulsing status dot */}
                <motion.div
                    className={`w-2 h-2 rounded-full ${spec.color.replace('text-', 'bg-')}`}
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 2 + index * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="flex flex-col gap-1 relative z-10">
                <span className={`text-6xl font-bold tracking-tighter ${spec.color}`}>
                    {spec.numericValue !== null ? (
                        <>
                            {spec.numericValue < 0 ? '-' : ''}{Math.abs(count)}{spec.value.includes('%') ? '%' : spec.value.replace(/[0-9-]/g, '')}
                        </>
                    ) : spec.value}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-widest uppercase">{spec.label}</span>
                    <span className="text-xs font-mono text-white/40 uppercase">{spec.unit}</span>
                </div>
            </div>
        </motion.div>
    );
};
