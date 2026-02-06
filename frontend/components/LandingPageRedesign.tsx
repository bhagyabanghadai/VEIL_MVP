import React from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { StickyHero } from '@/components/landing/StickyHero';
import { HolographicDeck } from '@/components/landing/HolographicDeck';
import { VelocityScroll } from '@/components/landing/VelocityScroll';
import { CinematicFooter } from '@/components/landing/CinematicFooter';
import { GlobalBackground } from '@/components/landing/GlobalBackground';
import { EditorialManifesto } from '@/components/landing/EditorialManifesto';
import { HybridBladeSection } from '@/components/landing/HybridBladeSection';
import { TechSpecGrid } from '@/components/landing/TechSpecGrid';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { ParallaxConnector } from '@/components/landing/ParallaxConnector';
import { HUDHeader } from "@/components/ui/hud-header";
import { SectionTransition } from '@/components/landing/SectionTransition';
import { SecurityBackground } from '@/components/landing/SecurityBackground';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <ErrorBoundary>
            <main className="w-full min-h-screen bg-[#0a0a0a] text-white selection:bg-[#e30613] selection:text-white overflow-x-hidden">

                {/* 0. ATMOSPHERE - Animated Security Background */}
                <SecurityBackground />

                {/* 1. HEADER */}
                <HUDHeader onStart={onStart} />

                {/* 2. CORE SECTIONS */}
                <div className="relative z-10">
                    <StickyHero onStart={onStart} />

                    {/* 2.1 HYBRID BLADE (Sporty x Luxury Synthesis) */}
                    {/* 2.1 HYBRID BLADE (Manifesto) */}
                    <div className="relative z-10">
                        <HybridBladeSection />
                    </div>

                    {/* 2.2 TECH SPECS (Grid) */}
                    <div className="relative z-10 bg-[#0a0a0a]">
                        <SectionTransition delay={0.1}>
                            <TechSpecGrid />
                        </SectionTransition>
                    </div>

                    {/* 2.3 PRODUCT SHOWCASE (Horizontal Scroll) */}
                    <SectionTransition delay={0.15}>
                        <ProductShowcase />
                    </SectionTransition>

                    {/* 2.3.5 TRANSITION BRIDGE (Fills the gap) */}
                    <SectionTransition delay={0.2}>
                        <ParallaxConnector />
                    </SectionTransition>

                    {/* 2.4 ARCHITECTURE */}
                    <SectionTransition delay={0.1}>
                        <HolographicDeck />
                    </SectionTransition>

                    <SectionTransition delay={0.15}>
                        <CinematicFooter />
                    </SectionTransition>
                </div>

            </main>
        </ErrorBoundary>
    );
};

export default LandingPage;
