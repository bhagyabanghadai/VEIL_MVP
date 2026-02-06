import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface SectionTransitionProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

/**
 * SectionTransition - Smooth scroll-triggered fade-in and slide-up animation
 * 
 * What's happening:
 * 1. Uses Framer Motion's `useInView` to detect when section enters viewport
 * 2. Triggers animation when section is 20% visible (threshold: 0.2)
 * 3. Animates from: opacity 0, translateY 50px
 * 4. Animates to: opacity 1, translateY 0
 * 5. Duration: 0.8s with smooth easing
 */
export const SectionTransition = ({ children, delay = 0, className = '' }: SectionTransitionProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, {
        once: true,  // Animation triggers only once
        margin: "-100px 0px -100px 0px"  // Trigger when section is 100px into viewport
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.25, 0.1, 0.25, 1.0]  // Custom cubic-bezier for smooth motion
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
