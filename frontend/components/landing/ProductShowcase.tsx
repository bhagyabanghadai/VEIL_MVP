import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import React, { useRef } from 'react';

const LAYERS = [
    {
        name: "IDENTITY",
        sub: "LAYER",
        layerNum: "01",
        description: "Cryptographic agent verification and trust profiling",
        features: ["Agent passports", "Trust profiling", "Misuse scoring", "Identity verification"],
        accent: "#ffffff"
    },
    {
        name: "FIREWALL",
        sub: "LAYER",
        layerNum: "02",
        description: "Real-time policy enforcement with deep reasoning",
        features: ["Policy enforcement", "Real-time blocking", "Deep reasoning AI", "Threat detection"],
        accent: "#FFD700"
    },
    {
        name: "AUDIT",
        sub: "LAYER",
        layerNum: "03",
        description: "Immutable cryptographic ledger for compliance",
        features: ["Immutable ledger", "Action logging", "Compliance reports", "Forensic analysis"],
        accent: "#e30613"
    },
    {
        name: "INTELLIGENCE",
        sub: "LAYER",
        layerNum: "04",
        description: "Gemini-powered threat intelligence and pattern recognition",
        features: ["Gemini 2.5 Flash", "Deep reasoning", "Threat intelligence", "Pattern recognition"],
        accent: "#0066FF"
    }
];

export const ProductShowcase = () => {
    return (
        <section className="relative bg-[#0a0a0a]/90 py-32 backdrop-blur-sm">
            {/* Section Header */}
            <div className="max-w-screen-xl mx-auto px-8 mb-24">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-px bg-white/20" />
                    <span className="text-xs font-mono text-white/40 tracking-[0.3em] uppercase">System Architecture</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6">
                    SECURITY<br />ARCHITECTURE
                </h2>
                <p className="text-white/40 text-lg max-w-xl">
                    Four integrated layers working in harmony to provide comprehensive protection.
                </p>
            </div>

            {/* Layers */}
            <div className="space-y-0">
                {LAYERS.map((layer, index) => (
                    <LayerSection key={layer.layerNum} layer={layer} index={index} />
                ))}
            </div>
        </section>
    );
};

interface LayerSectionProps {
    layer: typeof LAYERS[0];
    index: number;
}

const LayerSection: React.FC<LayerSectionProps> = ({ layer, index }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 0.9", "start 0.3"]
    });

    // Smooth spring animations
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    // MASKED REVEAL - Content slides up from hidden
    const contentY = useTransform(smoothProgress, [0, 1], [80, 0]);
    const contentOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.5, 1]);

    // Title lines - STAGGERED MASK
    const line1Y = useTransform(smoothProgress, [0, 0.6], ["100%", "0%"]);
    const line2Y = useTransform(smoothProgress, [0.1, 0.7], ["100%", "0%"]);

    // Number - SLOW parallax
    const numberY = useTransform(smoothProgress, [0, 1], [50, -20]);
    const numberScale = useTransform(smoothProgress, [0, 1], [0.9, 1]);

    // Line drawing effect
    const lineHeight = useTransform(smoothProgress, [0, 0.8], ["0%", "100%"]);

    // Features stagger
    const f1 = useTransform(smoothProgress, [0.3, 0.6], [0, 1]);
    const f2 = useTransform(smoothProgress, [0.4, 0.7], [0, 1]);
    const f3 = useTransform(smoothProgress, [0.5, 0.8], [0, 1]);
    const f4 = useTransform(smoothProgress, [0.6, 0.9], [0, 1]);
    const featureOpacities = [f1, f2, f3, f4];

    return (
        <motion.div
            ref={sectionRef}
            className="relative min-h-[80vh] flex items-center border-t border-white/5"
            style={{ opacity: contentOpacity }}
        >
            <div className="max-w-screen-xl mx-auto px-8 w-full">
                <div className="grid grid-cols-12 gap-8 items-start">

                    {/* Left - Large Number with PARALLAX */}
                    <div className="col-span-12 lg:col-span-4 relative">
                        <motion.div style={{ y: numberY, scale: numberScale }}>
                            {/* Line drawing effect */}
                            <motion.div
                                className="absolute -left-4 top-0 w-1"
                                style={{
                                    height: lineHeight,
                                    backgroundColor: layer.accent
                                }}
                            />

                            {/* Large number */}
                            <span
                                className="text-[10rem] md:text-[15rem] font-black leading-none block"
                                style={{ color: `${layer.accent}15` }}
                            >
                                {layer.layerNum}
                            </span>
                        </motion.div>
                    </div>

                    {/* Right - Content with MASKED REVEAL */}
                    <motion.div
                        className="col-span-12 lg:col-span-8 lg:-mt-20"
                        style={{ y: contentY }}
                    >
                        {/* Title - MASKED REVEAL (text slides up from hidden) */}
                        <div className="mb-8">
                            <div className="overflow-hidden">
                                <motion.h3
                                    className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter"
                                    style={{ y: line1Y }}
                                >
                                    {layer.name}
                                </motion.h3>
                            </div>
                            <div className="overflow-hidden mt-2">
                                <motion.span
                                    className="text-2xl md:text-3xl font-light uppercase tracking-[0.5em] block"
                                    style={{ y: line2Y, color: layer.accent }}
                                >
                                    {layer.sub}
                                </motion.span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed">
                            {layer.description}
                        </p>

                        {/* Features with STAGGERED fade */}
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-10">
                            {layer.features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-4"
                                    style={{ opacity: featureOpacities[i] }}
                                >
                                    <motion.div
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: layer.accent }}
                                        animate={{
                                            boxShadow: [
                                                `0 0 0 0 ${layer.accent}00`,
                                                `0 0 15px 2px ${layer.accent}50`,
                                                `0 0 0 0 ${layer.accent}00`
                                            ]
                                        }}
                                        transition={{
                                            duration: 2.5,
                                            repeat: Infinity,
                                            delay: i * 0.4
                                        }}
                                    />
                                    <span className="text-white/70 text-sm uppercase tracking-wider">
                                        {feature}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                            <motion.div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: layer.accent }}
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.6, 1, 0.6]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <span className="text-xs font-mono text-white/40 tracking-[0.2em] uppercase">
                                Operational
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                            <span className="text-xs font-mono text-white/20">
                                Layer {layer.layerNum}/04
                            </span>
                        </div>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    );
};
