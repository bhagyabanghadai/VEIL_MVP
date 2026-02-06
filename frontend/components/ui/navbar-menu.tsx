
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Adapted for Vite

const transition = {
    type: "spring",
    mass: 0.5,
    damping: 11.5,
    stiffness: 100,
    restDelta: 0.001,
    restSpeed: 0.001,
} as const;

export const MenuItem = ({
    setActive,
    active,
    item,
    children,
}: {
    setActive: (item: string) => void;
    active: string | null;
    item: string;
    children?: React.ReactNode;
}) => {
    return (
        <div onMouseEnter={() => setActive(item)} className="relative ">
            <motion.p
                transition={{ duration: 0.3 }}
                className="cursor-pointer text-veil-text-secondary hover:text-white transition-colors text-sm font-medium tracking-wide"
            >
                {item}
            </motion.p>
            {active !== null && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={transition}
                >
                    {active === item && (
                        <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
                            <motion.div
                                transition={transition}
                                layoutId="active" // layoutId ensures smooth animation
                                className="bg-black/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]"
                            >
                                <motion.div
                                    layout // layout ensures smooth animation
                                    className="w-max h-full p-4"
                                >
                                    {children}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export const Menu = ({
    setActive,
    children,
}: {
    setActive: (item: string | null) => void;
    children: React.ReactNode;
}) => {
    return (
        <nav
            onMouseLeave={() => setActive(null)} // resets the state
            className="relative rounded-full border border-transparent flex justify-center space-x-8 px-8 py-2"
        >
            {children}
        </nav>
    );
};

export const ProductItem = ({
    title,
    description,
    href,
    src,
}: {
    title: string;
    description: string;
    href: string;
    src: string;
}) => {
    return (
        <a href={href} className="flex space-x-4 group">
            <img
                src={src}
                alt={title}
                className="flex-shrink-0 rounded-md shadow-2xl w-[140px] h-[70px] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            <div>
                <h4 className="text-sm font-bold mb-1 text-white group-hover:text-veil-trust transition-colors">
                    {title}
                </h4>
                <p className="text-veil-text-muted text-xs max-w-[10rem] leading-relaxed">
                    {description}
                </p>
            </div>
        </a>
    );
};

export const HoveredLink = ({ children, ...rest }: any) => {
    return (
        <a
            {...rest}
            className="text-veil-text-muted hover:text-white transition-colors text-sm"
        >
            {children}
        </a>
    );
};
