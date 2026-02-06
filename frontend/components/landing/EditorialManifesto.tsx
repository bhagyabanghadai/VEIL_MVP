import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, MouseEvent } from 'react';

export const EditorialManifesto = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax logic for the text layers
    const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [200, -200]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    const WORDS = [
        { text: "SHARP", color: "text-white" },
        { text: "POWERFUL", color: "text-veil-mondrian-red" },
        { text: "LIGHT", color: "text-white" },
        { text: "FAST", color: "text-veil-mondrian-blue" }
    ];

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="min-h-[100vh] relative flex items-center justify-center bg-veil-bg py-24 overflow-hidden"
        >

            {/* Background Structural Lines (Mondrian Grid) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white/10" />
                <div className="absolute right-1/4 top-0 bottom-0 w-px bg-white/10" />
                <motion.div style={{ scaleY: scrollYProgress }} className="absolute left-1/4 top-0 w-px h-full bg-veil-mondrian-yellow origin-top" />
            </div>

            <div className="max-w-screen-2xl mx-auto px-6 relative z-10 flex flex-col gap-0 md:gap-8">
                {WORDS.map((word, i) => (
                    <motion.div
                        key={i}
                        style={{ y: i % 2 === 0 ? y1 : y2, opacity }}
                        className="overflow-hidden will-change-transform"
                    >
                        <MagneticWord
                            text={word.text}
                            color={word.color}
                            mouseX={mousePosition.x}
                            mouseY={mousePosition.y}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Narrative text floating */}
            <motion.div
                style={{ opacity: useTransform(scrollYProgress, [0.3, 0.5], [0, 1]) }}
                className="absolute bottom-24 right-12 md:right-32 max-w-md text-right"
            >
                <p className="text-xl md:text-2xl font-bold text-white mb-4">
                    The ultimate protection architecture.
                </p>
                <p className="text-white/60 font-mono text-sm leading-relaxed">
                    Designed to win the war on entropy. VEIL answers its calling on the very first packet.
                    Sharp enough to cut through noise. Powerful enough to stop threats.
                </p>

                <div className="mt-8 flex justify-end gap-2">
                    <div className="w-12 h-1 bg-veil-mondrian-red" />
                    <div className="w-4 h-1 bg-veil-mondrian-yellow" />
                    <div className="w-8 h-1 bg-veil-mondrian-blue" />
                </div>
            </motion.div>

        </section>
    );
};

const MagneticWord = ({ text, color, mouseX, mouseY }: { text: string, color: string, mouseX: number, mouseY: number }) => {
    const letters = text.split('');

    return (
        <h2 className={`text-[12vw] md:text-[14vw] font-black leading-[0.85] tracking-[-0.05em] uppercase ${color} flex`}>
            {letters.map((letter, i) => {
                // Calculate magnetic pull based on letter position
                const letterProgress = i / letters.length;
                const distanceX = (mouseX - letterProgress) * 20;
                const distanceY = (mouseY - 0.5) * 10;

                return (
                    <motion.span
                        key={i}
                        animate={{
                            x: distanceX,
                            y: distanceY,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 150,
                            damping: 15,
                            mass: 0.1
                        }}
                        className="inline-block"
                    >
                        {letter}
                    </motion.span>
                );
            })}
        </h2>
    );
};
