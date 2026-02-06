"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface AnimatedTextProps {
    text?: string;
    className?: string;
    as?: React.ElementType; // Allow rendering as h1, h2, etc.
}

function WaveText({
    text = "Hover me",
    className = "",
    as: Component = "span"
}: AnimatedTextProps) {
    return (
        <motion.span
            className={cn(
                "inline-block cursor-pointer transition-all",
                className
            )}
            whileHover="hover"
            initial="initial"
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    className="inline-block"
                    variants={{
                        initial: {
                            y: 0,
                            scale: 1,
                        },
                        hover: {
                            y: -4,
                            scale: 1.1, // Reduced scale slightly for professional feel
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 15,
                                delay: index * 0.03,
                            },
                        },
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.span>
    );
}

export { WaveText, WaveText as Text_03 };
