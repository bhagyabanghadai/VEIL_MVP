import React from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import {
    FacebookIcon,
    FrameIcon,
    InstagramIcon,
    LinkedinIcon,
    YoutubeIcon,
} from 'lucide-react';
import { Button } from './button';

interface FooterLink {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}
interface FooterLinkGroup {
    label: string;
    links: FooterLink[];
}

type StickyFooterProps = React.ComponentProps<'footer'>;

export function StickyFooter({ className, ...props }: StickyFooterProps) {
    return (
        <footer
            className={cn('relative h-[300px] w-full', className)} // Compact height
            style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
            {...props}
        >
            <div className="fixed bottom-0 h-[300px] w-full">
                {/* GLASSY TWIST: Backdrop blur and semi-transparent background */}
                <div className="sticky top-[calc(100vh-300px)] h-full overflow-hidden bg-black/60 backdrop-blur-xl border-t border-white/10">

                    {/* Active Grid Background (Glassy Tech) */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    </div>

                    <div className="relative flex size-full flex-col justify-between gap-5 px-4 py-8 md:px-12 z-10">

                        {/* Removed the original radial gradients for a cleaner 'Industrial Glass' look */}

                        <div className="mt-10 flex flex-col gap-8 md:flex-row xl:mt-0">
                            <AnimatedContainer className="w-full max-w-sm min-w-2xs space-y-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-3xl font-bold text-white tracking-[0.2em]">VEIL</h3>
                                </div>
                                <p className="text-veil-text-muted mt-8 text-sm md:mt-0 font-light leading-relaxed">
                                    Intelligence Control Plane. <br />
                                    Cryptographic verification for autonomous infrastructure.
                                </p>
                                <div className="flex gap-2">
                                    {socialLinks.map((link) => (
                                        <Button key={link.title} size="icon" variant="outline" className="size-8 border-white/10 bg-black/50 hover:bg-veil-trust hover:text-black hover:border-veil-trust transition-all duration-300">
                                            <link.icon className="size-4" />
                                        </Button>
                                    ))}
                                </div>
                            </AnimatedContainer>

                            {footerLinkGroups.map((group, index) => (
                                <AnimatedContainer
                                    key={group.label}
                                    delay={0.1 + index * 0.1}
                                    className="w-full"
                                >
                                    <div className="mb-10 md:mb-0">
                                        <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6 border-b border-white/10 pb-2 inline-block">{group.label}</h3>
                                        <ul className="text-veil-text-muted mt-4 space-y-3 text-sm md:text-sm lg:text-sm font-mono">
                                            {group.links.map((link) => (
                                                <li key={link.title}>
                                                    <a
                                                        href={link.href}
                                                        className="hover:text-veil-trust hover:shadow-[0_0_10px_rgba(56,189,248,0.3)] inline-flex items-center transition-all duration-300 hover:translate-x-1"
                                                    >
                                                        {link.icon && <link.icon className="me-1 size-4" />}
                                                        {link.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </AnimatedContainer>
                            ))}
                        </div>
                        <div className="text-veil-text-muted/60 flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-6 text-[10px] uppercase font-mono tracking-widest md:flex-row">
                            <p>© 2025 VEIL SYSTEMS INC.</p>
                            <div className="flex gap-4">
                                <span>Privacy Protocol</span>
                                <span>Terms of Trust</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const socialLinks = [
    { title: 'Facebook', href: '#', icon: FacebookIcon },
    { title: 'Instagram', href: '#', icon: InstagramIcon },
    { title: 'Youtube', href: '#', icon: YoutubeIcon },
    { title: 'LinkedIn', href: '#', icon: LinkedinIcon },
];

const footerLinkGroups: FooterLinkGroup[] = [
    {
        label: 'Platform',
        links: [
            { title: 'The Protocol', href: '/protocol' },
            { title: 'Security Architecture', href: '/protocol#security' },
        ],
    },
    {
        label: 'Developers',
        links: [
            { title: 'Documentation', href: '/docs' },
            { title: 'API Status', href: '/docs#status' },
        ],
    },
    {
        label: 'Company',
        links: [
            { title: 'Our Mission', href: '/mission' },
            { title: 'Contact Encryption', href: '/mission#contact' },
        ],
    },
];

type AnimatedContainerProps = React.ComponentProps<typeof motion.div> & {
    children?: React.ReactNode;
    delay?: number;
};

function AnimatedContainer({
    delay = 0.1,
    children,
    ...props
}: AnimatedContainerProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return children;
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
