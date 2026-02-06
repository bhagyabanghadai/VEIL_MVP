import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const ParallaxConnector = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Particle positions and velocities
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 2,
        shape: Math.random() > 0.5 ? 'circle' : 'triangle'
    }));

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="h-[80vh] -mt-[50vh] bg-transparent relative z-40 flex flex-col items-center justify-center overflow-hidden pointer-events-none">

            {/* Connecting Line */}
            <motion.div
                style={{ scaleY: scrollYProgress, opacity }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-veil-mondrian-red via-veil-mondrian-yellow to-veil-mondrian-blue origin-top"
            />

            {/* Floating Particles */}
            <motion.div style={{ opacity }} className="absolute inset-0">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            x: [0, Math.random() * 50 - 25, 0],
                            opacity: [0.2, 0.6, 0.2],
                            rotate: particle.shape === 'triangle' ? [0, 360] : 0
                        }}
                        transition={{
                            duration: particle.duration,
                            delay: particle.delay,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {particle.shape === 'circle' ? (
                            <div
                                className="rounded-full bg-white/30 backdrop-blur-sm"
                                style={{
                                    width: particle.size,
                                    height: particle.size
                                }}
                            />
                        ) : (
                            <div
                                className="bg-veil-mondrian-blue/30"
                                style={{
                                    width: 0,
                                    height: 0,
                                    borderLeft: `${particle.size}px solid transparent`,
                                    borderRight: `${particle.size}px solid transparent`,
                                    borderBottom: `${particle.size * 1.5}px solid currentColor`
                                }}
                            />
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {/* Center Glow */}
            <motion.div
                style={{ opacity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-veil-mondrian-yellow/10 rounded-full blur-3xl"
            />
        </section>
    );
};
