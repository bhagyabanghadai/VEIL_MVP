import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Grid pattern overlay
const GridPattern = () => (
    <div className="absolute inset-0 opacity-[0.06]">
        <div
            className="absolute inset-0"
            style={{
                backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
            }}
        />
    </div>
);

// Floating node
const DataNode = ({ delay, size, x, y }: { delay: number, size: number, x: string, y: string }) => (
    <motion.div
        className="absolute rounded-full bg-white/30"
        style={{ width: size, height: size, left: x, top: y }}
        animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
            duration: 5 + delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
        }}
    />
);

// Scan line
const ScanLine = ({ yPosition, duration, delay }: { yPosition: string, duration: number, delay: number }) => (
    <motion.div
        className="absolute left-0 w-full h-[2px]"
        style={{ top: yPosition }}
        animate={{
            x: ['-100%', '200%'],
            opacity: [0, 0.5, 0]
        }}
        transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: delay
        }}
    >
        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
    </motion.div>
);

// Glowing orb
const GlowingOrb = ({ color, size, x, y, delay }: { color: string, size: number, x: string, y: string, delay: number }) => (
    <motion.div
        className="absolute rounded-full"
        style={{
            width: size,
            height: size,
            left: x,
            top: y,
            background: `radial-gradient(circle, ${color}20 0%, ${color}08 40%, transparent 70%)`,
            filter: 'blur(60px)'
        }}
        animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
            duration: 8 + delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
        }}
    />
);

// Data stream
const DataStream = ({ x, delay }: { x: string, delay: number }) => (
    <motion.div
        className="absolute w-[1px] h-24"
        style={{ left: x }}
        animate={{
            top: ['-96px', 'calc(100% + 96px)'],
            opacity: [0, 0.5, 0]
        }}
        transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
            delay
        }}
    >
        <div className="h-full w-full bg-gradient-to-b from-transparent via-white/50 to-transparent" />
    </motion.div>
);

// Hexagon
const HexPattern = ({ x, y, size, delay }: { x: string, y: string, size: number, delay: number }) => (
    <motion.div
        className="absolute"
        style={{ left: x, top: y }}
        animate={{
            opacity: [0.05, 0.2, 0.05],
            rotate: [0, 20, 0]
        }}
        transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay
        }}
    >
        <svg width={size} height={size} viewBox="0 0 100 100">
            <polygon
                points="50,3 95,25 95,75 50,97 5,75 5,25"
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
            />
        </svg>
    </motion.div>
);

// Corner brackets
const CornerBracket = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const positionClasses = {
        tl: 'top-6 left-6',
        tr: 'top-6 right-6 rotate-90',
        bl: 'bottom-6 left-6 -rotate-90',
        br: 'bottom-6 right-6 rotate-180'
    };

    return (
        <motion.div
            className={`fixed ${positionClasses[position]} w-12 h-12 z-50`}
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 4, repeat: Infinity }}
        >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/50 to-transparent" />
            <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
    );
};

export const SecurityBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <>
            {/* Base layer - behind everything */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                <div className="absolute inset-0 bg-[#0a0a0a]" />
                <GridPattern />

                <motion.div style={{ y: y1 }} className="absolute inset-0">
                    <GlowingOrb color="#e30613" size={700} x="-5%" y="15%" delay={0} />
                    <GlowingOrb color="#0066FF" size={500} x="65%" y="55%" delay={3} />
                    <GlowingOrb color="#FFD700" size={400} x="75%" y="5%" delay={6} />
                </motion.div>

                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 100%)'
                }} />
            </div>

            {/* Overlay layer - above content */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
                <CornerBracket position="tl" />
                <CornerBracket position="tr" />
                <CornerBracket position="bl" />
                <CornerBracket position="br" />

                <motion.div style={{ y: y2 }} className="absolute inset-0">
                    <DataNode delay={0} size={5} x="12%" y="22%" />
                    <DataNode delay={1} size={4} x="88%" y="32%" />
                    <DataNode delay={2} size={6} x="42%" y="68%" />
                    <DataNode delay={3} size={4} x="72%" y="18%" />
                    <DataNode delay={4} size={5} x="52%" y="42%" />
                </motion.div>

                <ScanLine yPosition="22%" duration={7} delay={0} />
                <ScanLine yPosition="52%" duration={9} delay={2.5} />
                <ScanLine yPosition="82%" duration={6} delay={5} />

                <DataStream x="10%" delay={0} />
                <DataStream x="35%" delay={1.5} />
                <DataStream x="65%" delay={3} />
                <DataStream x="90%" delay={4.5} />

                <HexPattern x="5%" y="25%" size={80} delay={0} />
                <HexPattern x="90%" y="18%" size={65} delay={4} />
                <HexPattern x="85%" y="68%" size={75} delay={8} />
            </div>
        </>
    );
};
