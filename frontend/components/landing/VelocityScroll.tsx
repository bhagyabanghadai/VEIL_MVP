import { useRef, useState, MouseEvent } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";

interface ParallaxProps {
    children: string;
    baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
            <motion.div className="flex whitespace-nowrap gap-10" style={{ x }}>
                {/* Repeating text for sleek loop */}
                {[...Array(4)].map((_, i) => (
                    <motion.span
                        key={i}
                        onHoverStart={() => setHoveredIndex(i)}
                        onHoverEnd={() => setHoveredIndex(null)}
                        className="block text-[8rem] md:text-[12rem] font-bold uppercase tracking-tighter cursor-pointer"
                        style={{
                            WebkitTextStroke: hoveredIndex === i ? '0px' : '1px rgba(255,255,255,0.2)',
                            color: hoveredIndex === i ? 'white' : 'transparent',
                        }}
                        animate={{
                            scale: hoveredIndex === i ? 1.05 : 1,
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeOut"
                        }}
                    >
                        {children}{" "}
                    </motion.span>
                ))}
            </motion.div>
        </div>
    );
}

export const VelocityScroll = () => {
    return (
        <section className="py-24 bg-[#0D0D0D] border-y border-white/5 overflow-hidden z-20 relative">
            <ParallaxText baseVelocity={-3}>AUTONOMOUS SECURITY LAYER </ParallaxText>
            <ParallaxText baseVelocity={3}>IMMUTABLE AUDIT LOGS </ParallaxText>
        </section>
    );
};
