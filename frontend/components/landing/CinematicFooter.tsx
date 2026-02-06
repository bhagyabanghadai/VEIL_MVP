import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


import { ArrowRight } from "lucide-react";
import VaporizeTextCycle from "@/components/ui/vapour-text-effect";
import { FallingPattern } from "@/components/ui/falling-pattern";
import { Spotlight } from "@/components/ui/spotlight";
import { DotFlow } from "@/components/ui/dot-flow";
import { footerItems } from "@/components/landing/footer-data";
import HoverSlatButton from "@/components/ui/hover-button";

export const CinematicFooter = () => {
    return (
        <div className="relative h-screen w-full bg-[#050505] overflow-hidden flex flex-col items-center justify-center">
            {/* 1. Dynamic Background (Look Cycle) */}
            <div className="absolute inset-0 z-0 opacity-20">
                <FallingPattern
                    color="#ffffff"
                    backgroundColor="transparent"
                    duration={25}
                    className="rotate-180 scale-150"
                />
            </div>

            {/* Gradient Overlay for integration */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none" />

            {/* 2. Collaborative Spotlight (Look Cycle) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <Spotlight fill="white" className="-top-40 left-0 md:left-60 md:-top-20 opacity-50" />
            </div>

            {/* 3. Main Cinematic Content */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full w-full max-w-[1600px] mx-auto px-6 pb-40">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center space-y-16 w-full flex flex-col items-center"
                >
                    {/* Dynamic System Status */}
                    <div className="flex justify-center mb-8">
                        <DotFlow items={footerItems} />
                    </div>

                    {/* Vaporize Text Effect */}
                    <div className="h-[180px] w-full flex items-center justify-center">
                        <VaporizeTextCycle
                            texts={["SECURE THE FLEET", "INITIALIZE PROTOCOL", "SYSTEM READY"]}
                            font={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "80px",
                                fontWeight: 800
                            }}
                            color="rgba(255, 255, 255, 0.95)"
                            spread={2}
                            density={4}
                        />
                    </div>

                    {/* Connecting Line */}
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        whileInView={{ height: 60, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent"
                    />

                    <div className="flex justify-center pb-20 relative z-50">
                        <Link to="/login">
                            <HoverSlatButton
                                initialText="INITIALIZE"
                                hoverText="LOGIN PAGE"
                                className="scale-125"
                            />
                        </Link>
                    </div>
                </motion.div>

                {/* 4. Structured Footer Grid (Begg & Co) */}
                <div className="absolute bottom-0 w-full px-6 md:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 bg-black/40 backdrop-blur-sm">
                    <div className="flex flex-col gap-4">
                        <span className="text-xs text-white/30 uppercase tracking-[0.2em] font-mono mb-2">Platform</span>
                        <FooterLink href="/platform#neural-firewall">Neural Firewall</FooterLink>
                        <FooterLink href="/platform#identity-bridge">Identity Bridge</FooterLink>
                        <FooterLink href="/platform#audit-ledger">Audit Ledger</FooterLink>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="text-xs text-white/30 uppercase tracking-[0.2em] font-mono mb-2">Company</span>
                        <FooterLink href="/mission">Manifesto</FooterLink>
                        <FooterLink href="/careers">Careers</FooterLink>
                        <FooterLink href="/press">Press</FooterLink>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="text-xs text-white/30 uppercase tracking-[0.2em] font-mono mb-2">Connect</span>
                        <FooterLink href="https://twitter.com/veilsystems" external>Twitter</FooterLink>
                        <FooterLink href="https://github.com/veilsystems" external>GitHub</FooterLink>
                        <FooterLink href="https://discord.gg/veilsystems" external>Discord</FooterLink>
                    </div>

                    <div className="flex flex-col justify-between items-end text-right">
                        <div className="flex flex-col gap-2 scale-75 origin-right opacity-50">
                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                                <ArrowRight className="w-4 h-4 -rotate-45" />
                            </div>
                        </div>
                        <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mt-8">
                            © 2026 VEIL Systems Inc.<br />All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FooterLink = ({ href, children, external }: { href: string, children: React.ReactNode, external?: boolean }) => {
    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/60 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block w-fit font-mono tracking-wider"
            >
                {children}
            </a>
        );
    }
    return (
        <Link
            to={href}
            className="text-sm text-white/60 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block w-fit font-mono tracking-wider"
        >
            {children}
        </Link>
    );
};
