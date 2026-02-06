import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { SplineScene } from '@/components/ui/spline';
import { ArrowDown } from 'lucide-react';

const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export const StickyHero = ({ onStart }: { onStart: () => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // SMOOTH PHYSICS (Mass/Spring) for that "Luxury" feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Cinematic Transforms
    // The scene should "recede" into the darkness as we scroll
    const sceneScale = useTransform(smoothProgress, [0, 1], [1.2, 0.9]);
    const sceneOpacity = useTransform(smoothProgress, [0.6, 1], [1, 0]); // Fades out ONLY at the very end
    const sceneBlur = useTransform(smoothProgress, [0.6, 1], ["0px", "10px"]);

    // Text explodes outwards and fades OUT
    const textScale = useTransform(smoothProgress, [0, 0.4], [1, 3]); // Dramatic zoom
    const textOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]); // Quick fade

    // Technical overlays fade IN
    const overlayOpacity = useTransform(smoothProgress, [0.1, 0.3], [0, 1]);

    return (
        <div ref={containerRef} className="h-screen relative z-10">
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0D0D0D] perspective-1000">

                {/* 1. 3D Scene Container */}
                <motion.div
                    style={{
                        scale: sceneScale,
                        opacity: sceneOpacity,
                        filter: sceneBlur
                    }}
                    className="absolute inset-0 z-0 flex items-center justify-center will-change-transform"
                >
                    <div className="w-full h-full scale-[1]">
                        <SplineScene scene={SPLINE_SCENE_URL} className="w-full h-full" />
                    </div>
                </motion.div>

                {/* 2. Kinetic Typography Layer */}
                <motion.div
                    style={{ scale: textScale, opacity: textOpacity }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none origin-center"
                >
                    <h1 className="text-[16vw] font-black tracking-[-0.05em] text-white leading-none mix-blend-exclusion">
                        VEIL
                    </h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="h-0.5 w-12 bg-veil-mondrian-red" />
                        <span className="text-sm font-bold text-white tracking-[0.3em] uppercase">
                            Verified Ethereal Identity Ledger
                        </span>
                        <div className="h-0.5 w-12 bg-veil-mondrian-blue" />
                    </div>
                </motion.div>

                {/* 3. "HUD" Overlay - Only visible when scrolling starts */}
                <motion.div
                    style={{ opacity: overlayOpacity }}
                    className="absolute inset-0 z-30 pointer-events-none"
                >
                    <div className="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-8">
                        <div className="flex flex-col gap-2 border-l-2 border-veil-mondrian-yellow pl-4">
                            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Velocity</span>
                            <span className="text-xl font-bold text-white font-mono">3400 T/s</span>
                        </div>
                        <div className="flex flex-col gap-2 border-l-2 border-veil-mondrian-blue pl-4">
                            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Security</span>
                            <span className="text-xl font-bold text-white font-mono">GRADE A</span>
                        </div>
                    </div>
                </motion.div>

                {/* 4. Scroll Call to Action */}
                <motion.div
                    style={{ opacity: useTransform(smoothProgress, [0, 0.1], [1, 0]) }}
                    className="absolute bottom-12 w-full flex justify-center z-40"
                >
                    <div className="flex flex-col items-center gap-2 animate-bounce-slow">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-veil-mondrian-red font-bold">Initialize</span>
                        <div className="w-px h-12 bg-gradient-to-b from-veil-mondrian-red to-transparent" />
                    </div>
                </motion.div>

            </div>
        </div>
    );
};
